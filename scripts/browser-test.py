from pathlib import Path
import json, traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path('/mnt/data')
PHOTO = Path('/mnt/data/1000048206.jpg')
results = []

html = (ROOT / 'index.html').read_text()
css = (ROOT / 'styles/main.css').read_text()
config = (ROOT / 'config.js').read_text()
app = (ROOT / 'js/app.js').read_text()
html = html.replace('<link rel="stylesheet" href="styles/main.css" />', f'<style>{css}</style>')
html = html.replace('<script src="config.js"></script>', f'<script>{config}</script>')
html = html.replace('<script type="module" src="js/app.js"></script>', f'<script>{app}</script>')
STORE = '''(() => { const data=new Map(Object.entries(__STORE__)); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()},_dump(){return Object.fromEntries(data)}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''

def bundle(store=None):
    return html.replace('<body>', '<body><script>' + STORE.replace('__STORE__', json.dumps(store or {})) + '</script>', 1)

def load(context, viewport=(390, 844), store=None, errors=None):
    page = context.new_page()
    page.set_default_timeout(7000)
    page.set_viewport_size({'width': viewport[0], 'height': viewport[1]})
    if errors is not None:
        page.on('pageerror', lambda e: errors.append(str(e)))
    page.set_content(bundle(store), wait_until='load')
    page.wait_for_timeout(350)
    return page

def tab(page, name):
    page.evaluate('name => activateTab(name)', name)
    page.wait_for_timeout(100)

def overflow(page):
    return page.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')

def analyse_scenario(page, prop, constraint, preference='balanced', use_photo=False):
    tab(page, 'explore')
    if use_photo and PHOTO.exists():
        page.locator('#photoInput').set_input_files(str(PHOTO))
        page.wait_for_timeout(500)
    else:
        page.locator('#demoBtn').click()
        page.wait_for_timeout(180)
        tab(page, 'explore')
    page.locator('#propertyType').select_option(prop)
    page.locator('#preferenceSelect').select_option(preference)
    page.locator('#constraintSelect').select_option(constraint)
    page.locator('#analyseBtn').click()
    page.wait_for_timeout(280)
    tab(page, 'dashboard')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
    context = browser.new_context(accept_downloads=True)
    errors = []
    shots = []
    try:
        # Real courtyard photo: recommendation, constrained overlay, touch calibration and selected-future consistency.
        page = load(context, (390, 844), errors=errors)
        assert 'Build v8.9' in page.locator('.build-pill').inner_text()
        analyse_scenario(page, 'courtyard', 'unused', 'outdoor-living', use_photo=True)
        visual = page.locator('#dashboardTodayVisual')
        assert visual.locator('.visual-mode-switch button').count() == 3
        assert visual.locator('.photo-concept-stage.mode-recommended').count() == 1
        svg = visual.locator('.concept-overlay-svg')
        assert 'scenario-courtyard' in svg.get_attribute('class')
        assert 'future-gathering' in svg.get_attribute('class')
        assert svg.locator('clipPath').count() == 1 and svg.locator('mask').count() == 1
        assert svg.locator('.calibration-mask-route').count() == 1
        assert svg.locator('.feature-tree').count() == 0
        summary = page.locator('#dashboardResultSummary').inner_text()
        assert 'Gathering Space' in summary and 'Marker 5:' in summary

        visual.locator('[data-cal-action="open"]').click()
        page.wait_for_timeout(150)
        stage = page.locator('#dashboardTodayVisual .photo-concept-stage')
        stage.scroll_into_view_if_needed()
        page.wait_for_timeout(100)
        assert page.locator('#dashboardTodayVisual .calibration-handle.usable-handle').count() == 4
        assert page.locator('#dashboardTodayVisual .calibration-handle.access-handle').count() == 2
        assert page.locator('#dashboardTodayVisual .calibration-handle.first-handle').count() == 1
        assert page.locator('#dashboardTodayVisual .calibration-keep-clear').count() >= 1
        first = page.locator('#dashboardTodayVisual .first-handle')
        before = first.get_attribute('transform')
        box = first.bounding_box(); assert box
        page.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
        page.mouse.down()
        page.mouse.move(box['x'] + 70, box['y'] - 40, steps=5)
        page.mouse.up()
        page.wait_for_timeout(180)
        after = page.locator('#dashboardTodayVisual .first-handle').get_attribute('transform')
        assert before != after, (before, after)
        page.locator('#dashboardTodayVisual [data-cal-action="add-keep"]').click()
        page.wait_for_timeout(120)
        assert page.locator('#dashboardTodayVisual .calibration-keep-clear').count() >= 2
        page.locator('#dashboardTodayVisual [data-cal-action="done"]').click()
        page.wait_for_timeout(140)
        assert 'Adjusted for this property' in page.locator('#dashboardTodayVisual .calibration-closed').inner_text()

        # Productive can be selected while Gathering remains the recommendation.
        page.locator('[data-dashboard-future="productive"] [data-view-future="productive"]').click()
        page.wait_for_timeout(160)
        assert 'future-productive' in page.locator('#dashboardTodayVisual .concept-overlay-svg').get_attribute('class')
        assert 'SELECTED FUTURE' in page.locator('#dashboardTodayVisual .visual-mode-chip').inner_text().upper()
        assert 'RECOMMENDED' in page.locator('[data-dashboard-future="gathering"]').inner_text().upper()
        assert 'SELECTED' in page.locator('[data-dashboard-future="productive"]').inner_text().upper()
        page.locator('#dashboardTodayVisual [data-visual-mode="recommended"]').click()
        page.wait_for_timeout(100)
        assert 'future-gathering' in page.locator('#dashboardTodayVisual .concept-overlay-svg').get_attribute('class')

        # Save state and capture the real-photo result.
        tab(page, 'explore')
        page.locator('#saveProjectBtn').click()
        page.wait_for_timeout(100)
        page.evaluate('persistCurrentSessionNow()')
        store = page.evaluate('localStorage._dump()')
        assert 'calibration' in next(v for k, v in store.items() if 'current_session' in k)
        tab(page, 'dashboard')
        page.locator('#dashboardTodayVisual').scroll_into_view_if_needed()
        shot = OUT / 'v89_courtyard_calibrated_mobile.png'
        page.locator('#dashboardTodayVisual').screenshot(path=str(shot))
        shots.append(str(shot))
        assert overflow(page) <= 2
        page.close()

        # Reload: calibration and Selected future survive, Reset works.
        page = load(context, (390, 844), store, errors)
        tab(page, 'dashboard')
        assert 'Adjusted for this property' in page.locator('#dashboardTodayVisual .calibration-closed').inner_text()
        assert page.locator('#dashboardTodayVisual .concept-map-marker.marker-first').get_attribute('transform') == after
        assert page.locator('#dashboardTodayVisual .concept-overlay-svg mask rect').count() >= 3
        assert page.locator('[data-dashboard-future="productive"]').get_attribute('aria-pressed') == 'true'
        page.locator('#dashboardTodayVisual [data-visual-mode="selected"]').click()
        page.wait_for_timeout(80)
        assert 'future-productive' in page.locator('#dashboardTodayVisual .concept-overlay-svg').get_attribute('class')
        page.locator('#dashboardTodayVisual [data-cal-action="open"]').click()
        page.wait_for_timeout(80)
        page.locator('#dashboardTodayVisual [data-cal-action="reset"]').click()
        page.wait_for_timeout(90)
        page.locator('#dashboardTodayVisual [data-cal-action="done"]').click()
        page.wait_for_timeout(90)
        assert 'VerdeAI starting layout' in page.locator('#dashboardTodayVisual .calibration-closed').inner_text()
        page.close()

        # Mobile width checks are isolated to avoid resize-induced browser instability.
        for width in (360, 412, 430):
            width_page = load(context, (width, 844), store, errors)
            tab(width_page, 'dashboard')
            assert overflow(width_page) <= 2, (width, overflow(width_page))
            width_page.close()

        # Other scenario geometries are covered by smoke/static validation; Chromium uses the real courtyard case.

        # Desktop and AI lock state.
        desktop = load(context, (1440, 900), store, errors)
        tab(desktop, 'ai')
        txt = desktop.locator('#ai').inner_text()
        for token in ('Disabled', 'Not connected yet', 'Not added', 'Locked'):
            assert token in txt
        tab(desktop, 'dashboard')
        assert overflow(desktop) <= 2
        desktop.close()

        if errors:
            raise AssertionError(errors)
        results.append({
            'case': 'v8.9-calibrated-courtyard-and-persistence',
            'status': 'passed',
            'real_photo_used': PHOTO.exists(),
            'viewports': [360, 390, 412, 430, 1440],
            'horizontal_overflow': '0-2px maximum',
            'browser_scenario_count': 1,
            'scenario_geometry_static_count': 5,
            'persistence': 'passed',
            'recommended_selected_consistency': 'passed',
            'screenshots': shots,
        })
    except Exception as e:
        results.append({
            'case': 'v8.9-calibrated-courtyard-and-persistence',
            'status': 'failed',
            'error': str(e),
            'trace': traceback.format_exc(),
            'browser_errors': errors,
        })
    finally:
        browser.close()

out = OUT / 'v89_browser_test_results.json'
out.write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))
if any(x['status'] != 'passed' for x in results):
    raise SystemExit(1)
