# VerdeAI v9.2 — Security and Privacy Checklist

## Locked defaults in the supplied build

- [x] Build identification is v9.2.
- [x] Frontend provider calls are off.
- [x] Real rendering is disabled.
- [x] Hard kill switch is on.
- [x] Test/mock mode is on.
- [x] Paid calls are locked.
- [x] Provider key is absent from frontend code and repository configuration.
- [x] Pilot spend cap defaults to zero.
- [x] Invited tester limit defaults to zero.
- [x] Free calibrated overlay remains fully functional.
- [x] There is no render-all-six route.

## Browser preparation

- [x] One property photograph only.
- [x] Long edge reduced to no more than 1536 pixels.
- [x] Canvas/JPEG re-encode strips ordinary EXIF/GPS metadata.
- [x] Prepared image limited to 2.5 MB.
- [x] Explicit selected future and calibration are attached.
- [x] Four required consent checkboxes.
- [x] US$0.15 planning/reservation ceiling shown before submission, with provider-billing caveat.
- [x] No automatic retry.

## Backend request validation

- [x] Exactly one output image required.
- [x] JPEG/PNG/WebP data URL validation.
- [x] Metadata-stripped flag required.
- [x] Byte limit enforced again server-side.
- [x] Session identifier required.
- [x] Calibration usable ground, access route and marker 5 required.
- [x] Maximum per-render cost enforced.
- [x] Owner-approved provider, host and retention variables required.
- [x] API key required only server-side.
- [x] CORS limited to the VerdeAI host and localhost development.

## Abuse and spend controls

- [x] One render per session scaffold.
- [x] Two renders per IP per day scaffold.
- [x] Unique invited-tester cap scaffold.
- [x] Atomic total-spend reservation in Cloudflare Durable Object scaffold.
- [x] Budget-lock response before provider call.
- [x] Default cap and tester limit are zero until owner approval.

## Failure handling

- [x] 120-second timeout state.
- [x] Provider-error state.
- [x] Budget-lock state.
- [x] Safe blocked state.
- [x] Free calibrated-overlay fallback in every failure response.
- [x] Result label: “AI Concept Render · Not Final Design”.

## Logging and retention

- [x] Worker scaffold does not write photos, prompts or generated images to storage.
- [x] Operational logging contains hashed session/IP, image byte count, future ID, status and timing state only.
- [x] Raw IP address is not logged by application code.
- [x] Property note and prompt are not logged by application code.
- [ ] Cloudflare account-level log settings must be reviewed before pilot activation.
- [ ] OpenAI project data-control settings must be reviewed before pilot activation.
- [ ] Public privacy wording must disclose provider processing and default provider retention before real calls are enabled.
- [ ] A deletion/contact process must be named before inviting testers.

## Activation sequence — only after owner approval

1. Deploy Worker with all approval variables still locked.
2. Test health, estimate, one-image rejection, oversize rejection, missing-consent rejection, session limit and budget lock.
3. Add `OPENAI_API_KEY` and `RATE_LIMIT_SALT` as encrypted Worker secrets.
4. Set approved provider, backend, budget, tester count and retention variables.
5. Keep test mode on; run mock contract tests.
6. Enable real-rendering flag while kill switch remains on; confirm request remains blocked.
7. Turn test mode off.
8. Turn kill switch off last for one owner-controlled image.
9. Review image quality, logs, actual provider usage, invoice/usage-dashboard cost and deletion behaviour.
10. Configure provider-account budget controls where available, then turn the kill switch back on before inviting testers if any evidence is unclear.
