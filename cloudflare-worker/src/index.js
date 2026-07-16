const VERSION = "9.2";
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
const bool = (value, fallback = false) => value === undefined ? fallback : String(value).toLowerCase() === "true";
const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const fallbackResult = (future = "Selected future") => ({ type: "mock-fallback", label: "AI Concept Render · Not Final Design", selectedFuture: future, imageDataUrl: null, note: "Use the free calibrated overlay. No paid provider image was completed." });

async function sha256(value, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${value || "unknown"}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((v) => v.toString(16).padStart(2, "0")).join("").slice(0, 24);
}
function imageBytes(dataUrl = "") { const base64 = String(dataUrl).split(",")[1] || ""; return Math.ceil(base64.length * 0.75); }
function dataUrlBlob(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!match) throw new Error("Prepared image must be JPEG, PNG, or WebP.");
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: match[1] });
}
function originAllowed(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = env.ALLOWED_ORIGIN || "https://verdeai-alpha.pages.dev";
  return !origin || origin === allowed || origin.startsWith("http://localhost:");
}
function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  return origin ? { "access-control-allow-origin": origin, "access-control-allow-headers": "content-type", "access-control-allow-methods": "GET,POST,OPTIONS", vary: "Origin" } : {};
}
function validate(body, env) {
  const provider = body.provider || "mock";
  const count = Number(body.count ?? 1);
  const maxCostUsd = Number(body.maxCostUsd ?? 0);
  const imageSize = Number(body.imageBytes || imageBytes(body.imageDataUrl));
  const maximum = number(env.MAX_COST_PER_RENDER_USD, 0.15);
  const expected = 0.08;
  const confirmations = body.confirmRender === true && body.confirmPrivacy === true && body.confirmImageUse === true && body.confirmConceptOnly === true && body.confirmCost === true;
  const calibration = body.calibration || {};
  let reason = "none";
  if (count !== 1) reason = "one-image-only";
  else if (provider !== "openai-gpt-image-2") reason = provider === "mock" ? "mock-provider" : "provider-not-approved";
  else if (!bool(env.REAL_RENDERING_ENABLED, false)) reason = "real-rendering-disabled";
  else if (bool(env.RENDER_KILL_SWITCH, true)) reason = "hard-kill-switch-on";
  else if (bool(env.RENDER_TEST_MODE, true)) reason = "test-mode-on";
  else if (env.APPROVED_PROVIDER !== "openai-gpt-image-2") reason = "provider-not-owner-approved";
  else if (env.APPROVED_BACKEND !== "cloudflare-worker") reason = "backend-not-owner-approved";
  else if (env.RETENTION_POLICY !== "no-store") reason = "retention-policy-not-owner-approved";
  else if (!env.OPENAI_API_KEY) reason = "provider-key-missing";
  else if (!body.sessionId) reason = "session-id-required";
  else if (!confirmations) reason = "confirmation-required";
  else if (maxCostUsd < expected || maxCostUsd > maximum) reason = "cost-confirmation-invalid";
  else if (!body.metadataStripped || imageSize <= 0 || imageSize > number(env.MAX_IMAGE_BYTES, 2621440)) reason = "image-validation-failed";
  else if (!Array.isArray(calibration.usableGround) || !Array.isArray(calibration.protectedAccessRoute) || !calibration.marker5) reason = "calibration-required";
  return { provider, count, maxCostUsd, estimatedCostUsd: expected, imageBytes: imageSize, reason, allowed: reason === "none" };
}

async function reserve(env, requestData) {
  const id = env.PILOT_GUARD.idFromName("verdeai-v9-2-global-pilot");
  const stub = env.PILOT_GUARD.get(id);
  const response = await stub.fetch("https://guard.internal/reserve", { method: "POST", body: JSON.stringify(requestData) });
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
  const response = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: form, signal });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`provider-${response.status}`);
  const result = data?.data?.[0];
  if (!result?.b64_json && !result?.url) throw new Error("provider-empty-image");
  return { type: "provider-image", imageDataUrl: result.b64_json ? `data:image/jpeg;base64,${result.b64_json}` : null, imageUrl: result.url || null };
}

