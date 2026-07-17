import express from "express";
import cors from "cors";
import { handleRenderRequest, renderProvidersStatus, validateRenderRequest } from "./render/renderService.js";

const app = express();
const port = process.env.PORT || 8080;
const allowedOrigin = process.env.VERDEAI_ALLOWED_ORIGIN || "https://verdeai-alpha.pages.dev";
app.use(cors({ origin(origin, callback) { if (!origin || origin === allowedOrigin || /^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true); callback(new Error("Origin not allowed")); } }));
app.use(express.json({ limit: "5mb" }));

const meta = (req) => ({ ip: req.headers["cf-connecting-ip"] || req.ip || "unknown" });
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "VerdeAI v9.2.2 Owner Activation Scaffold", version: "9.2.2", realRenderingEnabled: process.env.VERDEAI_REAL_RENDERING_ENABLED === "true", testMode: process.env.VERDEAI_RENDER_TEST_MODE !== "false", killSwitchOn: process.env.VERDEAI_RENDER_KILL_SWITCH !== "false", retentionPolicy: process.env.VERDEAI_RETENTION_POLICY || "not-approved" }));
app.get("/api/render/providers", (_req, res) => res.json({ ok: true, version: "9.2.2", providers: renderProvidersStatus(), oneImageOnly: true }));
app.post("/api/render/estimate", (req, res) => { try { const r = validateRenderRequest(req.body || {}, meta(req)); res.json({ ok: true, version: "9.2.2", provider: r.provider, requestedCount: r.count, estimatedCostUsd: r.estimatedCostUsd, maximumCostUsd: 0.15, allowed: r.allowed, blockReason: r.blockReason }); } catch (error) { res.status(400).json({ ok: false, version: "9.2.2", message: error.message, safeFallback: "calibrated-overlay" }); } });
app.post("/api/render", async (req, res) => { try { const response = await handleRenderRequest(req.body || {}, meta(req)); const status = response.ok ? 200 : response.mode === "budget-lock" ? 402 : response.mode === "timeout" ? 504 : response.mode === "provider-error" ? 502 : 423; res.status(status).json({ ...response, version: "9.2.2" }); } catch (error) { const validationError = /exactly one rendered image|invalid|required|limit/i.test(String(error?.message || "")); res.status(validationError ? 400 : 500).json({ ok: false, version: "9.2.2", mode: validationError ? "request-validation-error" : "render-proxy-error", message: validationError ? String(error.message) : "The render request failed safely.", safeFallback: "calibrated-overlay" }); } });

// Existing mock analysis/report endpoints are retained for local development compatibility.
app.post("/api/analyse", (req, res) => res.json({ ok: true, mode: "mock-analysis", version: "9.2.2", received: { propertyType: req.body?.propertyType, preference: req.body?.preference }, note: "The production static app continues to run its existing browser analysis." }));
app.post("/api/futures", (_req, res) => res.json({ ok: true, mode: "mock-future-composer", version: "9.2.2" }));
app.post("/api/report", (req, res) => res.json({ ok: true, mode: "mock-report", version: "9.2.2", report: req.body?.report || "No report supplied.", generatedAt: new Date().toISOString() }));
app.listen(port, () => console.log(`VerdeAI v9.2.2 owner-activation pilot scaffold running on http://localhost:${port}`));
