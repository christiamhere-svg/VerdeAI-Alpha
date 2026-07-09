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
  [html.includes("futureGrid"), "future grid exists"],
  [html.includes("constraintSelect"), "main problem selector exists"],
  [html.includes("quickStartStatus"), "quick tester checklist exists"],
  [html.includes("starterSuggestions"), "starter suggestions container exists"],
  [html.includes("under-building"), "under-building situation option exists"],
  [html.includes("shade-dark"), "shade/dark problem option exists"],
  [js.includes("runAnalysis"), "analysis function exists"],
  [js.includes("localStorage"), "local save support exists"],
  [js.includes("overlayHtml"), "overlay engine exists"],
  [js.includes("specificityReasons"), "specificity reasoning exists"],
  [js.includes("STARTER_PRESETS"), "starter preset logic exists"],
  [js.includes("visibleSiteLanguage"), "visible-site language exists"],
  [css.includes(".quick-start-card"), "quick start CSS exists"],
  [css.includes(".clue-coach"), "clue coach CSS exists"],
  [css.includes("@media"), "responsive CSS exists"],
  [css.includes(":focus-visible"), "accessibility focus styles exist"]
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  failed.forEach(([, label]) => console.error("Failed:", label));
  process.exit(1);
}

console.log("VerdeAI v2.4 smoke test passed.");
