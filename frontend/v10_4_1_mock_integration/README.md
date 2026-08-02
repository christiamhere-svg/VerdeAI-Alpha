# VerdeAI v10.4.1 — Local Frontend-to-Mock Integration

This milestone connects the v10.3.2 own-photo result to a browser-only mock of the v10.4.0 one-image contract.

## User-visible behaviour

- One optional action appears for the current VerdeAI recommendation.
- The exact uploaded photo remains visible before, during, and after the mock flow.
- The flow demonstrates preparation, explicit consent, hard safe-lock, timeout, and fallback states.
- The successful local outcome is `SAFE_LOCKED`; no generated image is produced.

## Safety state

- Backend connected: no
- Provider calls: off
- Paid calls: locked
- Kill switch: on
- Network: forbidden
- API key: absent
- Cloudflare: untouched
- Automatic retries: zero
- Images requested: one
- VerdeAI image storage: none

The inline integration deliberately contains no `fetch`, XHR, WebSocket, EventSource, endpoint URL, API key, or browser persistence call.
