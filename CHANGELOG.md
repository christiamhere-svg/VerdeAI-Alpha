# CHANGELOG

## Build v9.2.2 — Owner-Approved One-Render Activation

Date: 17 July 2026

### Owner approvals compiled

- OpenAI GPT Image 2 approved.
- Cloudflare Worker Paid approved.
- US$10 total planning budget approved.
- US$5 provider reservation cap approved.
- US$0.15 per-request reservation ceiling approved.
- Ten invited testers approved.
- One render per session and two per IP per 24 hours approved.
- No VerdeAI server image storage approved.

### Frontend

- Added live Worker health verification.
- Added invited pilot access-code field.
- Enabled exactly one real render request only after every server gate reports ready.
- Sends Build v9.2.2, one session ID, one selected future, calibration geometry and four explicit confirmations.
- Preserves browser resizing, JPEG re-encoding, metadata stripping and 2.5 MB prepared-image limit.
- Added real provider-result display labelled **AI Concept Render · Not Final Design**.
- Keeps provider result in the current browser tab only.
- Added discard-result control.
- Preserved timeout, provider-failure, budget/access-lock and free-overlay fallback states.
- Added local **Stop AI calls on this browser** control without pretending it changes the server kill switch.
- Owner-status button remains non-actionable; a browser click cannot activate the Worker.

### Cloudflare Worker

- Added OpenAI `/v1/images/edits` integration for GPT Image 2.
- Added required Worker-secret declarations for API key, rate-limit salt and invite-code hashes.
- Added ten-code invited-pilot gate using SHA-256 hashes only.
- Added Durable Object enforcement for one code use, one session render, two IP reservations per day, ten testers and US$5 total reservations.
- Added exact one-image and Build v9.2.2 validation.
- Added approved provider, backend, retention, cost and image-size checks.
- Added 120-second timeout and no automatic retry.
- Added non-sensitive operational logging only.
- Added production and emergency safe-lock Wrangler configurations.
- Added private invite-code generator.

### Preservation

All v9.2.1 functions remain, including upload, demo mode, shaded self-test, starter clues, scenario analysis, calibration, futures, reports, save/recovery, history, export, Vision Board, Tester Page, Design Studio, Feedback Review, CSV import/export, accessibility, privacy wording and free calibrated overlay.
