# VerdeAI v9.2.1 — Owner Activation Checklist

Real rendering remains impossible in this build. Each item below requires an explicit owner decision before a later owner-only activation deployment may be prepared.

## Required approvals

- [ ] **Rendering provider:** OpenAI GPT Image 2, one medium landscape image edit per confirmed request.
- [ ] **Backend host:** Cloudflare Worker Paid with a Durable Object for atomic tester, IP, session, request-count, and spend reservations.
- [ ] **Total pilot budget:** US$10 total planning budget, with US$5 reserved for provider usage and a US$0.15 per-request reservation ceiling.
- [ ] **Tester limit:** 10 invited testers, one render per session, two requests per IP per 24 hours.
- [ ] **Retention/deletion policy:** No VerdeAI server storage of input or output images; disclose provider processing and applicable provider retention controls.

## Technical activation requirements after approval

- Add the provider API key only as an encrypted backend secret.
- Set the approved spend cap and tester limit in backend environment configuration.
- Keep one-photo, one-selected-future, one-confirmed-render enforcement.
- Confirm timeout, input-size, metadata-stripping, consent, rate-limit, and atomic spend-reservation controls.
- Conduct one owner-only paid render before inviting any tester.
- Review actual invoice cost, latency, image quality, preservation failures, moderation behaviour, and logs.
- Release the hard kill switch only in the owner-only backend deployment, never from the browser.

## Current locked state

- Mock mode: on
- Kill switch: on
- Provider calls: off
- Paid calls: locked
- Frontend API key: absent
- Backend live connection: disabled
- Free calibrated overlay: fully available
