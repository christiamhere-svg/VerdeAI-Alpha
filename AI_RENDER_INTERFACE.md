# VerdeAI AI Render Interface — v5.9

## Current state

Real AI rendering is not connected. v5.9 adds the backend proxy scaffold, provider adapter placeholders, request/response contract, cost estimate endpoint, and environment variable examples.

## Provider adapters prepared

- `backend/render/adapters/mockProvider.js`
- `backend/render/adapters/replicateFlux.js`
- `backend/render/adapters/openaiImage.js`
- `backend/render/adapters/stabilityAI.js`

Paid adapters intentionally throw until a real backend key, implementation, and cost confirmation policy are added.

## Required production flow

1. User creates a Property Futures Board.
2. User chooses one future to render first.
3. App displays prompt preview and cost estimate.
4. User confirms the paid render and maximum cost.
5. Frontend calls VerdeAI backend `/api/render`.
6. Backend calls provider using a private server-side API key.
7. Backend returns image URL or fallback status.
8. Concept board remains available if render fails.

## Example backend request

```json
{
  "futureId": "belonging",
  "provider": "replicate-flux",
  "prompt": "Generated prompt from VerdeAI",
  "imageReference": "uploaded photo or stored image id",
  "confirmCost": true,
  "maxCostUsd": 0.10,
  "count": 1
}
```

## Rules

- Do not expose provider API keys in browser code.
- Render one future first.
- Render all six only after separate confirmation.
- Show estimated cost before rendering.
- Keep concept boards as fallback.
- Log provider, future, prompt version, and estimated spend for debugging.
- Disable paid rendering unless `VERDEAI_REAL_RENDERING_ENABLED=true`.
