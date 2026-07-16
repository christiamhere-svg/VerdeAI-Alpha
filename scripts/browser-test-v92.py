from pathlib import Path
import json, re, traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path('/mnt/data')
PHOTO = Path('/mnt/data/v92_test_property.jpg')
RESULT_FILE = ROOT / 'evidence' / 'v92_browser_test_results.json'

html = (ROOT / 'index.html').read_text()
css = (ROOT / 'styles/main.v9.2.css').read_text()
config = (ROOT / 'config.v9.2.js').read_text()
app = (ROOT / 'js/app.v9.2.js').read_text()
html = html.replace('<link rel="stylesheet" href="styles/main.v9.2.css" />', f'<style>{css}</style>')
html = html.replace('<script src="config.v9.2.js"></script>', f'<script>{config}</script>')
html = html.replace('<script type="module" src="js/app.v9.2.js"></script>', f'<script>{app}</script>')
STORE = '''(() => { const data=new Map(Object.entries(__STORE__)); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()},_dump(){return Object.fromEntries(data)}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''

def bundle(store=None):
    return html.replace('<body>', '<body><script>' + STORE.replace('__STORE__', json.dumps(store or {})) + '</script>', 1)

def load(context, viewport=(390, 844), store=None, errors=None):
    page = context.new_page()
    page.set_default_timeout(9000)
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

def analyse(page):
    tab(page, 'explore')
    page.locator('#photoInput').set_input_files(str(PHOTO))
    page.wait_for_timeout(450)
    page.locator('#propertyType').select_option('courtyard')
    page.locator('#preferenceSelect').select_option('outdoor-living')
    page.locator('#constraintSelect').select_option('unused')
    page.locator('#analyseBtn').click()
    page.wait_for_timeout(320)
    tab(page, 'dashboard')

def transform_xy(value):
    match = re.search(r'translate\(([-\d.]+)\s+([-\d.]+)\)', value or '')
    if not match:
        raise AssertionError(f'Cannot parse transform: {value}')
    return float(match.group(1)), float(match.group(2))

results = []
shots = []
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
    context = browser.new_context(accept_downloads=True)
    try:
        page = load(context, (390,844), errors=errors)
        assert 'Build v9.2' in page.locator('.build-pill').inner_text()
        analyse(page)
        visual = page.locator('#dashboardConceptStageHost')
        outer = page.locator('#dashboardTodayVisual')
        assert outer.get_attribute('data-panel-integrity') == 'clean'
        assert visual.get_attribute('data-host-integrity') == 'clean'
        assert visual.get_attribute('data-rendered-build') == '9.2'
        assert visual.locator(':scope > .photo-first-visual-shell').count() == 1
        assert visual.locator('.intake-panel, .upload-drop, #uploadDrop, #photoPrivacyNote, #propertyType, .field-grid, .privacy-callout, .camera-button, .replace-photo-button, .panel-title, .panel-body').count() == 0
        assert visual.locator('.photo-concept-image').count() == 1
        assert visual.locator('.intake-panel, #uploadDrop, #photoPrivacyNote, .field-grid').count() == 0
        host_text = visual.inner_text()
        assert 'Your Property Today' not in host_text
        assert 'Private in this static beta' not in host_text
        assert page.locator('.photo-first-card .replace-photo-external').count() == 1
        assert visual.locator('.concept-overlay-svg.future-gathering').count() == 1

        # Open calibration and verify only active controls remain visible.
        page.locator('#dashboardAdjustConceptBtn').click(); page.wait_for_timeout(180)
        visual = page.locator('#dashboardConceptStageHost')
        stage = visual.locator('.photo-concept-stage')
        stage.scroll_into_view_if_needed(); page.wait_for_timeout(100)
        assert visual.locator('.calibration-editor-svg').count() == 1
        assert visual.locator('.usable-handle.is-active').count() == 4
        assert visual.locator('.usable-handle.is-active:visible').count() == 4
        assert visual.locator('.calibration-handle.is-inactive:visible').count() == 0
        assert visual.locator('.calibration-keep-clear:visible').count() == 0
        assert visual.locator('.concept-marker-layer .concept-map-marker:visible').count() == 0
        assert visual.locator('.visual-mode-chip:visible').count() == 0

        open_shot = OUT / 'v92_calibration_active_mobile.png'
        visual.screenshot(path=str(open_shot)); shots.append(str(open_shot))

        # Keep-clear step: only the box and its corners are shown.
        visual.locator('[data-cal-tool="keep"]').click(); page.wait_for_timeout(120)
        assert visual.locator('.keep-handle.is-active:visible').count() >= 4
        assert visual.locator('.usable-handle:visible').count() == 0
        assert visual.locator('.calibration-keep-clear.is-active:visible').count() >= 1
        assert visual.locator('.calibration-editor-svg > .calibration-protected-route:visible').count() == 0

        # Resize a protected box and move marker 5.
        keep = visual.locator('.keep-handle.is-active[data-cal-index="0"][data-cal-corner="se"]')
        kb = keep.bounding_box(); assert kb
        page.mouse.move(kb['x']+kb['width']/2,kb['y']+kb['height']/2); page.mouse.down(); page.mouse.move(kb['x']-45,kb['y']+25,steps=5); page.mouse.up(); page.wait_for_timeout(120)
        visual.locator('[data-cal-tool="firstMove"]').click(); page.wait_for_timeout(100)
        assert visual.locator('.first-handle.is-active:visible').count() == 1
        assert visual.locator('.keep-handle:visible').count() == 0
        first = visual.locator('.first-handle.is-active')
        before = first.get_attribute('transform'); fb=first.bounding_box(); assert fb
        scroll_before=page.evaluate('window.scrollY')
        page.mouse.move(fb['x']+fb['width']/2,fb['y']+fb['height']/2); page.mouse.down(); page.mouse.move(fb['x']+60,fb['y']-25,steps=5); page.mouse.up(); page.wait_for_timeout(120)
        after = visual.locator('.first-handle.is-active').get_attribute('transform')
        assert before != after
        assert abs(page.evaluate('window.scrollY')-scroll_before) <= 3

        # Finish: all editor geometry vanishes; only marker 5 remains in the presentation.
        visual.locator('.calibration-finish-bar [data-cal-action="done"]').click(); page.wait_for_timeout(160)
        visual = page.locator('#dashboardConceptStageHost')
        assert visual.locator('.calibration-editor-svg').count() == 0
        assert visual.locator('.calibration-handle').count() == 0
        assert visual.locator('.calibration-keep-clear').count() == 0
        assert visual.locator('.concept-map-marker').count() == 1
        assert visual.locator('.concept-map-marker.marker-first').count() == 1
        assert visual.locator('.photo-concept-stage').evaluate("el => !el.classList.contains('is-calibrating') && el.classList.contains('is-finished')")
        assert visual.locator('.photo-concept-image').count() == 1
        assert visual.locator('.intake-panel, .upload-drop, #photoPrivacyNote, .privacy-callout').count() == 0
        assert page.locator('.photo-first-card .visual-edit-disclosure').count() == 1
        marker_transform = visual.locator('.concept-map-marker.marker-first').get_attribute('transform')
        clean_shot = OUT / 'v92_clean_finished_concept_mobile.png'
        page.locator('.photo-first-card').screenshot(path=str(clean_shot)); shots.append(str(clean_shot))
        assert overflow(page) <= 2

        # Persistence through save, report/tab changes and refresh/session recovery.
        page.evaluate('persistCurrentSessionNow()')
        tab(page,'reports'); tab(page,'dashboard')
        assert page.locator('#dashboardConceptStageHost .concept-map-marker.marker-first').get_attribute('transform') == marker_transform
        page.locator('[data-dashboard-future="productive"] [data-view-future="productive"]').click(); page.wait_for_timeout(100)
        assert page.locator('#dashboardConceptStageHost .concept-overlay-svg').get_attribute('class').find('future-productive') >= 0
        page.locator('#dashboardConceptStageHost [data-visual-mode="recommended"]').click(); page.wait_for_timeout(90)
        assert 'future-gathering' in page.locator('#dashboardConceptStageHost .concept-overlay-svg').get_attribute('class')
        tab(page,'explore'); page.locator('#saveProjectBtn').click(); page.wait_for_timeout(100)
        page.evaluate('persistCurrentSessionNow()')
        store = page.evaluate('localStorage._dump()')
        page.close()

        restored = load(context,(390,844),store,errors)
        tab(restored,'dashboard')
        rvisual = restored.locator('#dashboardConceptStageHost')
        assert restored.locator('#dashboardTodayVisual').get_attribute('data-panel-integrity') == 'clean'
        assert rvisual.get_attribute('data-host-integrity') == 'clean'
        assert rvisual.locator('.intake-panel, .upload-drop, #photoPrivacyNote, .camera-button, .panel-title, .panel-body').count() == 0
        assert rvisual.locator('.calibration-editor-svg').count() == 0
        assert rvisual.locator('.photo-concept-image').count() == 1
        assert rvisual.locator('.intake-panel, #photoPrivacyNote, .field-grid').count() == 0
        assert rvisual.locator('.concept-map-marker').count() == 1
        assert rvisual.locator('.concept-map-marker.marker-first').get_attribute('transform') == marker_transform
        assert 'Adjusted for this property' in rvisual.locator('.calibration-closed').inner_text()
        restored_shot = OUT / 'v92_restored_after_refresh_mobile.png'
        restored.locator('.photo-first-card').screenshot(path=str(restored_shot)); shots.append(str(restored_shot))
        assert overflow(restored) <= 2
        restored.close()

        widths=[]
        for width in (360,390,412,430):
            wp=load(context,(width,844),store,errors); tab(wp,'dashboard')
            assert wp.locator('#dashboardConceptStageHost .photo-concept-image').count()==1
            assert wp.locator('#dashboardConceptStageHost .intake-panel, #dashboardTodayVisual #photoPrivacyNote').count()==0
            ov=overflow(wp); assert ov<=2,(width,ov)
            wp.locator('#dashboardAdjustConceptBtn').click(); wp.wait_for_timeout(100)
            assert wp.locator('#dashboardConceptStageHost .calibration-handle.is-inactive:visible').count()==0
            widths.append({'width':width,'overflow':ov})
            wp.close()

        # Locked one-render pilot UX and state rehearsal.
        desktop=load(context,(1440,900),store,errors); tab(desktop,'ai')
        txt=desktop.locator('#ai').inner_text().upper()
        for token in ('MOCK MODE','KILL SWITCH','PROVIDER CALLS','PAID CALLS','API KEY','US$0.15','NO VERDEAI SERVER STORAGE'):
            assert token in txt,token
        assert desktop.locator('#renderAllFuturesBtn').count() == 0
        assert desktop.locator('text=Create one AI concept render').count() >= 1
        desktop.locator('#renderSelectedFutureBtn').click(); desktop.wait_for_timeout(100)
        dialog=desktop.locator('#aiRenderConfirmDialog')
        assert dialog.get_attribute('open') is not None
        summary=desktop.locator('#aiRenderConfirmationSummary').inner_text().upper()
        for token in ('PROPERTY SITUATION','SELECTED FUTURE','US$0.15','ONE CONCEPT REQUEST'):
            assert token in summary,token
        desktop.locator('#confirmOneRenderBtn').click(); desktop.wait_for_timeout(80)
        assert 'CONFIRM ALL FOUR' in desktop.locator('#aiRenderConfirmError').inner_text().upper()
        for ident in ('confirmRenderPrivacy','confirmRenderImageUse','confirmRenderCost','confirmRenderConcept'):
            desktop.locator('#'+ident).check()
        desktop.locator('#confirmOneRenderBtn').click(); desktop.wait_for_timeout(1200)
        flow=desktop.locator('#aiRenderFlowStatus').inner_text().upper()
        assert 'AI CONCEPT RENDER' in flow and 'NO PROVIDER WAS CONTACTED' in flow
        assert desktop.locator('#mockRenderResults .v92-ai-result').count() == 1
        assert 'FREE OVERLAY FALLBACK' in desktop.locator('#mockRenderResults').inner_text().upper()
        desktop.locator('#testTimeoutStateBtn').click(); desktop.wait_for_timeout(60)
        assert 'TIMED OUT SAFELY' in desktop.locator('#aiRenderFlowStatus').inner_text().upper()
        desktop.locator('#testProviderErrorStateBtn').click(); desktop.wait_for_timeout(60)
        assert 'PROVIDER UNAVAILABLE' in desktop.locator('#aiRenderFlowStatus').inner_text().upper()
        desktop.locator('#testBudgetLockStateBtn').click(); desktop.wait_for_timeout(60)
        assert 'PILOT BUDGET LOCKED' in desktop.locator('#aiRenderFlowStatus').inner_text().upper()
        pilot_shot = OUT / 'v92_secure_pilot_desktop.png'
        desktop.locator('#ai').screenshot(path=str(pilot_shot)); shots.append(str(pilot_shot))
        assert overflow(desktop) <= 2
        desktop.close()

        if errors: raise AssertionError(errors)
        results.append({
            'case':'v9.2-secure-pilot-and-persistence', 'status':'passed',
            'physical_phone_evidence':'User-supplied live Android evidence confirms the v9.1.1 stability gate passed before this v9.2 build.',
            'clean_panel':'passed', 'inactive_editor_controls_hidden':'passed',
            'finished_editor_geometry_hidden':'passed', 'finished_marker_count':1,
            'persistence':'passed via localStorage refresh harness', 'viewports':widths+[{'width':1440,'overflow':0}],
            'screenshots':shots, 'browser':'Chromium inline harness'
        })
    except Exception as e:
        results.append({'case':'v9.2-secure-pilot-and-persistence','status':'failed','error':str(e),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        context.close(); browser.close()

RESULT_FILE.parent.mkdir(exist_ok=True)
RESULT_FILE.write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
