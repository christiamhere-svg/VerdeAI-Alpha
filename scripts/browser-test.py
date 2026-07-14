from playwright.sync_api import sync_playwright
from pathlib import Path
import json, traceback

ROOT=Path('/mnt/data/verdeai_v87_work')
OUT=Path('/mnt/data')
results=[]

source_html=(ROOT/'index.html').read_text()
css=(ROOT/'styles/main.css').read_text()
config=(ROOT/'config.js').read_text()
app=(ROOT/'js/app.js').read_text()
source_html=source_html.replace('<link rel="stylesheet" href="styles/main.css" />', f'<style>{css}</style>')
source_html=source_html.replace('<script src="config.js"></script>', f'<script>{config}</script>')
source_html=source_html.replace('<script type="module" src="js/app.js"></script>', f'<script>{app}</script>')

STORE_SCRIPT='''
(() => {
  const initial = __INITIAL_STORE__;
  const data = new Map(Object.entries(initial));
  const storage = {
    get length(){ return data.size; },
    key(i){ return Array.from(data.keys())[i] ?? null; },
    getItem(k){ k=String(k); return data.has(k) ? data.get(k) : null; },
    setItem(k,v){ data.set(String(k), String(v)); },
    removeItem(k){ data.delete(String(k)); },
    clear(){ data.clear(); },
    _dump(){ return Object.fromEntries(data); }
  };
  Object.defineProperty(window,'localStorage',{configurable:true,value:storage});
  Object.defineProperty(window,'sessionStorage',{configurable:true,value:{...storage,_dump:storage._dump}});
})();
'''

def bundle(store=None):
    init=STORE_SCRIPT.replace('__INITIAL_STORE__', json.dumps(store or {}))
    return source_html.replace('<body>', '<body><script>'+init+'</script>', 1)

def click_visible(page, selector):
    loc=page.locator(selector)
    for i in range(loc.count()):
        item=loc.nth(i)
        if item.is_visible():
            item.click()
            return item
    raise AssertionError(f'No visible element: {selector}')

def open_tab(page, tab):
    click_visible(page, f'.tab[data-tab="{tab}"]')
    page.wait_for_timeout(120)

def load_page(context, viewport, store=None):
    page=context.new_page()
    page.set_viewport_size({'width':viewport[0],'height':viewport[1]})
    page.set_content(bundle(store), wait_until='load')
    page.wait_for_timeout(400)
    return page

