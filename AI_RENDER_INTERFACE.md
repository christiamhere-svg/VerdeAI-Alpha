# VerdeAI AI Render Interface — v7.8

Real AI rendering remains disabled by default. v7.8 keeps the readiness guide and polishes the public beta experience before any real render connection is attempted.

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


## v7.8 Backend Connection Checklist

The app now includes a clear checklist for future backend connection: frontend request, backend provider checks, estimate, one-render confirmation, provider call, and image/fallback response. Paid rendering remains disabled and provider keys must stay server-side.

## v7.8 Backend Checklist Wording Polish

The backend checklist now reads as future setup actions:
- Choose backend host.
- Create Replicate account.
- Add server-side API key.
- Test estimate endpoint.
- Mock-test render endpoint.
- Confirm cost limit.

Status remains: not connected yet. Paid rendering remains disabled.

## v7.8 Production Copy Polish
- User-facing AI Setup copy now avoids build-version wording.
- Version numbers remain in CHANGELOG.md and BUILD_STATUS.md only.
- Real rendering remains disabled, backend unconnected, API key absent, and paid calls locked.
