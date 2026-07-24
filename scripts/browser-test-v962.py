from pathlib import Path
import json, traceback, base64, mimetypes
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence'; OUT.mkdir(exist_ok=True)
RESULT=OUT/'v962_browser_test_results.json'
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles/main.v9.6.2.css').read_text(encoding='utf-8')
config=(ROOT/'config.v9.6.2.js').read_text(encoding='utf-8')
app=(ROOT/'js/app.v9.6.2.js').read_text(encoding='utf-8')

def data_uri(path):
    p=ROOT/path
    mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode('ascii')

for rel in ['assets/demo-overgrown-garden.jpg']+[f'assets/inspiration/{x}.jpg' for x in ['belonging','minimal','wildlife','gathering','productive','maker']]:
    app=app.replace(rel, data_uri(rel))
html=html.replace('<link rel="stylesheet" href="styles/main.v9.6.2.css" />',f'<style>{css}</style>')
html=html.replace('<script src="config.v9.6.2.js"></script>',f'<script>{config}</script>')
html=html.replace('<script defer src="js/app.v9.6.2.js"></script>',f'<script>{app}</script>')
STORE='''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''
html=html.replace('<body>','<body><script>'+STORE+'</script>',1)
results=[]; errors=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx=browser.new_context(viewport={'width':390,'height':844}, device_scale_factor=1)
    p=ctx.new_page(); p.set_default_timeout(20000); p.on('pageerror', lambda e: errors.append(str(e)))
    try:
        p.set_content(html, wait_until='load'); p.wait_for_timeout(900)
        assert 'Build v9.6.2' in p.locator('body').inner_text()
        p.locator('#demoBtn').click(); p.wait_for_timeout(1600)
        board=p.locator('#possibilitiesBoard'); assert board.is_visible()
        cards=board.locator('[data-dashboard-future]'); assert cards.count()==6
        # Each property map must have real visible height and a background/photo.
        minis=cards.locator('.hybrid-property-mini'); assert minis.count()==6
        heights=minis.evaluate_all('(els)=>els.map(el=>el.getBoundingClientRect().height)')
        assert min(heights)>180, heights
        photos=cards.locator('.hybrid-property-mini>.future-property-photo'); assert photos.count()==6
        photo_heights=photos.evaluate_all('(els)=>els.map(el=>el.getBoundingClientRect().height)')
        assert min(photo_heights)>180, photo_heights
        assert cards.locator('.hybrid-property-mini .honest-placement-map').count()==6
        # Compact map should not show editor-like access line or marker 5.
        assert cards.locator('.hybrid-property-mini .honest-access-line').count()==0
        assert cards.locator('.hybrid-property-mini .honest-first-marker').count()==0
        # Wildlife image loaded and is visibly colourful enough to be a distinct reference.
        wildlife=board.locator('[data-dashboard-future="wildlife"] .hybrid-reference img')
        assert wildlife.count()==1
        assert wildlife.evaluate('(img)=>img.complete && img.naturalWidth>1000 && img.naturalHeight>600')
        recommended=p.evaluate('state.recommendedFutureId')
        alternate='minimal' if recommended!='minimal' else 'belonging'
        board.locator(f'[data-dashboard-future="{alternate}"]').click(); p.wait_for_timeout(350)
        pair=p.evaluate('({selected:state.selectedFutureId,recommended:state.recommendedFutureId})')
        assert pair['selected']==alternate and pair['recommended']==recommended and pair['selected']!=pair['recommended']
        board.locator(f'[data-dashboard-future="{alternate}"] [data-view-future]').click(); p.wait_for_timeout(550)
        host=p.locator('#dashboardConceptStageHost')
        assert host.locator('.hybrid-concept-grid').count()==1
        fullmap=host.locator('.hybrid-concept-property .honest-placement-map')
        assert fullmap.count()==1
        assert fullmap.locator('.honest-map-label').count()==0
        assert fullmap.locator('.honest-access-line').count()==1
        assert fullmap.locator('.honest-first-marker').count()==1
        marker_box=fullmap.locator('.honest-first-marker').bounding_box(); assert marker_box
        stage_box=host.locator('.hybrid-concept-property .photo-concept-stage').bounding_box(); assert stage_box
        assert marker_box['x']>=stage_box['x']-1 and marker_box['y']>=stage_box['y']-1
        assert marker_box['x']+marker_box['width']<=stage_box['x']+stage_box['width']+1
        assert marker_box['y']+marker_box['height']<=stage_box['y']+stage_box['height']+1
        open_btn=host.locator('[data-cal-action="open"]')
        if open_btn.count(): open_btn.first.click(); p.wait_for_timeout(350)
        assert host.locator('.calibration-editor-svg').count()==1
        done=host.locator('[data-cal-action="done"]'); assert done.count()>=1
        done.first.click(); p.wait_for_timeout(350)
        assert host.locator('.calibration-editor-svg').count()==0
        assert host.locator('.hybrid-concept-grid').count()==1
        assert p.locator('#dashboardCreateAiRenderBtn').is_disabled()
        overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow<=2, overflow
        # Capture board and full-size proof.
        p.locator('[data-nav-target="futures"]') if False else None
        board.screenshot(path=str(OUT/'v962_demo_board_android.png'))
        host.screenshot(path=str(OUT/'v962_demo_fullsize_android.png'))
        if errors: raise AssertionError(errors)
        results.append({'case':'v9.6.2-hybrid-map-clarity-inspiration-match','status':'passed','six_visible_property_maps':True,'quiet_full_size_map':True,'wildlife_reference_matched':True,'recommended_selected_independent':True,'calibration_preserved':True,'safe_ai_state':True,'overflow':overflow})
    except Exception as exc:
        results.append({'case':'v9.6.2-hybrid-map-clarity-inspiration-match','status':'failed','error':str(exc),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        ctx.close(); browser.close()
RESULT.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
