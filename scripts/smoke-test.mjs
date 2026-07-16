import { readFileSync, existsSync } from "node:fs";

const required = [
  "index.html", "styles/main.v9.2.css", "js/app.v9.2.js", "config.v9.2.js",
  "CHANGELOG.md", "BUILD_STATUS.md", "VALIDATION_RESULTS.json",
  "docs/OWNER_DECISION_BRIEF_V9_2.md", "docs/SECURITY_PRIVACY_CHECKLIST_V9_2.md",
  "docs/SECURE_PILOT_ARCHITECTURE_V9_2.md", "docs/OFFICIAL_PRICING_SOURCES_V9_2.md",
  "backend/server.js", "backend/render/renderService.js", "backend/render/adapters/openaiImage.js",
  "cloudflare-worker/src/index.js", "cloudflare-worker/wrangler.jsonc"
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) { console.error("Missing required files:", missing.join(", ")); process.exit(1); }

const html = readFileSync("index.html", "utf8");
const js = readFileSync("js/app.v9.2.js", "utf8");
const css = readFileSync("styles/main.v9.2.css", "utf8");
const backend = readFileSync("backend/render/renderService.js", "utf8");
const worker = readFileSync("cloudflare-worker/src/index.js", "utf8");
const config = readFileSync("config.v9.2.js", "utf8");

const checks = [
  [html.includes("Build v9.2"), "visible v9.2 label"],
  [html.includes("styles/main.v9.2.css") && html.includes("js/app.v9.2.js") && html.includes("config.v9.2.js"), "cache-busted v9.2 assets"],
  [js.includes('const BUILD_VERSION = "9.2"'), "stored build version"],
  [config.includes('version: "9.2"') && config.includes("useBackend: false"), "frontend backend disabled"],
  [html.includes("Create one AI concept render"), "optional one-render action"],
  [html.includes("aiRenderConfirmDialog") && html.includes("confirmRenderPrivacy") && html.includes("confirmRenderImageUse") && html.includes("confirmRenderCost") && html.includes("confirmRenderConcept"), "required confirmation dialog"],
  [!html.toLowerCase().includes("render all six") && !js.includes("renderAllFuturesBtn") && !js.includes("mockRenderFutures(FUTURES)"), "no render-all-six path"],
  [js.includes("prepareImageForRender") && js.includes("PILOT_MAX_LONG_EDGE = 1536") && js.includes("PILOT_MAX_IMAGE_BYTES"), "browser image preparation"],
  [js.includes("buildCalibrationAwareRenderRequest") && js.includes("usableGround") && js.includes("keepClear") && js.includes("protectedAccessRoute") && js.includes("marker5"), "calibration-aware payload"],
  [js.includes("Preserve all buildings, rooflines, doors, windows") && js.includes("Do not make structural modifications") && js.includes("inspiration only"), "prompt preservation limits"],
  [js.includes("state-timeout") || css.includes("state-timeout"), "timeout UX"],
  [js.includes("provider-error") && js.includes("budget-lock") && js.includes("calibrated overlay"), "failure and fallback UX"],
  [backend.includes("VERDEAI_RENDER_KILL_SWITCH") && backend.includes("VERDEAI_RENDER_TEST_MODE") && backend.includes("VERDEAI_PILOT_SPEND_CAP_USD"), "backend safety flags"],
  [backend.includes("count !== 1") && backend.includes("one-image-only"), "backend one-image enforcement"],
  [backend.includes("confirmPrivacy") && backend.includes("confirmImageUse") && backend.includes("confirmConceptOnly") && backend.includes("confirmCost"), "backend consent validation"],
  [backend.includes("metadataStripped") && backend.includes("image-validation-failed"), "backend image validation"],
  [worker.includes("class PilotGuard") && worker.includes("totalReserved") && worker.includes("INVITED_TESTER_LIMIT"), "Durable Object spend/tester guard"],
  [worker.includes("OPENAI_API_KEY") && worker.includes("env.OPENAI_API_KEY") && !html.includes("OPENAI_API_KEY"), "server-only provider secret"],
  [worker.includes("render-started") && !worker.includes("console.log(body.prompt") && !worker.includes("console.log(body.imageDataUrl"), "non-sensitive app logging"],
  [html.includes("photoInput") && js.includes("runShadedGardenSelfTest") && js.includes("openConceptCalibration"), "core upload/self-test/calibration preserved"],
  [html.includes("dashboardFutureCards") && js.includes("recommendedFutureId") && js.includes("selectedFutureId"), "six futures and recommendation independence preserved"],
  [js.includes("concept-map-marker marker-first") || js.includes("marker-first"), "marker 5 preserved"],
  [js.includes("restoreCurrentSession") && js.includes("persistCurrentSessionNow") && js.includes("saveProject"), "save and recovery preserved"],
  [js.includes("renderFeedbackReview") && js.includes("importFeedbackCsvFile") && html.includes("feedbackEvidenceFilter"), "feedback evidence system preserved"],
  [css.includes(".v92-render-dialog") && css.includes("@media(max-width:560px)"), "responsive v9.2 styles"],
  [css.includes(":focus-visible") && html.includes("aria-live"), "accessibility preserved"]
];
let failed = false;
for (const [ok, label] of checks) { console.log(`${ok ? "Passed" : "Failed"}: ${label}`); if (!ok) failed = true; }
if (failed) process.exit(1);
