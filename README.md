# VerdeAI v6.0 Workshop Build

VerdeAI v6.0 improves the safe AI render rehearsal flow. The app still does not make paid AI image calls. It now shows a clearer mock render preview with readable chips and a collapsible full prompt.

## What changed
- Better mock render preview.
- Shorter visible prompt summary.
- Full prompt hidden under details.
- Clear “No paid render was made” safety message.
- Real provider setup remains planned but disabled.

## Test path
1. Open the app.
2. Run shaded self-test.
3. Open AI Setup.
4. Choose a future.
5. Confirm mock render.
6. Confirm $0.00 mock cost and concept-board fallback.

## Safety
API keys must stay server-side. Real rendering requires a backend proxy and explicit cost confirmation.
