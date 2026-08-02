import fs from 'node:fs'; import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../backend/v10_4_0_secure_same_property/src/dry-run-transport-v10_4_6.mjs',import.meta.url),'utf8');
let n=0; const ok=(v,m)=>{n++;assert.ok(v,m)};
for(const token of ['local-one-shot-dry-run','DRY_RUN_ALREADY_USED','networkRequests: 0','providerCalls: 0','billableEvents: 0','costUsd: 0','storedInputs: false','storedOutputs: false','automaticRetries: 0','imageCreated: simulation.imageCreated','outputCount: simulation.outputCount','Object.freeze','sha256']) ok(source.includes(token),token);
for(const forbidden of ['fetch(','XMLHttpRequest','WebSocket','https://api','OPENAI_API_KEY','process.env','localStorage','sessionStorage','indexedDB','retry(']) ok(!source.includes(forbidden),`forbidden ${forbidden}`);
console.log(`PASS ${n}/${n}: static dry-run transport remains local, redacted, non-billable and storage-free.`);
