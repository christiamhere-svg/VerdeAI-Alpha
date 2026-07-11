import express from "express";
import cors from "cors";
import { handleRenderRequest, renderProvidersStatus, validateRenderRequest } from "./render/renderService.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "25mb" }));

const futures = [
  "Belonging Garden",
  "Sanctuary Garden",
  "Gathering Space",
  "Productive Garden",
  "Maker / Workshop Yard",
  "Possibility Garden"
];

function pickFuture(preference = "balanced", propertyType = "needs-review", constraint = "unsure") {
  if (constraint === "shade-dark" || propertyType === "under-building") return "Belonging Garden";
  if (constraint === "storage-creep" || constraint === "access-awkward") return "Maker / Workshop Yard";
  if (constraint === "maintenance-drag" || ["minimal", "low-maintenance"].includes(preference)) return "Sanctuary Garden";
  if (constraint === "privacy-gap") return "Belonging Garden";
  if (constraint === "unused" || preference === "outdoor-living") return "Gathering Space";
  if (constraint === "water-risk" || preference === "wildlife") return "Sanctuary Garden";
  if (preference === "food") return "Productive Garden";
  if (preference === "maker" || propertyType === "workshop") return "Maker / Workshop Yard";
  return "Belonging Garden";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "VerdeAI v5.3 Mock Backend", mode: "safe-render-proxy-scaffold", version: "5.3.0", realRenderingEnabled: process.env.VERDEAI_REAL_RENDERING_ENABLED === "true" });
});

app.get("/api/render/providers", (_req, res) => {
  res.json({ ok: true, version: "5.3.0", providers: renderProvidersStatus(), warning: "Provider keys must stay server-side. Paid providers are disabled unless VERDEAI_REAL_RENDERING_ENABLED=true and cost is confirmed." });
});

app.post("/api/render/estimate", (req, res) => {
  const estimate = validateRenderRequest(req.body || {});
  res.json({ ok: true, version: "5.3.0", provider: estimate.provider, futureId: estimate.futureId, requestedCount: estimate.count, estimatedCostUsd: estimate.estimatedCostUsd, confirmationRequired: estimate.realProviderRequested, allowed: estimate.allowed, blockReason: estimate.blockReason });
});

app.post("/api/analyse", (req, res) => {
  const { propertyType = "needs-review", preference = "balanced", postcode = "", note = "", constraint = "unsure", starterCue = "" } = req.body || {};
  const selectedFuture = pickFuture(preference, propertyType, constraint);
  res.json({
    ok: true,
    mode: "mock-analysis",
    version: "5.3.0",
    propertyDNA: {
      identity: propertyType === "front-yard" ? 82 : 68,
      flow: propertyType === "side-yard" || constraint === "access-awkward" ? 86 : propertyType === "under-building" ? 76 : 64,
      privacy: constraint === "privacy-gap" || String(note).toLowerCase().includes("privacy") ? 88 : 58,
      habitat: preference === "wildlife" || constraint === "water-risk" ? 90 : 62,
      maintenance: constraint === "shade-dark" || constraint === "maintenance-drag" || ["minimal", "low-maintenance"].includes(preference) ? 88 : 66,
      utility: propertyType === "workshop" || propertyType === "under-building" || constraint === "storage-creep" ? 90 : 58
    },
    detected: [propertyType, preference, `problem:${constraint}`, starterCue ? `starter:${starterCue}` : "no-starter", postcode ? `postcode:${postcode}` : "no-postcode"],
    summary: `Mock analysis selected ${selectedFuture} for a ${propertyType} with ${preference} direction and ${constraint} problem. v5.3 treats the image as an overlay base and uses human clues until real vision is connected.`,
    selectedFuture,
    confidence: 88
  });
});

app.post("/api/futures", (req, res) => {
  const selectedFuture = pickFuture(req.body?.preference, req.body?.propertyType, req.body?.constraint);
  res.json({ ok: true, mode: "mock-future-composer", version: "5.3.0", selectedFuture, futures });
});

app.post("/api/render", async (req, res) => {
  try {
    const response = await handleRenderRequest(req.body || {});
    res.json({ ...response, version: "5.3.0" });
  } catch (error) {
    res.status(500).json({ ok: false, version: "5.3.0", mode: "render-proxy-error", message: error.message, safeFallback: "Use concept board result; no paid render was completed." });
  }
});

app.post("/api/report", (req, res) => {
  res.json({ ok: true, mode: "mock-report", version: "5.3.0", report: req.body?.report || "No report supplied.", generatedAt: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`VerdeAI v5.3 mock backend running on http://localhost:${port}`);
});
