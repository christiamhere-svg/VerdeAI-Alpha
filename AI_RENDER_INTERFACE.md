# VerdeAI AI Render Interface — v7.2

Real AI rendering remains disabled by default. v7.2 adds a plain-English readiness guide so the first paid render can be planned safely later.

## Current safe mode

- Concept boards stay active.
- Mock render flow stays active.
- Backend proxy scaffold remains available.
- Providers remain disabled.
- No paid calls are made.

## Safe first render order

1. Keep GitHub Pages frontend.
2. Choose Netlify Functions or Cloudflare Workers.
3. Create Replicate account.
4. Add server-side API key as an environment variable.
5. Test estimate endpoint.
6. Render one image only after confirmation.


## v7.4 Backend Connection Checklist

The app now includes a clear checklist for future backend connection: frontend request, backend provider checks, estimate, one-render confirmation, provider call, and image/fallback response. Paid rendering remains disabled and provider keys must stay server-side.

## v7.4 Backend Checklist Wording Polish

The backend checklist now reads as future setup actions:
- Choose backend host.
- Create Replicate account.
- Add server-side API key.
- Test estimate endpoint.
- Mock-test render endpoint.
- Confirm cost limit.

Status remains: not connected yet. Paid rendering remains disabled.
