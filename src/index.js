const VERSION = "9.2.2";
const PROVIDER = "openai-gpt-image-2";
const BACKEND = "cloudflare-worker";
const RETENTION = "no-store";
const ESTIMATED_COST_USD = 0.08;

const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store, max-age=0",
    "x-content-type-options": "nosniff",
    ...headers
  }
});
const bool = (value, fallback = false) => value === undefined ? fallback : String(value).toLowerCase() === "true";
const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const fallbackResult = (future = "Selected future") => ({
  type: "free-overlay-fallback",
  label: "AI Concept Render · Not Final Design",
  selectedFuture: future,
  imageDataUrl: null,
  note: "Continue with the free calibrated overlay. No provider image was completed."
});

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(value || "")));
  return [...new Uint8Array(digest)].map((v) => v.toString(16).padStart(2, "0")).join("");
}
async function privateHash(value, salt) {
  return (await sha256Hex(`${salt}:${value || "unknown"}`)).slice(0, 24);
}
function parseInviteHashes(env) {
  return String(env.PILOT_INVITE_CODE_HASHES || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => /^[a-f0-9]{64}$/.test(item));
}
function imageBytes(dataUrl = "") {
  const base64 = String(dataUrl).split(",")[1] || "";
  return Math.ceil(base64.length * 0.75);
}
function dataUrlBlob(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("prepared-image-format-invalid");
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: match[1] });
}
function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || "https://verdeai-alpha.pages.dev")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
function originAllowed(request, env) {
  const origin = request.headers.get("origin") || "";
  if (!origin) return true;
  return allowedOrigins(env).includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
}
function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  if (!origin) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-max-age": "600",
    vary: "Origin"
  };
}
function health(env) {
  return {
    ok: true,
    version: VERSION,
    service: "VerdeAI owner-approved one-render Worker",
    realRenderingEnabled: bool(env.REAL_RENDERING_ENABLED, false),
    killSwitchOn: bool(env.RENDER_KILL_SWITCH, true),
    testModeOn: bool(env.RENDER_TEST_MODE, true),
    providerKeyPresent: Boolean(env.OPENAI_API_KEY),
    inviteCodesConfigured: parseInviteHashes(env).length > 0,
    retentionPolicy: env.RETENTION_POLICY || "not-approved",
    approvedProvider: env.APPROVED_PROVIDER || "not-approved",
    approvedBackend: env.APPROVED_BACKEND || "not-approved",
    pilotSpendCapUsd: number(env.PILOT_SPEND_CAP_USD, 0),
    invitedTesterLimit: number(env.INVITED_TESTER_LIMIT, 0),
    perSessionLimit: number(env.PER_SESSION_LIMIT, 1),
    perIpDailyLimit: number(env.PER_IP_DAILY_LIMIT, 2),
    maxCostPerRenderUsd: number(env.MAX_COST_PER_RENDER_USD, 0.15),
    oneImageOnly: true,
    serverImageStorage: false
  };
}
function validationStatus(reason) {
  if (["invalid-invite-code", "invite-code-used", "session-render-limit", "ip-daily-render-limit", "invited-tester-limit"].includes(reason)) return 429;
  if (["pilot-budget-lock", "pilot-spend-cap-not-approved", "tester-limit-not-approved"].includes(reason)) return 402;
  if (["one-image-only", "worker-version-mismatch", "provider-not-approved", "confirmation-required", "cost-confirmation-invalid", "image-validation-failed", "calibration-required", "prompt-invalid", "session-id-required", "access-code-required"].includes(reason)) return 400;
  return 423;
}
async function validate(body, env) {
  const provider = body.provider || "";
  const count = Number(body.count ?? 1);
  const maxCostUsd = Number(body.maxCostUsd ?? 0);
  const size = Number(body.imageBytes || imageBytes(body.imageDataUrl));
  const maximum = number(env.MAX_COST_PER_RENDER_USD, 0.15);
  const confirmations = body.confirmRender === true && body.confirmPrivacy === true && body.confirmImageUse === true && body.confirmConceptOnly === true && body.confirmCost === true;
  const calibration = body.calibration || {};
  const prompt = String(body.prompt || "");
  const inviteHashes = parseInviteHashes(env);
  const accessCode = String(body.accessCode || "").trim();
  const inviteHash = accessCode ? await sha256Hex(accessCode) : "";
  let reason = "none";
  if (count !== 1) reason = "one-image-only";
  else if (body.buildVersion !== VERSION) reason = "worker-version-mismatch";
  else if (provider !== PROVIDER) reason = "provider-not-approved";
  else if (!bool(env.REAL_RENDERING_ENABLED, false)) reason = "real-rendering-disabled";
  else if (bool(env.RENDER_KILL_SWITCH, true)) reason = "hard-kill-switch-on";
  else if (bool(env.RENDER_TEST_MODE, true)) reason = "test-mode-on";
  else if (env.APPROVED_PROVIDER !== PROVIDER) reason = "provider-not-owner-approved";
  else if (env.APPROVED_BACKEND !== BACKEND) reason = "backend-not-owner-approved";
  else if (env.RETENTION_POLICY !== RETENTION) reason = "retention-policy-not-owner-approved";
  else if (!env.OPENAI_API_KEY) reason = "provider-key-missing";
  else if (!env.RATE_LIMIT_SALT || String(env.RATE_LIMIT_SALT).length < 16) reason = "rate-limit-secret-missing";
  else if (!body.sessionId) reason = "session-id-required";
  else if (!accessCode) reason = "access-code-required";
  else if (!inviteHashes.length || !inviteHashes.includes(inviteHash)) reason = "invalid-invite-code";
  else if (!confirmations) reason = "confirmation-required";
  else if (maxCostUsd < ESTIMATED_COST_USD || maxCostUsd > maximum || maximum !== 0.15) reason = "cost-confirmation-invalid";
  else if (!body.metadataStripped || size <= 0 || size > number(env.MAX_IMAGE_BYTES, 2621440)) reason = "image-validation-failed";
  else if (!Array.isArray(calibration.usableGround) || !Array.isArray(calibration.keepClearAreas || calibration.keepClear) || !Array.isArray(calibration.protectedAccessRoute) || !calibration.marker5) reason = "calibration-required";
  else if (prompt.length < 20 || prompt.length > 12000) reason = "prompt-invalid";
  return {
    provider,
    count,
    maxCostUsd,
    estimatedCostUsd: ESTIMATED_COST_USD,
    imageBytes: size,
    inviteHash,
    reason,
    allowed: reason === "none"
  };
}
async function reserve(env, requestData) {
  const id = env.PILOT_GUARD.idFromName("verdeai-v9-2-2-global-pilot");
  const stub = env.PILOT_GUARD.get(id);
  const response = await stub.fetch("https://guard.internal/reserve", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(requestData)
  });
  return response.json();
}
async function callOpenAI(body, env, signal) {
  const form = new FormData();
  form.append("model", "gpt-image-2");
  form.append("image", dataUrlBlob(body.imageDataUrl), "verdeai-property.jpg");
  form.append("prompt", String(body.prompt || "").slice(0, 12000));
  form.append("n", "1");
  form.append("quality", "medium");
  form.append("size", "1536x1024");
  form.append("output_format", "jpeg");
  form.append("output_compression", "82");
  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: form,
    signal
  });
  const providerRequestId = response.headers.get("x-request-id") || "";
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`provider-${response.status}`);
  const result = data?.data?.[0];
  if (!result?.b64_json && !result?.url) throw new Error("provider-empty-image");
  return {
    type: "provider-image",
    imageDataUrl: result.b64_json ? `data:image/jpeg;base64,${result.b64_json}` : null,
    imageUrl: result.url || null,
    providerRequestId
  };
}

