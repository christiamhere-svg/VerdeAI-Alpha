import { handlePilotRequest } from '../backend/v10_4_0_secure_same_property/src/cloudflare-worker-entry-v10_7_0.mjs';
import { VerdeAIPilotRateLimiter } from '../backend/v10_4_0_secure_same_property/src/pilot-rate-durable-object-v10_7_0.mjs';
import { bytesToBase64, sha256Hex } from '../backend/v10_4_0_secure_same_property/src/runtime-codec-v10_7_0.mjs';
import { V1070_SCOPE } from '../backend/v10_4_0_secure_same_property/src/pilot-policy-v10_7_0.mjs';
import { assert, jpegBytes, validEnvelope, MemoryAtomicRateStore } from './v10_7_0_test_helpers.mjs';

let checks = 0;
const check = (value, message) => { checks += 1; assert(value, message); };
const ownerEmail = 'owner@example.test';
const allowedOrigin = 'https://verdeai-owner.example.test';
const input = jpegBytes(600);
const output = jpegBytes(900);
const ownerHash = await sha256Hex(ownerEmail);
const apiKey = `sk-${'p'.repeat(32)}`;
const env = {
  VERDEAI_ALLOWED_ORIGIN: allowedOrigin,
  VERDEAI_OWNER_EMAIL_SHA256: ownerHash,
  VERDEAI_PILOT_ENABLED: 'TRUE', VERDEAI_PAID_PILOT_APPROVED: 'TRUE',
  VERDEAI_KILL_SWITCH: 'OFF', VERDEAI_NETWORK_ALLOWED: 'TRUE',
  VERDEAI_PLATFORM_SPEND_LIMIT_CONFIRMED: 'TRUE', VERDEAI_RATE_SALT: 'worker-rate-salt-123456',
  OPENAI_API_KEY: apiKey, PILOT_RATE_LIMITER: {}
};
const requestBody = {
  imageBase64: bytesToBase64(input), sessionId: 'worker-session-0001',
  propertySummary: 'Wooded Australian garden path with mature canopy.',
  preserveNote: 'Keep the access path and mature trees.', envelope: validEnvelope(input),
  consentEvidence: { explicit: true, serverVerified: true, scope: V1070_SCOPE,
    temporaryProcessingOnly: true, storeInput: false, storeOutput: false,
    recommendationId: 'wildlife-haven' }
};
function makeRequest(body = requestBody, overrides = {}) {
  return new Request('https://pilot.example.test/v1/pilot', {
    method: overrides.method || 'POST',
    headers: {
      origin: overrides.origin ?? allowedOrigin,
      'content-type': overrides.contentType || 'application/json',
      'cf-access-authenticated-user-email': overrides.email ?? ownerEmail,
      'cf-connecting-ip': overrides.ip || '203.0.113.60',
      ...(overrides.headers || {})
    },
    body: (overrides.method || 'POST') === 'GET' ? undefined : (overrides.rawBody ?? JSON.stringify(body))
  });
}

let providerCalls = 0;
const fakeFetch = async (url, options) => {
  providerCalls += 1;
  check(url === 'https://api.openai.com/v1/images/edits', 'worker uses exact OpenAI edits URL');
  check(options.body.getAll('image[]').length === 1, 'worker forwards one image');
  return new Response(JSON.stringify({ data: [{ b64_json: bytesToBase64(output) }], usage: { total_tokens: 410, input_tokens: 214, output_tokens: 196 } }), {
    status: 200, headers: { 'content-type': 'application/json', 'x-request-id': 'req_worker_001' }
  });
};

const originRejected = await handlePilotRequest(makeRequest(requestBody, { origin: 'https://evil.example' }), env, { fetchImpl: fakeFetch, rateStore: new MemoryAtomicRateStore(), now: 1_786_000_000_000 });
check(originRejected.status === 403, 'foreign origin rejected');
check(providerCalls === 0, 'foreign origin makes no provider call');
const getRejected = await handlePilotRequest(makeRequest(requestBody, { method: 'GET' }), env, { fetchImpl: fakeFetch, rateStore: new MemoryAtomicRateStore() });
check(getRejected.status === 405, 'GET rejected');
const typeRejected = await handlePilotRequest(makeRequest(requestBody, { contentType: 'text/plain' }), env, { fetchImpl: fakeFetch, rateStore: new MemoryAtomicRateStore() });
check(typeRejected.status === 415, 'non-JSON rejected');
const sizeRejected = await handlePilotRequest(makeRequest(requestBody, { headers: { 'content-length': '3700001' } }), env, { fetchImpl: fakeFetch, rateStore: new MemoryAtomicRateStore() });
check(sizeRejected.status === 413, 'oversized JSON rejected before parsing');
const badOwner = await handlePilotRequest(makeRequest(requestBody, { email: 'stranger@example.test' }), env, { fetchImpl: fakeFetch, rateStore: new MemoryAtomicRateStore() });
const badOwnerBody = await badOwner.json();
check(badOwner.status === 423 && badOwnerBody.code === 'OWNER_IDENTITY_REQUIRED', 'non-owner blocked');
check(providerCalls === 0, 'non-owner makes no provider call');

