import { createHash } from 'node:crypto';
import { inspectActivationBoundary } from './activation-boundary-v10_4_5.mjs';

export const V1046_BUILD = 'v10.4.6';
export const V1046_RECEIPT_SCHEMA = 'verdeai.activation-receipt.v1';

function freezeDeep(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const item of Object.values(value)) freezeDeep(item);
  return Object.freeze(value);
}

function digest(value) {
  return createHash('sha256').update(String(value ?? '')).digest('hex').slice(0, 20);
}

function safeIso(value) {
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  if (Number.isNaN(date.valueOf())) throw Object.assign(new Error('Invalid receipt timestamp.'), { code: 'INVALID_TIMESTAMP' });
  return date.toISOString();
}

function gateSummary(boundary) {
  return freezeDeep({
    configurationValidated: boundary.configurationValidated === true,
    consentValidated: boundary.consentValidated === true,
    envelopeValidated: boundary.envelopeValidated === true,
    transportAttached: boundary.transportAttached === true,
    transportInvocationAllowed: boundary.transportInvocationAllowed === false,
    ownerApprovalRequired: true,
    oneImageRequired: true,
    oneOutputRequired: true,
    zeroRetriesRequired: true,
    noStorageRequired: true,
    budgetCapsRequired: true
  });
}

export function createOneShotDryRunTransport({ clock = () => new Date(), receiptSalt = 'verdeai-v10.4.6-local-dry-run' } = {}) {
  let used = false;
  let receipt = null;

  function run({ serverConfig, consentEvidence, envelope } = {}) {
    if (used) {
      const error = new Error('The local dry-run transport has already been exercised.');
      error.code = 'DRY_RUN_ALREADY_USED';
      error.receipt = receipt;
      throw error;
    }
    used = true;

    let simulatorCalls = 0;
    const simulator = () => {
      simulatorCalls += 1;
      return freezeDeep({
        ok: true,
        code: 'LOCAL_DRY_RUN_COMPLETE',
        imageCreated: false,
        outputCount: 0,
        billable: false,
        networkUsed: false,
        stored: false,
        retryCount: 0
      });
    };

    const boundary = inspectActivationBoundary({ serverConfig, consentEvidence, envelope, transport: simulator });
    if (boundary.state !== 'ready-boundary' || boundary.code !== 'BOUNDARY_READY_NO_TRANSPORT_CALL') {
      const error = new Error('The v10.4.5 activation boundary did not reach its ready state.');
      error.code = boundary.code || 'BOUNDARY_NOT_READY';
      error.boundary = boundary;
      throw error;
    }
    if (simulatorCalls !== 0 || boundary.transportInvoked !== false) {
      throw Object.assign(new Error('The v10.4.5 boundary unexpectedly invoked transport.'), { code: 'BOUNDARY_SIDE_EFFECT_DETECTED' });
    }

    const simulation = simulator();
    if (simulatorCalls !== 1) throw Object.assign(new Error('Dry-run simulator did not execute exactly once.'), { code: 'SIMULATOR_CALL_COUNT_INVALID' });

    const timestamp = safeIso(clock());
    const gates = gateSummary(boundary);
    receipt = freezeDeep({
      schema: V1046_RECEIPT_SCHEMA,
      build: V1046_BUILD,
      mode: 'local-one-shot-dry-run',
      receiptId: digest(`${receiptSalt}|${timestamp}|${envelope?.sessionKey}|${envelope?.selectedRecommendation?.id}`),
      timestamp,
      requestFingerprint: digest(`${receiptSalt}|${JSON.stringify({
        contractBuild: envelope?.contractBuild,
        clientBuild: envelope?.clientBuild,
        futureId: envelope?.futureId,
        recommendationId: envelope?.selectedRecommendation?.id,
        byteCount: envelope?.input?.image?.byteCount,
        width: envelope?.input?.image?.width,
        height: envelope?.input?.image?.height,
        outputCount: envelope?.output?.count
      })}`),
      gates,
      execution: freezeDeep({
        simulatorCalls,
        networkRequests: 0,
        providerCalls: 0,
        imageCreated: simulation.imageCreated,
        outputCount: simulation.outputCount,
        billableEvents: 0,
        costUsd: 0,
        storedInputs: false,
        storedOutputs: false,
        automaticRetries: 0
      }),
      outcome: 'DRY_RUN_COMPLETE_NO_SIDE_EFFECTS'
    });
    return receipt;
  }

  return freezeDeep({
    run,
    get used() { return used; },
    get receipt() { return receipt; }
  });
}

export function verifyActivationReceipt(receipt) {
  const errors = [];
  if (!receipt || typeof receipt !== 'object') errors.push('receipt');
  else {
    if (receipt.schema !== V1046_RECEIPT_SCHEMA) errors.push('schema');
    if (receipt.build !== V1046_BUILD) errors.push('build');
    if (receipt.outcome !== 'DRY_RUN_COMPLETE_NO_SIDE_EFFECTS') errors.push('outcome');
    if (!/^[a-f0-9]{20}$/.test(receipt.receiptId || '')) errors.push('receiptId');
    if (!/^[a-f0-9]{20}$/.test(receipt.requestFingerprint || '')) errors.push('requestFingerprint');
    const x = receipt.execution || {};
    if (x.simulatorCalls !== 1) errors.push('simulatorCalls');
    if (x.networkRequests !== 0) errors.push('networkRequests');
    if (x.providerCalls !== 0) errors.push('providerCalls');
    if (x.imageCreated !== false) errors.push('imageCreated');
    if (x.outputCount !== 0) errors.push('outputCount');
    if (x.billableEvents !== 0 || x.costUsd !== 0) errors.push('billing');
    if (x.storedInputs !== false || x.storedOutputs !== false) errors.push('storage');
    if (x.automaticRetries !== 0) errors.push('retries');
    const serialized = JSON.stringify(receipt);
    if (/data:image|base64|api[_-]?key|credential|consentId|approvalId|sessionKey|photo|prompt/i.test(serialized)) errors.push('redaction');
  }
  return freezeDeep({ ok: errors.length === 0, errors });
}
