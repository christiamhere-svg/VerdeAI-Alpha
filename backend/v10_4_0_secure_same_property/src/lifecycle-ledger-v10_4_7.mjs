import { verifyActivationReceipt, V1046_BUILD } from './dry-run-transport-v10_4_6.mjs';

export const V1047_BUILD = 'v10.4.7';
export const V1047_LEDGER_SCHEMA = 'verdeai.lifecycle-ledger.v1';

const ALLOWED_STATES = Object.freeze(['accepted', 'audited', 'closed']);
const ESCALATION_WORDS = /bill|charge|cost|paid|provider|network|image|output|generate|transport|retry/i;
const SENSITIVE_WORDS = /data:image|base64|api[_-]?key|credential|consentId|approvalId|sessionKey|rawSession|photo|prompt/i;

function freezeDeep(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const item of Object.values(value)) freezeDeep(item);
  return Object.freeze(value);
}

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function safeIso(value) {
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  if (Number.isNaN(date.valueOf())) throw fail('INVALID_LEDGER_TIMESTAMP', 'Invalid lifecycle timestamp.');
  return date.toISOString();
}

function immutableReceipt(receipt) {
  return Boolean(
    receipt &&
    typeof receipt === 'object' &&
    Object.isFrozen(receipt) &&
    Object.isFrozen(receipt.gates) &&
    Object.isFrozen(receipt.execution)
  );
}

function redactedReceiptFacts(receipt) {
  return freezeDeep({
    sourceBuild: V1046_BUILD,
    receiptId: receipt.receiptId,
    requestFingerprint: receipt.requestFingerprint,
    dryRunOnly: true,
    networkRequests: 0,
    providerCalls: 0,
    billableEvents: 0,
    costUsd: 0,
    imageCreated: false,
    outputCount: 0,
    storedInputs: false,
    storedOutputs: false,
    automaticRetries: 0
  });
}

function publicEntry(entry) {
  return freezeDeep({
    receiptId: entry.receiptId,
    requestFingerprint: entry.requestFingerprint,
    state: entry.state,
    facts: entry.facts,
    transitions: entry.transitions.map((transition) => freezeDeep({ ...transition }))
  });
}

export function createReplayProofLifecycleLedger({ clock = () => new Date() } = {}) {
  const entries = new Map();
  const fingerprints = new Set();
  let sequence = 0;

  function append(entry, from, to, code) {
    sequence += 1;
    entry.state = to;
    entry.transitions.push(freezeDeep({
      sequence,
      from,
      to,
      code,
      timestamp: safeIso(clock())
    }));
    return publicEntry(entry);
  }

  function acceptReceipt(receipt) {
    const checked = verifyActivationReceipt(receipt);
    if (!checked.ok) throw fail('INVALID_ACTIVATION_RECEIPT', `Receipt rejected: ${checked.errors.join(',')}`);
    if (!immutableReceipt(receipt)) throw fail('MUTABLE_RECEIPT_REJECTED', 'Only the immutable v10.4.6 receipt may enter the ledger.');
    if (entries.has(receipt.receiptId)) throw fail('RECEIPT_REPLAY_REJECTED', 'This dry-run receipt has already been accepted.');
    if (fingerprints.has(receipt.requestFingerprint)) throw fail('DUPLICATE_REQUEST_FINGERPRINT', 'This request fingerprint has already been accepted.');

    const serialized = JSON.stringify(receipt);
    if (SENSITIVE_WORDS.test(serialized)) throw fail('SENSITIVE_RECEIPT_CONTENT', 'Receipt contains forbidden sensitive content.');

    const facts = redactedReceiptFacts(receipt);
    const entry = {
      receiptId: receipt.receiptId,
      requestFingerprint: receipt.requestFingerprint,
      state: null,
      facts,
      transitions: []
    };
    entries.set(receipt.receiptId, entry);
    fingerprints.add(receipt.requestFingerprint);
    return append(entry, 'none', 'accepted', 'DRY_RUN_RECEIPT_ACCEPTED');
  }

  function transition(receiptId, targetState) {
    if (typeof targetState !== 'string' || !targetState) throw fail('INVALID_TARGET_STATE', 'A lifecycle target state is required.');
    if (ESCALATION_WORDS.test(targetState)) {
      throw fail('DRY_RUN_ESCALATION_FORBIDDEN', 'A dry-run receipt can never become billable or image-producing.');
    }
    if (!ALLOWED_STATES.includes(targetState)) throw fail('UNKNOWN_LIFECYCLE_STATE', 'Unknown lifecycle target state.');
    const entry = entries.get(receiptId);
    if (!entry) throw fail('RECEIPT_NOT_ACCEPTED', 'The receipt must be accepted before lifecycle transitions.');

    const expected = entry.state === 'accepted' ? 'audited' : entry.state === 'audited' ? 'closed' : null;
    if (targetState !== expected) throw fail('OUT_OF_ORDER_TRANSITION', `Expected ${expected ?? 'no further transition'}, received ${targetState}.`);
    const code = targetState === 'audited' ? 'DRY_RUN_RECEIPT_AUDITED' : 'DRY_RUN_LIFECYCLE_CLOSED';
    return append(entry, entry.state, targetState, code);
  }

  function getEntry(receiptId) {
    const entry = entries.get(receiptId);
    return entry ? publicEntry(entry) : null;
  }

  function snapshot() {
    const publicEntries = [...entries.values()].map(publicEntry);
    const transitionCount = publicEntries.reduce((total, entry) => total + entry.transitions.length, 0);
    return freezeDeep({
      schema: V1047_LEDGER_SCHEMA,
      build: V1047_BUILD,
      mode: 'local-memory-redacted-lifecycle',
      persistentStorageUsed: false,
      networkRequests: 0,
      providerCalls: 0,
      billableEvents: 0,
      costUsd: 0,
      imagesCreated: 0,
      outputsCreated: 0,
      automaticRetries: 0,
      entryCount: publicEntries.length,
      transitionCount,
      entries: publicEntries
    });
  }

  return freezeDeep({
    acceptReceipt,
    transition,
    getEntry,
    snapshot,
    get entryCount() { return entries.size; },
    get transitionCount() { return sequence; }
  });
}

