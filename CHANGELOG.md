# VerdeAI Changelog

## Build v9.2 — Owner Decision and Secure Pilot Preparation

### Added

- Owner decision brief based on current official OpenAI and Cloudflare documentation.
- Preferred pilot recommendation: OpenAI GPT Image 2 + Cloudflare Worker.
- Optional **Create one AI concept render** action on the result board and AI Setup screen.
- Required privacy, image-use, maximum-cost and concept-only confirmations.
- Browser-side image resize, JPEG re-encode, metadata stripping and 2.5 MB limit.
- Calibration-aware request builder using usable ground, keep-clear areas, access route, opportunity point and marker 5.
- Progress, timeout, provider-error, budget-lock and free-overlay fallback states.
- Result label: **AI Concept Render · Not Final Design**.
- Node secure-proxy contract scaffold and preferred Cloudflare Worker/Durable Object scaffold.
- Per-session, per-IP, tester-count and total-spend guardrails.
- Non-sensitive operational logging plan and no-VerdeAI-image-storage policy.
- Owner approval gate for provider, backend, budget, tester count and retention policy.

### Removed

- All render-all-six controls and request paths.
- Obsolete Replicate/Stability provider choices and placeholder pricing.
- Browser API-key input concept.

### Preserved

All verified v9.1.1 photo, demo, self-test, analysis, calibration, overlay, future selection, marker 5, reports, saved projects, recovery, history, export, Vision Board, Tester Page, Design Studio, Feedback Review, CSV and accessibility functionality.

### Safety state

Real rendering disabled; backend not connected; API key absent; provider calls off; paid calls locked; kill switch on; test mode on; spend cap zero; tester limit zero.