def summary_value(page, label):
    cards=page.locator('#feedbackReviewSummary article')
    for i in range(cards.count()):
        card=cards.nth(i)
        if card.locator('span').inner_text().strip()==label:
            return int(card.locator('b').inner_text().strip())
    raise AssertionError(f'Summary label not found: {label}')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
    context=browser.new_context(accept_downloads=True)
    page=load_page(context,(390,844))
    errors=[]
    page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
    page.on('console', lambda m: errors.append(f'console {m.type}: {m.text}') if m.type=='error' else None)
    try:
        assert 'Build v8.7' in page.locator('.build-pill').inner_text()

        # Full self-test journey: clue -> analysis -> overlay -> recommendation -> six futures -> selection -> first move.
        click_visible(page,'.self-test-btn')
        page.wait_for_timeout(550)
        assert page.locator('#dashboard').get_attribute('aria-hidden')=='false'
        assert page.locator('#dashboardFutureCards [data-dashboard-future]').count()==6
        assert page.locator('#dashboardTodayVisual .dashboard-overlay-key span').count() >= 3
        assert page.locator('#dashboardNextStep').inner_text().strip()
        assert 'CONCEPT BOARD' in page.locator('.concept-trust-label').inner_text().upper()
        assert page.locator('[data-feedback-evidence-kind]').first.input_value()=='internal'

        maker=page.locator('[data-dashboard-future="maker"]')
        maker.scroll_into_view_if_needed(); maker.click(); page.wait_for_timeout(250)
        assert maker.get_attribute('aria-pressed')=='true'
        assert 'RECOMMENDED' in page.locator('#dashboardFutureCards').inner_text().upper()
        assert 'SELECTED' in maker.inner_text().upper()

        # Save one internal check. It must not become tester evidence.
        click_visible(page,'.dashboard-feedback-card [data-feedback-reaction="useful"]')
        page.wait_for_timeout(150)

        # Explicitly classify the next response as genuine tester evidence and tag an issue area.
        details=page.locator('.dashboard-feedback-card .feedback-evidence-details')
        details.locator('summary').click()
        details.locator('[data-feedback-evidence-kind]').select_option('tester')
        details.locator('[data-feedback-issue-stage]').select_option('navigation')
        click_visible(page,'.dashboard-feedback-card [data-feedback-reaction="confusing"]')
        page.wait_for_timeout(180)

        open_tab(page,'saved')
        assert summary_value(page,'Records')==2
        assert summary_value(page,'Tester')==1
        assert summary_value(page,'Internal')==1
        assert summary_value(page,'Tester negative')==1
        assert summary_value(page,'Different choice')==1
        assert '1 genuine tester response' in page.locator('#feedbackEvidenceBoundary').inner_text()
        assert '100% of testers chose differently' in page.locator('#feedbackDisagreementSummary').inner_text()
        assert 'One tester response only' in page.locator('#feedbackEvidenceInsight').inner_text()
        assert 'Owner / internal check' in page.locator('#feedbackReviewList').inner_text()
        assert 'Tester response' in page.locator('#feedbackReviewList').inner_text()
        assert 'Navigation or mobile layout' in page.locator('#feedbackReviewList').inner_text()
        assert page.locator('#savedProjects').inner_text().strip()

        # Filters, including the new evidence boundary filter.
        page.locator('#feedbackReactionFilter').select_option(label='Confusing')
        page.locator('#feedbackSituationFilter').select_option(label='Under-building / shaded area')
        page.locator('#feedbackBuildFilter').select_option(label='v8.7')
        page.locator('#feedbackEvidenceFilter').select_option(label='Tester response')
        assert '4 filters active' in page.locator('#feedbackReviewCountStatus').inner_text()
        assert summary_value(page,'Records')==1
        page.locator('#feedbackResetFiltersBtn').click()
        assert 'filter' not in page.locator('#feedbackReviewCountStatus').inner_text().lower()

        with page.expect_download() as info:
            page.locator('#exportFeedbackBtn').click()
        download=info.value
        assert download.suggested_filename=='verdeai-v8-7-feedback.csv'
        csv_path=OUT/'v87_feedback_browser.csv'; download.save_as(str(csv_path))
        csv_text=csv_path.read_text(encoding='utf-8-sig')
        for header in ['Selected different from recommendation','Evidence origin','Evidence type','Issue area','Context ID','Record ID']:
            assert header in csv_text
        assert 'Tester response' in csv_text and 'Owner / internal check' in csv_text

        overflow=page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow <= 2, overflow
        mobile_shot=OUT/'v87_feedback_mobile.png'; page.screenshot(path=str(mobile_shot), full_page=True)
        store=page.evaluate('localStorage._dump()')
        page.close()

        # Simulated refresh with storage persistence.
        page=load_page(context,(390,844),store)
        page.on('pageerror', lambda e: errors.append(f'pageerror after reload: {e}'))
        open_tab(page,'saved')
        assert summary_value(page,'Records')==2
        assert summary_value(page,'Tester')==1
        assert page.locator('#savedProjects').inner_text().strip()
        open_tab(page,'dashboard')
        assert page.locator('[data-dashboard-future="maker"]').get_attribute('aria-pressed')=='true'
        assert all(item['buildVersion']=='v8.7' for item in page.evaluate("JSON.parse(localStorage.getItem('verdeai_v5_7_feedback'))"))

        # Clear and re-import the exported evidence; dedupe on second import.
        open_tab(page,'saved')
        page.on('dialog', lambda dialog: dialog.accept())
        page.locator('#clearFeedbackBtn').click(); page.wait_for_timeout(100)
        assert summary_value(page,'Records')==0
        page.locator('#feedbackCsvInput').set_input_files(str(csv_path)); page.wait_for_timeout(280)
        assert summary_value(page,'Records')==2
        assert 'Imported CSV' in page.locator('#feedbackReviewList').inner_text()
        assert summary_value(page,'Tester')==1
        page.locator('#feedbackCsvInput').set_input_files(str(csv_path)); page.wait_for_timeout(180)
        assert summary_value(page,'Records')==2
        overflow2=page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow2 <= 2, overflow2
        results.append({'case':'chromium-mobile-full-flow-and-evidence-boundary','status':'passed','viewport':[390,844],'overflow':max(overflow,overflow2),'screenshot':str(mobile_shot),'csv':str(csv_path),'persistence':'passed via storage-preserving document reload'})

        page.set_viewport_size({'width':1440,'height':900}); page.wait_for_timeout(180)
        desktop_overflow=page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert desktop_overflow <= 2, desktop_overflow
        assert page.locator('#feedbackGroupSummary article').count()==5
        desktop_shot=OUT/'v87_feedback_desktop.png'; page.screenshot(path=str(desktop_shot), full_page=False)
        results.append({'case':'chromium-desktop-evidence-review','status':'passed','viewport':[1440,900],'overflow':desktop_overflow,'screenshot':str(desktop_shot)})
        if errors: raise AssertionError(errors)
    except Exception as e:
        results.append({'case':'failure','status':'failed','error':str(e),'trace':traceback.format_exc(),'errors':errors})
    finally:
        browser.close()
Path('/mnt/data/v87_browser_test_results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
