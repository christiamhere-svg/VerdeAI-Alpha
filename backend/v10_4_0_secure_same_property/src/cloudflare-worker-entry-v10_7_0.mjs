import { executeControlledPilot } from './controlled-pilot-orchestrator-v10_7_0.mjs';
import { createDurableRateStore } from './pilot-rate-durable-object-v10_7_0.mjs';
import { base64ToBytes, bytesToBase64, sha256Hex } from './runtime-codec-v10_7_0.mjs';
import {
  V1070_BUILD, V1070_ENDPOINT, V1070_IP_LIMIT_24H, V1070_MAX_EDGE,
  V1070_MAX_INPUT_BYTES, V1070_MAX_JSON_BODY_BYTES, V1070_MAX_OUTPUT_BYTES,
  V1070_MAX_REQUEST_COST_USD, V1070_MODEL, V1070_OUTPUT_COMPRESSION,
  V1070_OUTPUT_FORMAT, V1070_OUTPUT_QUALITY, V1070_OUTPUT_SIZE, V1070_SCOPE,
  V1070_SESSION_LIMIT, V1070_TOTAL_BUDGET_USD
} from './pilot-policy-v10_7_0.mjs';

export const V1070_WORKER_BUILD = 'v10.7.0';

function json(value, status = 200, origin = '') {
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };
  if (origin) { headers['access-control-allow-origin'] = origin; headers.vary = 'Origin'; }
  return new Response(JSON.stringify(value), { status, headers });
}
function runtimeConfig(env) {
  return {
    build: V1070_BUILD, scope: V1070_SCOPE, environment: 'server', provider: 'openai',
    model: V1070_MODEL, endpoint: V1070_ENDPOINT,
    pilotEnabled: env.VERDEAI_PILOT_ENABLED === 'TRUE', infrastructureBuildApproved: true,
    paidPilotApproved: env.VERDEAI_PAID_PILOT_APPROVED === 'TRUE', publicDeploymentApproved: false,
    ownerOnly: true, cloudflareAccessRequired: true, providerCredentialLocation: 'server-secret',
    providerCredentialPresent: /^sk-[A-Za-z0-9_-]{20,}$/.test(String(env.OPENAI_API_KEY || '')),
    killSwitch: env.VERDEAI_KILL_SWITCH !== 'OFF', networkAllowed: env.VERDEAI_NETWORK_ALLOWED === 'TRUE',
    maxImagesPerRequest: 1, maxOutputsPerRequest: 1, sessionLimit: V1070_SESSION_LIMIT,
    ipLimit24h: V1070_IP_LIMIT_24H, automaticRetries: 0, storeInputImages: false,
    storeOutputImages: false, storePrompts: false, maxInputBytes: V1070_MAX_INPUT_BYTES,
    maxOutputBytes: V1070_MAX_OUTPUT_BYTES, maxEdge: V1070_MAX_EDGE, outputSize: V1070_OUTPUT_SIZE,
    outputQuality: V1070_OUTPUT_QUALITY, outputFormat: V1070_OUTPUT_FORMAT,
    outputCompression: V1070_OUTPUT_COMPRESSION, moderation: 'auto',
    maxRequestCostUsd: V1070_MAX_REQUEST_COST_USD, totalBudgetUsd: V1070_TOTAL_BUDGET_USD,
    platformSpendLimitConfirmed: env.VERDEAI_PLATFORM_SPEND_LIMIT_CONFIRMED === 'TRUE',
    atomicRateLimiterAttached: !!env.PILOT_RATE_LIMITER, auditSinkMode: 'redacted-metadata-only'
  };
}

export async function handlePilotRequest(request, env, context = {}) {
  const allowedOrigin = String(env.VERDEAI_ALLOWED_ORIGIN || '');
  const origin = request.headers.get('origin') || '';
  if (!allowedOrigin || (origin && origin !== allowedOrigin)) return json({ build: V1070_BUILD, state: 'SAFE_LOCKED', code: 'ORIGIN_REJECTED' }, 403);
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'access-control-allow-origin': allowedOrigin, 'access-control-allow-methods': 'POST,OPTIONS',
      'access-control-allow-headers': 'content-type', 'access-control-max-age': '600', vary: 'Origin'
    } });
  }
  if (request.method !== 'POST') return json({ build: V1070_BUILD, state: 'SAFE_LOCKED', code: 'METHOD_NOT_ALLOWED' }, 405, allowedOrigin);
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return json({ build: V1070_BUILD, state: 'SAFE_LOCKED', code: 'JSON_REQUIRED' }, 415, allowedOrigin);
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > V1070_MAX_JSON_BODY_BYTES) return json({ build: V1070_BUILD, state: 'SAFE_LOCKED', code: 'REQUEST_TOO_LARGE' }, 413, allowedOrigin);

  const ownerEmail = (request.headers.get('cf-access-authenticated-user-email') || '').toLowerCase().trim();
  const subjectHash = await sha256Hex(ownerEmail);
  const ownerHash = String(env.VERDEAI_OWNER_EMAIL_SHA256 || '').toLowerCase();
  const identityEvidence = { verified: ownerHash.length === 64 && subjectHash === ownerHash, issuer: 'cloudflare-access', role: 'owner', subjectHash };

  let body;
  try { body = await request.json(); }
  catch { return json({ build: V1070_BUILD, state: 'SAFE_LOCKED', code: 'INVALID_JSON' }, 400, allowedOrigin); }

  const imageBytes = base64ToBytes(body?.imageBase64, 3_600_000);
  const ipAddress = request.headers.get('cf-connecting-ip') || '';
  const fetchImpl = context.fetchImpl || globalThis.fetch;
  const rateStore = context.rateStore || createDurableRateStore(env.PILOT_RATE_LIMITER);
  const result = await executeControlledPilot({
    runtimeConfig: runtimeConfig(env), identityEvidence, consentEvidence: body?.consentEvidence,
    envelope: body?.envelope, imageBytes, propertySummary: body?.propertySummary,
    preserveNote: body?.preserveNote, rateStore, ipAddress, sessionId: body?.sessionId,
    rateSalt: env.VERDEAI_RATE_SALT, apiKey: env.OPENAI_API_KEY, fetchImpl, now: context.now
  });

  if (result.state === 'OWNER_REVIEW_REQUIRED') {
    return json({
      build: result.build, state: result.state, code: result.code, displayMode: result.displayMode,
      replaceOriginal: false, samePropertyConfirmed: false, requiresHumanSamePropertyReview: true,
      outputMimeType: result.outputMimeType, outputByteCount: result.outputByteCount,
      imageBase64: bytesToBase64(result.outputBytes), providerRequestId: result.providerRequestId,
      usage: result.usage || null
    }, 200, allowedOrigin);
  }
  const status = result.providerCalled ? 502 : 423;
  return json({
    build: result.build, state: result.state, code: result.code, originalPreserved: true,
    providerCalled: result.providerCalled === true, providerRequestId: result.providerRequestId || null
  }, status, allowedOrigin);
}

export default { fetch: handlePilotRequest };
