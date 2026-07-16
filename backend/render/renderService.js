import crypto from "node:crypto";
import { estimateRenderCost, providerLabel } from "./costs.js";
import { renderWithMock } from "./adapters/mockProvider.js";
import { renderWithOpenAIImage } from "./adapters/openaiImage.js";

const spentLedger = { reservedUsd: 0, sessions: new Set(), ipDaily: new Map() };
const truthy = (value) => String(value).toLowerCase() === "true";
const numberEnv = (name, fallback) => Number(process.env[name] ?? fallback);
const hash = (value) => crypto.createHash("sha256").update(`${process.env.VERDEAI_RATE_LIMIT_SALT || "local-dev"}:${value || "unknown"}`).digest("hex").slice(0, 20);

export function renderProvidersStatus() {
  const realEnabled = truthy(process.env.VERDEAI_REAL_RENDERING_ENABLED);
  const killSwitchOn = process.env.VERDEAI_RENDER_KILL_SWITCH !== "false";
  const testModeOn = process.env.VERDEAI_RENDER_TEST_MODE !== "false";
  return [
    { id: "mock", label: "Mock / calibrated-overlay fallback", enabled: true, paid: false, keyRequired: false },
    { id: "openai-gpt-image-2", label: "OpenAI GPT Image 2", enabled: realEnabled && !killSwitchOn && !testModeOn && Boolean(process.env.OPENAI_API_KEY), paid: true, keyRequired: true }
  ];
}

function imageByteLength(dataUrl = "") {
  const base64 = String(dataUrl).split(",")[1] || "";
  return Math.ceil(base64.length * 0.75);
}

export function validateRenderRequest(body = {}, requestMeta = {}) {
  const provider = body.provider || "mock";
  const count = Number(body.count ?? 1);
  const estimatedCostUsd = estimateRenderCost(provider, count);
  const maxCostUsd = Number(body.maxCostUsd ?? 0);
  const maxImageBytes = numberEnv("VERDEAI_RENDER_MAX_IMAGE_BYTES", 2_621_440);
  const imageBytes = Number(body.imageBytes || imageByteLength(body.imageDataUrl));
  const allowedMime = /^data:image\/(jpeg|png|webp);base64,/.test(String(body.imageDataUrl || ""));
  const sessionId = String(body.sessionId || "").slice(0, 120);
  const ipHash = hash(requestMeta.ip || "unknown");
  const sessionHash = hash(sessionId);
  const realProviderRequested = provider !== "mock";
  const realRenderingEnabled = truthy(process.env.VERDEAI_REAL_RENDERING_ENABLED);
  const killSwitchOn = process.env.VERDEAI_RENDER_KILL_SWITCH !== "false";
  const testModeOn = process.env.VERDEAI_RENDER_TEST_MODE !== "false";
  const confirmations = body.confirmRender === true && body.confirmPrivacy === true && body.confirmImageUse === true && body.confirmConceptOnly === true && body.confirmCost === true;
  const approvedProvider = process.env.VERDEAI_APPROVED_PROVIDER === "openai-gpt-image-2";
  const approvedHost = process.env.VERDEAI_APPROVED_BACKEND === "cloudflare-worker" || process.env.VERDEAI_APPROVED_BACKEND === "node-proxy";
  const approvedPolicy = process.env.VERDEAI_RETENTION_POLICY === "no-store";
  const imageAllowed = imageBytes > 0 && imageBytes <= maxImageBytes && allowedMime && body.metadataStripped === true;
  const calibrationPresent = Boolean(body.calibration?.usableGround && body.calibration?.protectedAccessRoute && body.calibration?.marker5);
  let blockReason = "none";
  if (count !== 1) blockReason = "one-image-only";
  else if (!realProviderRequested) blockReason = "mock-provider";
  else if (!realRenderingEnabled) blockReason = "real-rendering-disabled";
  else if (killSwitchOn) blockReason = "hard-kill-switch-on";
  else if (testModeOn) blockReason = "test-mode-on";
  else if (!approvedProvider) blockReason = "provider-not-owner-approved";
  else if (!approvedHost) blockReason = "backend-not-owner-approved";
  else if (!approvedPolicy) blockReason = "retention-policy-not-owner-approved";
  else if (!process.env.OPENAI_API_KEY) blockReason = "provider-key-missing";
  else if (!sessionId) blockReason = "session-id-required";
  else if (!confirmations) blockReason = "confirmation-required";
  else if (maxCostUsd < estimatedCostUsd || maxCostUsd > numberEnv("VERDEAI_MAX_COST_PER_RENDER_USD", 0.15)) blockReason = "cost-confirmation-invalid";
  else if (!imageAllowed) blockReason = "image-validation-failed";
  else if (!calibrationPresent) blockReason = "calibration-required";

  return {
    provider, count, futureId: body.futureId, selectedFuture: body.selectedFuture, recommendedFuture: body.recommendedFuture,
    propertySituation: body.propertySituation, calibration: body.calibration, firstMove: body.firstMove,
    prompt: String(body.prompt || "").slice(0, 12000), imageDataUrl: body.imageDataUrl,
    imageBytes, maxImageBytes, metadataStripped: body.metadataStripped === true,
    estimatedCostUsd, maxCostUsd, sessionHash, ipHash, blockReason,
    allowed: !realProviderRequested || blockReason === "none"
  };
}