export default {
  async fetch(request, env) {
    if (!originAllowed(request, env)) return json({ ok: false, version: VERSION, message: "Origin not allowed" }, 403);
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    if (url.pathname === "/api/health" && request.method === "GET") return json(health(env), 200, cors);
    if (url.pathname === "/api/render/providers" && request.method === "GET") {
      const h = health(env);
      return json({
        ok: true,
        version: VERSION,
        oneImageOnly: true,
        providers: [{ id: PROVIDER, enabled: h.realRenderingEnabled && !h.killSwitchOn && !h.testModeOn && h.providerKeyPresent && h.inviteCodesConfigured, paid: true }]
      }, 200, cors);
    }
    if (request.method !== "POST" || !["/api/render/estimate", "/api/render"].includes(url.pathname)) return json({ ok: false, version: VERSION, message: "Not found" }, 404, cors);

    const body = await request.json().catch(() => ({}));
    const checked = await validate(body, env);
    if (url.pathname === "/api/render/estimate") {
      return json({
        ok: true,
        version: VERSION,
        requestedCount: checked.count,
        estimatedCostUsd: checked.estimatedCostUsd,
        maximumCostUsd: number(env.MAX_COST_PER_RENDER_USD, 0.15),
        allowed: checked.allowed,
        blockReason: checked.reason
      }, 200, cors);
    }
    if (!checked.allowed) {
      return json({
        ok: false,
        version: VERSION,
        mode: checked.reason.includes("budget") || checked.reason.includes("limit") || checked.reason.includes("invite") ? "budget-lock" : "safe-render-blocked",
        blockReason: checked.reason,
        safeFallback: fallbackResult(body.selectedFuture)
      }, validationStatus(checked.reason), cors);
    }

    const salt = env.RATE_LIMIT_SALT;
    const ipHash = await privateHash(request.headers.get("cf-connecting-ip") || "unknown", salt);
    const sessionHash = await privateHash(String(body.sessionId || ""), salt);
    const reservation = await reserve(env, {
      ipHash,
      sessionHash,
      inviteHash: checked.inviteHash,
      maxCostUsd: checked.maxCostUsd,
      capUsd: number(env.PILOT_SPEND_CAP_USD, 0),
      testerLimit: number(env.INVITED_TESTER_LIMIT, 0),
      perSessionLimit: number(env.PER_SESSION_LIMIT, 1),
      perIpDailyLimit: number(env.PER_IP_DAILY_LIMIT, 2)
    });
    if (!reservation.ok) {
      return json({
        ok: false,
        version: VERSION,
        mode: "budget-lock",
        blockReason: reservation.reason,
        safeFallback: fallbackResult(body.selectedFuture)
      }, validationStatus(reservation.reason), cors);
    }

    const requestId = crypto.randomUUID();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), number(env.RENDER_TIMEOUT_MS, 120000));
    console.log(JSON.stringify({ event: "render-started", version: VERSION, requestId, sessionHash, ipHash, imageBytes: checked.imageBytes, futureId: body.futureId, reservedUsd: checked.maxCostUsd }));
    try {
      const result = await callOpenAI(body, env, controller.signal);
      console.log(JSON.stringify({ event: "render-completed", version: VERSION, requestId, sessionHash, ipHash, futureId: body.futureId, providerRequestId: result.providerRequestId || undefined }));
      return json({
        ok: true,
        version: VERSION,
        mode: "provider-render",
        requestId,
        label: "AI Concept Render · Not Final Design",
        estimatedCostUsd: checked.estimatedCostUsd,
        reservedCostUsd: checked.maxCostUsd,
        retentionPolicy: RETENTION,
        result
      }, 200, cors);
    } catch (error) {
      const mode = error?.name === "AbortError" ? "timeout" : "provider-error";
      console.log(JSON.stringify({ event: "render-failed", version: VERSION, requestId, mode, sessionHash, ipHash, futureId: body.futureId }));
      return json({
        ok: false,
        version: VERSION,
        mode,
        message: mode === "timeout" ? "Render timed out safely." : "Provider did not return a usable concept.",
        reservationRetained: true,
        safeFallback: fallbackResult(body.selectedFuture)
      }, mode === "timeout" ? 504 : 502, cors);
    } finally {
      clearTimeout(timer);
    }
  }
};

