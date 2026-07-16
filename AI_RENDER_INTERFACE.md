# AI Render Interface — v9.1

Real AI rendering is disabled. The backend is not connected. API keys are not present in frontend code. Paid calls are locked.

v9.1 keeps the disconnected one-image pilot scaffold but changes the decision state to **Prepared · not approved**. No provider, backend host or budget is selected automatically.

The future pilot contract retains:

- server-side secrets only;
- hard kill switch;
- test mode;
- one-image limit;
- privacy, render and cost confirmations;
- input-size limits;
- session/IP rate-limit hooks;
- timeout handling;
- provider abstraction;
- mock/free-overlay fallback.

See `docs/REAL_RENDER_PILOT_V9_1.md`.
