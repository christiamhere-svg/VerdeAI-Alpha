import fs from "node:fs";
const src = fs.readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
const cfg = fs.readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");
const checks = {
  version: src.includes('VERSION = "9.2.2"'),
  oneImageOnly: src.includes('count !== 1') && !src.includes('renderAllSix'),
  serverSecret: src.includes('env.OPENAI_API_KEY') && !src.includes('sk-'),
  inviteHashes: src.includes('PILOT_INVITE_CODE_HASHES') && src.includes('invite-code-used'),
  durableObject: src.includes('class PilotGuard'),
  noStore: src.includes('serverImageStorage: false') && src.includes('RETENTION'),
  providerEndpoint: src.includes('https://api.openai.com/v1/images/edits'),
  approvedCaps: cfg.includes('"PILOT_SPEND_CAP_USD": "5"') && cfg.includes('"INVITED_TESTER_LIMIT": "10"'),
  requiredSecrets: cfg.includes('OPENAI_API_KEY') && cfg.includes('RATE_LIMIT_SALT') && cfg.includes('PILOT_INVITE_CODE_HASHES')
};
const failed = Object.entries(checks).filter(([, ok]) => !ok);
console.log(JSON.stringify({ ok: !failed.length, checks }, null, 2));
if (failed.length) process.exit(1);
