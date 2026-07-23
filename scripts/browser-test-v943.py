from pathlib import Path
import json, traceback, base64
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence'; OUT.mkdir(exist_ok=True)
RESULT=OUT/'v943_browser_test_results.json'
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles/main.v9.4.3.css').read_text(encoding='utf-8')
config=(ROOT/'config.v9.4.3.js').read_text(encoding='utf-8')
app=(ROOT/'js/app.v9.4.3.js').read_text(encoding='utf-8')
photo='data:image/jpeg;base64,'+base64.b64encode((ROOT/'assets/demo-overgrown-garden.jpg').read_bytes()).decode('ascii')
app=app.replace('assets/demo-overgrown-garden.jpg', photo)
html=html.replace('<link rel="stylesheet" href="styles/main.v9.4.3.css" />',f'<style>{css}</style>')
html=html.replace('<script src="config.v9.4.3.js"></script>',f'<script>{config}</script>')
html=html.replace('<script defer src="js/app.v9.4.3.js"></script>',f'<script>{app}</script>')
STORE='''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''
html=html.replace('<body>','<body><script>'+STORE+'</script>',1)
results=[]; errors=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx=browser.new_context(viewport={'width':390,'height':844})
    p=ctx.new_page(); p.set_default_timeout(18000); p.on('pageerror', lambda e: errors.append(str(e)))
    try:
        p.set_content(html, wait_until='load'); p.wait_for_timeout(900)
        assert 'Build v9.4.3' in p.locator('body').inner_text()
        assert p.locator('#demoBtn').inner_text().strip() == 'Use real demo photo'
        p.locator('#demoBtn').click(); p.wait_for_timeout(1400)
        board=p.locator('#possibilitiesBoard'); assert board.is_visible()
        cards=board.locator('[data-dashboard-future]'); assert cards.count()==6
        assert board.locator('#dashboardBoardToday img').count()==1
        src=board.locator('#dashboardBoardToday img').get_attribute('src') or ''
        assert src.startswith('data:image/jpeg;base64,'), src[:60]
        assert cards.locator('img.future-property-photo').count()==6
        state=p.evaluate('({demo:state.demoMode,photo:state.photoDataUrl,type:state.propertyType,scenario:state.calibration?.scenario,keep:state.calibration?.keepClear?.length,usable:state.calibration?.usable})')
        assert state['demo'] is True and state['photo'].startswith('data:image/jpeg;base64,')
        assert state['type']=='overgrown' and state['scenario']=='recovery' and state['keep']==2
        assert state['usable'][0]['y']==250
        recommended=p.evaluate('state.recommendedFutureId')
        alternate='wildlife' if recommended!='wildlife' else 'minimal'
        board.locator(f'[data-dashboard-future="{alternate}"]').click(); p.wait_for_timeout(350)
        pair=p.evaluate('({selected:state.selectedFutureId,recommended:state.recommendedFutureId})')
        assert pair['selected']==alternate and pair['recommended']==recommended and pair['selected']!=pair['recommended']
        board.locator(f'[data-dashboard-future="{alternate}"] [data-view-future]').click(); p.wait_for_timeout(500)
        host=p.locator('#dashboardConceptStageHost')
        assert host.locator('.photo-concept-image').count()==1
        assert (host.locator('.photo-concept-image').get_attribute('src') or '').startswith('data:image/jpeg;base64,')
        assert host.locator('.demo-natural-ratio').count()==1
        ratio=host.locator('.photo-concept-stage').evaluate('(el)=>{const r=el.getBoundingClientRect();return r.width/r.height}')
        assert 0.96 <= ratio <= 1.04, ratio
        assert host.locator('.future-ground-treatment').count()==1
        open_btn=host.locator('[data-cal-action="open"]')
        if open_btn.count(): open_btn.click(); p.wait_for_timeout(280)
        assert host.locator('.calibration-editor-svg').count()==1
        assert host.locator('.calibration-keep-clear').count()==2
        done=host.locator('[data-cal-action=\"done\"]'); assert done.count()>=1; done=done.first
        done.click(); p.wait_for_timeout(300)
        assert host.locator('.calibration-editor-svg').count()==0
        route_display=host.locator('.concept-access-protection').evaluate('(el)=>getComputedStyle(el).display')
        assert route_display=='none', route_display
        assert host.locator('.marker-first').count()==1
        assert p.locator('#dashboardCreateAiRenderBtn').is_disabled()
        overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow<=2, overflow
        board.screenshot(path=str(OUT/'v943_demo_board_android.png'))
        host.screenshot(path=str(OUT/'v943_demo_fullsize_android.png'))
        if errors: raise AssertionError(errors)
        results.append({'case':'v9.4.3-transformation-clarity-pass','status':'passed','real_demo_photo':True,'six_futures':True,'photo_specific_calibration':True,'recommended_selected_independent':True,'finished_access_guide_hidden':True,'marker_5_visible':True,'safe_ai_state':True,'overflow':overflow})
    except Exception as exc:
        results.append({'case':'v9.4.3-transformation-clarity-pass','status':'failed','error':str(exc),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        ctx.close(); browser.close()
RESULT.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
