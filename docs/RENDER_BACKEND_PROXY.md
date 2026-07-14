# VerdeAI v8.6 Render Backend Proxy Plan

This document describes the next safe step toward real AI-rendered futures.

## Why a backend proxy is required

Browser code is public. Any API key placed in frontend JavaScript can be copied and abused. Real rendering must happen through a backend endpoint such as `/api/render`.

## Safe flow

1. User chooses one future.
2. VerdeAI shows prompt preview and estimated cost.
3. User confirms a max spend.
4. Frontend calls `/api/render` with no secret key.
5. Backend validates cost and provider status.
6. Backend calls Replicate / OpenAI / Stability using server-side keys.
7. Backend returns image URL or safe fallback.

## Current status

- Mock render endpoint exists.
- Provider adapters exist as placeholders.
- Environment variable names are documented.
- Paid providers are disabled by default.
- No real paid call is made in v8.6.

## Next real connection step

Implement one provider adapter first, preferably a low-cost single-image provider, and keep the first production button as “Render one future”.