function reservePilotBudget(request) {
  const cap = numberEnv("VERDEAI_PILOT_SPEND_CAP_USD", 0);
  const testerLimit = numberEnv("VERDEAI_INVITED_TESTER_LIMIT", 0);
  const perSession = numberEnv("VERDEAI_PER_SESSION_LIMIT", 1);
  const perIp = numberEnv("VERDEAI_PER_IP_DAILY_LIMIT", 2);
  const day = new Date().toISOString().slice(0, 10);
  const ipKey = `${day}:${request.ipHash}`;
  const ipCount = spentLedger.ipDaily.get(ipKey) || 0;
  if (cap <= 0) return { ok: false, reason: "pilot-spend-cap-not-approved" };
  if (testerLimit <= 0) return { ok: false, reason: "tester-limit-not-approved" };
  if (spentLedger.sessions.has(request.sessionHash) && perSession <= 1) return { ok: false, reason: "session-render-limit" };
  if (ipCount >= perIp) return { ok: false, reason: "ip-daily-render-limit" };
  if (!spentLedger.sessions.has(request.sessionHash) && spentLedger.sessions.size >= testerLimit) return { ok: false, reason: "invited-tester-limit" };
  if (spentLedger.reservedUsd + request.maxCostUsd > cap) return { ok: false, reason: "pilot-budget-lock" };
  spentLedger.sessions.add(request.sessionHash);
  spentLedger.ipDaily.set(ipKey, ipCount + 1);
  spentLedger.reservedUsd = Number((spentLedger.reservedUsd + request.maxCostUsd).toFixed(2));
  return { ok: true, reservedUsd: request.maxCostUsd, totalReservedUsd: spentLedger.reservedUsd };
}

function operationalLog(event, request, extra = {}) {
  console.info(JSON.stringify({ event, at: new Date().toISOString(), provider: request.provider, futureId: request.futureId, imageBytes: request.imageBytes, sessionHash: request.sessionHash, ipHash: request.ipHash, ...extra }));
}

export async function handleRenderRequest(body = {}, requestMeta = {}) {
  const request = validateRenderRequest(body, requestMeta);
  if (request.provider === "mock") return { ok: true, mode: "mock-render", result: await renderWithMock(request), estimatedCostUsd: 0 };
  if (!request.allowed) {
    operationalLog("render-blocked", request, { reason: request.blockReason });
    return { ok: false, mode: request.blockReason.includes("budget") ? "budget-lock" : "safe-render-blocked", blockReason: request.blockReason, estimatedCostUsd: request.estimatedCostUsd, safeFallback: await renderWithMock(request) };
  }
  const reservation = reservePilotBudget(request);
  if (!reservation.ok) {
    operationalLog("render-budget-blocked", request, { reason: reservation.reason });
    return { ok: false, mode: "budget-lock", blockReason: reservation.reason, safeFallback: await renderWithMock(request) };
  }
  const controller = new AbortController();
  const timeoutMs = numberEnv("VERDEAI_RENDER_TIMEOUT_MS", 120_000);
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  operationalLog("render-started", request, { reservedUsd: reservation.reservedUsd });
  try {
    const result = await renderWithOpenAIImage(request, { signal: controller.signal });
    operationalLog("render-completed", request, { durationLimitMs: timeoutMs });
    return { ok: true, mode: "provider-render", provider: request.provider, providerLabel: providerLabel(request.provider), label: "AI Concept Render · Not Final Design", estimatedCostUsd: request.estimatedCostUsd, result };
  } catch (error) {
    const mode = error?.name === "AbortError" ? "timeout" : "provider-error";
    operationalLog("render-failed", request, { mode });
    return { ok: false, mode, message: mode === "timeout" ? "Render timed out safely." : "The image provider did not return a usable concept.", safeFallback: await renderWithMock(request) };
  } finally { clearTimeout(timer); }
}