const lockedEnv = { ...env, VERDEAI_PAID_PILOT_APPROVED: 'FALSE' };
const locked = await handlePilotRequest(makeRequest(), lockedEnv, { fetchImpl: fakeFetch, rateStore: new MemoryAtomicRateStore() });
const lockedBody = await locked.json();
check(locked.status === 423 && lockedBody.code === 'RUNTIME_CONFIG_REJECTED', 'paid approval remains an independent server gate');
check(providerCalls === 0, 'locked server makes no provider call');

const response = await handlePilotRequest(makeRequest(), env, { fetchImpl: fakeFetch, rateStore: new MemoryAtomicRateStore(), now: 1_786_000_000_000 });
const body = await response.json();
check(response.status === 200, 'mocked owner pilot succeeds');
check(providerCalls === 1, 'worker invokes provider exactly once');
check(body.state === 'OWNER_REVIEW_REQUIRED', 'worker requires owner review');
check(body.displayMode === 'side-by-side-with-original', 'worker specifies side-by-side display');
check(body.replaceOriginal === false && body.samePropertyConfirmed === false, 'worker never replaces or auto-confirms original');
check(body.requiresHumanSamePropertyReview === true, 'human same-property review required');
check(body.outputMimeType === 'image/jpeg' && body.outputByteCount === output.byteLength, 'worker returns one valid JPEG');
check(body.imageBase64 === bytesToBase64(output), 'worker returns expected temporary image');
const serialized = JSON.stringify(body);
check(!serialized.includes(apiKey), 'worker response contains no API key');
check(!serialized.includes(requestBody.propertySummary), 'worker response contains no property prompt context');
check(response.headers.get('cache-control') === 'no-store', 'worker response disables caching');
check(response.headers.get('access-control-allow-origin') === allowedOrigin, 'worker response limits CORS origin');

class FakeTxnStorage {
  constructor() { this.map = new Map(); }
  async transaction(callback) {
    return callback({
      get: async key => this.map.get(key),
      put: async (key, value) => { this.map.set(key, value); }
    });
  }
}
const storage = new FakeTxnStorage();
const durable = new VerdeAIPilotRateLimiter({ storage });
const reservePayload = { now: 1_786_000_000_000, dayBucket: 20671, ipHash: '1'.repeat(64), sessionHash: '2'.repeat(64),
  sessionLimit: 1, ipLimit24h: 2, sessionExpiresAt: 1_786_014_400_000, ipExpiresAt: 1_786_090_000_000 };
const reserve1 = await durable.fetch(new Request('https://internal/reserve', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(reservePayload) }));
check(reserve1.status === 200 && (await reserve1.json()).ok === true, 'Durable Object atomically reserves first session');
const reserve2 = await durable.fetch(new Request('https://internal/reserve', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(reservePayload) }));
const reserve2Body = await reserve2.json();
check(reserve2.status === 429 && reserve2Body.code === 'SESSION_LIMIT_REACHED', 'Durable Object blocks session replay');
const reserve3Payload = { ...reservePayload, sessionHash: '3'.repeat(64) };
const reserve3 = await durable.fetch(new Request('https://internal/reserve', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(reserve3Payload) }));
check(reserve3.status === 200, 'second distinct session for same IP accepted');
const reserve4Payload = { ...reservePayload, sessionHash: '4'.repeat(64) };
const reserve4 = await durable.fetch(new Request('https://internal/reserve', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(reserve4Payload) }));
check(reserve4.status === 429 && (await reserve4.json()).code === 'IP_DAILY_LIMIT_REACHED', 'Durable Object blocks third IP attempt');

console.log(`PASS ${checks}/${checks}: v10.7.0 Worker and atomic rate limiter reject untrusted traffic and allow one mocked private owner request without persistence.`);
