import { readFileSync, existsSync, statSync } from "node:fs";
const required=[
  "index.html","styles/main.v9.6.2.css","js/app.v9.6.2.js","config.v9.6.2.js",
  "assets/demo-overgrown-garden.jpg","assets/inspiration/wildlife.jpg",
  "HYBRID_MAP_CLARITY_INSPIRATION_MATCH_V9_6_2.md","BUILD_STATUS.md","CHANGELOG.md","INSPIRATION_PHOTO_CREDITS.md"
];
const missing=required.filter(f=>!existsSync(f));
if(missing.length){console.error("Missing:",missing);process.exit(1)}
const html=readFileSync("index.html","utf8");
const js=readFileSync("js/app.v9.6.2.js","utf8");
const css=readFileSync("styles/main.v9.6.2.css","utf8");
const cfg=readFileSync("config.v9.6.2.js","utf8");
const credits=readFileSync("INSPIRATION_PHOTO_CREDITS.md","utf8");
const checks=[
 [html.includes("Build v9.6.2"),"visible build"],
 [html.includes("styles/main.v9.6.2.css")&&html.includes("js/app.v9.6.2.js")&&html.includes("config.v9.6.2.js"),"versioned assets"],
 [js.includes('const BUILD_VERSION = "9.6.2"'),"stored build"],
 [cfg.includes('version: "9.6.2"')&&cfg.includes('useBackend: false')&&cfg.includes('paidCallsLocked: true')&&cfg.includes('killSwitch: true'),"safe lock"],
 [js.includes('dense native flowering layers')&&js.includes('Courtney Celley / USFWS'),"matched wildlife reference metadata"],
 [css.includes('position:relative!important')&&css.includes('.hybrid-property-mini{\n  aspect-ratio:16/9'),"visible card property photo repair"],
 [css.includes('.honest-zone-fill{opacity:.075}')&&css.includes('.honest-zone-outline{stroke-width:5'),"quiet finished map"],
 [js.includes("${compact ? '' : `<path")&&js.includes("${compact ? '' : `<g class=\"honest-first-marker\""),"compact map simplification"],
 [credits.includes('Horicon NWR native pollinator garden')&&credits.includes('public domain'),"wildlife credit"],
 [statSync("assets/inspiration/wildlife.jpg").size>200000,"wildlife asset present"]
];
let failed=false;for(const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`);failed ||= !ok;}if(failed)process.exit(1);
