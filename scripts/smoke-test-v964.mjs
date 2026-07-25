import { readFileSync, existsSync } from "node:fs";
const required=[
  "index.html","styles/main.v9.6.4.css","js/app.v9.6.4.js","config.v9.6.4.js",
  "assets/demo-overgrown-garden.jpg","TESTER_SUMMARY_UNDEFINED_HOTFIX_V9_6_4.md","BUILD_STATUS.md","CHANGELOG.md"
];
const missing=required.filter(f=>!existsSync(f));
if(missing.length){console.error("Missing:",missing);process.exit(1)}
const html=readFileSync("index.html","utf8");
const js=readFileSync("js/app.v9.6.4.js","utf8");
const css=readFileSync("styles/main.v9.6.4.css","utf8");
const cfg=readFileSync("config.v9.6.4.js","utf8");
const checks=[
 [html.includes("Build v9.6.4"),"visible build"],
 [html.includes("styles/main.v9.6.4.css")&&html.includes("js/app.v9.6.4.js")&&html.includes("config.v9.6.4.js"),"versioned assets"],
 [js.includes('const BUILD_VERSION = "9.6.4"'),"stored build"],
 [cfg.includes('version: "9.6.4"')&&cfg.includes('useBackend: false')&&cfg.includes('paidCallsLocked: true')&&cfg.includes('killSwitch: true'),"safe lock"],
 [html.includes("One photo. One map. One honest inspiration."),"tester promise aligned"],
 [html.includes("One Honest Reaction")&&html.includes('data-feedback-reaction="not-believable"'),"direct feedback"],
 [!html.includes("until you choose a paid provider")&&!html.includes("Screenshot the plant overlay"),"outdated tester copy removed"],
 [js.includes('includeCalibration: false, forceFinished: true')&&js.includes('if (id === "testerPage")'),"tester editor suppressed"],
 [js.includes("Property map plus separate real-world inspiration")&&js.includes("Inspiration is clearly labelled"),"copied tester text aligned"],
 [js.includes("`${ref.label}. Inspiration only — not this property and not an exact render.`")&&!js.includes("`${ref.title}. Inspiration only — not this property and not an exact render.`"),"tester summary inspiration label fixed"],
 [css.includes("Tester Summary Undefined Hotfix")&&css.includes(".tester-page-feedback-buttons"),"tester layout polish"]
];
let failed=false;for(const [ok,label] of checks){console.log(`${ok?"Passed":"Failed"}: ${label}`);failed ||= !ok;}if(failed)process.exit(1);
