import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repo = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(repo, "index.html");
const policyPath = path.join(repo, "backend", "v10_4_0_secure_same_property", "src", "policy.mjs");
const html = fs.readFileSync(indexPath, "utf8");
const policy = fs.readFileSync(policyPath, "utf8");
const uiStart = html.indexOf("VERDEAI_V10_4_1_MOCK_UI_START");
const uiEnd = html.indexOf("VERDEAI_V10_4_1_MOCK_UI_END");
const scriptStart = html.indexOf("VERDEAI_V10_4_1_MOCK_SCRIPT_START");
const scriptEnd = html.indexOf("VERDEAI_V10_4_1_MOCK_SCRIPT_END");
const uiBlock = uiStart >= 0 && uiEnd > uiStart ? html.slice(uiStart, uiEnd) : "";
const scriptBlock = scriptStart >= 0 && scriptEnd > scriptStart ? html.slice(scriptStart, scriptEnd) : "";
const block = `${uiBlock}\n${scriptBlock}`;
let failures = 0;
let passes = 0;
function check(name, condition){
  if(condition){ passes += 1; console.log(`PASS ${passes}: ${name}`); }
  else { failures += 1; console.error(`FAIL: ${name}`); }
}
function count(text, needle){ return text.split(needle).length - 1; }

check("index declares build v10.4.1", /Build v10\.4\.1/i.test(html));
check("own-photo result image anchor remains", html.includes('id="ownPhotoResultImage"'));
check("recommendation title anchor remains", html.includes('id="ownPhotoRecommendationTitle"'));
check("exactly one optional mock entry action exists", count(html, 'id="v1041OpenMock"') === 1);
check("mock proof keeps the uploaded photo visible", html.includes('id="v1041MockPhoto"'));
check("one-image contract is explicit", block.includes('imageCount: 1'));
check("four consent controls exist", ["v1041ConsentOwn","v1041ConsentProcess","v1041ConsentConcept","v1041ConsentStorage"].every((id) => block.includes(id)));
check("SAFE_LOCKED state exists", block.includes('SAFE_LOCKED'));
check("timeout fallback state exists", block.includes('Timeout fallback shown'));
check("fallback preserves exact photo and concept result", block.includes('exact uploaded photo') && block.includes('concept'));
check("no fetch call in v10.4.1 block", !/\bfetch\s*\(/.test(block));
check("no XHR, WebSocket, EventSource, or sendBeacon", !/(XMLHttpRequest|WebSocket|EventSource|sendBeacon)/.test(block));
check("no provider or Cloudflare endpoint", !/(api\.openai\.com|workers\.dev|pages\.dev|cloudflare\.com)/i.test(block));
check("no browser persistence added", !/(localStorage|sessionStorage|indexedDB)/.test(block));
check("hard lock remains in backend policy", /providerCallsEnabled:\s*false/.test(policy) && /paidCallsLocked:\s*true/.test(policy) && /killSwitch:\s*true/.test(policy) && /allowNetwork:\s*false/.test(policy));
check("automatic retries remain zero", block.includes('automaticRetries: 0') && /automaticRetries:\s*0/.test(policy));
check("no render-all-six action introduced", !/(render all six|generate all six|six renders)/i.test(block));

console.log(`RESULT: ${passes} passed, ${failures} failed`);
if(failures) process.exit(1);