export function verifyLifecycleSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object') errors.push('snapshot');
  else {
    if (snapshot.schema !== V1047_LEDGER_SCHEMA) errors.push('schema');
    if (snapshot.build !== V1047_BUILD) errors.push('build');
    if (snapshot.mode !== 'local-memory-redacted-lifecycle') errors.push('mode');
    if (snapshot.persistentStorageUsed !== false) errors.push('storage');
    if (snapshot.networkRequests !== 0 || snapshot.providerCalls !== 0) errors.push('network');
    if (snapshot.billableEvents !== 0 || snapshot.costUsd !== 0) errors.push('billing');
    if (snapshot.imagesCreated !== 0 || snapshot.outputsCreated !== 0) errors.push('outputs');
    if (snapshot.automaticRetries !== 0) errors.push('retries');
    if (!Array.isArray(snapshot.entries) || snapshot.entryCount !== snapshot.entries?.length) errors.push('entries');

    const seenReceipts = new Set();
    const seenFingerprints = new Set();
    let transitions = 0;
    for (const entry of snapshot.entries || []) {
      if (!/^[a-f0-9]{20}$/.test(entry.receiptId || '')) errors.push('receiptId');
      if (!/^[a-f0-9]{20}$/.test(entry.requestFingerprint || '')) errors.push('requestFingerprint');
      if (seenReceipts.has(entry.receiptId)) errors.push('receiptReplay');
      if (seenFingerprints.has(entry.requestFingerprint)) errors.push('fingerprintReplay');
      seenReceipts.add(entry.receiptId);
      seenFingerprints.add(entry.requestFingerprint);
      if (!ALLOWED_STATES.includes(entry.state)) errors.push('state');
      if (!Array.isArray(entry.transitions)) errors.push('transitions');
      transitions += entry.transitions?.length || 0;
      const route = (entry.transitions || []).map((item) => `${item.from}>${item.to}`).join('|');
      if (!['none>accepted', 'none>accepted|accepted>audited', 'none>accepted|accepted>audited|audited>closed'].includes(route)) errors.push('transitionOrder');
      const facts = entry.facts || {};
      if (facts.dryRunOnly !== true || facts.billableEvents !== 0 || facts.costUsd !== 0 || facts.imageCreated !== false || facts.outputCount !== 0) errors.push('dryRunFacts');
    }
    if (snapshot.transitionCount !== transitions) errors.push('transitionCount');
    if (SENSITIVE_WORDS.test(JSON.stringify(snapshot))) errors.push('redaction');
  }
  return freezeDeep({ ok: errors.length === 0, errors });
}
