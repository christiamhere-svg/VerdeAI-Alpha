import { readFileSync, existsSync } from "node:fs";
const required = [
  "index.html", "styles/main.v9.3.css", "js/app.v9.3.js", "config.v9.3.js",
  "CHANGELOG.md", "BUILD_STATUS.md", "VALIDATION_RESULTS.json",
  "docs/PLANT_OVERLAY_IMPLEMENTATION_V9_3.md", "docs/ANDROID_PLANT_OVERLAY_CHECKLIST_V9_3.md",
  "docs/BROWSER_TESTING_LIMITATIONS_V9_3.md", "NEXT_PROMPT.md"
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) { console.error("Missing required files:", missing.join(", ")); process.exit(1); }
const html=readFileSync("index.html","utf8"), js=readFileSync("js/app.v9.3.js","utf8"), css=readFileSync("styles/main.v9.3.css","utf8"), config=readFileSync("config.v9.3.js","utf8");
const checks = [
 [html.includes("Build v9.3"),"visible build"],
 [html.includes("styles/main.v9.3.css")&&html.includes("js/app.v9.3.js")&&html.includes("config.v9.3.js"),"unique assets"],
 [js.includes('const BUILD_VERSION = "9.3"'),"stored build"],
 [config.includes('version: "9.3"')&&config.includes("providerCallsEnabled: false")&&config.includes("paidCallsLocked: true")&&config.includes("killSwitch: true"),"real rendering safe lock"],
 [js.includes("botanicalDefsSvg")&&js.includes("botanicalPlantingSvg")&&js.includes("plant-depth-layer"),"botanical overlay engine"],
 [js.includes("calibrationDefsSvg")&&js.includes("calibration-mask-route")&&js.includes("keepClear"),"calibration masks preserved"],
 [js.includes('future.id === "gathering"')&&js.includes('future.id === "wildlife"')&&js.includes('future.id === "minimal"')&&js.includes('future.id === "productive"'),"distinct future recipes"],
 [html.includes("Real AI rendering is disabled")&&html.includes("Plant Overlay Gate safety lock"),"visible AI lock"],
 [css.includes(".plant-rear-layer")&&css.includes(".plant-mid-layer")&&css.includes(".plant-front-layer"),"depth styles"],
 [css.includes("@media(max-width:760px)")&&css.includes(":focus-visible"),"mobile and accessibility styles preserved"],
 [html.includes("dashboardConceptStageHost")&&js.includes("openConceptCalibration")&&js.includes("restoreCurrentSession"),"core visual workflow preserved"]
];
let failed=false; for (const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`); if(!ok)failed=true;} if(failed)process.exit(1);
