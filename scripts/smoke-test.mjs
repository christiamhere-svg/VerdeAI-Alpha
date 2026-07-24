import { readFileSync, existsSync } from "node:fs";

const required = [
  "index.html", "styles/main.v9.4.css", "js/app.v9.4.js", "config.v9.4.js",
  "CHANGELOG.md", "BUILD_STATUS.md", "VALIDATION_RESULTS.json",
  "docs/PROPERTY_POSSIBILITIES_BOARD_V9_4.md", "docs/ANDROID_BOARD_CHECKLIST_V9_4.md",
  "docs/INVITED_TESTER_ROUND_V9_4.md", "docs/BROWSER_TESTING_LIMITATIONS_V9_4.md",
  "docs/DEPLOYMENT_STEPS_V9_4.md", "NEXT_PROMPT.md"
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("Missing required files:", missing.join(", "));
  process.exit(1);
}

const html = readFileSync("index.html", "utf8");
const js = readFileSync("js/app.v9.4.js", "utf8");
const css = readFileSync("styles/main.v9.4.css", "utf8");
const config = readFileSync("config.v9.4.js", "utf8");

const checks = [
  [html.includes("Build v9.4"), "visible build"],
  [html.includes("styles/main.v9.4.css") && html.includes("js/app.v9.4.js") && html.includes("config.v9.4.js"), "versioned assets"],
  [js.includes('const BUILD_VERSION = "9.4"'), "stored build"],
  [config.includes('version: "9.4"') && config.includes("providerCallsEnabled: false") && config.includes("paidCallsLocked: true") && config.includes("killSwitch: true"), "real rendering safe lock"],
  [html.includes('id="possibilitiesBoard"') && html.includes("What Could Your Property Become?"), "possibilities board"],
  [html.includes('id="dashboardBoardToday"') && html.includes('id="dashboardFutureCards"') && html.includes('id="dashboardRecommendation"'), "board story anchors"],
  [html.includes('id="dashboardCompass"') && html.includes('id="dashboardNextStep"') && html.includes('id="dashboardEvolution"'), "board decision supports"],
  [js.includes("botanicalPlantGeometry") && js.includes("botanicalRandom") && js.includes("data-plant-variant"), "verified botanical library preserved"],
  [js.includes("calibrationDefsSvg") && js.includes("calibration-mask-route") && js.includes("keepClear"), "calibration masks preserved"],
  [css.includes(".possibilities-board") && css.includes(".possibilities-futures-grid") && css.includes(".board-compass-row"), "responsive board styles"],
  [css.includes("filter:none!important;opacity:1!important"), "photo remains clear"],
  [html.includes("Real AI rendering disabled") && html.includes("paid calls remain locked"), "visible safety boundary"],
  [html.includes("dashboardConceptStageHost") && js.includes("openConceptCalibration") && js.includes("restoreCurrentSession"), "core workflow preserved"]
];

let failed = false;
for (const [ok, label] of checks) {
  console.log(`${ok ? "Passed" : "Failed"}: ${label}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
