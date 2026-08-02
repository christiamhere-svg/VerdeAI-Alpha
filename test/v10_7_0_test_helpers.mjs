import { createLockedPilotConfig, V1070_SCOPE } from '../backend/v10_4_0_secure_same_property/src/pilot-policy-v10_7_0.mjs';

export function jpegBytes(size = 256) {
  const length = Math.max(100, size);
  const bytes = new Uint8Array(length);
  bytes[0] = 0xff; bytes[1] = 0xd8;
  for (let i = 2; i < length - 2; i += 1) bytes[i] = (i * 31) % 251;
  bytes[length - 2] = 0xff; bytes[length - 1] = 0xd9;
  return bytes;
}

export function validEnvelope(imageBytes = jpegBytes(), futureId = 'wildlife-haven') {
  return {
    contractBuild: 'v10.4.0', preparationBuild: 'v10.4.2', bridgeBuild: 'v10.4.3', mode: 'SAFE_LOCKED',
    selectedRecommendation: { count: 1, id: futureId },
    input: { imageCount: 1, image: {
      mimeType: 'image/jpeg', byteCount: imageBytes.byteLength, width: 1200, height: 900,
      metadataStripped: true, orientationPreservedByBrowserDecode: true,
      dataRef: 'single-browser-prepared-image'
    } },
    output: { count: 1, mimeType: 'image/jpeg', preserveSameProperty: true,
      automaticRetryCount: 0, selectedFutureId: futureId },
    consent: { requiredAtActivation: true, collected: false },
    policy: { backendConnected: false, providerCallsEnabled: false, paidCallsLocked: true,
      killSwitch: true, networkAllowed: false, imageCount: 1, outputCount: 1,
      automaticRetries: 0, storeInput: false, storeOutput: false }
  };
}

export function validConsent(futureId = 'wildlife-haven') {
  return { explicit: true, serverVerified: true, scope: V1070_SCOPE,
    temporaryProcessingOnly: true, storeInput: false, storeOutput: false,
    recommendationId: futureId };
}

export function validIdentity() {
  return { verified: true, issuer: 'cloudflare-access', role: 'owner', subjectHash: 'a'.repeat(64) };
}

export function liveConfig() {
  return Object.freeze({ ...createLockedPilotConfig(), pilotEnabled: true, paidPilotApproved: true,
    providerCredentialPresent: true, killSwitch: false, networkAllowed: true,
    platformSpendLimitConfirmed: true, atomicRateLimiterAttached: true });
}

export class MemoryAtomicRateStore {
  constructor() { this.sessions = new Map(); this.ips = new Map(); }
  async reserve(payload) {
    const now = Number(payload.now);
    const sessionRecord = this.sessions.get(payload.sessionHash);
    const ipKey = `${payload.dayBucket}:${payload.ipHash}`;
    const ipRecord = this.ips.get(ipKey);
    const sessionCount = sessionRecord?.expiresAt > now ? sessionRecord.count : 0;
    const ipCount = ipRecord?.expiresAt > now ? ipRecord.count : 0;
    if (sessionCount >= payload.sessionLimit) return { ok: false, code: 'SESSION_LIMIT_REACHED' };
    if (ipCount >= payload.ipLimit24h) return { ok: false, code: 'IP_DAILY_LIMIT_REACHED' };
    this.sessions.set(payload.sessionHash, { count: sessionCount + 1, expiresAt: payload.sessionExpiresAt });
    this.ips.set(ipKey, { count: ipCount + 1, expiresAt: payload.ipExpiresAt });
    return { ok: true, sessionRemaining: payload.sessionLimit - sessionCount - 1,
      ipRemaining24h: payload.ipLimit24h - ipCount - 1 };
  }
}

export function assert(condition, message) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}
