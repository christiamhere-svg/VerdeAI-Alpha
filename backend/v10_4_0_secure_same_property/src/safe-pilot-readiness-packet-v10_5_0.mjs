import { createHash } from 'node:crypto';
import { verifyLifecycleSnapshot, V1047_BUILD } from './lifecycle-ledger-v10_4_7.mjs';
import { createActivationReadinessAudit, verifyActivationReadinessAudit, renderOwnerReadinessReview, V1048_BUILD } from './readiness-audit-v10_4_8.mjs';
import { createActivationDecisionMatrix, verifyActivationDecisionMatrix, renderActivationDecisionMatrix, V1049_BUILD } from './activation-decision-matrix-v10_4_9.mjs';

export const V1050_BUILD = 'v10.5.0';
export const V1050_PACKET_SCHEMA = 'verdeai.safe-pilot-readiness-packet.v1';

const SENSITIVE_WORDS = /data:image|base64|\"(?:api[_-]?key|credentialValue|secretValue|consentId|approvalId|sessionKey|rawSession|photoData|prompt)\"\s*:/i;
function freezeDeep(value) { if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value; for (const item of Object.values(value)) freezeDeep(item); return Object.freeze(value); }
function digest(value) { return createHash('sha256').update(String(value ?? '')).digest('hex').slice(0, 28); }
function fail(code, message) { throw Object.assign(new Error(message), { code }); }

export function createSafePilotReadinessPacket(snapshot, options = {}) {
  const snapshotCheck = verifyLifecycleSnapshot(snapshot);
  if (!snapshotCheck.ok) fail('INVALID_LIFECYCLE_SNAPSHOT', `Lifecycle snapshot rejected: ${snapshotCheck.errors.join(',')}`);
  const audit = createActivationReadinessAudit(snapshot, options);
  const matrix = createActivationDecisionMatrix(audit);
  const packet = freezeDeep({
    schema: V1050_PACKET_SCHEMA,
    build: V1050_BUILD,
    sourceBuilds: [V1047_BUILD, V1048_BUILD, V1049_BUILD],
    mode: 'safe-locked-pilot-readiness-candidate',
    packetId: digest(`${audit.auditId}|${matrix.matrixId}|${V1050_BUILD}`),
    status: 'SAFE_LOCKED_CANDIDATE',
    recommendation: 'PAUSE_AT_OWNER_DECISION_BOUNDARY',
    repositoryInstalled: false,
    committed: false,
    pushed: false,
    deployed: false,
    backendConnected: false,
    providerConnected: false,
    paidCallsLocked: true,
    realCallsEnabled: false,
    activationReady: false,
    ownerInputRequiredForNextPhase: true,
    audit,
    decisionMatrix: matrix,
    zeroSideEffectProof: audit.proof
  });
  if (SENSITIVE_WORDS.test(JSON.stringify(packet))) fail('PACKET_REDACTION_FAILURE', 'The readiness packet contains forbidden sensitive content.');
  return packet;
}

export function verifySafePilotReadinessPacket(packet) {
  const errors = [];
  if (!packet || typeof packet !== 'object') errors.push('packet');
  else {
    if (packet.schema !== V1050_PACKET_SCHEMA || packet.build !== V1050_BUILD) errors.push('schemaBuild');
    if (!Array.isArray(packet.sourceBuilds) || packet.sourceBuilds.join('|') !== [V1047_BUILD, V1048_BUILD, V1049_BUILD].join('|')) errors.push('sourceBuilds');
    if (!/^[a-f0-9]{28}$/.test(packet.packetId || '')) errors.push('packetId');
    if (packet.mode !== 'safe-locked-pilot-readiness-candidate' || packet.status !== 'SAFE_LOCKED_CANDIDATE') errors.push('status');
    if (packet.recommendation !== 'PAUSE_AT_OWNER_DECISION_BOUNDARY') errors.push('recommendation');
    for (const field of ['repositoryInstalled','committed','pushed','deployed','backendConnected','providerConnected','realCallsEnabled','activationReady']) {
      if (packet[field] !== false) errors.push(field);
    }
    if (packet.paidCallsLocked !== true || packet.ownerInputRequiredForNextPhase !== true) errors.push('locks');
    if (!verifyActivationReadinessAudit(packet.audit).ok) errors.push('audit');
    if (!verifyActivationDecisionMatrix(packet.decisionMatrix).ok) errors.push('matrix');
    if (packet.decisionMatrix.auditId !== packet.audit.auditId) errors.push('linkage');
    const proof = packet.zeroSideEffectProof || {};
    if (proof.networkRequests !== 0 || proof.providerCalls !== 0 || proof.billableEvents !== 0 || proof.costUsd !== 0 || proof.imagesCreated !== 0 || proof.outputsCreated !== 0 || proof.persistentStorageUsed !== false || proof.automaticRetries !== 0) errors.push('proof');
    if (SENSITIVE_WORDS.test(JSON.stringify(packet))) errors.push('redaction');
  }
  return freezeDeep({ ok: errors.length === 0, errors });
}

export function renderSafePilotReadinessReport(packet) {
  const checked = verifySafePilotReadinessPacket(packet);
  if (!checked.ok) fail('INVALID_READINESS_PACKET', `Readiness packet rejected: ${checked.errors.join(',')}`);
  return [
    '# VerdeAI v10.5.0 — Safe-Locked Pilot Readiness Candidate',
    '',
    '**Status:** SAFE_LOCKED_CANDIDATE',
    '**Recommendation:** Pause at owner decision boundary',
    '**Real calls enabled:** No',
    '**Paid calls locked:** Yes',
    '**Repository installed:** No',
    '**Committed or pushed:** No',
    '**Deployed:** No',
    '',
    renderOwnerReadinessReview(packet.audit),
    '',
    renderActivationDecisionMatrix(packet.decisionMatrix)
  ].join('\n');
}
