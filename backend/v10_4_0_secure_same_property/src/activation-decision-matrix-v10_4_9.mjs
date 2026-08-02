import { createHash } from 'node:crypto';
import { verifyActivationReadinessAudit, V1048_BUILD } from './readiness-audit-v10_4_8.mjs';

export const V1049_BUILD = 'v10.4.9';
export const V1049_MATRIX_SCHEMA = 'verdeai.activation-decision-matrix.v1';

const SENSITIVE_WORDS = /data:image|base64|\"(?:api[_-]?key|credentialValue|secretValue|consentId|approvalId|sessionKey|rawSession|photoData|prompt)\"\s*:/i;

function freezeDeep(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const item of Object.values(value)) freezeDeep(item);
  return Object.freeze(value);
}
function digest(value) { return createHash('sha256').update(String(value ?? '')).digest('hex').slice(0, 24); }
function fail(code, message) { throw Object.assign(new Error(message), { code }); }

const CHECKS = freezeDeep([
  { code: 'LOCAL_CONTRACTS_AND_DRY_RUN', category: 'local', state: 'PASS', blocking: false },
  { code: 'REPLAY_PROOF_LIFECYCLE', category: 'local', state: 'PASS', blocking: false },
  { code: 'REDACTED_OWNER_AUDIT', category: 'local', state: 'PASS', blocking: false },
  { code: 'EXPLICIT_CURRENT_OWNER_ACTIVATION', category: 'owner', state: 'REQUIRED', blocking: true },
  { code: 'SERVER_BACKEND_DEPLOYED_AND_HEALTHY', category: 'infrastructure', state: 'NOT_VALIDATED', blocking: true },
  { code: 'SERVER_SECRET_PRESENT_AND_ROTATABLE', category: 'security', state: 'NOT_VALIDATED', blocking: true },
  { code: 'BUDGET_AND_RATE_LIMIT_ENFORCEMENT', category: 'cost-control', state: 'NOT_VALIDATED', blocking: true },
  { code: 'CONSENT_AND_TEMPORARY_PROCESSING_FLOW', category: 'privacy', state: 'NOT_VALIDATED', blocking: true },
  { code: 'NO_INPUT_OR_OUTPUT_RETENTION', category: 'privacy', state: 'NOT_VALIDATED', blocking: true },
  { code: 'PROVIDER_MODERATION_AND_FAILURE_HANDLING', category: 'safety', state: 'NOT_VALIDATED', blocking: true },
  { code: 'ONE_CONTROLLED_LIVE_REQUEST', category: 'provider', state: 'NOT_RUN', blocking: true },
  { code: 'SAME_PROPERTY_OUTPUT_QUALITY', category: 'product', state: 'NOT_VALIDATED', blocking: true },
  { code: 'PHYSICAL_ANDROID_AND_CROSS_BROWSER', category: 'product', state: 'NOT_VALIDATED', blocking: true }
]);

export function createActivationDecisionMatrix(audit) {
  const checked = verifyActivationReadinessAudit(audit);
  if (!checked.ok) fail('INVALID_READINESS_AUDIT', `Readiness audit rejected: ${checked.errors.join(',')}`);
  if (!Object.isFrozen(audit)) fail('MUTABLE_READINESS_AUDIT', 'Only an immutable readiness audit may be evaluated.');

  const blockers = CHECKS.filter((item) => item.blocking).map((item) => item.code);
  const matrix = freezeDeep({
    schema: V1049_MATRIX_SCHEMA,
    build: V1049_BUILD,
    sourceBuild: V1048_BUILD,
    mode: 'local-owner-decision-boundary',
    matrixId: digest(`${audit.auditId}|${audit.sourceFingerprint}|${V1049_BUILD}`),
    auditId: audit.auditId,
    currentState: 'SAFE_LOCKED',
    decision: 'DO_NOT_ACTIVATE',
    activationReady: false,
    realTransportPermitted: false,
    realProviderCallPermitted: false,
    billableEventPermitted: false,
    deploymentPermittedByThisBuild: false,
    canProceedWithoutOwnerInput: false,
    nextRequiredAuthority: 'EXPLICIT_OWNER_REVIEW_AND_APPROVAL',
    passedCheckCount: CHECKS.filter((item) => item.state === 'PASS').length,
    blockingCheckCount: blockers.length,
    checks: CHECKS,
    blockers,
    guardrails: audit.recordedGuardrails,
    proof: audit.proof
  });
  if (SENSITIVE_WORDS.test(JSON.stringify(matrix))) fail('MATRIX_REDACTION_FAILURE', 'The decision matrix contains forbidden sensitive content.');
  return matrix;
}

