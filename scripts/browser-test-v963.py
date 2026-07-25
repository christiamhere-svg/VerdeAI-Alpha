from pathlib import Path
import json, traceback, base64, mimetypes
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence'; OUT.mkdir(exist_ok=True)
RESULT=OUT/'v963_browser_test_results.json'
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles/main.v9.6.3.css').read_text(encoding='utf-8')
config=(ROOT/'config.v9.6.3.js').read_text(encoding='utf-8')
app=(ROOT/'js/app.v9.6.3.js').read_text(encoding='utf-8')

def data_uri(path):
    p=ROOT/path
    mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode('ascii')

for rel in ['assets/demo-overgrown-garden.jpg']+[f'assets/inspiration/{x}.jpg' for x in ['belonging','minimal','wildlife','gathering','productive','maker']]:
    app=app.replace(rel, data_uri(rel))
html=html.replace('<link rel="stylesheet" href="styles/main.v9.6.3.css" />',f'<style>{css}</style>')
html=html.replace('<script src="config.v9.6.3.js"></script>',f'<script>{config}</script>')
html=html.replace('<script defer src="js/app.v9.6.3.js"></script>',f'<script>{app}</script>')
STORE='''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''
html=html.replace('<body>','<body><script>'+STORE+'</script>',1)
results=[]; errors=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx=browser.new_context(viewport={'width':390,'height':844}, device_scale_factor=1)
    p=ctx.new_page(); p.set_default_timeout(20000); p.on('pageerror', lambda e: errors.append(str(e)))
    try:
        p.set_content(html, wait_until='load'); p.wait_for_timeout(700)
        body=p.locator('body').inner_text()
        assert 'Build v9.6.3' in body
        assert 'until you choose a paid provider' not in body
        p.locator('#demoBtn').click(); p.wait_for_timeout(1500)
        # Select a non-recommended future so the tester page must use the current selected future.
        board=p.locator('#possibilitiesBoard')
        board.locator('[data-dashboard-future="minimal"]').click(); p.wait_for_timeout(250)
        # Simulate an editor left open elsewhere, then open Tester Page.
        p.evaluate('calibrationUi.open=true')
        p.locator('.tab[data-tab="testerPage"]').click(); p.wait_for_timeout(500)
        tester=p.locator('#testerPage')
        assert tester.is_visible()
        text=tester.inner_text()
        assert 'One photo. One map. One honest inspiration.' in text
        assert 'property map' in text.lower()
        assert 'real-world inspiration' in text.lower()
        assert 'paid provider' not in text.lower()
        assert 'ai rendering is being prepared' not in text.lower()
        assert 'screenshot the plant overlay' not in text.lower()
        visual=tester.locator('#testerPageVisual')
        assert visual.locator('.hybrid-concept-grid').count()==1
        assert visual.locator('.hybrid-concept-property .photo-concept-image').count()==1
        assert visual.locator('.hybrid-concept-reference img').count()==1
        assert visual.locator('.calibration-editor-svg').count()==0
        assert visual.locator('.calibration-controls').count()==0
        assert p.evaluate('calibrationUi.open') is False
        # Current selected future must be reflected in tester cards/context.
        assert 'Low-Maintenance Haven' in text
        # Direct tester feedback is present and works.
        buttons=tester.locator('.tester-page-feedback-buttons [data-feedback-reaction]')
        assert buttons.count()==3
        buttons.first.click(); p.wait_for_timeout(250)
        assert p.evaluate('getFeedback().length')>=1
        overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow<=2, overflow
        p.screenshot(path=str(OUT/'v963_tester_page_android.png'), full_page=True)
        if errors: raise AssertionError(errors)
        results.append({'case':'v9.6.3-tester-page-alignment','status':'passed','clean_finished_result':True,'current_photo_and_selection':True,'copy_aligned':True,'direct_feedback':True,'safe_ai_state':True,'overflow':overflow})
    except Exception as exc:
        results.append({'case':'v9.6.3-tester-page-alignment','status':'failed','error':str(exc),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        ctx.close(); browser.close()
RESULT.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
