# VerdeAI Build Status — v9.2

## Milestone

Owner-decision and secure-pilot preparation for one optional AI-generated concept image.

## Ready

- Deployment-ready static frontend package.
- Existing free calibrated overlay and v9.1.1 stability functionality retained.
- One-image confirmation UX implemented.
- Calibration-aware provider prompt implemented.
- Browser image preparation implemented.
- Mock progress/success, timeout, provider-error and budget-lock states implemented.
- Preferred Cloudflare Worker + Durable Object backend scaffold included.
- Local Node proxy scaffold included.
- Security/privacy checklist and decision brief included.

## Intentionally not active

- No real backend is connected to the frontend.
- No API key is present.
- No provider account has been approved or configured.
- No paid call can start with supplied defaults.
- Pilot spend cap and tester limit are zero.
- Kill switch remains on and test mode remains on.

## Owner approval required

1. OpenAI GPT Image 2 provider.
2. Cloudflare Worker Paid backend.
3. US$10 total budget / US$5 VerdeAI reservation cap / US$0.15 planning ceiling per request, with first-render billing verification.
4. 10 invited testers / one per session / two per IP per day.
5. No VerdeAI server storage, with provider processing and default retention disclosure accepted.

## Deployment note

Deploying the static ZIP updates the UI and mock preparation only. It does not deploy the included Worker or enable provider calls.
