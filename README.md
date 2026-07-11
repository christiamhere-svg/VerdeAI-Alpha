# VerdeAI v5.7 Workshop Build

VerdeAI v5.7 keeps the public beta result board and share flow intact while making AI Render Setup clearer for normal users.

## What changed
- AI Setup now opens with simple status: real rendering is not connected, cost risk is locked, API keys are server-side only, and current mode is free concept boards.
- Technical `/api/render` contract details are still included, but moved into Developer details.
- Provider explanations make it clearer that Replicate / FLUX, OpenAI image generation, and Stability AI are planned options that need backend keys.

## Safety
No paid AI rendering is connected. No API keys are included. Concept boards remain the default and fallback.


## v5.7 note
This build adds a safe one-future render simulation and stronger property-specific prompt generation. Real AI rendering remains disabled by default. API keys must remain server-side only.
