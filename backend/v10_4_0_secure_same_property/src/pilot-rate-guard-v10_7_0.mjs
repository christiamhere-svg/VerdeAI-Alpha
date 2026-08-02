import { sha256Hex } from './runtime-codec-v10_7_0.mjs';
import { V1070_IP_LIMIT_24H, V1070_SESSION_LIMIT } from './pilot-policy-v10_7_0.mjs';

export const V1070_RATE_BUILD = 'v10.7.0';
const DAY_MS = 86_400_000;
const SESSION_MS = 14_400_000;

function freeze(value) { return Object.freeze(value); }
export function validateRateStore(store) { return !!store && typeof store.reserve === 'function'; }

export async function reservePilotAttempt({ store, ipAddress, sessionId, salt, now = Date.now() } = {}) {
  if (!validateRateStore(store)) return freeze({ ok: false, code: 'ATOMIC_RATE_LIMITER_REQUIRED' });
  if (!/^[^\s]{3,128}$/.test(String(ipAddress || ''))) return freeze({ ok: false, code: 'IP_REQUIRED' });
  if (!/^[a-zA-Z0-9._:-]{8,160}$/.test(String(sessionId || ''))) return freeze({ ok: false, code: 'SESSION_REQUIRED' });
  if (!/^[a-zA-Z0-9._:-]{16,200}$/.test(String(salt || ''))) return freeze({ ok: false, code: 'RATE_SALT_REQUIRED' });

  const ipHash = await sha256Hex(`${salt}|ip|${ipAddress}`);
  const sessionHash = await sha256Hex(`${salt}|session|${sessionId}`);
  const reservation = await store.reserve({
    now,
    dayBucket: Math.floor(now / DAY_MS),
    ipHash,
    sessionHash,
    sessionLimit: V1070_SESSION_LIMIT,
    ipLimit24h: V1070_IP_LIMIT_24H,
    sessionExpiresAt: now + SESSION_MS,
    ipExpiresAt: now + DAY_MS + 3_600_000
  });
  if (!reservation?.ok) return freeze({ ok: false, code: reservation?.code || 'RATE_LIMITER_REJECTED' });
  return freeze({
    ok: true,
    code: 'ATTEMPT_RESERVED',
    sessionRemaining: Number(reservation.sessionRemaining),
    ipRemaining24h: Number(reservation.ipRemaining24h),
    identifiersRedacted: true,
    inputStored: false,
    outputStored: false
  });
}
