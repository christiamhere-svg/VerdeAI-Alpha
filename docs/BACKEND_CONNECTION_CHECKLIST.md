# Backend Connection Checklist — VerdeAI v7.8

This guide prepares the first real-render backend connection without enabling paid rendering. The current build phrases the checklist as future setup actions, not completed setup.

## Future render flow
1. Frontend sends render request to the backend.
2. Backend checks provider settings, server-side API key, CORS, and request limits.
3. Backend estimates cost.
4. User confirms one render.
5. Backend calls the provider.
6. Frontend shows the image or keeps the concept-board fallback.

## Before connecting
Status: Not connected yet — this checklist is for later setup only.

- Choose backend host: Netlify Functions or Cloudflare Workers.
- Create Replicate account for the first FLUX test.
- Add API key server-side only.
- Test estimate endpoint.
- Mock-test render endpoint.
- Confirm cost limit before any paid call.

## Ready for real render test?
Only start real rendering after:
- Backend is deployed.
- API key is server-side.
- Estimate endpoint works.
- Cost limit is confirmed.
- One-image render is approved.

## Safety rules
- Never put API keys in frontend files.
- Keep GitHub Pages as the frontend unless there is a reason to move it.
- Render one image first.
- Keep all-six rendering locked until the first result is reviewed.
