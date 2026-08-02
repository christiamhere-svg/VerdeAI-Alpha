export const V1070_DURABLE_RATE_BUILD = 'v10.7.0';

function response(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export class VerdeAIPilotRateLimiter {
  constructor(state) { this.state = state; }

  async fetch(request) {
    if (request.method !== 'POST') return response({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405);
    let body;
    try { body = await request.json(); } catch { return response({ ok: false, code: 'INVALID_JSON' }, 400); }
    const validHash = value => /^[a-f0-9]{64}$/.test(String(value || ''));
    if (!validHash(body?.ipHash) || !validHash(body?.sessionHash)) return response({ ok: false, code: 'HASH_REQUIRED' }, 400);
    const now = Number(body.now);
    const sessionLimit = Number(body.sessionLimit);
    const ipLimit = Number(body.ipLimit24h);
    if (!Number.isFinite(now) || sessionLimit !== 1 || ipLimit !== 2) return response({ ok: false, code: 'LIMIT_CONTRACT_REJECTED' }, 400);

    const result = await this.state.storage.transaction(async txn => {
      const sessionKey = `session:${body.sessionHash}`;
      const ipKey = `ip:${body.dayBucket}:${body.ipHash}`;
      const [sessionRecord, ipRecord] = await Promise.all([txn.get(sessionKey), txn.get(ipKey)]);
      const sessionCount = sessionRecord?.expiresAt > now ? Number(sessionRecord.count || 0) : 0;
      const ipCount = ipRecord?.expiresAt > now ? Number(ipRecord.count || 0) : 0;
      if (sessionCount >= sessionLimit) return { ok: false, code: 'SESSION_LIMIT_REACHED' };
      if (ipCount >= ipLimit) return { ok: false, code: 'IP_DAILY_LIMIT_REACHED' };
      await txn.put(sessionKey, { count: sessionCount + 1, expiresAt: Number(body.sessionExpiresAt) });
      await txn.put(ipKey, { count: ipCount + 1, expiresAt: Number(body.ipExpiresAt) });
      return {
        ok: true,
        code: 'ATTEMPT_RESERVED',
        sessionRemaining: sessionLimit - sessionCount - 1,
        ipRemaining24h: ipLimit - ipCount - 1
      };
    });
    return response(result, result.ok ? 200 : 429);
  }
}

export function createDurableRateStore(binding) {
  if (!binding || typeof binding.idFromName !== 'function' || typeof binding.get !== 'function') return null;
  const stub = binding.get(binding.idFromName('verdeai-owner-pilot-v1'));
  return Object.freeze({
    async reserve(payload) {
      const responseValue = await stub.fetch('https://rate-limiter.internal/reserve', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let data;
      try { data = await responseValue.json(); } catch { data = null; }
      return data || { ok: false, code: 'RATE_LIMITER_INVALID_RESPONSE' };
    }
  });
}
