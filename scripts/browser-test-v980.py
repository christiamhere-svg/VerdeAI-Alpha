from pathlib import Path
import json, traceback, base64, mimetypes
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence'; OUT.mkdir(exist_ok=True)
RESULT=OUT/'v980_browser_test_results.json'
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles/main.v9.8.0.css').read_text(encoding='utf-8')
config=(ROOT/'config.v9.8.0.js').read_text(encoding='utf-8')
app=(ROOT/'js/app.v9.8.0.js').read_text(encoding='utf-8')

def data_uri(path):
    p=ROOT/path
    mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode('ascii')

assets=['assets/demo-overgrown-garden.jpg']
assets += [f'assets/inspiration/{x}.jpg' for x in ['belonging','minimal','wildlife','gathering','productive','maker']]
assets += [f'assets/golden-demo/{x}.jpg' for x in ['today','belonging','wildlife','gathering','productive','maker','possibility','year0','year1','year2','year3','year5']]
for rel in assets:
    app=app.replace(rel, data_uri(rel))
html=html.replace('<link rel="stylesheet" href="styles/main.v9.8.0.css" />',f'<style>{css}</style>')
html=html.replace('<script src="config.v9.8.0.js"></script>',f'<script>{config}</script>')
html=html.replace('<script defer src="js/app.v9.8.0.js"></script>',f'<script>{app}</script>')
STORE='''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''
html=html.replace('<body>','<body><script>'+STORE+'</script>',1)
results=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])

    for label,viewport in [('android',{'width':390,'height':844}),('desktop',{'width':1440,'height':900})]:
        ctx=browser.new_context(viewport=viewport, device_scale_factor=1)
        p=ctx.new_page(); p.set_default_timeout(25000); errors=[]; p.on('pageerror', lambda e: errors.append(str(e)))
        try:
            p.set_content(html, wait_until='load'); p.wait_for_timeout(700)
            visible=p.locator('body').inner_text()
            assert 'build v9.8.0' in visible.lower()
            assert 'six different futures for the same outdoor space' in visible.lower()
            initial_overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
            assert initial_overflow <= 2, initial_overflow
            p.locator('#demoBtn').click(); p.wait_for_timeout(1800)
            assert p.locator('.same-property-demo-card').count()==6
            assert p.locator('.aspirational-future-image').count()==6
            labels=p.locator('.aspirational-inspiration-label').all_inner_texts()
            assert all(x.strip().lower()=='your property reimagined' for x in labels), labels
            srcs=p.locator('.aspirational-future-image').evaluate_all("els=>els.map(e=>e.src)")
            assert len(set(srcs))==6
            today_src=p.locator('#dashboardBoardToday img').get_attribute('src')
            assert today_src and today_src != srcs[0]
            assert p.locator('.golden-demo-evolution-step').count()==5
            board_overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
            assert board_overflow <= 2, board_overflow
            p.locator('#possibilitiesBoard').screenshot(path=str(OUT/f'v980_{label}_board.png'))
            p.locator('[data-dashboard-future="gathering"]').click(); p.wait_for_timeout(500)
            p.locator('[data-view-future="gathering"]').click(); p.wait_for_timeout(500)
            assert p.locator('.golden-demo-full-view').count()>=1
            if errors: raise AssertionError(errors)
            results.append({'case':f'{label}-golden-demo-board','status':'passed','initial_overflow':initial_overflow,'board_overflow':board_overflow,'same_property_cards':6,'evolution_frames':5})
        except Exception as exc:
            results.append({'case':f'{label}-golden-demo-board','status':'failed','error':str(exc),'trace':traceback.format_exc(),'browser_errors':errors})
        finally:
            ctx.close()
    browser.close()

RESULT.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
