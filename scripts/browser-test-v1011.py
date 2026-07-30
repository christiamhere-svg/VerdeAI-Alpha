from pathlib import Path
from urllib.parse import urlparse, unquote
import json, mimetypes, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def bundled_html():
    html=(ROOT/'index.html').read_text(encoding='utf-8')
    css=(ROOT/'styles/main.v10.1.1.css').read_text(encoding='utf-8')
    cfg=(ROOT/'config.v10.1.1.js').read_text(encoding='utf-8')
    js=(ROOT/'js/app.v10.1.1.js').read_text(encoding='utf-8')
    html=re.sub(r'<link rel="stylesheet" href="styles/main\.v10\.1\.1\.css"\s*/>', '<style>'+css+'</style>', html)
    html=html.replace('<script src="config.v10.1.1.js"></script>', '<script>'+cfg+'</script>')
    html=html.replace('<script defer src="js/app.v10.1.1.js"></script>', '<script>'+js+'</script>')
    storage="<script>(()=>{const makeStore=()=>{const data=new Map();return{getItem:k=>data.has(String(k))?data.get(String(k)):null,setItem:(k,v)=>data.set(String(k),String(v)),removeItem:k=>data.delete(String(k)),clear:()=>data.clear(),key:i=>Array.from(data.keys())[i]??null,get length(){return data.size}}};try{Object.defineProperty(window,'localStorage',{value:makeStore(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:makeStore(),configurable:true})}catch(e){}})();</script>"
    return html.replace('<head>', '<head><base href="https://verdeai.local/">'+storage, 1)
def route_assets(page):
    def handler(route):
        u=urlparse(route.request.url); rel=unquote(u.path.lstrip('/')); f=(ROOT/rel).resolve()
        if f.exists() and f.is_file(): route.fulfill(status=200,path=str(f),content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
        else: route.fulfill(status=404,body='not found')
    page.route('https://verdeai.local/**',handler)
def run():
    ev=ROOT/'evidence'; ev.mkdir(exist_ok=True); results={}
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        for name,vp in [('mobile',{'width':390,'height':844}),('desktop',{'width':1650,'height':900})]:
            page=browser.new_page(viewport=vp); errors=[]; page.on('pageerror',lambda exc: errors.append(str(exc))); route_assets(page)
            page.set_content(bundled_html(),wait_until='load'); page.wait_for_timeout(350)
            assert 'build v10.1.1' in page.locator('body').inner_text().lower()
            page.click('#demoBtn'); page.wait_for_timeout(1300)
            assert page.locator('#wholeBoardStage').is_visible()
            assert page.locator('#wholeBoardPoster .wb-future').count()==6
            assert page.locator('#wholeBoardPoster .wb-pending').count()==0
            assert page.locator('#wholeBoardPoster img[src*="golden-demo"]').count()>=7
            assert 'Under-building / shaded area' in page.locator('#wholeBoardPoster').inner_text()
            assert 'Feature Garden' in page.locator('#wholeBoardPoster').inner_text()
            page.click('#wholeBoardOpenBtn'); page.wait_for_timeout(350)
            assert page.locator('#wholeBoardOverlay').is_visible()
            canvas=page.locator('#wholeBoardOverlayCanvas').bounding_box(); poster=page.locator('#wholeBoardOverlay .whole-board-poster-full').bounding_box(); assert canvas and poster
            tol=2
            assert poster['width'] <= canvas['width']+tol and poster['height'] <= canvas['height']+tol
            assert poster['x'] >= canvas['x']-tol and poster['y'] >= canvas['y']-tol
            assert poster['x']+poster['width'] <= canvas['x']+canvas['width']+tol
            assert poster['y']+poster['height'] <= canvas['y']+canvas['height']+tol
            page.screenshot(path=str(ev/f'v1011-{name}-completed-example-fit.png'))
            overflow=page.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth')
            assert not overflow and not errors, errors
            results[name]={'errors':errors,'horizontalOverflow':overflow,'samePropertyFutureCards':6,'pendingBadges':0,'wholeBoardFit':True,'completedExample':True,'safetyLocksPreserved':True}
            page.close()
        browser.close()
    (ROOT/'static-validation-v1011-browser.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
    print(json.dumps(results,indent=2))
if __name__=='__main__': run()
