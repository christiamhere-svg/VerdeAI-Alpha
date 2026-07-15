from playwright.sync_api import sync_playwright
from pathlib import Path
import json, traceback

ROOT=Path(__file__).resolve().parents[1]
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
    loc=page.locator(f'.tab[data-tab="{tab}"]')
    for i in range(loc.count()):
        item=loc.nth(i)
        if item.is_visible():
            item.click(); page.wait_for_timeout(100); return
    page.evaluate("tab => activateTab(tab)", tab)
    page.wait_for_timeout(100)

def load_page(context, viewport, store=None):
    page=context.new_page()
    page.set_viewport_size({'width':viewport[0],'height':viewport[1]})
    page.set_content(bundle(store), wait_until='load')
    page.wait_for_timeout(450)
    return page

def set_scenario(page, property_type, constraint):
    open_tab(page,'explore')
    page.locator('#propertyType').select_option(property_type)
    page.locator('#constraintSelect').select_option(constraint)
    page.locator('#analyseBtn').click()
    page.wait_for_timeout(260)
    open_tab(page,'dashboard')
    page.wait_for_timeout(160)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
    context=browser.new_context(accept_downloads=True)
    page=load_page(context,(390,844))
    errors=[]
    page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
    page.on('console', lambda m: errors.append(f'console {m.type}: {m.text}') if m.type=='error' else None)
    try:
        assert 'Build v8.8' in page.locator('.build-pill').inner_text()

        # Photo-first shaded self-test journey.
        click_visible(page,'.self-test-btn')
        page.wait_for_timeout(600)
        assert page.locator('#dashboard').get_attribute('aria-hidden')=='false'
        visual=page.locator('#dashboardTodayVisual')
        assert visual.locator('.visual-mode-switch button').count()==3
        assert visual.locator('.photo-concept-stage').count()==1
        assert visual.locator('.concept-overlay-svg').count()==1
        assert visual.locator('.concept-map-marker').count()==5
        assert visual.locator('.concept-map-legend .concept-legend-item').count()==5
        assert 'NOT FINAL AI RENDER' in visual.locator('.concept-overlay-trust').inner_text().upper()
        assert 'marker 5' in page.locator('#dashboardResultSummary').inner_text().lower()
        assert 'scenario-shade' in visual.locator('.concept-overlay-svg').get_attribute('class')

        # Three visual modes are clearly independent.
        visual.locator('[data-visual-mode="original"]').click(); page.wait_for_timeout(140)
        assert page.locator('#dashboardTodayVisual .concept-overlay-svg').count()==0
        assert 'ORIGINAL PHOTO' in page.locator('#dashboardTodayVisual .visual-mode-chip').inner_text().upper()
        page.locator('#dashboardTodayVisual [data-visual-mode="recommended"]').click(); page.wait_for_timeout(140)
        assert page.locator('#dashboardTodayVisual .concept-overlay-svg').count()==1
        assert 'VERDEAI CONCEPT' in page.locator('#dashboardTodayVisual .visual-mode-chip').inner_text().upper()

        # Future choice changes the photo while recommendation remains fixed.
        maker=page.locator('[data-dashboard-future="maker"]')
        maker.locator('[data-view-future="maker"]').click(); page.wait_for_timeout(260)
        assert maker.get_attribute('aria-pressed')=='true'
        assert 'future-maker' in page.locator('#dashboardTodayVisual .concept-overlay-svg').get_attribute('class')
        assert 'SELECTED FUTURE' in page.locator('#dashboardTodayVisual .visual-mode-chip').inner_text().upper()
        assert 'RECOMMENDED' in page.locator('[data-dashboard-future="minimal"]').inner_text().upper()
        assert 'SELECTED' in page.locator('[data-dashboard-future="maker"]').inner_text().upper()

        # Every future visibly changes the selected overlay.
        for future_id in ['belonging','minimal','wildlife','gathering','productive','maker']:
            button=page.locator(f'[data-dashboard-future="{future_id}"] [data-view-future="{future_id}"]')
            button.scroll_into_view_if_needed(); button.click(); page.wait_for_timeout(110)
            assert f'future-{future_id}' in page.locator('#dashboardTodayVisual .concept-overlay-svg').get_attribute('class')

        # Four requested situations have distinct geometry and expected recommendation.
        scenarios=[
            ('under-building','shade-dark','scenario-shade','Sanctuary Garden'),
            ('blank','too-open','scenario-blank','Belonging Garden'),
            ('overgrown','maintenance-drag','scenario-recovery','Possibility Garden'),
            ('workshop','storage-creep','scenario-workshop','Maker / Workshop Yard')
        ]
        svg_signatures=[]
        for property_type,constraint,scenario_class,recommendation in scenarios:
            set_scenario(page,property_type,constraint)
            svg=page.locator('#dashboardTodayVisual .concept-overlay-svg')
            assert scenario_class in svg.get_attribute('class')
            assert recommendation in page.locator('#dashboardResultSummary').inner_text()
            assert page.locator('#dashboardTodayVisual .concept-legend-item').count()==5
            svg_signatures.append(svg.inner_html())
        assert len(set(svg_signatures))==4

        # Save/refresh keeps selection and visual mode independent from recommendation.
        page.locator('[data-dashboard-future="belonging"] [data-view-future="belonging"]').click(); page.wait_for_timeout(160)
        open_tab(page,'explore')
        page.locator('#saveProjectBtn').click(); page.wait_for_timeout(160)
        store=page.evaluate('localStorage._dump()')
        overflow=page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow <= 2, overflow
        open_tab(page,'dashboard')
        page.locator('#dashboardTodayVisual').scroll_into_view_if_needed(); page.wait_for_timeout(120)
        mobile_shot=OUT/'v88_photo_first_mobile.png'; page.locator('#dashboardTodayVisual').screenshot(path=str(mobile_shot))
        page.close()

        page=load_page(context,(390,844),store)
        page.on('pageerror', lambda e: errors.append(f'pageerror after reload: {e}'))
        open_tab(page,'dashboard')
        assert page.locator('[data-dashboard-future="belonging"]').get_attribute('aria-pressed')=='true'
        assert 'SELECTED FUTURE' in page.locator('#dashboardTodayVisual .visual-mode-chip').inner_text().upper()
        assert 'RECOMMENDED' in page.locator('[data-dashboard-future="maker"]').inner_text().upper()

        # Compare screen uses the same richer overlay system.
        open_tab(page,'compare')
        assert page.locator('#compareOriginal .concept-overlay-svg').count()==0
        assert page.locator('#compareFuture .concept-overlay-svg').count()==1
        assert page.locator('#overlayLegend [data-index]').count()==5

        # Safety state remains unchanged.
        open_tab(page,'ai')
        ai_text=page.locator('#ai').inner_text()
        for token in ['Disabled','Not connected yet','Not added','Locked']:
            assert token in ai_text

        page.set_viewport_size({'width':1440,'height':900}); page.wait_for_timeout(220)
        open_tab(page,'dashboard')
        desktop_overflow=page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert desktop_overflow <= 2, desktop_overflow
        page.locator('#dashboardTodayVisual').scroll_into_view_if_needed(); page.wait_for_timeout(100)
        desktop_shot=OUT/'v88_photo_first_desktop.png'; page.locator('#dashboardTodayVisual').screenshot(path=str(desktop_shot))
        results.append({'case':'chromium-photo-first-full-flow','status':'passed','mobile_viewport':[390,844],'desktop_viewport':[1440,900],'mobile_overflow':overflow,'desktop_overflow':desktop_overflow,'scenario_count':4,'future_treatments':6,'screenshots':[str(mobile_shot),str(desktop_shot)],'persistence':'passed via storage-preserving reload'})
        if errors: raise AssertionError(errors)
    except Exception as e:
        results.append({'case':'failure','status':'failed','error':str(e),'trace':traceback.format_exc(),'errors':errors})
    finally:
        browser.close()
Path('/mnt/data/v88_browser_test_results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
