import express from "express";
import cors from "cors";
import { handleRenderRequest, renderProvidersStatus, validateRenderRequest } from "./render/renderService.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "12mb" }));

const requestBuckets = new Map();
function renderRateLimit(req, res, next) {
  const key = `${req.ip || "unknown"}:${String(req.body?.sessionId || "no-session").slice(0, 80)}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const limit = Math.max(1, Number(process.env.VERDEAI_RENDER_REQUESTS_PER_HOUR || 3));
  const recent = (requestBuckets.get(key) || []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) return res.status(429).json({ ok: false, version: "9.1.1", mode: "rate-limited", message: "Render pilot limit reached. No paid call was started." });
  recent.push(now); requestBuckets.set(key, recent); next();
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("Render request timed out safely")), ms))]);
}

const futures = [
  "Belonging Garden",
  "Sanctuary Garden",
  "Gathering Space",
  "Productive Garden",
  "Maker / Workshop Yard",
  "Possibility Garden"
];

function pickFuture(preference = "balanced", propertyType = "needs-review", constraint = "unsure") {
  // Keep this disconnected mock scaffold aligned with the public v9.1 scenario rules.
  if (propertyType === "workshop" || constraint === "storage-creep" || (constraint === "access-awkward" && propertyType === "workshop")) return "Maker / Workshop Yard";
  if (propertyType === "under-building" || constraint === "shade-dark") return "Sanctuary Garden";
  if (propertyType === "overgrown" || constraint === "maintenance-drag") return "Possibility Garden";
  if (propertyType === "blank" || propertyType === "front-yard" || constraint === "too-open") return "Belonging Garden";
  if (constraint === "privacy-gap") return "Belonging Garden";
  if (constraint === "unused" || preference === "outdoor-living") return "Gathering Space";
  if (constraint === "water-risk" || preference === "wildlife") return "Possibility Garden";
  if (preference === "food") return "Productive Garden";
  if (preference === "maker") return "Maker / Workshop Yard";
  if (["minimal", "low-maintenance"].includes(preference)) return "Sanctuary Garden";
  return "Belonging Garden";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "VerdeAI v9.1.1 Mock Backend", mode: "safe-render-proxy-scaffold", version: "9.1.1", realRenderingEnabled: process.env.VERDEAI_REAL_RENDERING_ENABLED === "true" });
});

app.get("/api/render/providers", (_req, res) => {
  res.json({ ok: true, version: "9.1.1", providers: renderProvidersStatus(), warning: "Provider keys must stay server-side. Paid providers are disabled unless VERDEAI_REAL_RENDERING_ENABLED=true and cost is confirmed." });
});

app.post("/api/render/estimate", (req, res) => {
  const estimate = validateRenderRequest(req.body || {});
  res.json({ ok: true, version: "9.1.1", provider: estimate.provider, futureId: estimate.futureId, requestedCount: estimate.count, estimatedCostUsd: estimate.estimatedCostUsd, confirmationRequired: estimate.realProviderRequested, allowed: estimate.allowed, blockReason: estimate.blockReason });
});

app.post("/api/analyse", (req, res) => {
  const { propertyType = "needs-review", preference = "balanced", postcode = "", note = "", constraint = "unsure", starterCue = "" } = req.body || {};
  const selectedFuture = pickFuture(preference, propertyType, constraint);
  res.json({
    ok: true,
    mode: "mock-analysis",
    version: "9.1.1",
    propertyDNA: {
      identity: propertyType === "front-yard" ? 82 : 68,
      flow: propertyType === "side-yard" || constraint === "access-awkward" ? 86 : propertyType === "under-building" ? 76 : 64,
      privacy: constraint === "privacy-gap" || String(note).toLowerCase().includes("privacy") ? 88 : 58,
      habitat: preference === "wildlife" || constraint === "water-risk" ? 90 : 62,
      maintenance: constraint === "shade-dark" || constraint === "maintenance-drag" || ["minimal", "low-maintenance"].includes(preference) ? 88 : 66,
      utility: propertyType === "workshop" || propertyType === "under-building" || constraint === "storage-creep" ? 90 : 58
    },
    detected: [propertyType, preference, `problem:${constraint}`, starterCue ? `starter:${starterCue}` : "no-starter", postcode ? `postcode:${postcode}` : "no-postcode"],
    summary: `Mock analysis selected ${selectedFuture} for a ${propertyType} with ${preference} direction and ${constraint} problem. v9.1 treats the image as an overlay base and uses human clues until real vision is connected.`,
    selectedFuture,
    confidence: 88
  });
});

app.post("/api/futures", (req, res) => {
  const selectedFuture = pickFuture(req.body?.preference, req.body?.propertyType, req.body?.constraint);
  res.json({ ok: true, mode: "mock-future-composer", version: "9.1.1", selectedFuture, futures });
});

app.post("/api/render", renderRateLimit, async (req, res) => {
  try {
    const timeoutMs = Math.max(5000, Number(process.env.VERDEAI_RENDER_TIMEOUT_MS || 45000));
    const response = await withTimeout(handleRenderRequest(req.body || {}), timeoutMs);
    res.json({ ...response, version: "9.1.1" });
  } catch (error) {
    res.status(500).json({ ok: false, version: "9.1.1", mode: "render-proxy-error", message: error.message, safeFallback: "Use concept board result; no paid render was completed." });
  }
});

app.post("/api/report", (req, res) => {
  res.json({ ok: true, mode: "mock-report", version: "9.1.1", report: req.body?.report || "No report supplied.", generatedAt: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`VerdeAI v9.1.1 mock backend running on http://localhost:${port}`);
});