export function verifyActivationDecisionMatrix(matrix) {
  const errors = [];
  if (!matrix || typeof matrix !== 'object') errors.push('matrix');
  else {
    if (matrix.schema !== V1049_MATRIX_SCHEMA) errors.push('schema');
    if (matrix.build !== V1049_BUILD || matrix.sourceBuild !== V1048_BUILD) errors.push('build');
    if (!/^[a-f0-9]{24}$/.test(matrix.matrixId || '')) errors.push('matrixId');
    if (!/^[a-f0-9]{24}$/.test(matrix.auditId || '')) errors.push('auditId');
    if (matrix.mode !== 'local-owner-decision-boundary') errors.push('mode');
    if (matrix.currentState !== 'SAFE_LOCKED' || matrix.decision !== 'DO_NOT_ACTIVATE') errors.push('decision');
    if (matrix.activationReady !== false || matrix.realTransportPermitted !== false || matrix.realProviderCallPermitted !== false) errors.push('activation');
    if (matrix.billableEventPermitted !== false || matrix.deploymentPermittedByThisBuild !== false) errors.push('sideEffects');
    if (matrix.canProceedWithoutOwnerInput !== false || matrix.nextRequiredAuthority !== 'EXPLICIT_OWNER_REVIEW_AND_APPROVAL') errors.push('authority');
    if (!Array.isArray(matrix.checks) || matrix.checks.length !== CHECKS.length) errors.push('checks');
    if (!Array.isArray(matrix.blockers) || matrix.blockers.length < 1) errors.push('blockers');
    if (matrix.blockingCheckCount !== matrix.blockers?.length) errors.push('blockingCount');
    if (matrix.passedCheckCount !== 3) errors.push('passedCount');
    if (matrix.checks?.some((item) => item.blocking === true && !matrix.blockers.includes(item.code))) errors.push('blockerMismatch');
    const proof = matrix.proof || {};
    if (proof.networkRequests !== 0 || proof.providerCalls !== 0 || proof.billableEvents !== 0 || proof.costUsd !== 0) errors.push('proof');
    if (SENSITIVE_WORDS.test(JSON.stringify(matrix))) errors.push('redaction');
  }
  return freezeDeep({ ok: errors.length === 0, errors });
}

export function renderActivationDecisionMatrix(matrix) {
  const checked = verifyActivationDecisionMatrix(matrix);
  if (!checked.ok) fail('INVALID_DECISION_MATRIX', `Decision matrix rejected: ${checked.errors.join(',')}`);
  const lines = [
    '# VerdeAI v10.4.9 — Activation Decision Matrix',
    '',
    '**Decision:** DO NOT ACTIVATE',
    '**State:** SAFE_LOCKED',
    `**Passed local checks:** ${matrix.passedCheckCount}`,
    `**Blocking checks:** ${matrix.blockingCheckCount}`,
    '',
    '## Blocking items',
    ...matrix.blockers.map((item) => `- ${item}`),
    '',
    'No real transport, provider call, billable event, deployment, image creation, or persistent storage is permitted by this build.'
  ];
  return lines.join('\n');
}
