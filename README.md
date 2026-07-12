# VerdeAI v6.8 Workshop Build

VerdeAI v6.8 improves the AI Setup screen with a plain-English backend hosting guide for the first real AI rendering provider path.

## What changed
- Adds “Which backend host should I use?” inside AI Setup.
- Explains Netlify Functions, Cloudflare Workers, Vercel, and small backend options.
- Recommends a safe first setup path: keep GitHub Pages for the frontend and add one backend/proxy for real rendering.
- Keeps Replicate / FLUX as the recommended first provider path for one-image testing.
- Keeps all paid rendering disabled by default.

## Safety
No API keys are included. No paid rendering calls are made. Real image generation still requires a backend/proxy with server-side environment variables and explicit cost confirmation.
