# VerdeAI v5.3 Workshop Build — Safe Render Proxy Scaffold

## Added

- Backend render proxy scaffold for future AI rendering.
- Provider adapter placeholders for Replicate / FLUX, OpenAI image generation, and Stability AI.
- Mock provider fallback that never makes paid calls.
- `GET /api/render/providers` provider status endpoint.
- `POST /api/render/estimate` cost/safety estimate endpoint.
- Expanded `POST /api/render` request/response shape.
- `api/render-contract.v5.3.json` contract file.
- `docs/RENDER_BACKEND_PROXY.md` safe backend plan.
- Expanded `.env.example` with server-side provider key placeholders.

## Preserved

- Upload, demo, shaded self-test, result board, Share page, More tools, tester page, plant overlay, report, export/share, save/load, history, Vision Board, AI Setup, render prompts, cost estimates, and mock render flow.

## Safety

- Real AI rendering remains disabled by default.
- No paid rendering calls are made.
- API keys are documented as server-side only.
- Concept boards remain the fallback.
