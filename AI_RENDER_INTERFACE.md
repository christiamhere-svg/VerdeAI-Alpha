# VerdeAI AI Render Interface — v6.8

The AI render interface remains scaffolded and disabled by default. v6.8 adds backend host choice guidance before any paid provider is connected.

## Recommended first path
1. Keep GitHub Pages hosting the current VerdeAI frontend.
2. Add one small backend/proxy using Netlify Functions or Cloudflare Workers.
3. Store provider API keys only in backend environment variables.
4. Start with Replicate / FLUX as the first provider candidate.
5. Test `/api/render/estimate` first.
6. Render one future image only after cost confirmation.
7. Keep concept-board fallback if rendering fails.

## Providers
- Replicate / FLUX — planned first candidate.
- OpenAI image generation — planned later candidate.
- Stability AI — planned later candidate.

## Security
Never place provider API keys in frontend JavaScript, GitHub Pages, or checked-in files.
