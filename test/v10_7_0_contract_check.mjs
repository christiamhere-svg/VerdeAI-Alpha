import { executeControlledPilot } from '../backend/v10_4_0_secure_same_property/src/controlled-pilot-orchestrator-v10_7_0.mjs';
import { invokeOpenAIImage2Edit } from '../backend/v10_4_0_secure_same_property/src/openai-image2-adapter-v10_7_0.mjs';
import { bytesToBase64 } from '../backend/v10_4_0_secure_same_property/src/runtime-codec-v10_7_0.mjs';
import { createLockedPilotConfig, V1070_ENDPOINT, V1070_MODEL } from '../backend/v10_4_0_secure_same_property/src/pilot-policy-v10_7_0.mjs';
import { assert, jpegBytes, validEnvelope, validConsent, validIdentity, liveConfig, MemoryAtomicRateStore } from './v10_7_0_test_helpers.mjs';

let checks = 0;
const check = (value, message) => { checks += 1; assert(value, message); };
const input = jpegBytes(512);
const output = jpegBytes(1024);
const apiKey = `sk-${'x'.repeat(32)}`;
const common = { runtimeConfig: liveConfig(), identityEvidence: validIdentity(), consentEvidence: validConsent(),
  envelope: validEnvelope(input), imageBytes: input, propertySummary: 'A wooded Australian garden path with mature trees.',
  preserveNote: 'Keep the path, mature trees, and access clear.', ipAddress: '203.0.113.20',
  sessionId: 'owner-session-0001', rateSalt: 'private-rate-salt-123456', apiKey, now: 1_786_000_000_000 };

let calls = 0;
const successFetch = async (url, options) => {
  calls += 1;
  check(url === V1070_ENDPOINT, 'provider endpoint exact');
  check(options.method === 'POST', 'provider method POST');
  check(options.headers.Authorization === `Bearer ${apiKey}`, 'server authorization supplied');
  check(options.body instanceof FormData, 'provider request is multipart');
  check(options.body.get('model') === V1070_MODEL, 'model snapshot exact');
  check(options.body.getAll('image[]').length === 1, 'exactly one input image');
  check(options.body.get('n') === '1', 'exactly one output requested');
  check(options.body.get('size') === '1536x1024', 'landscape output size');
  check(options.body.get('quality') === 'medium', 'medium quality');
  check(options.body.get('output_format') === 'jpeg', 'JPEG output');
  check(options.body.get('output_compression') === '82', 'JPEG compression set');
  check(options.body.get('moderation') === 'auto', 'moderation auto');
  check(options.body.get('input_fidelity') === null, 'input fidelity omitted for GPT Image 2');
  return new Response(JSON.stringify({ data: [{ b64_json: bytesToBase64(output) }], usage: { total_tokens: 400, input_tokens: 204, output_tokens: 196 } }), {
    status: 200, headers: { 'content-type': 'application/json', 'x-request-id': 'req_pilot_001' }
  });
};

const locked = await executeControlledPilot({ ...common, runtimeConfig: createLockedPilotConfig(), rateStore: new MemoryAtomicRateStore(), fetchImpl: successFetch });
check(locked.state === 'SAFE_LOCKED' && locked.code === 'RUNTIME_CONFIG_REJECTED', 'locked runtime blocks provider');
check(calls === 0, 'locked runtime makes zero calls');
const badIdentity = await executeControlledPilot({ ...common, identityEvidence: { verified: false }, rateStore: new MemoryAtomicRateStore(), fetchImpl: successFetch });
check(badIdentity.code === 'OWNER_IDENTITY_REQUIRED' && calls === 0, 'unverified identity blocks provider');
const badConsent = await executeControlledPilot({ ...common, consentEvidence: { explicit: false }, rateStore: new MemoryAtomicRateStore(), fetchImpl: successFetch });
check(badConsent.code === 'SERVER_VERIFIED_CONSENT_REQUIRED' && calls === 0, 'missing consent blocks provider');
const wrongImage = jpegBytes(513);
const mismatch = await executeControlledPilot({ ...common, imageBytes: wrongImage, rateStore: new MemoryAtomicRateStore(), fetchImpl: successFetch });
check(mismatch.code === 'IMAGE_ENVELOPE_MISMATCH' && calls === 0, 'image/envelope mismatch blocks provider');
const noRate = await executeControlledPilot({ ...common, rateStore: null, fetchImpl: successFetch });
check(noRate.code === 'ATOMIC_RATE_LIMITER_REQUIRED' && calls === 0, 'atomic limiter required');

