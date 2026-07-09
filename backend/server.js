import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "25mb" }));

const futures = [
  "Belonging Garden",
  "Low-Maintenance Haven",
  "Wildlife Haven",
  "Gathering Grove",
  "Productive Patch",
  "Maker Territory"
];

function pickFuture(preference = "balanced", propertyType = "needs-review", constraint = "unsure") {
  if (constraint === "shade-dark" || propertyType === "under-building") return "Low-Maintenance Haven";
  if (constraint === "storage-creep" || constraint === "access-awkward") return "Maker Territory";
  if (constraint === "maintenance-drag" || ["minimal", "low-maintenance"].includes(preference)) return "Low-Maintenance Haven";
  if (constraint === "privacy-gap") return "Belonging Garden";
  if (constraint === "unused" || preference === "outdoor-living") return "Gathering Grove";
  if (constraint === "water-risk" || preference === "wildlife") return "Wildlife Haven";
  if (preference === "food") return "Productive Patch";
  if (preference === "maker" || propertyType === "workshop") return "Maker Territory";
  return "Belonging Garden";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "VerdeAI v2.8 Mock Backend", mode: "mock", version: "2.8.0" });
});

app.post("/api/analyse", (req, res) => {
  const { propertyType = "needs-review", preference = "balanced", postcode = "", note = "", constraint = "unsure", starterCue = "" } = req.body || {};
  const selectedFuture = pickFuture(preference, propertyType, constraint);
  res.json({
    ok: true,
    mode: "mock-analysis",
    version: "2.8.0",
    propertyDNA: {
      identity: propertyType === "front-yard" ? 82 : 68,
      flow: propertyType === "side-yard" || constraint === "access-awkward" ? 86 : propertyType === "under-building" ? 76 : 64,
      privacy: constraint === "privacy-gap" || String(note).toLowerCase().includes("privacy") ? 88 : 58,
      habitat: preference === "wildlife" || constraint === "water-risk" ? 90 : 62,
      maintenance: constraint === "shade-dark" || constraint === "maintenance-drag" || ["minimal", "low-maintenance"].includes(preference) ? 88 : 66,
      utility: propertyType === "workshop" || propertyType === "under-building" || constraint === "storage-creep" ? 90 : 58
    },
    detected: [propertyType, preference, `problem:${constraint}`, starterCue ? `starter:${starterCue}` : "no-starter", postcode ? `postcode:${postcode}` : "no-postcode"],
    summary: `Mock analysis selected ${selectedFuture} for a ${propertyType} with ${preference} direction and ${constraint} problem. v2.8 treats the image as an overlay base and uses human clues until real vision is connected.`,
    selectedFuture,
    confidence: 88
  });
});

app.post("/api/futures", (req, res) => {
  const selectedFuture = pickFuture(req.body?.preference, req.body?.propertyType, req.body?.constraint);
  res.json({ ok: true, mode: "mock-future-composer", selectedFuture, futures });
});

app.post("/api/render", (req, res) => {
  res.json({
    ok: true,
    mode: "mock-render",
    futureId: req.body?.futureId || "belonging",
    message: "Real image generation is not connected. Frontend overlay engine uses the uploaded photo plus selected clues.",
    overlayLabels: req.body?.overlayLabels || ["primary zone", "supporting edge", "movement / view line", "first test area"]
  });
});

app.post("/api/report", (req, res) => {
  res.json({ ok: true, mode: "mock-report", report: req.body?.report || "No report supplied.", generatedAt: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`VerdeAI v2.8 mock backend running on http://localhost:${port}`);
});
