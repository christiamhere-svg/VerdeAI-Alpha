from pathlib import Path
import json, traceback
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence'; OUT.mkdir(exist_ok=True)
PHOTO=Path('/mnt/data/v92_test_property.jpg')
RESULT=OUT/'v93_browser_test_results.json'
html=(ROOT/'index.html').read_text()
css=(ROOT/'styles/main.v9.3.css').read_text()
config=(ROOT/'config.v9.3.js').read_text()
app=(ROOT/'js/app.v9.3.js').read_text()
html=html.replace('<link rel="stylesheet" href="styles/main.v9.3.css" />',f'<style>{css}</style>')
html=html.replace('<script src="config.v9.3.js"></script>',f'<script>{config}</script>')
html=html.replace('<script type="module" src="js/app.v9.3.js"></script>',f'<script>{app}</script>')
STORE='''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''

def page_for(ctx,w=390,h=844,errors=None):
    p=ctx.new_page(); p.set_viewport_size({'width':w,'height':h}); p.set_default_timeout(15000)
    if errors is not None: p.on('pageerror',lambda e: errors.append(str(e)))
    p.set_content(html.replace('<body>','<body><script>'+STORE+'</script>',1),wait_until='load'); p.wait_for_timeout(500); return p

def tab(p,name): p.evaluate('name=>activateTab(name)',name); p.wait_for_timeout(180)
def overflow(p): return p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')

results=[]; errors=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    ctx=browser.new_context()
    try:
        p=page_for(ctx,390,844,errors)
        assert 'BUILD V9.3' in p.locator('body').inner_text().upper()
        tab(p,'explore')
        p.locator('#photoInput').set_input_files(str(PHOTO)); p.wait_for_timeout(500)
        p.locator('#propertyType').select_option('under-building')
        p.locator('#constraintSelect').select_option('shade-dark')
        p.locator('#analyseBtn').click(); p.wait_for_timeout(500)
        tab(p,'dashboard'); p.wait_for_timeout(500)
        host=p.locator('#dashboardConceptStageHost')
        assert host.count()==1
        assert host.locator('.photo-concept-stage').count()==1
        assert host.locator('.botanical-composition').count()==1
        assert host.locator('.botanical-plant').count() >= 10
        assert host.locator('.plant-depth-layer').count()==3
        assert overflow(p)<=2
        # Complete calibration if it is open; otherwise open then complete to verify handles hide.
        open_btn=host.locator('[data-cal-action="open"]')
        if open_btn.count():
            open_btn.click(); p.wait_for_timeout(120)
        done_btn=host.locator('[data-cal-action="done"]')
        if done_btn.count():
            done_btn.first.click(); p.wait_for_timeout(250)
        stage=host.locator('.photo-concept-stage')
        assert 'is-finished' in (stage.get_attribute('class') or '')
        assert host.locator('.calibration-editor-svg').count()==0
        assert host.locator('.marker-first').count()==1
        # Force selected mode and capture distinct futures.
        p.locator('[data-visual-mode="selected"]').click(); p.wait_for_timeout(150)
        shots=[]; counts={}
        for fid in ['gathering','wildlife','minimal','productive','belonging','maker']:
            card=p.locator(f'#dashboardFutureCards [data-dashboard-future="{fid}"]')
            assert card.count()==1
            card.click(); p.wait_for_timeout(250)
            p.locator('#dashboardTodayVisual').scroll_into_view_if_needed(); p.wait_for_timeout(120)
            stage=host.locator('.photo-concept-stage')
            assert f'future-{fid}' in (stage.locator('.concept-overlay-svg').get_attribute('class') or '')
            count=stage.locator('.botanical-plant').count(); counts[fid]=count
            assert count >= (5 if fid=='maker' else 10)
            shot=OUT/f'v93_{fid}_overlay_mobile.png'
            stage.screenshot(path=str(shot)); shots.append(str(shot))
        # Ensure future recipes are materially different.
        assert len(set(counts.values())) >= 3, counts
        # Refresh persistence using real localStorage context page reload is not available with set_content; inspect state serialization instead.
        state_data=p.evaluate('({selected: state.selectedFutureId, calibration: state.calibration})')
        assert state_data and state_data.get('calibration') and state_data.get('selected')=='maker'
        # Safe rendering gate
        tab(p,'ai'); p.wait_for_timeout(250)
        assert 'REAL AI RENDERING IS DISABLED' in p.locator('#v93AiLockBanner').inner_text().upper()
        assert p.locator('#dashboardCreateAiRenderBtn').is_disabled()
        p.close()
        widths=[]
        for w in (360,390,412,430,1440):
            q=page_for(ctx,w,900 if w==1440 else 844,errors); tab(q,'dashboard'); q.wait_for_timeout(150)
            ov=overflow(q); assert ov<=2,(w,ov); widths.append({'width':w,'overflow':ov}); q.close()
        if errors: raise AssertionError(errors)
        results.append({'case':'v9.3-plant-overlay-gate','status':'passed','botanical_layers':True,'future_counts':counts,'finished_handles_hidden':True,'marker_5_visible':True,'safe_ai_state':True,'viewports':widths,'screenshots':shots,'browser':'Chromium inline harness'})
    except Exception as e:
        results.append({'case':'v9.3-plant-overlay-gate','status':'failed','error':str(e),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        ctx.close(); browser.close()
RESULT.write_text(json.dumps(results,indent=2)); print(json.dumps(results,indent=2))
if any(x.get('status')!='passed' for x in results): raise SystemExit(1)
