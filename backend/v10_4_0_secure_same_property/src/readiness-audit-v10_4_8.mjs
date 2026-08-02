import { createHash } from 'node:crypto';
import { verifyLifecycleSnapshot, V1047_BUILD } from './lifecycle-ledger-v10_4_7.mjs';

export const V1048_BUILD = 'v10.4.8';
export const V1048_AUDIT_SCHEMA = 'verdeai.activation-readiness-audit.v1';

const SENSITIVE_WORDS = /data:image|base64|\"(?:api[_-]?key|credentialValue|secretValue|consentId|approvalId|sessionKey|rawSession|photoData|prompt)\"\s*:/i;

function freezeDeep(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const item of Object.values(value)) freezeDeep(item);
  return Object.freeze(value);
}

function digest(value) {
  return createHash('sha256').update(String(value ?? '')).digest('hex').slice(0, 24);
}

function safeIso(value) {
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  if (Number.isNaN(date.valueOf())) throw Object.assign(new Error('Invalid audit timestamp.'), { code: 'INVALID_AUDIT_TIMESTAMP' });
  return date.toISOString();
}

function fail(code, message) {
  throw Object.assign(new Error(message), { code });
}

const RECORDED_GUARDRAILS = freezeDeep({
  status: 'recorded-proposal-not-activation-authority',
  maxImagesPerRequest: 1,
  maxOutputsPerRequest: 1,
  maxPreparedImageBytes: 2500000,
  maxEdgePixels: 2048,
  automaticRetries: 0,
  storeInputImages: false,
  storeOutputImages: false,
  maxCostUsdPerRequest: 0.15,
  totalPilotBudgetUsd: 10,
  invitedTesterLimit: 10,
  maxRendersPerSession: 1,
  maxRequestsPerIpPer24Hours: 2
});

const OWNER_DECISIONS = freezeDeep([
  { code: 'OWNER_CONFIRM_PROVIDER_AND_MODEL', required: true, state: 'not-authorised-by-this-build' },
  { code: 'OWNER_CONFIRM_BACKEND_HOST_AND_REGION', required: true, state: 'not-authorised-by-this-build' },
  { code: 'OWNER_CONFIRM_SERVER_SECRET_SETUP', required: true, state: 'not-authorised-by-this-build' },
  { code: 'OWNER_CONFIRM_PILOT_BUDGET_AND_RATE_LIMITS', required: true, state: 'not-authorised-by-this-build' },
  { code: 'OWNER_CONFIRM_CONSENT_WORDING', required: true, state: 'not-authorised-by-this-build' },
  { code: 'OWNER_CONFIRM_RETENTION_AND_DELETION_POLICY', required: true, state: 'not-authorised-by-this-build' },
  { code: 'OWNER_CONFIRM_MODERATION_AND_FAILURE_POLICY', required: true, state: 'not-authorised-by-this-build' },
  { code: 'OWNER_APPROVE_ONE_CONTROLLED_LIVE_TEST', required: true, state: 'not-authorised-by-this-build' }
]);

const LOCKED_ITEMS = freezeDeep([
  'REAL_NETWORK_TRANSPORT',
  'PROVIDER_CONNECTION',
  'SERVER_CREDENTIAL',
  'PAID_CALLS',
  'IMAGE_GENERATION',
  'INPUT_STORAGE',
  'OUTPUT_STORAGE',
  'AUTOMATIC_RETRIES',
  'PUBLIC_TESTER_ACTIVATION'
]);

export function createActivationReadinessAudit(snapshot, { clock = () => new Date() } = {}) {
  const checked = verifyLifecycleSnapshot(snapshot);
  if (!checked.ok) fail('INVALID_LIFECYCLE_SNAPSHOT', `Lifecycle snapshot rejected: ${checked.errors.join(',')}`);
  if (!Object.isFrozen(snapshot)) fail('MUTABLE_LIFECYCLE_SNAPSHOT', 'Only an immutable lifecycle snapshot may be audited.');
  if (snapshot.entryCount < 1) fail('EMPTY_LIFECYCLE_SNAPSHOT', 'At least one verified dry-run lifecycle is required.');
  if (snapshot.entries.some((entry) => entry.state !== 'closed')) fail('INCOMPLETE_LIFECYCLE', 'Every audited dry-run lifecycle must be closed.');

  const sourceFingerprint = digest(JSON.stringify({
    schema: snapshot.schema,
    build: snapshot.build,
    entryCount: snapshot.entryCount,
    transitionCount: snapshot.transitionCount,
    receiptIds: snapshot.entries.map((entry) => entry.receiptId),
    requestFingerprints: snapshot.entries.map((entry) => entry.requestFingerprint)
  }));
  const timestamp = safeIso(clock());

  const audit = freezeDeep({
    schema: V1048_AUDIT_SCHEMA,
    build: V1048_BUILD,
    sourceBuild: V1047_BUILD,
    mode: 'local-redacted-owner-readiness-review',
    auditId: digest(`${sourceFingerprint}|${timestamp}|${V1048_BUILD}`),
    timestamp,
    sourceFingerprint,
    currentState: 'SAFE_LOCKED',
    readyForRealCalls: false,
    activationAuthorised: false,
    installationPerformed: false,
    deploymentPerformed: false,
    proof: {
      lifecycleEntriesVerified: snapshot.entryCount,
      lifecycleTransitionsVerified: snapshot.transitionCount,
      allLifecyclesClosed: true,
      networkRequests: 0,
      providerCalls: 0,
      billableEvents: 0,
      costUsd: 0,
      imagesCreated: 0,
      outputsCreated: 0,
      persistentStorageUsed: false,
      automaticRetries: 0
    },
    ready: [
      'BROWSER_IMAGE_PREPARATION_CONTRACT',
      'LOCKED_REQUEST_ENVELOPE_CONTRACT',
      'NON_DESTRUCTIVE_RESPONSE_FALLBACK',
      'SERVER_ONLY_ACTIVATION_BOUNDARY',
      'ONE_SHOT_LOCAL_DRY_RUN',
      'REPLAY_PROOF_LOCAL_LIFECYCLE',
      'REDACTED_OWNER_AUDIT'
    ],
    locked: LOCKED_ITEMS,
    recordedGuardrails: RECORDED_GUARDRAILS,
    ownerDecisionsRequired: OWNER_DECISIONS,
    externalValidationStillRequired: [
      'LIVE_BACKEND_DEPLOYMENT',
      'REAL_PROVIDER_RESPONSE_CONTRACT',
      'REAL_PROVIDER_COST_AND_LATENCY',
      'REAL_PROVIDER_MODERATION_AND_FAILURES',
      'SAME_PROPERTY_IMAGE_QUALITY',
      'PHYSICAL_ANDROID_TEST',
      'CROSS_BROWSER_TEST'
    ],
    recommendation: 'DO_NOT_ACTIVATE_REAL_CALLS'
  });

  if (SENSITIVE_WORDS.test(JSON.stringify(audit))) fail('AUDIT_REDACTION_FAILURE', 'The readiness audit contains forbidden sensitive content.');
  return audit;
}

