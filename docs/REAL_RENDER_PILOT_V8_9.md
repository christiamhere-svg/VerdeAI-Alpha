# VerdeAI v8.9 — Small Secure Real-Rendering Pilot Plan

## Decision
Ready to prepare a controlled pilot; not ready to enable public automatic paid rendering.

## Smallest safe scope
- 10–20 invited testers.
- One confirmed concept render per tester.
- No render-all-six option.
- USD $5–$10 total hard cap.
- 8 MB maximum input after browser resizing.
- 45-second server timeout.
- Three requests per IP/session per hour, two per session during the pilot.
- Server-side key only.
- Hard kill switch and test mode must be deliberately changed by the operator.
- No input/output retention in VerdeAI storage; verify provider retention terms separately.

## Provider options
### Replicate / FLUX
- Simple per-output pricing and fast provider experimentation.
- Official pricing page currently lists FLUX Dev around USD $0.025 per output and FLUX 1.1 Pro around USD $0.04 per output.
- Good lowest-cost pilot candidate.
- Risks: model/version changes, photo-edit fidelity varies, provider processing/privacy terms must be checked.

### OpenAI image generation
- Strong instruction following and image editing options.
- Token-priced rather than a fixed per-image number. Budget roughly USD $0.05–$0.20 for one edited concept image until measured with the exact chosen model, size and quality.
- Risks: variable cost, latency, policy filtering, output may alter architecture or property details.

### Stability AI
- Keep as an interchangeable adapter option, not the first pilot default until current pricing, editing quality and retention terms are re-verified.

## Required request contract
A real-provider request must include:
- one future only;
- a session ID;
- explicit render confirmation;
- explicit privacy confirmation;
- explicit cost confirmation;
- maximum authorised USD cost;
- measured input bytes;
- calibrated property constraints and a prompt that says which structures must remain unchanged.

## Main risks
- The render may invent or remove building details.
- The result may look convincing while being structurally or horticulturally unrealistic.
- User photos leave the browser and are processed by a provider.
- Provider retention and training policies can change.
- Costs can drift with model, resolution or repeated attempts.
- Latency and failures can damage tester trust.

## Mitigations
- Label every result Concept Render, not final design.
- Keep the calibrated overlay as the free fallback and reference map.
- Show the cost estimate before confirmation.
- Allow only one attempt in the first pilot.
- Never store provider keys or raw provider responses in frontend code.
- Resize inputs and remove metadata where possible.
- Log only non-sensitive request metadata.
- Keep an immediate operator kill switch.
