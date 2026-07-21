import { readFileSync, existsSync } from "node:fs";
const required = [
  "index.html", "styles/main.v9.3.1.css", "js/app.v9.3.1.js", "config.v9.3.1.js",
  "CHANGELOG.md", "BUILD_STATUS.md", "VALIDATION_RESULTS.json",
  "docs/PLANT_OVERLAY_IMPLEMENTATION_V9_3_1.md", "docs/ANDROID_PLANT_OVERLAY_CHECKLIST_V9_3_1.md",
  "docs/BROWSER_TESTING_LIMITATIONS_V9_3_1.md", "docs/DEPLOYMENT_STEPS_V9_3_1.md", "NEXT_PROMPT.md"
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) { console.error("Missing required files:", missing.join(", ")); process.exit(1); }
const html=readFileSync("index.html","utf8"), js=readFileSync("js/app.v9.3.1.js","utf8"), css=readFileSync("styles/main.v9.3.1.css","utf8"), config=readFileSync("config.v9.3.1.js","utf8");
const checks = [
 [html.includes("Build v9.3.1"),"visible build"],
 [html.includes("styles/main.v9.3.1.css")&&html.includes("js/app.v9.3.1.js")&&html.includes("config.v9.3.1.js"),"unique assets"],
 [js.includes('const BUILD_VERSION = "9.3.1"'),"stored build"],
 [config.includes('version: "9.3.1"')&&config.includes("providerCallsEnabled: false")&&config.includes("paidCallsLocked: true")&&config.includes("killSwitch: true"),"real rendering safe lock"],
 [html.includes('id="futureSelectionPanel"')&&html.includes("Other possible futures")&&html.includes('id="dashboardFutureCards"'),"visible future-selection panel"],
 [js.includes("ensureFutureSelectionPanel")&&js.includes("Wildlife Haven")&&js.includes("Low-Maintenance Haven")&&js.includes("Food Garden")&&js.includes("Feature Garden"),"future-selection recovery and labels"],
 [js.includes("botanicalDefsSvg")&&js.includes("botanicalPlantingSvg")&&js.includes("plant-depth-layer"),"botanical overlay engine"],
 [js.includes("calibrationDefsSvg")&&js.includes("calibration-mask-route")&&js.includes("keepClear"),"calibration masks preserved"],
 [js.includes('future.id === "gathering"')&&js.includes('future.id === "wildlife"')&&js.includes('future.id === "minimal"')&&js.includes('future.id === "productive"'),"distinct future recipes"],
 [html.includes("Real AI rendering is disabled")&&html.includes("safety lock"),"visible AI lock"],
 [css.includes(".plant-rear-layer")&&css.includes(".plant-mid-layer")&&css.includes(".plant-front-layer")&&css.includes(".concept-depth-wash{display:none"),"depth and clear-photo styles"],
 [css.includes("@media(max-width:720px)")&&css.includes(":focus-visible"),"mobile and accessibility styles preserved"],
 [html.includes("dashboardConceptStageHost")&&js.includes("openConceptCalibration")&&js.includes("restoreCurrentSession"),"core visual workflow preserved"]
];
let failed=false; for (const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`); if(!ok)failed=true;} if(failed)process.exit(1);
