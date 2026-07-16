# VerdeAI v9.1 — Secure one-image pilot decision

## Recommendation

**Not yet. Do not enable provider calls or paid rendering in v9.1.**

The free calibrated overlay is now clean enough to support a final deployment check. Before a property photo is sent to any third-party image provider, capture one live v9.1 Android screenshot after Done and one after a full page refresh.

## What is already prepared

- server-side-key architecture only;
- provider abstraction;
- mock mode;
- kill switch;
- test mode;
- one-image limit;
- privacy and cost confirmation concepts;
- timeout and fallback path;
- calibrated free-overlay fallback.

## Approval still required later

- rendering provider;
- backend host;
- total pilot budget;
- retention/deletion policy;
- explicit owner permission to disable test-only mode.

## Required gate before owner decisions

1. Deploy v9.1.
2. Confirm the finished concept has no editor geometry or legacy intake content.
3. Refresh the live phone page.
4. Confirm calibration persists and the editor remains closed.

Once those pass, VerdeAI can move to a new chat dedicated to the smallest secure one-image pilot.
