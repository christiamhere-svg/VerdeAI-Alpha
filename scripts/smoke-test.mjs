import { readFileSync, existsSync } from "node:fs";

const required = [
  "index.html",
  "styles/main.css",
  "js/app.js",
  "config.js",
  "CHANGELOG.md",
  "BUILD_STATUS.md",
  "backend/server.js",
  "api/openapi-alpha.json"
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("Missing required files:", missing.join(", "));
  process.exit(1);
}

const html = readFileSync("index.html", "utf8");
const js = readFileSync("js/app.js", "utf8");
const css = readFileSync("styles/main.css", "utf8");

const checks = [
  [html.includes("photoInput"), "photo input exists"],
  [html.includes("testerPage"), "public tester page exists"],
  [html.includes("testerPageVisual"), "tester visual stage exists"],
  [html.includes("futureGrid"), "future grid exists"],
  [html.includes("constraintSelect"), "main problem selector exists"],
  [html.includes("quickStartStatus"), "quick tester checklist exists"],
  [html.includes("starterSuggestions"), "starter suggestions container exists"],
  [html.includes("under-building"), "under-building situation option exists"],
  [html.includes("shade-dark"), "shade/dark problem option exists"],
  [js.includes("runAnalysis"), "analysis function exists"],
  [js.includes("localStorage"), "local save support exists"],
  [js.includes("overlayHtml"), "overlay engine exists"],
  [js.includes("plantPictureOverlayHtml"), "plant picture overlay engine exists"],
  [js.includes("renderTesterPage"), "tester page render logic exists"],
  [js.includes("specificityReasons"), "specificity reasoning exists"],
  [js.includes("STARTER_PRESETS"), "starter preset logic exists"],
  [js.includes("visibleSiteLanguage"), "visible-site language exists"],
  [js.includes("captureAnalysisSnapshot"), "analysis snapshot capture exists"],
  [js.includes("restoreAnalysisSnapshot"), "analysis snapshot restore exists"],
  [js.includes("cleanPropertyNote"), "property note cleanup exists"],
  [js.includes("compressImageFile"), "client-side image compression exists"],
  [js.includes("copyShareCode"), "share code export exists"],
  [js.includes("importShareCode"), "share code import exists"],
  [js.includes("testerInviteText"), "tester invite copy exists"],
  [js.includes("readinessScore"), "beta readiness scoring exists"],
  [html.includes("publicBetaChecklist"), "public beta checklist exists"],
  [html.includes("copyTesterInviteBtn"), "tester invite button exists"],
  [html.includes("handoffStatus"), "handoff status exists"],
  [html.includes("smartNextCard"), "smart next card exists"],
  [js.includes("smartNextPlan"), "smart next plan logic exists"],
  [js.includes("handleSmartNextAction"), "smart next button logic exists"],
  [js.includes("restoreCurrentSession"), "autosave session restore exists"],
  [js.includes("persistCurrentSessionNow"), "autosave session persist exists"],
  [html.includes("sessionRecovery"), "session recovery card exists"],
  [html.includes("Run shaded garden self-test"), "self-test button exists"],
  [js.includes("runShadedGardenSelfTest"), "self-test runner exists"],
  [js.includes("saveSelfTestProject"), "self-test saved project exists"],
  [js.includes("shadedSelfTestImage"), "self-test image exists"],
  [css.includes(".self-test-card"), "self-test card CSS exists"],
  [css.includes(".tester-page-shell"), "tester page CSS exists"],
  [css.includes(".plant-picture-layer"), "plant overlay CSS exists"],
  [css.includes(".session-recovery-card"), "session recovery CSS exists"],
  [css.includes(".smart-next-card"), "smart next card CSS exists"],
  [html.includes("Copy Share Code"), "share code button exists"],
  [html.includes("analysis stays locked"), "design tab stability copy exists"],
  [css.includes(".stability-note"), "stability note CSS exists"],
  [css.includes(".beta-test-card"), "public beta handoff CSS exists"],
  [css.includes(".readiness-meter"), "beta readiness meter CSS exists"],
  [css.includes(".quick-start-card"), "quick start CSS exists"],
  [css.includes(".clue-coach"), "clue coach CSS exists"],
  [css.includes("@media"), "responsive CSS exists"],
  [css.includes(":focus-visible"), "accessibility focus styles exist"],

  [html.includes("Property Futures Dashboard"), "property futures dashboard exists"],
  [html.includes("dashboardFutureCards"), "dashboard future cards container exists"],
  [html.includes("dashboardCompass"), "dashboard compass exists"],
  [html.includes("dashboardEvolution"), "dashboard evolution strip exists"],
  [html.includes("dashboardCopyBtn"), "dashboard copy button exists"],
  [js.includes("dashboardFutureCardHtml"), "dashboard future card renderer exists"],
  [js.includes("dashboardFutureTag"), "future-specific dashboard tags exist"],
  [js.includes("futureSceneIntent"), "future design intent renderer exists"],
  [js.includes("propertyMovieSteps"), "property movie steps exist"],
  [js.includes("cleanTesterResultText"), "clean dashboard result copy exists"],
  [css.includes(".dashboard-futures-grid"), "dashboard futures CSS exists"],
  [css.includes(".compass-ring"), "property compass score rings CSS exists"],
  [html.includes("AI Render Setup"), "AI render setup screen exists"],
  [html.includes("renderProviderSelect"), "render provider selector exists"],
  [html.includes("Render Prompt Builder"), "render prompt builder exists"],
  [html.includes("renderSelectedFutureBtn"), "render selected future button exists"],
  [js.includes("buildRenderPrompts"), "render prompt builder logic exists"],
  [js.includes("RENDER_PROVIDER_COSTS"), "render provider cost estimates exist"],
  [js.includes("mockRenderFutures"), "mock render flow exists"],
  [css.includes(".render-prompt-card"), "render prompt card CSS exists"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  failed.forEach(([, label]) => console.error("Failed:", label));
  process.exit(1);
}

console.log("VerdeAI v3.7 smoke test passed.");
