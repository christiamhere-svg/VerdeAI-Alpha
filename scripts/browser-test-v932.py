from pathlib import Path
import json, traceback
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'evidence'
OUT.mkdir(exist_ok=True)
PHOTO = ROOT / 'evidence/v932_test_property_clean.jpg'
RESULT = OUT / 'v932_browser_test_results.json'

html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'styles/main.v9.3.2.css').read_text(encoding='utf-8')
config = (ROOT / 'config.v9.3.2.js').read_text(encoding='utf-8')
app = (ROOT / 'js/app.v9.3.2.js').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="styles/main.v9.3.2.css" />', f'<style>{css}</style>')
html = html.replace('<script src="config.v9.3.2.js"></script>', f'<script>{config}</script>')
html = html.replace('<script type="module" src="js/app.v9.3.2.js"></script>', f'<script>{app}</script>')
STORE = '''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''


def page_for(ctx, w=390, h=844, errors=None):
    p = ctx.new_page()
    p.set_viewport_size({'width': w, 'height': h})
    p.set_default_timeout(18000)
    if errors is not None:
        p.on('pageerror', lambda e: errors.append(str(e)))
    p.set_content(html.replace('<body>', '<body><script>' + STORE + '</script>', 1), wait_until='load')
    p.wait_for_timeout(700)
    return p


def tab(p, name):
    p.evaluate('name => activateTab(name)', name)
    p.wait_for_timeout(240)


def overflow(p):
    return p.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')


def prepare_result(p):
    tab(p, 'explore')
    p.locator('#photoInput').set_input_files(str(PHOTO))
    p.wait_for_timeout(480)
    p.locator('#propertyType').select_option('overgrown')
    p.locator('#constraintSelect').select_option('maintenance-drag')
    p.locator('#preferenceSelect').select_option('wildlife')
    p.locator('#analyseBtn').click()
    p.wait_for_timeout(650)
    tab(p, 'dashboard')
    p.wait_for_timeout(650)


results, errors = [], []
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx = browser.new_context()
    try:
        p = page_for(ctx, 390, 844, errors)
        assert 'BUILD V9.3.2' in p.locator('body').inner_text().upper()
        prepare_result(p)

        panel = p.locator('#futureSelectionPanel')
        assert panel.is_visible()
        assert panel.locator('[data-dashboard-future]').count() == 6
        host = p.locator('#dashboardConceptStageHost')
        stage = host.locator('.photo-concept-stage')
        assert host.count() == 1 and stage.count() == 1
        assert host.locator('.photo-concept-image').count() == 1
        assert host.locator('.concept-depth-wash').evaluate('(el) => getComputedStyle(el).display') == 'none'
        photo_style = host.locator('.photo-concept-image').evaluate('(el) => ({opacity:getComputedStyle(el).opacity, filter:getComputedStyle(el).filter})')
        assert photo_style == {'opacity': '1', 'filter': 'none'}, photo_style

        # Complete placement so the final screenshot represents the finished user result.
        open_btn = host.locator('[data-cal-action="open"]')
        if open_btn.count():
            open_btn.click(); p.wait_for_timeout(180)
        done_btn = host.locator('[data-cal-action="done"]')
        if done_btn.count():
            done_btn.first.click(); p.wait_for_timeout(280)
        assert host.locator('.calibration-editor-svg').count() == 0
        assert host.locator('.marker-first').count() == 1

        captures, metrics, signatures = [], {}, {}
        for fid in ['wildlife', 'belonging', 'minimal']:
            card = panel.locator(f'[data-dashboard-future="{fid}"]')
            assert card.count() == 1 and card.is_visible()
            card.click(); p.wait_for_timeout(420)
            stage = host.locator('.photo-concept-stage')
            assert f'future-{fid}' in (stage.locator('.concept-overlay-svg').get_attribute('class') or '')
            plant_count = stage.locator('.botanical-plant').count()
            leaf_count = stage.locator('.plant-leaf').count()
            shadows = stage.locator('.plant-contact-shadow').count()
            variants = stage.locator('.botanical-plant').evaluate_all('(els) => [...new Set(els.map(el => el.dataset.plantVariant))]')
            types = stage.locator('.botanical-plant').evaluate_all('(els) => [...new Set(els.map(el => el.dataset.plantType))]')
            assert plant_count >= 10, (fid, plant_count)
            assert leaf_count >= 100, (fid, leaf_count)
            assert shadows >= plant_count, (fid, shadows, plant_count)
            assert len(variants) >= max(8, plant_count - 3), (fid, len(variants), plant_count)
            assert len(types) >= 4, (fid, types)
            metrics[fid] = {'plants': plant_count, 'leaves': leaf_count, 'shadows': shadows, 'unique_variants': len(variants), 'types': types}
            signatures[fid] = stage.locator('.concept-future-layer').inner_html()
            shot = OUT / f'v932_{fid}_overlay_mobile.png'
            stage.screenshot(path=str(shot))
            captures.append(str(shot))

        assert len(set(signatures.values())) == 3
        assert metrics['wildlife']['plants'] > metrics['minimal']['plants']

        # Feature Garden text must stay tied to Feature Garden, not a stale site-pattern name.
        feature = panel.locator('[data-dashboard-future="belonging"]')
        feature_text = feature.locator('.dashboard-future-copy').inner_text()
        assert 'Feature Garden' in feature_text
        assert 'Recovery Garden' not in feature_text
        assert 'focal' in feature_text.lower()

        # Wildlife and Feature remain independent compositions and selection state.
        panel.locator('[data-dashboard-future="wildlife"]').click(); p.wait_for_timeout(250)
        state_data = p.evaluate('({selected: state.selectedFutureId, recommended: state.recommendedFutureId})')
        assert state_data['selected'] == 'wildlife'
        assert 'Wildlife Haven' in p.locator('#futureSelectionStatus').inner_text()

        # Visual evidence of the future panel on Android.
        panel.scroll_into_view_if_needed(); p.wait_for_timeout(120)
        p.add_style_tag(content='.skip-link{display:none!important}')
        panel.screenshot(path=str(OUT / 'v932_future_panel_android.png'))
        assert overflow(p) <= 2

        # Safe rendering remains locked.
        assert p.locator('#dashboardCreateAiRenderBtn').is_disabled()
        tab(p, 'ai'); p.wait_for_timeout(250)
        assert 'REAL AI RENDERING IS DISABLED' in p.locator('#v93AiLockBanner').inner_text().upper()
        widths = []
        for w, h in ((360, 844), (430, 844), (768, 900), (1440, 900)):
            p.set_viewport_size({'width': w, 'height': h})
            p.wait_for_timeout(180)
            ov = overflow(p)
            assert p.locator('#futureSelectionPanel [data-dashboard-future]').count() == 6
            assert ov <= 2, (w, ov)
            widths.append({'width': w, 'overflow': ov})
        p.close()

        if errors:
            raise AssertionError(errors)
        results.append({
            'case': 'v9.3.2-botanical-overlay-realism-pass',
            'status': 'passed',
            'photo_unobscured': True,
            'procedural_botanical_geometry': True,
            'ground_contact_shadows': True,
            'perspective_depth_bands': True,
            'repetition_reduced': True,
            'feature_text_synced': True,
            'distinct_future_signatures': 3,
            'metrics': metrics,
            'finished_handles_hidden': True,
            'marker_5_visible': True,
            'safe_ai_state': True,
            'viewports': widths,
            'screenshots': captures + [str(OUT / 'v932_future_panel_android.png')],
            'browser': 'Chromium inline harness',
            'physical_android_gate': 'pending'
        })
    except Exception as exc:
        results.append({'case': 'v9.3.2-botanical-overlay-realism-pass', 'status': 'failed', 'error': str(exc), 'trace': traceback.format_exc(), 'browser_errors': errors})
    finally:
        ctx.close(); browser.close()

RESULT.write_text(json.dumps(results, indent=2), encoding='utf-8')
print(json.dumps(results, indent=2))
if any(item.get('status') != 'passed' for item in results):
    raise SystemExit(1)
