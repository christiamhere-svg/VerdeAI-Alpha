# VerdeAI AI Render Interface — v5.1

## Current state

Real AI rendering is not connected. v5.1 prepares the safe interface, prompt system, cost controls, and backend proxy contract.

## Required production flow

1. User creates a Property Futures Board.
2. User chooses one future to render first.
3. App displays prompt preview and cost estimate.
4. User confirms the paid render.
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
  "maxCostUsd": 0.10
}
```

## Rules

- Do not expose provider API keys in browser code.
- Render one future first.
- Render all six only after separate confirmation.
- Show estimated cost before rendering.
- Keep concept boards as fallback.
- Log provider, future, prompt version, and estimated spend for debugging.
