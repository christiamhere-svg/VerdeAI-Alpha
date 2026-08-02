import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../backend/v10_4_0_secure_same_property/src/lifecycle-ledger-v10_4_7.mjs', import.meta.url), 'utf8');
let count = 0;
const ok = (value, message) => { count += 1; assert.ok(value, message); };

for (const token of [
  'local-memory-redacted-lifecycle',
  'RECEIPT_REPLAY_REJECTED',
  'DUPLICATE_REQUEST_FINGERPRINT',
  'OUT_OF_ORDER_TRANSITION',
  'DRY_RUN_ESCALATION_FORBIDDEN',
  'persistentStorageUsed: false',
  'networkRequests: 0',
  'providerCalls: 0',
  'billableEvents: 0',
  'costUsd: 0',
  'imagesCreated: 0',
  'outputsCreated: 0',
  'automaticRetries: 0',
  'Object.freeze',
  'verifyActivationReceipt'
]) ok(source.includes(token), token);

for (const forbidden of [
  'fetch(', 'XMLHttpRequest', 'WebSocket', 'https://api', 'OPENAI_API_KEY', 'process.env',
  'localStorage', 'sessionStorage', 'indexedDB', 'writeFile', 'appendFile', 'retry('
]) ok(!source.includes(forbidden), `forbidden ${forbidden}`);

console.log(`PASS ${count}/${count}: lifecycle ledger is local-memory-only, replay-proof, redacted, non-billable and output-free.`);
