import assert from 'node:assert/strict';
import { createOneShotDryRunTransport } from '../backend/v10_4_0_secure_same_property/src/dry-run-transport-v10_4_6.mjs';
import { createReplayProofLifecycleLedger, verifyLifecycleSnapshot, V1047_BUILD } from '../backend/v10_4_0_secure_same_property/src/lifecycle-ledger-v10_4_7.mjs';

let count = 0;
const ok = (value, message) => { count += 1; assert.equal(Boolean(value), true, message); };
const eq = (actual, expected, message) => { count += 1; assert.equal(actual, expected, message); };
const deepFreeze = (value) => { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; Object.values(value).forEach(deepFreeze); return Object.freeze(value); };

const envelope = { contractBuild:'v10.4.0', preparationBuild:'v10.4.2', bridgeBuild:'v10.4.3', mode:'SAFE_LOCKED', selectedRecommendation:{count:1,id:'wildlife-haven',title:'Wildlife Haven'}, input:{imageCount:1,image:{mimeType:'image/jpeg',byteCount:2100000,width:2048,height:1536,metadataStripped:true,orientationPreservedByBrowserDecode:true,dataRef:'single-browser-prepared-image'},clues:{}}, output:{count:1,mimeType:'image/jpeg',preserveSameProperty:true,selectedFutureId:'wildlife-haven',automaticRetryCount:0}, consent:{requiredAtActivation:true,collected:false,state:'pending-owner-approved-real-activation'}, policy:{backendConnected:false,providerCallsEnabled:false,paidCallsLocked:true,killSwitch:true,networkAllowed:false,imageCount:1,outputCount:1,automaticRetries:0,storeInput:false,storeOutput:false} };
const config = { build:'v10.4.5',configurationSource:'server-environment',environment:'server',ownerApproved:true,approvalId:'verdeai-owner-approved-2026',approvalVersion:'v10.4.5',approvalScope:'same-property-single-image-v1',backendConnected:true,providerCallsEnabled:true,paidCallsLocked:false,killSwitch:false,networkAllowed:true,providerCredentialPresent:true,providerCredentialLocation:'server-secret',transportAdapterId:'verdeai.future.transport',maxImagesPerRequest:1,maxOutputsPerRequest:1,maxPreparedImageBytes:2500000,maxEdge:2048,automaticRetries:0,storeInputImages:false,storeOutputImages:false,maxCostUsd:0.15,totalBudgetUsd:10 };
const consent = { collected:true,explicit:true,source:'server-verified-consent',scope:'same-property-single-image-v1',termsVersion:'v10.4.5',photoUse:'temporary-processing',outputCount:1,storeInput:false,storeOutput:false,sessionBound:true,consentId:'vda-consent-session-2026',capturedAt:'2026-08-02T00:00:00.000Z',recommendationId:'wildlife-haven' };

const transport = createOneShotDryRunTransport({ clock:() => new Date('2026-08-02T00:01:00.000Z') });
const receipt = transport.run({ serverConfig:config, consentEvidence:consent, envelope });
const times = ['2026-08-02T00:02:00.000Z','2026-08-02T00:03:00.000Z','2026-08-02T00:04:00.000Z'];
let timeIndex = 0;
const ledger = createReplayProofLifecycleLedger({ clock:() => new Date(times[Math.min(timeIndex++, times.length - 1)]) });

eq(ledger.entryCount, 0, 'empty ledger');
const accepted = ledger.acceptReceipt(receipt);
eq(accepted.state, 'accepted', 'receipt accepted');
eq(accepted.transitions.length, 1, 'one transition');
eq(accepted.transitions[0].code, 'DRY_RUN_RECEIPT_ACCEPTED', 'accept code');
eq(ledger.entryCount, 1, 'one entry');
eq(ledger.transitionCount, 1, 'one ledger transition');

let replay = '';
try { ledger.acceptReceipt(receipt); } catch (error) { replay = error.code; }
eq(replay, 'RECEIPT_REPLAY_REJECTED', 'receipt replay rejected');