const rateStore = new MemoryAtomicRateStore();
const success = await executeControlledPilot({ ...common, rateStore, fetchImpl: successFetch });
check(calls === 1, 'successful pilot invokes provider exactly once');
check(success.state === 'OWNER_REVIEW_REQUIRED', 'success requires owner review');
check(success.displayMode === 'side-by-side-with-original', 'output is side-by-side');
check(success.replaceOriginal === false && success.originalPreserved === true, 'original is never replaced');
check(success.samePropertyConfirmed === false && success.requiresHumanSamePropertyReview === true, 'same property is not auto-confirmed');
check(success.outputByteCount === output.byteLength, 'output byte count exact');
check(success.usage?.outputTokens === 196, 'redacted token usage retained');
check(!JSON.stringify({ ...success, outputBytes: undefined }).includes(apiKey), 'result contains no API key');
check(!JSON.stringify({ ...success, outputBytes: undefined }).includes('A wooded Australian'), 'result contains no prompt');

const replay = await executeControlledPilot({ ...common, rateStore, fetchImpl: successFetch });
check(replay.code === 'SESSION_LIMIT_REACHED' && calls === 1, 'same session cannot replay');

const ipStore = new MemoryAtomicRateStore();
let ipCalls = 0;
const ipFetch = async (...args) => { ipCalls += 1; return successFetch(...args); };
await executeControlledPilot({ ...common, sessionId: 'owner-session-1001', rateStore: ipStore, fetchImpl: ipFetch });
await executeControlledPilot({ ...common, sessionId: 'owner-session-1002', rateStore: ipStore, fetchImpl: ipFetch });
const third = await executeControlledPilot({ ...common, sessionId: 'owner-session-1003', rateStore: ipStore, fetchImpl: ipFetch });
check(ipCalls === 2, 'only two calls allowed per IP/day');
check(third.code === 'IP_DAILY_LIMIT_REACHED', 'third IP attempt blocked');

let throwCalls = 0;
const failure = await invokeOpenAIImage2Edit({ apiKey, imageBytes: input,
  prompt: 'Edit the supplied property photograph into one believable finished landscape concept for this exact same property. Preserve the original camera position, perspective, property boundaries, building geometry, major trees, paths, driveways, fences, terrain, and recognisable site structure. Do not invent written text. Keep access clear and use realistic Australian native planting. Return one image only.',
  fetchImpl: async () => { throwCalls += 1; throw new Error('offline'); } });
check(throwCalls === 1, 'provider failure has no retry');
check(failure.code === 'PROVIDER_NETWORK_FAILURE' && failure.automaticRetryAttempted === false, 'network failure returns safe no-retry state');

const multi = await invokeOpenAIImage2Edit({ apiKey, imageBytes: input,
  prompt: 'Edit the supplied property photograph into one believable finished landscape concept for this exact same property. Preserve the original camera position, perspective, property boundaries, building geometry, major trees, paths, driveways, fences, terrain, and recognisable site structure. Do not invent written text. Keep access clear and use realistic Australian native planting. Return one image only.',
  fetchImpl: async () => new Response(JSON.stringify({ data: [{ b64_json: bytesToBase64(output) }, { b64_json: bytesToBase64(output) }] }), { status: 200 }) });
check(multi.code === 'OUTPUT_COUNT_REJECTED', 'multiple provider outputs rejected');

const nonJpegBytes = new Uint8Array(200).fill(12);
const nonJpeg = await invokeOpenAIImage2Edit({ apiKey, imageBytes: input,
  prompt: 'Edit the supplied property photograph into one believable finished landscape concept for this exact same property. Preserve the original camera position, perspective, property boundaries, building geometry, major trees, paths, driveways, fences, terrain, and recognisable site structure. Do not invent written text. Keep access clear and use realistic Australian native planting. Return one image only.',
  fetchImpl: async () => new Response(JSON.stringify({ data: [{ b64_json: bytesToBase64(nonJpegBytes) }] }), { status: 200 }) });
check(nonJpeg.code === 'NON_JPEG_PROVIDER_OUTPUT', 'non-JPEG provider output rejected');

console.log(`PASS ${checks}/${checks}: v10.7.0 contract blocks all unsafe paths and permits only one mocked owner-only image edit for side-by-side human review.`);
