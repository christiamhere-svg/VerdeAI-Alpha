# Backend Connection Checklist — VerdeAI v7.3

This guide prepares the first real-render backend connection without enabling paid rendering.

## Future render flow
1. Frontend sends render request to the backend.
2. Backend checks provider settings, server-side API key, CORS, and request limits.
3. Backend estimates cost.
4. User confirms one render.
5. Backend calls the provider.
6. Frontend shows the image or keeps the concept-board fallback.

## Before connecting
- Backend host chosen: Netlify Functions or Cloudflare Workers.
- Replicate account ready for the first FLUX test.
- API key stored server-side only.
- Estimate endpoint tested.
- Render endpoint tested in mock mode.
- Cost limit confirmed before any paid call.

## Safety rules
- Never put API keys in frontend files.
- Keep GitHub Pages as the frontend unless there is a reason to move it.
- Render one image first.
- Keep all-six rendering locked until the first result is reviewed.
