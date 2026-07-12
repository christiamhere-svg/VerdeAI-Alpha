# VerdeAI Changelog

## v6.3 — Mobile provider comparison formatting fix

- Fixed the AI Setup “Choose first render provider” section on mobile.
- Converted provider comparison text into separate cards for Replicate / FLUX, OpenAI image generation, and Stability AI.
- Turned inline “planned” text into clear status chips.
- Improved wrapping, spacing, and heading sizing under sticky navigation.
- Preserved the safe v6.2 render-provider planning and backend/proxy messaging.
- Paid rendering remains disabled by default; no API keys are exposed.

# VerdeAI v6.3 Workshop Build

## Added
- Plain-English first render provider planning section.
- Provider comparison for Replicate / FLUX, OpenAI image generation, and Stability AI.
- Recommended safe first path: one provider, one future, cost shown first, concept-board fallback, confirmation before all six.
- Deployment notes explaining why GitHub Pages cannot safely hide API keys and why a backend/proxy is required.

## Preserved
- Public beta tester flow.
- Result board, Share page, AI Setup, mock render flow, render prompt builder, backend proxy scaffold.
- All paid rendering remains disabled by default.

## Safety
- No API keys included.
- No paid rendering calls made.
