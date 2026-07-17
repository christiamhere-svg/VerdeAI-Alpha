# VerdeAI v9.2.1 — Browser and Testing Limitations

## Verified

- Automated Chromium tests at 360, 390, 412, 430, and 1440 pixel widths.
- Existing calibration completion, marker-5 persistence, save/recovery, one-render confirmation, mock result, timeout, provider-failure, and budget-lock flows.
- Genuine Android evidence for the live v9.2 predecessor flow.
- Static checks for cache-busted assets, one-render-only architecture, locked owner approvals, absent frontend secrets, and preserved core features.

## Not verified in this build

- Live deployment of v9.2.1.
- Physical Android testing of the new owner-activation panel and refined failure cards.
- iPhone/iPad Safari, desktop Safari, Firefox, or accessibility screen-reader hardware.
- A real provider request, real provider invoice, moderation response, generated-image quality, or actual latency.
- Deployed Cloudflare Worker / Durable Object behaviour under concurrent traffic.
- Provider Zero Data Retention eligibility for the eventual account.
- Exchange-rate, tax, or billing variations.

## Important constraint

The preview failure buttons simulate display states. They do not contact a provider, consume budget, prove network timeout cancellation, or validate provider billing behaviour.
