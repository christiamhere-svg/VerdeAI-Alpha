import { readFileSync, existsSync } from "node:fs";
const required=["index.html","styles/main.v9.6.1.css","js/app.v9.6.1.js","config.v9.6.1.js","assets/demo-overgrown-garden.jpg","assets/inspiration/wildlife.jpg","HONEST_HYBRID_BOARD_LAYOUT_REPAIR_V9_6_1.md","BUILD_STATUS.md","CHANGELOG.md","INSPIRATION_PHOTO_CREDITS.md"];
const missing=required.filter(f=>!existsSync(f)); if(missing.length){console.error("Missing:",missing);process.exit(1)}
const html=readFileSync("index.html","utf8"),js=readFileSync("js/app.v9.6.1.js","utf8"),css=readFileSync("styles/main.v9.6.1.css","utf8"),cfg=readFileSync("config.v9.6.1.js","utf8");
const checks=[
 [html.includes("Build v9.6.1"),"visible build"],
 [html.includes("styles/main.v9.6.1.css")&&html.includes("js/app.v9.6.1.js")&&html.includes("config.v9.6.1.js"),"versioned assets"],
 [js.includes('const BUILD_VERSION = "9.6.1"'),"stored build"],
 [cfg.includes('version: "9.6.1"')&&cfg.includes('useBackend: false')&&cfg.includes('paidCallsLocked: true')&&cfg.includes('killSwitch: true'),"safe lock"],
 [js.includes('hybrid-card-section hybrid-card-property')&&js.includes('hybrid-card-section hybrid-card-inspiration'),"stacked card structure"],
 [js.includes('Inspiration only — not your property and not an exact render'),"honest disclaimer"],
 [css.includes('.hybrid-card-visual{display:flex;flex-direction:column')&&css.includes('.hybrid-concept-grid{display:grid;grid-template-columns:1fr'),"stacked layout styles"],
 [css.includes('aspect-ratio:16/9')&&css.includes('aspect-ratio:4/3'),"responsive full-width images"],
 [js.includes('honestPlacementMapHtml')&&js.includes('openConceptCalibration'),"calibration preserved"]
];
let failed=false;for(const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`);failed ||= !ok;}if(failed)process.exit(1);
