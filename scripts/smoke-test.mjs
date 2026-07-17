import { readFileSync, existsSync } from "node:fs";
const required = [
  "index.html", "styles/main.v9.2.1.css", "js/app.v9.2.1.js", "config.v9.2.1.js",
  "CHANGELOG.md", "BUILD_STATUS.md", "VALIDATION_RESULTS.json",
  "docs/OWNER_ACTIVATION_CHECKLIST_V9_2_1.md", "docs/OWNER_APPROVAL_REQUIREMENTS_V9_2_1.md",
  "docs/BROWSER_TESTING_LIMITATIONS_V9_2_1.md", "docs/PHYSICAL_PHONE_EVIDENCE_V9_2.md",
  "backend/server.js", "backend/render/renderService.js", "cloudflare-worker/src/index.js"
];
const missing = required.filter((file) => !existsSync(file));
if (missing.length) { console.error("Missing required files:", missing.join(", ")); process.exit(1); }
const html=readFileSync("index.html","utf8"), js=readFileSync("js/app.v9.2.1.js","utf8"), css=readFileSync("styles/main.v9.2.1.css","utf8"), config=readFileSync("config.v9.2.1.js","utf8"), backend=readFileSync("backend/render/renderService.js","utf8"), worker=readFileSync("cloudflare-worker/src/index.js","utf8");
const checks = [
 [html.includes("Build v9.2.1"),"visible build"],
 [html.includes("styles/main.v9.2.1.css")&&html.includes("js/app.v9.2.1.js")&&html.includes("config.v9.2.1.js"),"unique assets"],
 [js.includes('const BUILD_VERSION = "9.2.1"'),"stored build"],
 [config.includes('version: "9.2.1"')&&config.includes("useBackend: false")&&config.includes("killSwitch: true"),"locked config"],
 [html.includes("0 of 5 approvals recorded")&&html.includes("activateOwnerPilotBtn")&&html.includes("ownerRetentionControl"),"owner approval panel"],
 [js.includes("copyOwnerApprovalRequest")&&js.includes("resetOwnerSafeState"),"owner review actions"],
 [js.includes("No automatic retry")&&js.includes("No charge started")&&js.includes("Back to rehearsal"),"refined failure states"],
 [!html.toLowerCase().includes("render all six")&&!js.includes("renderAllFuturesBtn"),"no render-all-six"],
 [backend.includes("VERDEAI_RENDER_KILL_SWITCH")&&backend.includes("VERDEAI_RENDER_TEST_MODE"),"backend locks"],
 [worker.includes("OPENAI_API_KEY")&&!html.includes("OPENAI_API_KEY"),"server secret only"],
 [html.includes("photoInput")&&js.includes("runShadedGardenSelfTest")&&js.includes("openConceptCalibration"),"core preserved"],
 [js.includes("renderFeedbackReview")&&js.includes("importFeedbackCsvFile"),"feedback preserved"],
 [css.includes(".v921-owner-activation")&&css.includes(".v921-state-facts")&&css.includes("@media(max-width:700px)"),"responsive v921 styles"],
 [css.includes(":focus-visible")&&html.includes("aria-live"),"accessibility preserved"]
];
let failed=false; for (const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`); if(!ok)failed=true;} if(failed)process.exit(1);
