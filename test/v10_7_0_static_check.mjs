import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert } from './v10_7_0_test_helpers.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, '../backend/v10_4_0_secure_same_property/src');
const names = fs.readdirSync(src).filter(name => name.includes('v10_7_0') && name.endsWith('.mjs'));
let checks = 0;
const check = (value, message) => { checks += 1; assert(value, message); };
check(names.length >= 9, 'all v10.7.0 modules exist');
for (const name of names) {
  const text = fs.readFileSync(path.join(src, name), 'utf8');
  check(!text.includes("from 'node:"), `${name} has no Node-only runtime import`);
  check(!/\bBuffer\b/.test(text), `${name} has no Buffer dependency`);
  check(!/\b(localStorage|sessionStorage|indexedDB)\b/.test(text), `${name} has no browser persistence`);
  check(!/\b(retry|retries)\s*[:=]\s*[1-9]/i.test(text), `${name} does not configure retries`);
  check(!/sk-[A-Za-z0-9_-]{20,}/.test(text), `${name} contains no API key`);
}
const policy = fs.readFileSync(path.join(src, 'pilot-policy-v10_7_0.mjs'), 'utf8');
check(policy.includes("gpt-image-2-2026-04-21"), 'model snapshot is pinned');
check(policy.includes("https://api.openai.com/v1/images/edits"), 'edits endpoint is pinned');
check(policy.includes("V1070_SESSION_LIMIT = 1"), 'session limit is one');
check(policy.includes("V1070_IP_LIMIT_24H = 2"), 'IP daily limit is two');
check(policy.includes("V1070_MAX_REQUEST_COST_USD = 0.15"), 'request policy cap documented');
check(policy.includes("V1070_TOTAL_BUDGET_USD = 10"), 'total budget policy documented');
const worker = fs.readFileSync(path.join(src, 'cloudflare-worker-entry-v10_7_0.mjs'), 'utf8');
check(worker.includes("publicDeploymentApproved: false"), 'public deployment stays false');
check(worker.includes("cache-control': 'no-store"), 'worker responses are no-store');
check(worker.includes('cf-access-authenticated-user-email'), 'Cloudflare Access identity is required');
check(worker.includes('PILOT_RATE_LIMITER'), 'atomic Durable Object rate limiter is required');
console.log(`PASS ${checks}/${checks}: v10.7.0 static pilot infrastructure is server-only, one-shot, non-persistent, owner-gated and contains no secret.`);
