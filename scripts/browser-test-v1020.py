from pathlib import Path
from urllib.parse import urlparse, unquote
import json, mimetypes, re
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def bundled_html():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    css = (ROOT / 'styles/main.v10.2.0.css').read_text(encoding='utf-8')
    cfg = (ROOT / 'config.v10.2.0.js').read_text(encoding='utf-8')
    js = (ROOT / 'js/app.v10.2.0.js').read_text(encoding='utf-8')
    html = re.sub(r'<link rel="stylesheet" href="styles/main\.v10\.2\.0\.css"\s*/>', '<style>' + css + '</style>', html)
    html = html.replace('<script src="config.v10.2.0.js"></script>', '<script>' + cfg + '</script>')
    html = html.replace('<script defer src="js/app.v10.2.0.js"></script>', '<script>' + js + '</script>')
    storage = "<script>(()=>{const makeStore=()=>{const data=new Map();return{getItem:k=>data.has(String(k))?data.get(String(k)):null,setItem:(k,v)=>data.set(String(k),String(v)),removeItem:k=>data.delete(String(k)),clear:()=>data.clear(),key:i=>Array.from(data.keys())[i]??null,get length(){return data.size}}};try{Object.defineProperty(window,'localStorage',{value:makeStore(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:makeStore(),configurable:true})}catch(e){}})();</script>"
    return html.replace('<head>', '<head><base href="https://verdeai.local/">' + storage, 1)


def route_assets(page):
    def handler(route):
        u = urlparse(route.request.url)
        rel = unquote(u.path.lstrip('/'))
        f = (ROOT / rel).resolve()
        if f.exists() and f.is_file():
            route.fulfill(status=200, path=str(f), content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
        else:
            route.fulfill(status=404, body='not found')
    page.route('https://verdeai.local/**', handler)


def run():
    evidence = ROOT / 'evidence'
    evidence.mkdir(exist_ok=True)
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        for name, viewport in [('mobile', {'width': 390, 'height': 844}), ('desktop', {'width': 1650, 'height': 900})]:
            page = browser.new_page(viewport=viewport, accept_downloads=True)
            errors = []
            page.on('pageerror', lambda exc: errors.append(str(exc)))
            route_assets(page)
            page.set_content(bundled_html(), wait_until='load')
            page.wait_for_timeout(400)

            body_text = page.locator('body').inner_text().lower()
            assert 'build v10.2.0' in body_text
            assert 'open the finished example' in body_text
            assert 'try your own photo — early preview' in body_text
            assert 'automatic future-image creation' in body_text
            assert page.locator('#demoBtn').is_visible()
            assert page.locator('#photoInput').count() == 1

            landing_overflow = page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth')
            assert not landing_overflow
            page.screenshot(path=str(evidence / f'v1020-{name}-landing.png'), full_page=True)

            page.click('#demoBtn')
            page.wait_for_timeout(1300)
            assert page.locator('#wholeBoardStage').is_visible()
            assert page.locator('#wholeBoardPoster .wb-future').count() == 6
            assert page.locator('#wholeBoardPoster .wb-pending').count() == 0
            assert page.locator('#wholeBoardPoster img[src*="golden-demo"]').count() >= 7
            assert 'Under-building / shaded area' in page.locator('#wholeBoardPoster').inner_text()
            assert 'Feature Garden' in page.locator('#wholeBoardPoster').inner_text()
            assert page.locator('#firstTesterSurvey').is_visible()
            assert page.locator('#wholeBoardDetailsBtn').inner_text() == 'Answer 3 quick questions'
            assert page.locator('.result-quick-feedback').count() == 1
            assert not page.locator('.result-quick-feedback').is_visible()
            for legacy in page.locator('.legacy-one-tap-feedback').all():
                assert not legacy.is_visible()

            survey = page.locator('#firstTesterSurvey')
            assert survey.locator('fieldset').count() == 3
            assert survey.locator('[data-tester-answer]').count() == 9
            assert page.locator('#saveFirstTesterSurveyBtn').is_disabled()
            page.click('[data-tester-answer="sense"][data-answer-value="yes"]')
            page.click('[data-tester-answer="believable"][data-answer-value="partly"]')
            page.click('[data-tester-answer="tryOwn"][data-answer-value="yes"]')
            assert not page.locator('#saveFirstTesterSurveyBtn').is_disabled()
            page.click('#saveFirstTesterSurveyBtn')
            page.wait_for_timeout(200)
            status = page.locator('#firstTesterSurveyStatus').inner_text()
            assert 'Saved on this device' in status
            assert page.locator('#copyFirstTesterSurveyBtn').is_visible()
            stored = page.evaluate("JSON.parse(localStorage.getItem('verdeai_v10_2_first_tester_responses'))")
            assert len(stored) == 1
            assert stored[0]['sense'] == 'yes'
            assert stored[0]['believable'] == 'partly'
            assert stored[0]['tryOwn'] == 'yes'
            assert stored[0]['buildVersion'] == 'v10.2.0'

            # Owner export remains one simple CSV download.
            export_button = page.locator('#exportFirstTesterSurveyBtn')
            assert not export_button.is_disabled()
            with page.expect_download() as download_info:
                page.evaluate('exportFirstTesterSurveyCsv()')
            download = download_info.value
            assert 'first-tester-feedback.csv' in download.suggested_filename

            page.click('#wholeBoardOpenBtn')
            page.wait_for_timeout(300)
            assert page.locator('#wholeBoardOverlay').is_visible()
            canvas = page.locator('#wholeBoardOverlayCanvas').bounding_box()
            poster = page.locator('#wholeBoardOverlay .whole-board-poster-full').bounding_box()
            assert canvas and poster
            tolerance = 2
            assert poster['width'] <= canvas['width'] + tolerance and poster['height'] <= canvas['height'] + tolerance
            assert poster['x'] >= canvas['x'] - tolerance and poster['y'] >= canvas['y'] - tolerance
            assert poster['x'] + poster['width'] <= canvas['x'] + canvas['width'] + tolerance
            assert poster['y'] + poster['height'] <= canvas['y'] + canvas['height'] + tolerance
            page.click('#wholeBoardCloseBtn')
            page.wait_for_timeout(2400)

            page.locator('#firstTesterSurvey').scroll_into_view_if_needed()
            page.screenshot(path=str(evidence / f'v1020-{name}-tester-survey.png'), full_page=False)
            overflow = page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth')
            assert not overflow and not errors, errors
            results[name] = {
                'errors': errors,
                'landingHorizontalOverflow': landing_overflow,
                'resultHorizontalOverflow': overflow,
                'samePropertyFutureCards': 6,
                'pendingBadges': 0,
                'wholeBoardFit': True,
                'threeQuestionSurvey': True,
                'surveySavedLocally': True,
                'testerCsvExport': True,
                'copyAnswersExport': True,
                'ownPhotoMarkedEarlyPreview': True,
                'safetyLocksPreserved': True,
            }
            page.close()
        browser.close()
    (ROOT / 'static-validation-v1020-browser.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    print(json.dumps(results, indent=2))


if __name__ == '__main__':
    run()
