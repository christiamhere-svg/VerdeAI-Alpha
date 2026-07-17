import { readFileSync, existsSync } from "node:fs";
const required = [
  "index.html", "styles/main.v9.2.2.css", "js/app.v9.2.2.js", "config.v9.2.2.js",
  "CHANGELOG.md", "BUILD_STATUS.md", "VALIDATION_RESULTS.json",
  "docs/APPROVED_PILOT_SETTINGS_V9_2_2.md", "docs/ACTIVATION_AND_ROLLBACK_V9_2_2.md",
  "docs/BROWSER_TESTING_LIMITATIONS_V9_2_2.md", "docs/OWNER_FIRST_RENDER_RUNBOOK_V9_2_2.md",
  "backend/server.js", "cloudflare-worker/src/index.js", "cloudflare-worker/wrangler.safe-lock.jsonc"
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) { console.error("Missing required files:", missing.join(", ")); process.exit(1); }
const html=readFileSync("index.html","utf8"), js=readFileSync("js/app.v9.2.2.js","utf8"), css=readFileSync("styles/main.v9.2.2.css","utf8"), config=readFileSync("config.v9.2.2.js","utf8"), worker=readFileSync("cloudflare-worker/src/index.js","utf8"), wrangler=readFileSync("cloudflare-worker/wrangler.jsonc","utf8");
const checks = [
 [html.includes("Build v9.2.2"),"visible build"],
 [html.includes("styles/main.v9.2.2.css")&&html.includes("js/app.v9.2.2.js")&&html.includes("config.v9.2.2.js"),"unique assets"],
 [js.includes('const BUILD_VERSION = "9.2.2"'),"stored build"],
 [config.includes('version: "9.2.2"')&&config.includes("pilotApproved: true")&&config.includes("frontendApiKeyPresent: false"),"approved secret-free config"],
 [html.includes("5 of 5 approvals recorded")&&html.includes("ownerRetentionControl")&&html.includes("checkPilotConnectionBtn"),"owner approval summary"],
 [js.includes("submitOneRenderPilot")&&js.includes("refreshPilotHealth")&&js.includes("pilotAccessCode"),"live one-render frontend"],
 [js.includes("No automatic retry")&&js.includes("free calibrated overlay"),"failure fallbacks"],
 [!html.toLowerCase().includes("render all six")&&!js.includes("renderAllFuturesBtn"),"no render-all-six"],
 [worker.includes("PILOT_INVITE_CODE_HASHES")&&worker.includes("class PilotGuard")&&worker.includes("/v1/images/edits"),"secure Worker path"],
 [wrangler.includes('"PILOT_SPEND_CAP_USD": "5"')&&wrangler.includes('"INVITED_TESTER_LIMIT": "10"'),"approved server caps"],
 [worker.includes("env.OPENAI_API_KEY")&&!html.includes("OPENAI_API_KEY"),"server secret only"],
 [html.includes("photoInput")&&js.includes("runShadedGardenSelfTest")&&js.includes("openConceptCalibration"),"core preserved"],
 [js.includes("renderFeedbackReview")&&js.includes("importFeedbackCsvFile"),"feedback preserved"],
 [css.includes(".v922-live-result")&&css.includes(".v922-provider-image")&&css.includes("@media(max-width:700px)"),"responsive result styles"],
 [css.includes(":focus-visible")&&html.includes("aria-live"),"accessibility preserved"]
];
let failed=false; for (const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`); if(!ok)failed=true;} if(failed)process.exit(1);
