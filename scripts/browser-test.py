from pathlib import Path
import json, re, traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path('/mnt/data')
PHOTO = Path('/mnt/data/v892_courtyard_photo_crop.jpg')
results = []

html = (ROOT / 'index.html').read_text()
css = (ROOT / 'styles/main.css').read_text()
config = (ROOT / 'config.js').read_text()
app = (ROOT / 'js/app.js').read_text()
html = html.replace('<link rel="stylesheet" href="styles/main.css?v=9.0" />', f'<style>{css}</style>')
html = html.replace('<script src="config.js?v=9.0"></script>', f'<script>{config}</script>')
html = html.replace('<script type="module" src="js/app.js?v=9.0"></script>', f'<script>{app}</script>')
STORE = '''(() => { const data=new Map(Object.entries(__STORE__)); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()},_dump(){return Object.fromEntries(data)}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''

def bundle(store=None):
    return html.replace('<body>', '<body><script>' + STORE.replace('__STORE__', json.dumps(store or {})) + '</script>', 1)

def load(context, viewport=(390, 844), store=None, errors=None):
    page = context.new_page()
    page.set_default_timeout(8000)
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

def analyse_scenario(page, prop='courtyard', constraint='unused', preference='outdoor-living', use_photo=True):
    tab(page, 'explore')
    if use_photo and PHOTO.exists():
        page.locator('#photoInput').set_input_files(str(PHOTO))
        page.wait_for_timeout(450)
    else:
        page.locator('#demoBtn').click()
        page.wait_for_timeout(180)
        tab(page, 'explore')
    page.locator('#propertyType').select_option(prop)
    page.locator('#preferenceSelect').select_option(preference)
    page.locator('#constraintSelect').select_option(constraint)
    page.locator('#analyseBtn').click()
    page.wait_for_timeout(300)
    tab(page, 'dashboard')

def transform_xy(value):
    match = re.search(r'translate\(([-\d.]+)\s+([-\d.]+)\)', value or '')
    if not match:
        raise AssertionError(f'Cannot parse transform: {value}')
    return float(match.group(1)), float(match.group(2))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
    context = browser.new_context(accept_downloads=True)
    errors = []
    shots = []
    try:
        page = load(context, (390, 844), errors=errors)
        assert 'Build v9.0' in page.locator('.build-pill').inner_text()
        analyse_scenario(page)
        assert page.locator('#dashboardAdjustConceptBtn').is_enabled()
        page.locator('#dashboardAdjustConceptBtn').click()
        page.wait_for_timeout(180)
        visual = page.locator('#dashboardTodayVisual')
        stage = visual.locator('.photo-concept-stage')
        stage.scroll_into_view_if_needed()
        page.wait_for_timeout(100)

        # One-minute guidance and clear finish actions.
        assert 'Step 1 of 5' in visual.locator('.calibration-step-status').inner_text()
        assert 'Ground' in visual.locator('.calibration-step-status').inner_text()
        assert visual.locator('.calibration-finish-bar [data-cal-action="done"]').count() == 1
        assert visual.locator('.calibration-done-primary').count() == 1

        # Only the current tool is draggable; all handles keep a large 98px SVG hit diameter.
        assert visual.locator('.calibration-handle.usable-handle.is-active').count() == 4
        assert visual.locator('.calibration-handle.is-inactive').count() >= 4
        assert visual.locator('.calibration-handle.is-inactive[tabindex="-1"]').count() == visual.locator('.calibration-handle.is-inactive').count()
        assert visual.locator('.calibration-handle.is-active .calibration-hit-target').first.get_attribute('r') == '49'
        active_box = visual.locator('.calibration-handle.is-active').first.bounding_box(); assert active_box
        assert min(active_box['width'], active_box['height']) >= 50, active_box
        assert abs(active_box['width'] - active_box['height']) <= 4, active_box

        # Drag an edge point hard toward the top-left. The page locks while dragging and the handle remains visible.
        handle = visual.locator('.usable-handle.is-active').first
        box = handle.bounding_box(); assert box
        page.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
        page.mouse.down()
        page.wait_for_timeout(40)
        assert page.locator('body').evaluate("el => el.classList.contains('calibration-dragging')")
        stage_box = stage.bounding_box(); assert stage_box
        page.mouse.move(stage_box['x'] - 80, stage_box['y'] - 80, steps=6)
        page.mouse.up()
        page.wait_for_timeout(180)
        assert not page.locator('body').evaluate("el => el.classList.contains('calibration-dragging')")
        x, y = transform_xy(visual.locator('.usable-handle.is-active').first.get_attribute('transform'))
        assert x >= 35 and y >= 35, (x, y)

        # First-move step is isolated and marker 5 moves without page scrolling.
        visual.locator('[data-cal-tool="firstMove"]').click()
        page.wait_for_timeout(120)
        assert 'Step 5 of 5' in visual.locator('.calibration-step-status').inner_text()
        assert visual.locator('.first-handle.is-active').count() == 1
        first = visual.locator('.first-handle.is-active')
        before = first.get_attribute('transform')
        fb = first.bounding_box(); assert fb
        scroll_before = page.evaluate('window.scrollY')
        page.mouse.move(fb['x'] + fb['width']/2, fb['y'] + fb['height']/2)
        page.mouse.down()
        page.mouse.move(fb['x'] + 70, fb['y'] - 40, steps=5)
        page.mouse.up()
        page.wait_for_timeout(180)
        after = visual.locator('.first-handle.is-active').get_attribute('transform')
        scroll_after = page.evaluate('window.scrollY')
        assert before != after
        assert abs(scroll_after - scroll_before) <= 3, (scroll_before, scroll_after)
        assert visual.locator('.concept-map-marker.marker-first').get_attribute('transform') == after

        # Undo is visible and reverses the last marker change.
        visual.locator('.calibration-finish-bar [data-cal-action="undo"]').click()
        page.wait_for_timeout(130)
        undone = visual.locator('.first-handle.is-active').get_attribute('transform')
        assert undone == before, (undone, before)

        # Keep-clear mode exposes only keep-clear corners and updates the protected mask.
        visual.locator('[data-cal-tool="keep"]').click()
        page.wait_for_timeout(100)
        assert visual.locator('.keep-handle.is-active').count() >= 4
        assert visual.locator('.usable-handle.is-inactive').count() == 4
        mask_before = visual.locator('[data-cal-mask-keep="0"]').first.get_attribute('width')
        keep = visual.locator('.keep-handle.is-active[data-cal-index="0"][data-cal-corner="se"]')
        keep.scroll_into_view_if_needed(); page.wait_for_timeout(80)
        kb = keep.bounding_box(); assert kb
        page.mouse.move(kb['x'] + kb['width']/2, kb['y'] + kb['height']/2)
        page.mouse.down(); page.mouse.move(kb['x'] - 60, kb['y'] + 20, steps=4); page.mouse.up()
        page.wait_for_timeout(160)
        mask_after = visual.locator('[data-cal-mask-keep="0"]').first.get_attribute('width')
        assert mask_before != mask_after

        # Reset is unmistakable and Undo restores the user's calibrated layout.
        customised_before_reset = page.evaluate('JSON.stringify(state.calibration)')
        visual.locator('[data-cal-action="reset"]').first.click(); page.wait_for_timeout(120)
        assert page.evaluate('state.calibration.customised') is False
        visual.locator('[data-cal-action="undo"]').first.click(); page.wait_for_timeout(120)
        assert page.evaluate('state.calibration.customised') is True
        assert page.evaluate('JSON.stringify(state.calibration)') == customised_before_reset

        # Capture the open phone calibration state.
        shot = OUT / 'v90_calibration_mobile.png'
        visual.screenshot(path=str(shot))
        shots.append(str(shot))
        assert overflow(page) <= 2

        # Finish, select another future, save and persist.
        visual.locator('.calibration-finish-bar [data-cal-action="done"]').click()
        page.wait_for_timeout(130)
        assert 'Adjusted for this property' in visual.locator('.calibration-closed').inner_text()
        page.locator('[data-dashboard-future="productive"] [data-view-future="productive"]').click()
        page.wait_for_timeout(130)
        assert 'future-productive' in visual.locator('.concept-overlay-svg').get_attribute('class')
        assert 'RECOMMENDED' in page.locator('[data-dashboard-future="gathering"]').inner_text().upper()
        assert 'SELECTED' in page.locator('[data-dashboard-future="productive"]').inner_text().upper()
        visual.locator('[data-visual-mode="recommended"]').click(); page.wait_for_timeout(80)
        assert 'future-gathering' in visual.locator('.concept-overlay-svg').get_attribute('class')

        tab(page, 'explore')
        page.locator('#saveProjectBtn').click(); page.wait_for_timeout(100)
        page.evaluate('persistCurrentSessionNow()')
        store = page.evaluate('localStorage._dump()')
        session_json = next(v for k, v in store.items() if 'current_session' in k)
        assert 'calibration' in session_json and 'customised' in session_json
        page.close()

        # Reload preserves calibration and selected future; controls still open correctly.
        page = load(context, (390, 844), store, errors)
        tab(page, 'dashboard')
        visual = page.locator('#dashboardTodayVisual')
        assert 'Adjusted for this property' in visual.locator('.calibration-closed').inner_text()
        assert page.locator('[data-dashboard-future="productive"]').get_attribute('aria-pressed') == 'true'
        page.locator('#dashboardAdjustConceptBtn').click(); page.wait_for_timeout(150)
        assert visual.locator('.calibration-panel').count() == 1
        assert visual.locator('.calibration-finish-bar').count() == 1
        assert overflow(page) <= 2
        restored_shot = OUT / 'v90_calibration_restored_mobile.png'
        visual.screenshot(path=str(restored_shot))
        shots.append(str(restored_shot))
        page.close()

        # Isolated mobile widths; open editor and verify controls are not clipped.
        width_results = []
        for width in (360, 390, 412, 430):
            wp = load(context, (width, 844), store, errors)
            tab(wp, 'dashboard')
            wp.locator('#dashboardAdjustConceptBtn').click(); wp.wait_for_timeout(120)
            editor = wp.locator('#dashboardTodayVisual')
            assert editor.locator('.calibration-finish-bar').is_visible()
            assert editor.locator('.calibration-tools button').count() == 5
            ov = overflow(wp)
            assert ov <= 2, (width, ov)
            width_results.append({'width': width, 'overflow': ov})
            wp.close()

        # Demo and shaded self-test retain calibration entry.
        for trigger in ('#demoBtn', '[data-self-test="shaded"]'):
            quick = load(context, (390, 844), errors=errors)
            if trigger == '#demoBtn':
                tab(quick, 'explore'); quick.locator(trigger).click(); quick.wait_for_timeout(180); tab(quick, 'dashboard')
            else:
                quick.locator(trigger).first.click(); quick.wait_for_timeout(280); tab(quick, 'dashboard')
            assert quick.locator('#dashboardAdjustConceptBtn').is_enabled()
            quick.locator('#dashboardAdjustConceptBtn').click(); quick.wait_for_timeout(120)
            assert quick.locator('#dashboardTodayVisual .calibration-editor-svg').count() == 1
            quick.close()

        # Desktop and locked pilot status.
        desktop = load(context, (1440, 900), store, errors)
        tab(desktop, 'ai')
        txt = desktop.locator('#ai').inner_text().upper()
        for token in ('DISABLED', 'NOT CONNECTED YET', 'NOT ADDED', 'LOCKED', 'CALIBRATION MODULE', 'READY', 'ONE-IMAGE AI PILOT', 'NOT APPROVED'):
            assert token in txt, token
        tab(desktop, 'dashboard')
        assert overflow(desktop) <= 2
        desktop.close()

        if errors:
            raise AssertionError(errors)
        results.append({
            'case': 'v9.0-phone-calibration-hardening',
            'status': 'passed',
            'real_photo_used': PHOTO.exists(),
            'viewports': [360, 390, 412, 430, 1440],
            'width_results': width_results,
            'horizontal_overflow': '0-2px maximum',
            'large_touch_target_diameter_svg_units': 98,
            'drag_scroll_lock': 'passed in Chromium pointer simulation',
            'edge_handle_clamp': 'passed',
            'undo_reset_done': 'Undo, Reset and Done passed in Chromium',
            'persistence': 'passed',
            'recommended_selected_consistency': 'passed',
            'screenshots': shots,
            'physical_android_test': 'not supplied / not performed'
        })
    except Exception as e:
        results.append({
            'case': 'v9.0-phone-calibration-hardening',
            'status': 'failed',
            'error': str(e),
            'trace': traceback.format_exc(),
            'browser_errors': errors,
        })
    finally:
        browser.close()

out = OUT / 'v90_browser_test_results.json'
out.write_text(json.dumps(results, indent=2))
print(json.dumps(results, indent=2))
if any(x['status'] != 'passed' for x in results):
    raise SystemExit(1)
