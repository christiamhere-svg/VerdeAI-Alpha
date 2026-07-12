# VerdeAI v7.1 — When I am ready to connect real rendering

Real AI rendering remains disabled by default. This guide explains the safe setup order for the first paid image test.

## Recommended first path

1. Keep GitHub Pages as the public frontend.
2. Choose Netlify Functions or Cloudflare Workers for one small render proxy.
3. Create a Replicate account and use Replicate / FLUX as the first test provider.
4. Store the provider API key only in backend environment variables.
5. Test `/api/render/estimate` before unlocking `/api/render`.
6. Render one future image only after explicit cost confirmation.

## What will cost money

- Real provider image generation.
- Possibly backend hosting if free limits are exceeded.
- Repeated renders, especially all-six future sets.

## What stays free

- The current GitHub Pages frontend.
- Concept boards, mock render previews, reports, sharing, saved projects, and prompt preview.

## Do not do this

Do not put API keys in frontend files, GitHub Pages, public GitHub files, screenshots, or copied prompts. Provider keys belong only in backend environment variables.
