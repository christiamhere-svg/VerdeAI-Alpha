# VerdeAI v7.3 Workshop Build

VerdeAI v7.3 adds the backend connection checklist for a future one-image real render test while keeping paid rendering disabled.

## What changed
- Added a clear Backend connection checklist in AI Setup.
- Explained the future real-render flow from frontend request through backend estimate, user confirmation, provider call, and fallback.
- Added a Before connecting checklist so real rendering is not attempted until the backend host, server-side API key, endpoints, and cost limit are ready.
- Preserved the public beta tester flow and mock render safety.

## Safety
- Real rendering remains disabled.
- Providers are disabled by default.
- API keys are not included.
- No paid AI calls are made.

## Deploy
Use the full ZIP contents to replace the current VerdeAI project, commit, and push to GitHub Pages.
