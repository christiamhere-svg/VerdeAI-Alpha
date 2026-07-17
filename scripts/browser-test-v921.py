from pathlib import Path
import json, traceback
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence'
PHOTO=Path('/mnt/data/v92_test_property.jpg')
RESULT=OUT/'v921_browser_test_results.json'
html=(ROOT/'index.html').read_text(); css=(ROOT/'styles/main.v9.2.1.css').read_text(); config=(ROOT/'config.v9.2.1.js').read_text(); app=(ROOT/'js/app.v9.2.1.js').read_text()
html=html.replace('<link rel="stylesheet" href="styles/main.v9.2.1.css" />',f'<style>{css}</style>').replace('<script src="config.v9.2.1.js"></script>',f'<script>{config}</script>').replace('<script type="module" src="js/app.v9.2.1.js"></script>',f'<script>{app}</script>')
STORE='''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''
def page_for(ctx,w=390,h=844,errors=None):
 p=ctx.new_page(); p.set_viewport_size({'width':w,'height':h}); p.set_default_timeout(9000); p.on('pageerror',lambda e: errors.append(str(e)) if errors is not None else None); p.set_content(html.replace('<body>','<body><script>'+STORE+'</script>',1),wait_until='load'); p.wait_for_timeout(300); return p
def tab(p,name): p.evaluate('name=>activateTab(name)',name); p.wait_for_timeout(100)
def overflow(p): return p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
results=[]; errors=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox']); ctx=browser.new_context()
 try:
  p=page_for(ctx,390,844,errors)
  assert 'BUILD V9.2.1' in p.locator('body').inner_text().upper()
  tab(p,'explore'); p.locator('#photoInput').set_input_files(str(PHOTO)); p.wait_for_timeout(400); p.locator('#propertyType').select_option('under-building'); p.locator('#constraintSelect').select_option('shade-dark'); p.locator('#analyseBtn').click(); p.wait_for_timeout(300)
  tab(p,'dashboard'); assert p.locator('#dashboardConceptStageHost').count()==1; assert overflow(p)<=2
  tab(p,'ai')
  assert p.locator('#ownerActivationPanel').count()==1
  assert '0 OF 5 APPROVALS RECORDED' in p.locator('#ownerActivationPanel').inner_text().upper()
  assert p.locator('#activateOwnerPilotBtn').is_disabled()
  for ident in ['ownerProviderControl','ownerBackendControl','ownerBudgetControl','ownerTesterControl','ownerRetentionControl']: assert p.locator('#'+ident).count()==1
  p.evaluate("document.querySelector('#ownerActivationPanel').scrollIntoView({block:'start'})"); p.wait_for_timeout(150); shot=OUT/'v921_owner_activation_mobile.png'; p.screenshot(path=str(shot))
  p.locator('#copyOwnerApprovalRequestBtn').click(); p.wait_for_timeout(70)
  p.locator('#renderSelectedFutureBtn').click(); p.wait_for_timeout(80)
  for ident in ['confirmRenderPrivacy','confirmRenderImageUse','confirmRenderCost','confirmRenderConcept']: p.locator('#'+ident).check()
  p.locator('#confirmOneRenderBtn').click(); p.wait_for_timeout(1000)
  assert 'NO PROVIDER WAS CONTACTED' in p.locator('#aiRenderFlowStatus').inner_text().upper()
  checks=[]
  for button,title,fact in [
   ('#testTimeoutStateBtn','RENDER STOPPED AFTER 120 SECONDS','NO AUTOMATIC RETRY'),
   ('#testProviderErrorStateBtn','PROVIDER COULD NOT RETURN A USABLE IMAGE','NO AUTOMATIC RETRY'),
   ('#testBudgetLockStateBtn','OWNER APPROVAL OR PILOT BUDGET IS NOT AVAILABLE','NO CHARGE STARTED')]:
    p.locator(button).click(); p.wait_for_timeout(80); text=p.locator('#aiRenderFlowStatus').inner_text().upper(); assert title in text and fact in text and 'USE FREE CALIBRATED OVERLAY' in text and 'BACK TO REHEARSAL' in text; heights=p.locator('#aiRenderFlowStatus button').evaluate_all('(els)=>els.map(el=>el.getBoundingClientRect().height)'); assert max(heights)<=90,heights; checks.append(title)
  failure_shot=OUT/'v921_budget_lock_mobile.png'; p.locator('#aiRenderFlowStatus').scroll_into_view_if_needed(); p.wait_for_timeout(2600); p.screenshot(path=str(failure_shot)); p.locator('#aiRenderFlowStatus [data-reset-render-state]').click(); p.wait_for_timeout(60); assert 'SAFE REHEARSAL READY' in p.locator('#aiRenderFlowStatus').inner_text().upper()
  p.locator('#resetOwnerSafeStateBtn').click(); p.wait_for_timeout(100); assert p.locator('#renderProviderSelect').input_value()=='none'; assert p.locator('#activateOwnerPilotBtn').is_disabled()
  assert overflow(p)<=2
  p.close()
  widths=[]
  for w in (360,390,412,430,1440):
   q=page_for(ctx,w,900 if w==1440 else 844,errors); tab(q,'ai'); ov=overflow(q); assert ov<=2,(w,ov); assert q.locator('#activateOwnerPilotBtn').is_disabled(); widths.append({'width':w,'overflow':ov}); q.close()
  if errors: raise AssertionError(errors)
  results.append({'case':'v9.2.1-owner-activation-preparation','status':'passed','owner_approvals':'0/5','activation_button':'disabled','failure_states':checks,'core_preservation':'passed','viewports':widths,'screenshots':[str(shot),str(failure_shot)],'browser':'Chromium inline harness'})
 except Exception as e:
  results.append({'case':'v9.2.1-owner-activation-preparation','status':'failed','error':str(e),'trace':traceback.format_exc(),'browser_errors':errors})
 finally:
  ctx.close(); browser.close()
OUT.mkdir(exist_ok=True); RESULT.write_text(json.dumps(results,indent=2)); print(json.dumps(results,indent=2));
if any(x.get('status')!='passed' for x in results): raise SystemExit(1)
