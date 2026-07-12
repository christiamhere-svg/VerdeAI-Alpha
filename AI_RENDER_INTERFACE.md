# VerdeAI AI Render Interface — v7.0

Real AI rendering remains disabled by default. v7.0 adds a recommended setup package for the first safe render path.

## Recommended first path

- Frontend: GitHub Pages can remain active.
- Backend: one small proxy, such as Netlify Functions or Cloudflare Workers.
- Provider: Replicate / FLUX first.
- First render: one future only.
- Cost: estimate before render.
- Fallback: keep concept boards if rendering fails.

## Server-side only

API keys must stay in backend environment variables. Do not place provider keys in frontend code, GitHub Pages, or public JavaScript.
