# VerdeAI AI Render Interface — v6.2

## Current mode
Free concept boards and mock render simulation. No paid provider is connected.

## Planned provider options
- Replicate / FLUX
- OpenAI image generation
- Stability AI

## Safe first path
1. Choose one provider.
2. Configure a backend/proxy with server-side API key storage.
3. Render one future first.
4. Show estimated cost before rendering.
5. Keep concept-board fallback.
6. Require confirmation before rendering all six futures.

## Endpoint contract
- GET /api/render/providers
- POST /api/render/estimate
- POST /api/render

Never place provider API keys in frontend code.
