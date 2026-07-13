# Real Render Ready Guide — VerdeAI v7.8

Use this later, only when one paid image test is worth it.

## Current status

- Real rendering: disabled
- Backend: not connected yet
- API key: not added
- Paid calls: locked

## Simple setup path

1. Keep GitHub Pages as the frontend.
2. Use a backend/proxy such as Netlify Functions or Cloudflare Workers.
3. Start with Replicate / FLUX as the first provider candidate.
4. Store the API key only in backend environment variables.
5. Test the estimate endpoint before unlocking rendering.
6. Render one image only, then review before all-six rendering.

## Do not do this

Do not put API keys in `index.html`, JavaScript, GitHub Pages, screenshots, or public GitHub files.