export class PilotGuard {
  constructor(state) { this.state = state; }
  async fetch(request) {
    if (request.method !== "POST" || new URL(request.url).pathname !== "/reserve") return json({ ok: false, reason: "not-found" }, 404);
    const input = await request.json().catch(() => ({}));
    const day = new Date().toISOString().slice(0, 10);
    return this.state.storage.transaction(async (tx) => {
      const totalReserved = Number(await tx.get("totalReserved") || 0);
      const testers = new Set(await tx.get("testers") || []);
      const sessionCount = Number(await tx.get(`session:${input.sessionHash}`) || 0);
      const ipCount = Number(await tx.get(`ip:${day}:${input.ipHash}`) || 0);
      const inviteUsed = Boolean(await tx.get(`invite:${input.inviteHash}`));
      if (input.capUsd !== 5) return json({ ok: false, reason: "pilot-spend-cap-not-approved" }, 402);
      if (input.testerLimit !== 10) return json({ ok: false, reason: "tester-limit-not-approved" }, 402);
      if (input.maxCostUsd !== 0.15) return json({ ok: false, reason: "cost-confirmation-invalid" }, 400);
      if (inviteUsed) return json({ ok: false, reason: "invite-code-used" }, 429);
      if (sessionCount >= input.perSessionLimit) return json({ ok: false, reason: "session-render-limit" }, 429);
      if (ipCount >= input.perIpDailyLimit) return json({ ok: false, reason: "ip-daily-render-limit" }, 429);
      if (!testers.has(input.inviteHash) && testers.size >= input.testerLimit) return json({ ok: false, reason: "invited-tester-limit" }, 429);
      if (totalReserved + input.maxCostUsd > input.capUsd) return json({ ok: false, reason: "pilot-budget-lock" }, 402);
      testers.add(input.inviteHash);
      await tx.put("testers", [...testers]);
      await tx.put(`invite:${input.inviteHash}`, { usedAt: new Date().toISOString() });
      await tx.put(`session:${input.sessionHash}`, sessionCount + 1);
      await tx.put(`ip:${day}:${input.ipHash}`, ipCount + 1);
      await tx.put("totalReserved", Number((totalReserved + input.maxCostUsd).toFixed(2)));
      return json({ ok: true, reservedUsd: input.maxCostUsd, totalReservedUsd: Number((totalReserved + input.maxCostUsd).toFixed(2)) });
    });
  }
}
