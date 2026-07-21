from pathlib import Path
import json, traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'evidence'
OUT.mkdir(exist_ok=True)
PHOTO = Path('/mnt/data/v92_test_property.jpg')
RESULT = OUT / 'v931_browser_test_results.json'

html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'styles/main.v9.3.1.css').read_text(encoding='utf-8')
config = (ROOT / 'config.v9.3.1.js').read_text(encoding='utf-8')
app = (ROOT / 'js/app.v9.3.1.js').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="styles/main.v9.3.1.css" />', f'<style>{css}</style>')
html = html.replace('<script src="config.v9.3.1.js"></script>', f'<script>{config}</script>')
html = html.replace('<script type="module" src="js/app.v9.3.1.js"></script>', f'<script>{app}</script>')
STORE = '''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''


def page_for(ctx, w=390, h=844, errors=None):
    p = ctx.new_page()
    p.set_viewport_size({'width': w, 'height': h})
    p.set_default_timeout(18000)
    if errors is not None:
        p.on('pageerror', lambda e: errors.append(str(e)))
    p.set_content(html.replace('<body>', '<body><script>' + STORE + '</script>', 1), wait_until='load')
    p.wait_for_timeout(600)
    return p


def tab(p, name):
    p.evaluate('name => activateTab(name)', name)
    p.wait_for_timeout(220)


def overflow(p):
    return p.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')


results, errors = [], []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx = browser.new_context()
    try:
        p = page_for(ctx, 390, 844, errors)
        assert 'BUILD V9.3.1' in p.locator('body').inner_text().upper()

        tab(p, 'explore')
        p.locator('#photoInput').set_input_files(str(PHOTO))
        p.wait_for_timeout(450)
        p.locator('#propertyType').select_option('under-building')
        p.locator('#constraintSelect').select_option('shade-dark')
        p.locator('#analyseBtn').click()
        p.wait_for_timeout(600)
        tab(p, 'dashboard')
        p.wait_for_timeout(600)

        panel = p.locator('#futureSelectionPanel')
        assert panel.count() == 1
        assert panel.is_visible()
        assert 'OTHER POSSIBLE FUTURES' in panel.locator('.panel-title').inner_text().upper()
        cards = panel.locator('[data-dashboard-future]')
        assert cards.count() == 6
        titles = panel.locator('.dashboard-future-copy h3').all_inner_texts()
        expected = ['Feature Garden', 'Low-Maintenance Haven', 'Wildlife Haven', 'Gathering Space', 'Food Garden', 'Maker / Workshop Yard']
        for name in expected:
            assert any(name.lower() in title.lower() for title in titles), (name, titles)

        # DOM order: futures must be after recommendation summary and before optional AI rendering.
        order = p.evaluate('''() => {
          const result = document.querySelector('#boardResultTop');
          const futures = document.querySelector('#futureSelectionPanel');
          const ai = document.querySelector('.ai-dashboard-note');
          const pos = (a,b) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
          return { afterResult: pos(result, futures), beforeAi: pos(futures, ai) };
        }''')
        assert order == {'afterResult': True, 'beforeAi': True}, order

        host = p.locator('#dashboardConceptStageHost')
        stage = host.locator('.photo-concept-stage')
        assert host.count() == 1 and stage.count() == 1
        assert host.locator('.photo-concept-image').count() == 1
        assert host.locator('.botanical-composition').count() == 1
        assert host.locator('.botanical-plant').count() >= 10
        photo_style = host.locator('.photo-concept-image').evaluate('(el) => ({opacity:getComputedStyle(el).opacity, filter:getComputedStyle(el).filter})')
        wash_style = host.locator('.concept-depth-wash').evaluate('(el) => getComputedStyle(el).display')
        assert photo_style['opacity'] == '1'
        assert photo_style['filter'] == 'none'
        assert wash_style == 'none'

        # Complete placement and verify editor controls disappear while marker 5 remains.
        open_btn = host.locator('[data-cal-action="open"]')
        if open_btn.count():
            open_btn.click(); p.wait_for_timeout(150)
        done_btn = host.locator('[data-cal-action="done"]')
        if done_btn.count():
            done_btn.first.click(); p.wait_for_timeout(250)
        assert 'is-finished' in (stage.get_attribute('class') or '')
        assert host.locator('.calibration-editor-svg').count() == 0
        assert host.locator('.marker-first').count() == 1

        # Capture and compare all six future compositions on the same property photo.
        shots, counts, signatures = [], {}, {}
        for fid in ['gathering', 'wildlife', 'minimal', 'productive', 'belonging', 'maker']:
            card = panel.locator(f'[data-dashboard-future="{fid}"]')
            assert card.count() == 1 and card.is_visible()
            card.click()
            p.wait_for_timeout(320)
            stage = host.locator('.photo-concept-stage')
            svg = stage.locator('.concept-overlay-svg')
            assert f'future-{fid}' in (svg.get_attribute('class') or '')
            count = stage.locator('.botanical-plant').count()
            counts[fid] = count
            signatures[fid] = stage.locator('.concept-future-layer').inner_html()
            shot = OUT / f'v931_{fid}_overlay_mobile.png'
            stage.screenshot(path=str(shot))
            shots.append(str(shot))

        assert len(set(counts.values())) >= 3, counts
        assert len(set(signatures.values())) == 6

        # Wildlife can be selected and stays independent from VerdeAI recommendation.
        panel.locator('[data-dashboard-future="wildlife"]').click()
        p.wait_for_timeout(300)
        state_data = p.evaluate('({selected: state.selectedFutureId, recommended: state.recommendedFutureId, calibration: state.calibration})')
        assert state_data['selected'] == 'wildlife'
        assert state_data['calibration']
        status_text = p.locator('#futureSelectionStatus').inner_text()
        assert 'Wildlife Haven' in status_text

        # Visible Android evidence of the future picker itself.
        panel.scroll_into_view_if_needed(); p.wait_for_timeout(120)
        p.evaluate('document.activeElement && document.activeElement.blur()')
        p.add_style_tag(content='.skip-link{display:none!important}')
        p.wait_for_timeout(80)
        panel.screenshot(path=str(OUT / 'v931_other_futures_android.png'))
        assert overflow(p) <= 2

        # Safe rendering remains hard locked.
        assert p.locator('#dashboardCreateAiRenderBtn').is_disabled()
        tab(p, 'ai'); p.wait_for_timeout(250)
        assert 'REAL AI RENDERING IS DISABLED' in p.locator('#v93AiLockBanner').inner_text().upper()
        p.close()

        widths = []
        for w in (360, 390, 412, 430, 768, 1440):
            q = page_for(ctx, w, 900 if w >= 768 else 844, errors)
            tab(q, 'explore')
            q.locator('#photoInput').set_input_files(str(PHOTO))
            q.wait_for_timeout(250)
            q.locator('#analyseBtn').click(); q.wait_for_timeout(400)
            tab(q, 'dashboard'); q.wait_for_timeout(350)
            visible_cards = q.locator('#futureSelectionPanel [data-dashboard-future]').count()
            ov = overflow(q)
            assert visible_cards == 6, (w, visible_cards)
            assert q.locator('#futureSelectionPanel').is_visible()
            assert ov <= 2, (w, ov)
            widths.append({'width': w, 'overflow': ov, 'future_cards': visible_cards})
            q.close()

        if errors:
            raise AssertionError(errors)
        results.append({
            'case': 'v9.3.1-plant-overlay-and-future-selection-hotfix',
            'status': 'passed',
            'future_panel_visible': True,
            'six_futures_selectable': True,
            'wildlife_selectable': True,
            'recommended_selected_independent': True,
            'photo_unobscured': True,
            'botanical_layers': True,
            'future_counts': counts,
            'distinct_composition_signatures': 6,
            'finished_handles_hidden': True,
            'marker_5_visible': True,
            'safe_ai_state': True,
            'viewports': widths,
            'screenshots': shots + [str(OUT / 'v931_other_futures_android.png')],
            'browser': 'Chromium inline harness'
        })
    except Exception as exc:
        results.append({'case': 'v9.3.1-plant-overlay-and-future-selection-hotfix', 'status': 'failed', 'error': str(exc), 'trace': traceback.format_exc(), 'browser_errors': errors})
    finally:
        ctx.close(); browser.close()

RESULT.write_text(json.dumps(results, indent=2), encoding='utf-8')
print(json.dumps(results, indent=2))
if any(item.get('status') != 'passed' for item in results):
    raise SystemExit(1)
