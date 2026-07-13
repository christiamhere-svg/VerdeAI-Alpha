# Backend Host Decision Guide — VerdeAI v7.6

Recommended first path: keep GitHub Pages as the public frontend and add one small backend/proxy later.

## First recommendation

Use **Netlify Functions** first if setup convenience matters most. Use **Cloudflare Workers** if you want a separate lightweight proxy while keeping GitHub Pages untouched.

## Rules

- No API keys in frontend files.
- Render one future first.
- Show cost before rendering.
- Keep concept-board fallback.
- Keep all providers disabled until the backend is configured.
