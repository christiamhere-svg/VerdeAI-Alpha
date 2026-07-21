import { readFileSync, existsSync } from "node:fs";

const required = [
  "index.html", "styles/main.v9.3.2.css", "js/app.v9.3.2.js", "config.v9.3.2.js",
  "CHANGELOG.md", "BUILD_STATUS.md", "VALIDATION_RESULTS.json",
  "docs/BOTANICAL_ASSET_IMPLEMENTATION_V9_3_2.md", "docs/ANDROID_REALISM_CHECKLIST_V9_3_2.md",
  "docs/BROWSER_TESTING_LIMITATIONS_V9_3_2.md", "docs/DEPLOYMENT_STEPS_V9_3_2.md", "NEXT_PROMPT.md"
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("Missing required files:", missing.join(", "));
  process.exit(1);
}

const html = readFileSync("index.html", "utf8");
const js = readFileSync("js/app.v9.3.2.js", "utf8");
const css = readFileSync("styles/main.v9.3.2.css", "utf8");
const config = readFileSync("config.v9.3.2.js", "utf8");

const checks = [
  [html.includes("Build v9.3.2"), "visible build"],
  [html.includes("styles/main.v9.3.2.css") && html.includes("js/app.v9.3.2.js") && html.includes("config.v9.3.2.js"), "versioned assets"],
  [js.includes('const BUILD_VERSION = "9.3.2"'), "stored build"],
  [config.includes('version: "9.3.2"') && config.includes("providerCallsEnabled: false") && config.includes("paidCallsLocked: true") && config.includes("killSwitch: true"), "real rendering safe lock"],
  [html.includes('id="futureSelectionPanel"') && html.includes("Other possible futures") && html.includes('id="dashboardFutureCards"'), "six-future panel"],
  [js.includes("botanicalPlantGeometry") && js.includes("botanicalRandom") && js.includes("data-plant-variant"), "procedural botanical library"],
  [js.includes("plant-contact-shadow") && js.includes("perspective"), "grounding and perspective"],
  [js.includes("futureCompositionText") && !js.includes("${profile.pattern}: ${constraintLabel"), "future-specific text sync"],
  [js.includes("calibrationDefsSvg") && js.includes("calibration-mask-route") && js.includes("keepClear"), "calibration masks preserved"],
  [css.includes(".plant-leaf-dark") && css.includes(".plant-leaf-vein") && css.includes(".plant-rear-layer") && css.includes(".plant-front-layer"), "botanical detail and depth"],
  [css.includes(".concept-depth-wash{display:none") && css.includes("filter:none!important;opacity:1!important"), "photo remains clear"],
  [html.includes("Real AI rendering is disabled") && html.includes("safety lock"), "visible AI lock"],
  [html.includes("dashboardConceptStageHost") && js.includes("openConceptCalibration") && js.includes("restoreCurrentSession"), "core workflow preserved"]
];

let failed = false;
for (const [ok, label] of checks) {
  console.log(`${ok ? "Passed" : "Failed"}: ${label}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