export function verifyActivationReadinessAudit(audit) {
  const errors = [];
  if (!audit || typeof audit !== 'object') errors.push('audit');
  else {
    if (audit.schema !== V1048_AUDIT_SCHEMA) errors.push('schema');
    if (audit.build !== V1048_BUILD || audit.sourceBuild !== V1047_BUILD) errors.push('build');
    if (audit.mode !== 'local-redacted-owner-readiness-review') errors.push('mode');
    if (!/^[a-f0-9]{24}$/.test(audit.auditId || '')) errors.push('auditId');
    if (!/^[a-f0-9]{24}$/.test(audit.sourceFingerprint || '')) errors.push('sourceFingerprint');
    if (audit.currentState !== 'SAFE_LOCKED') errors.push('state');
    if (audit.readyForRealCalls !== false || audit.activationAuthorised !== false) errors.push('activation');
    if (audit.installationPerformed !== false || audit.deploymentPerformed !== false) errors.push('sideEffects');
    const proof = audit.proof || {};
    if (proof.lifecycleEntriesVerified < 1 || proof.allLifecyclesClosed !== true) errors.push('lifecycle');
    if (proof.networkRequests !== 0 || proof.providerCalls !== 0) errors.push('network');
    if (proof.billableEvents !== 0 || proof.costUsd !== 0) errors.push('billing');
    if (proof.imagesCreated !== 0 || proof.outputsCreated !== 0) errors.push('outputs');
    if (proof.persistentStorageUsed !== false || proof.automaticRetries !== 0) errors.push('storageRetries');
    if (!Array.isArray(audit.ready) || audit.ready.length < 1) errors.push('ready');
    if (!Array.isArray(audit.locked) || !LOCKED_ITEMS.every((item) => audit.locked.includes(item))) errors.push('locked');
    if (!Array.isArray(audit.ownerDecisionsRequired) || audit.ownerDecisionsRequired.length !== OWNER_DECISIONS.length) errors.push('ownerDecisions');
    if (audit.ownerDecisionsRequired?.some((item) => item.required !== true || item.state !== 'not-authorised-by-this-build')) errors.push('ownerDecisionState');
    const guardrails = audit.recordedGuardrails || {};
    if (guardrails.status !== 'recorded-proposal-not-activation-authority') errors.push('guardrailStatus');
    if (guardrails.maxImagesPerRequest !== 1 || guardrails.maxOutputsPerRequest !== 1) errors.push('counts');
    if (guardrails.maxCostUsdPerRequest !== 0.15 || guardrails.totalPilotBudgetUsd !== 10) errors.push('budgets');
    if (guardrails.automaticRetries !== 0 || guardrails.storeInputImages !== false || guardrails.storeOutputImages !== false) errors.push('guardrails');
    if (audit.recommendation !== 'DO_NOT_ACTIVATE_REAL_CALLS') errors.push('recommendation');
    if (SENSITIVE_WORDS.test(JSON.stringify(audit))) errors.push('redaction');
  }
  return freezeDeep({ ok: errors.length === 0, errors });
}

export function renderOwnerReadinessReview(audit) {
  const checked = verifyActivationReadinessAudit(audit);
  if (!checked.ok) fail('INVALID_READINESS_AUDIT', `Readiness audit rejected: ${checked.errors.join(',')}`);
  const lines = [
    '# VerdeAI v10.4.8 — Owner Readiness Review',
    '',
    '**Current state:** SAFE_LOCKED',
    '**Real provider calls:** Not authorised',
    '**Recommendation:** Do not activate real calls',
    '',
    '## Proven locally',
    ...audit.ready.map((item) => `- ${item}`),
    '',
    '## Still locked',
    ...audit.locked.map((item) => `- ${item}`),
    '',
    '## Owner decisions required before any real connection',
    ...audit.ownerDecisionsRequired.map((item) => `- ${item.code}`),
    '',
    '## Zero-side-effect proof',
    '- Network requests: 0',
    '- Provider calls: 0',
    '- Billable events: 0',
    '- Cost: US$0',
    '- Images created: 0',
    '- Outputs created: 0',
    '- Persistent storage: no',
    '- Automatic retries: 0'
  ];
  return lines.join('\n');
}
