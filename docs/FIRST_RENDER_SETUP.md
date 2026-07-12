# VerdeAI First Render Setup Package

This document describes the first safe path to real AI image rendering.

## Recommended path

1. Keep GitHub Pages as the frontend.
2. Choose one backend host: Netlify Functions or Cloudflare Workers.
3. Create a Replicate account for the first FLUX test.
4. Add the Replicate API key as a server-side environment variable.
5. Deploy `/api/render/estimate`.
6. Deploy `/api/render`.
7. Test one future image only after cost confirmation.
8. Keep concept boards as the fallback.

## Safety rules

- Do not expose API keys in frontend code.
- Do not render all six futures until one image has been reviewed.
- Always show estimated cost before rendering.
- Keep paid rendering disabled by default.
