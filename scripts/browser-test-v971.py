from pathlib import Path
import json, traceback, base64, mimetypes
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'evidence'; OUT.mkdir(exist_ok=True)
RESULT=OUT/'v971_browser_test_results.json'
html=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'styles/main.v9.7.1.css').read_text(encoding='utf-8')
config=(ROOT/'config.v9.7.1.js').read_text(encoding='utf-8')
app=(ROOT/'js/app.v9.7.1.js').read_text(encoding='utf-8')

def data_uri(path):
    p=ROOT/path
    mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode('ascii')

for rel in ['assets/demo-overgrown-garden.jpg']+[f'assets/inspiration/{x}.jpg' for x in ['belonging','minimal','wildlife','gathering','productive','maker']]:
    app=app.replace(rel, data_uri(rel))
html=html.replace('<link rel="stylesheet" href="styles/main.v9.7.1.css" />',f'<style>{css}</style>')
html=html.replace('<script src="config.v9.7.1.js"></script>',f'<script>{config}</script>')
html=html.replace('<script defer src="js/app.v9.7.1.js"></script>',f'<script>{app}</script>')
STORE='''(() => { const data=new Map(); const storage={get length(){return data.size},key(i){return Array.from(data.keys())[i]??null},getItem(k){k=String(k);return data.has(k)?data.get(k):null},setItem(k,v){data.set(String(k),String(v))},removeItem(k){data.delete(String(k))},clear(){data.clear()}}; Object.defineProperty(window,'localStorage',{configurable:true,value:storage});})();'''
html=html.replace('<body>','<body><script>'+STORE+'</script>',1)
results=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])

    # Android first-time entry and example path.
    ctx=browser.new_context(viewport={'width':390,'height':844}, device_scale_factor=1)
    p=ctx.new_page(); p.set_default_timeout(25000); errors=[]; p.on('pageerror', lambda e: errors.append(str(e)))
    try:
        p.set_content(html, wait_until='load'); p.wait_for_timeout(700)
        visible=p.locator('body').inner_text()
        assert 'build v9.7.1' in visible.lower()
        assert 'See ideas for your outdoor space.' in visible
        assert 'Choose a photo' in visible
        assert 'Try an example instead' in visible
        assert 'Run shaded garden self-test' not in visible
        assert 'Built for clear first tests.' not in visible
        assert 'Photo → Pattern → Futures → First Move' not in visible
        assert not p.locator('#workspaceTabs').is_visible()
        initial_overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        initial_vertical=p.evaluate('document.documentElement.scrollHeight-document.documentElement.clientHeight')
        assert initial_overflow <= 2, initial_overflow
        assert initial_vertical <= 2, initial_vertical
        p.screenshot(path=str(OUT/'v971_android_entry.png'), full_page=True)

        p.locator('#demoBtn').click(); p.wait_for_timeout(1900)
        assert p.locator('body').evaluate("el=>el.classList.contains('entry-started')")
        assert not p.locator('.hero-shell').is_visible()
        assert p.locator('#workspaceTabs').is_visible()
        assert p.locator('#possibilitiesBoard').is_visible()
        assert p.locator('#dashboardFutureCards [data-dashboard-future]').count()==6
        assert p.locator('.premium-future-property-inset').count()==0
        assert p.locator('.aspirational-future-card').count()==6
        after_overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert after_overflow <= 2, after_overflow
        p.locator('#possibilitiesBoard').screenshot(path=str(OUT/'v971_android_board.png'))
        # A returning session can continue without restoring the old cluttered landing.
        p.evaluate("document.body.classList.remove('entry-started'); renderAll()")
        p.wait_for_timeout(250)
        assert p.locator('.hero-shell').is_visible()
        assert p.locator('#continueSessionBtn').is_visible()
        p.locator('#continueSessionBtn').click(); p.wait_for_timeout(400)
        assert not p.locator('.hero-shell').is_visible()
        assert p.locator('#possibilitiesBoard').is_visible()
        # Reset returns to the simple entry screen.
        p.evaluate('resetProject()'); p.wait_for_timeout(300)
        assert p.locator('.hero-shell').is_visible()
        assert not p.locator('#continueSessionBtn').is_visible()
        if errors: raise AssertionError(errors)
        results.append({'case':'android-first-entry-example','status':'passed','initial_vertical_overflow':initial_vertical,'initial_horizontal_overflow':initial_overflow,'result_horizontal_overflow':after_overflow,'saved_continue':True,'reset_returns_entry':True})
    except Exception as exc:
        results.append({'case':'android-first-entry-example','status':'failed','error':str(exc),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        ctx.close()

    # Android upload path should go directly to clues.
    ctx=browser.new_context(viewport={'width':390,'height':844}, device_scale_factor=1)
    p=ctx.new_page(); p.set_default_timeout(25000); errors=[]; p.on('pageerror', lambda e: errors.append(str(e)))
    try:
        p.set_content(html, wait_until='load'); p.wait_for_timeout(500)
        p.locator('#photoInput').set_input_files(str(ROOT/'assets/demo-overgrown-garden.jpg'))
        p.wait_for_timeout(1600)
        assert p.locator('body').evaluate("el=>el.classList.contains('entry-started')")
        assert p.locator('#explore').is_visible()
        active=p.locator('.tab.active').first.inner_text().strip()
        assert active == 'Upload / Clues', active
        assert p.locator('#starterSuggestions').is_visible()
        overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow <= 2, overflow
        if errors: raise AssertionError(errors)
        results.append({'case':'android-photo-to-clues','status':'passed','active_tab':active,'overflow':overflow})
    except Exception as exc:
        results.append({'case':'android-photo-to-clues','status':'failed','error':str(exc),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        ctx.close()

    # Desktop visual sanity.
    ctx=browser.new_context(viewport={'width':1440,'height':900}, device_scale_factor=1)
    p=ctx.new_page(); p.set_default_timeout(20000); errors=[]; p.on('pageerror', lambda e: errors.append(str(e)))
    try:
        p.set_content(html, wait_until='load'); p.wait_for_timeout(500)
        assert p.locator('.hero-shell').is_visible()
        assert p.locator('.hero-grid').evaluate("el=>getComputedStyle(el).gridTemplateColumns.split(' ').length") >= 1
        overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert overflow <= 2, overflow
        p.screenshot(path=str(OUT/'v971_desktop_entry.png'), full_page=True)
        p.locator('#demoBtn').click(); p.wait_for_timeout(1800)
        assert p.locator('.aspirational-future-card').count()==6
        assert p.locator('.premium-future-property-inset').count()==0
        assert p.locator('.aspirational-future-image').count()==6
        board_overflow=p.evaluate('document.documentElement.scrollWidth-document.documentElement.clientWidth')
        assert board_overflow <= 2, board_overflow
        p.locator('#possibilitiesBoard').screenshot(path=str(OUT/'v971_desktop_board.png'))
        if errors: raise AssertionError(errors)
        results.append({'case':'desktop-first-entry','status':'passed','overflow':overflow,'board_overflow':board_overflow,'six_image_first_cards':True})
    except Exception as exc:
        results.append({'case':'desktop-first-entry','status':'failed','error':str(exc),'trace':traceback.format_exc(),'browser_errors':errors})
    finally:
        ctx.close(); browser.close()

RESULT.write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
if any(r.get('status')!='passed' for r in results): raise SystemExit(1)