const duplicateFingerprint = deepFreeze({ ...receipt, receiptId:'aaaaaaaaaaaaaaaaaaaa' });
let duplicate = '';
try { ledger.acceptReceipt(duplicateFingerprint); } catch (error) { duplicate = error.code; }
eq(duplicate, 'DUPLICATE_REQUEST_FINGERPRINT', 'duplicate fingerprint rejected');

let outOfOrder = '';
try { ledger.transition(receipt.receiptId, 'closed'); } catch (error) { outOfOrder = error.code; }
eq(outOfOrder, 'OUT_OF_ORDER_TRANSITION', 'out of order rejected');

for (const forbiddenState of ['billable','image-generated','provider-output','network-transport','paid']) {
  let escalation = '';
  try { ledger.transition(receipt.receiptId, forbiddenState); } catch (error) { escalation = error.code; }
  eq(escalation, 'DRY_RUN_ESCALATION_FORBIDDEN', `escalation rejected: ${forbiddenState}`);
}

const audited = ledger.transition(receipt.receiptId, 'audited');
eq(audited.state, 'audited', 'audited state');
eq(audited.transitions.length, 2, 'two transitions');
eq(audited.transitions[1].code, 'DRY_RUN_RECEIPT_AUDITED', 'audit code');

const closed = ledger.transition(receipt.receiptId, 'closed');
eq(closed.state, 'closed', 'closed state');
eq(closed.transitions.length, 3, 'three transitions');
eq(closed.transitions[2].code, 'DRY_RUN_LIFECYCLE_CLOSED', 'close code');

let afterClose = '';
try { ledger.transition(receipt.receiptId, 'audited'); } catch (error) { afterClose = error.code; }
eq(afterClose, 'OUT_OF_ORDER_TRANSITION', 'closed lifecycle cannot reopen');

const snapshot = ledger.snapshot();
eq(snapshot.build, V1047_BUILD, 'snapshot build');
eq(snapshot.entryCount, 1, 'snapshot entry count');
eq(snapshot.transitionCount, 3, 'snapshot transition count');
eq(snapshot.persistentStorageUsed, false, 'no persistent storage');
eq(snapshot.networkRequests, 0, 'zero network');
eq(snapshot.providerCalls, 0, 'zero provider');
eq(snapshot.billableEvents, 0, 'zero billable events');
eq(snapshot.costUsd, 0, 'zero cost');
eq(snapshot.imagesCreated, 0, 'zero images');
eq(snapshot.outputsCreated, 0, 'zero outputs');
eq(snapshot.automaticRetries, 0, 'zero retries');
ok(Object.isFrozen(snapshot), 'snapshot frozen');
ok(Object.isFrozen(snapshot.entries), 'entries frozen');
ok(Object.isFrozen(snapshot.entries[0]), 'entry frozen');
ok(Object.isFrozen(snapshot.entries[0].transitions), 'transitions frozen');
ok(verifyLifecycleSnapshot(snapshot).ok, 'snapshot verifies');

const serialized = JSON.stringify(snapshot);
ok(!serialized.includes('vda-consent-session-2026'), 'consent ID absent');
ok(!serialized.includes('verdeai-owner-approved-2026'), 'approval ID absent');
ok(!serialized.includes('sessionKey'), 'session key absent');
ok(!serialized.includes('data:image'), 'image data absent');
ok(!serialized.includes('prompt'), 'prompt absent');

const tampered = { ...snapshot, billableEvents:1 };
eq(verifyLifecycleSnapshot(tampered).ok, false, 'tampered billing rejected');
const reordered = { ...snapshot, entries:[{ ...snapshot.entries[0], transitions:[snapshot.entries[0].transitions[1],snapshot.entries[0].transitions[0],snapshot.entries[0].transitions[2]] }] };
eq(verifyLifecycleSnapshot(reordered).ok, false, 'reordered transitions rejected');

let unknown = '';
try { ledger.transition('bbbbbbbbbbbbbbbbbbbb', 'audited'); } catch (error) { unknown = error.code; }
eq(unknown, 'RECEIPT_NOT_ACCEPTED', 'unknown receipt rejected');

console.log(`PASS ${count}/${count}: receipt replay, duplicate fingerprint, out-of-order and dry-run escalation are blocked; ledger remains redacted and side-effect-free.`);
