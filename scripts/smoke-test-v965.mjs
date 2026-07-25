import { readFileSync, existsSync } from "node:fs";
const required=[
  "index.html","styles/main.v9.6.5.css","js/app.v9.6.5.js","config.v9.6.5.js",
  "assets/demo-overgrown-garden.jpg","ONE_SCREEN_FIRST_TIME_ENTRY_V9_6_5.md","BUILD_STATUS.md","CHANGELOG.md"
];
const missing=required.filter(f=>!existsSync(f));
if(missing.length){console.error("Missing:",missing);process.exit(1)}
const html=readFileSync("index.html","utf8");
const js=readFileSync("js/app.v9.6.5.js","utf8");
const css=readFileSync("styles/main.v9.6.5.css","utf8");
const cfg=readFileSync("config.v9.6.5.js","utf8");
const checks=[
 [html.includes("Build v9.6.5"),"visible build"],
 [html.includes("styles/main.v9.6.5.css")&&html.includes("js/app.v9.6.5.js")&&html.includes("config.v9.6.5.js"),"versioned assets"],
 [js.includes('const BUILD_VERSION = "9.6.5"'),"stored build"],
 [cfg.includes('version: "9.6.5"')&&cfg.includes('useBackend: false')&&cfg.includes('paidCallsLocked: true')&&cfg.includes('killSwitch: true'),"safe lock"],
 [html.includes("See ideas for your outdoor space.")&&html.includes("Choose a photo")&&html.includes("Try an example instead"),"plain-language entry"],
 [!html.includes("Photo → Pattern → Futures → First Move")&&!html.includes("Built for clear first tests."),"opening jargon removed"],
 [!html.includes('id="demoBtn" class="ghost"')&&!html.includes('data-self-test="shaded">Run shaded garden self-test</button>\n          </div>'),"initial competing action removed"],
 [html.includes('id="continueSessionBtn"')&&js.includes('showGeneratedBoard("continued")'),"saved-result continuation"],
 [js.includes('document.body.classList.add("entry-started")')&&js.includes('activateTab("explore", { scroll: true })'),"photo transition"],
 [css.includes("One-Screen First-Time Entry")&&css.includes("body:not(.entry-started) #workspaceTabs")&&css.includes("body.entry-started .hero-shell"),"one-screen entry layout"]
];
let failed=false;for(const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`);failed ||= !ok;}if(failed)process.exit(1);
