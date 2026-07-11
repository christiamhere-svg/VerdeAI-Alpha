# VerdeAI v5.3 — Safe AI Render Proxy Scaffold

VerdeAI is a static-first public beta that creates property futures boards from photos and human clues. v5.3 prepares the backend shape needed for future real AI rendering while keeping all paid providers disabled by default.

## What changed in v5.3

- Safe backend `/api/render` scaffold.
- Provider placeholders for Replicate / FLUX, OpenAI image generation, and Stability AI.
- Cost estimate endpoint and provider status endpoint.
- Mock render fallback for free testing.
- Environment variable examples for server-side keys only.

## Safety rule

Do not put real API keys in frontend code. Use the backend proxy only.

# VerdeAI v5.3 Workshop Build

VerdeAI helps testers upload a property photo or run a built-in shaded garden self-test, then creates a clear Property Futures Board with six possible futures, a recommendation, first move, Share page, and optional AI rendering setup.

## v5.3 focus
This is a mobile navigation bug-fix release. It fixes the issue where **Open AI Setup** and **More tools** could appear not to respond on mobile.

## Included
- Public result board
- Upload / demo / shaded self-test
- Share-ready tester handoff
- Save/load and autosave
- Vision Board and report exports
- AI Setup roadmap
- Render readiness checklist
- Prompt preview cards
- Mock render flow

## AI rendering status
Real AI rendering is **not connected yet**. Paid provider calls are disabled by default. A backend proxy is required before Replicate / FLUX, OpenAI image generation, or Stability AI can be connected safely.

## Live test target
Open the site on mobile, tap **AI Setup** or **Open AI Setup**, and confirm the app visibly jumps to the render roadmap.