export default {
  async fetch(request, env) {
    if (!originAllowed(request, env)) return json({ ok: false, version: VERSION, message: "Origin not allowed" }, 403);
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    if (url.pathname === "/api/health") return json({ ok: true, version: VERSION, service: "VerdeAI secure-pilot Worker", realRenderingEnabled: bool(env.REAL_RENDERING_ENABLED, false), killSwitchOn: bool(env.RENDER_KILL_SWITCH, true), testModeOn: bool(env.RENDER_TEST_MODE, true), retentionPolicy: env.RETENTION_POLICY || "not-approved" }, 200, cors);
    if (url.pathname === "/api/render/providers") return json({ ok: true, version: VERSION, oneImageOnly: true, providers: [{ id: "mock", enabled: true, paid: false }, { id: "openai-gpt-image-2", enabled: bool(env.REAL_RENDERING_ENABLED, false) && !bool(env.RENDER_KILL_SWITCH, true) && !bool(env.RENDER_TEST_MODE, true) && Boolean(env.OPENAI_API_KEY), paid: true }] }, 200, cors);
    if (request.method !== "POST" || !["/api/render/estimate", "/api/render"].includes(url.pathname)) return json({ ok: false, version: VERSION, message: "Not found" }, 404, cors);
    const body = await request.json().catch(() => ({}));
    const checked = validate(body, env);
    if (url.pathname === "/api/render/estimate") return json({ ok: true, version: VERSION, requestedCount: checked.count, estimatedCostUsd: checked.estimatedCostUsd, maximumCostUsd: number(env.MAX_COST_PER_RENDER_USD, 0.15), allowed: checked.allowed, blockReason: checked.reason }, 200, cors);
    if (!checked.allowed) return json({ ok: false, version: VERSION, mode: checked.reason.includes("budget") ? "budget-lock" : "safe-render-blocked", blockReason: checked.reason, safeFallback: fallbackResult(body.selectedFuture) }, checked.reason === "mock-provider" ? 200 : 423, cors);

    const salt = env.RATE_LIMIT_SALT || "replace-before-production";
    const ipHash = await sha256(request.headers.get("cf-connecting-ip") || "unknown", salt);
    const sessionHash = await sha256(String(body.sessionId || ""), salt);
    const reservation = await reserve(env, { ipHash, sessionHash, maxCostUsd: checked.maxCostUsd, capUsd: number(env.PILOT_SPEND_CAP_USD, 0), testerLimit: number(env.INVITED_TESTER_LIMIT, 0), perSessionLimit: number(env.PER_SESSION_LIMIT, 1), perIpDailyLimit: number(env.PER_IP_DAILY_LIMIT, 2) });
    if (!reservation.ok) return json({ ok: false, version: VERSION, mode: "budget-lock", blockReason: reservation.reason, safeFallback: fallbackResult(body.selectedFuture) }, 402, cors);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), number(env.RENDER_TIMEOUT_MS, 120000));
    console.log(JSON.stringify({ event: "render-started", version: VERSION, sessionHash, ipHash, imageBytes: checked.imageBytes, futureId: body.futureId, reservedUsd: checked.maxCostUsd }));
    try {
      const result = await callOpenAI(body, env, controller.signal);
      console.log(JSON.stringify({ event: "render-completed", version: VERSION, sessionHash, ipHash, futureId: body.futureId }));
      return json({ ok: true, version: VERSION, mode: "provider-render", label: "AI Concept Render · Not Final Design", estimatedCostUsd: checked.estimatedCostUsd, result }, 200, cors);
    } catch (error) {
      const mode = error?.name === "AbortError" ? "timeout" : "provider-error";
      console.log(JSON.stringify({ event: "render-failed", version: VERSION, mode, sessionHash, ipHash, futureId: body.futureId }));
      return json({ ok: false, version: VERSION, mode, message: mode === "timeout" ? "Render timed out safely." : "Provider did not return a usable concept.", safeFallback: fallbackResult(body.selectedFuture) }, mode === "timeout" ? 504 : 502, cors);
    } finally { clearTimeout(timer); }
  }
};

export class PilotGuard {
  constructor(state) { this.state = state; }
  async fetch(request) {
    if (new URL(request.url).pathname !== "/reserve") return json({ ok: false, reason: "not-found" }, 404);
    const input = await request.json();
    const day = new Date().toISOString().slice(0, 10);
    return this.state.storage.transaction(async (tx) => {
      const totalReserved = Number(await tx.get("totalReserved") || 0);
      const testers = new Set(await tx.get("testers") || []);
      const sessionCount = Number(await tx.get(`session:${input.sessionHash}`) || 0);
      const ipCount = Number(await tx.get(`ip:${day}:${input.ipHash}`) || 0);
      if (input.capUsd <= 0) return json({ ok: false, reason: "pilot-spend-cap-not-approved" }, 402);
      if (input.testerLimit <= 0) return json({ ok: false, reason: "tester-limit-not-approved" }, 402);
      if (sessionCount >= input.perSessionLimit) return json({ ok: false, reason: "session-render-limit" }, 429);
      if (ipCount >= input.perIpDailyLimit) return json({ ok: false, reason: "ip-daily-render-limit" }, 429);
      if (!testers.has(input.sessionHash) && testers.size >= input.testerLimit) return json({ ok: false, reason: "invited-tester-limit" }, 429);
      if (totalReserved + input.maxCostUsd > input.capUsd) return json({ ok: false, reason: "pilot-budget-lock" }, 402);
      testers.add(input.sessionHash);
      await tx.put("testers", [...testers]);
      await tx.put(`session:${input.sessionHash}`, sessionCount + 1);
      await tx.put(`ip:${day}:${input.ipHash}`, ipCount + 1);
      await tx.put("totalReserved", Number((totalReserved + input.maxCostUsd).toFixed(2)));
      return json({ ok: true, reservedUsd: input.maxCostUsd, totalReservedUsd: Number((totalReserved + input.maxCostUsd).toFixed(2)) });
    });
  }
}
