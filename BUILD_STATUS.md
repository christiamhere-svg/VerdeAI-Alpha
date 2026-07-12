# VerdeAI v7.3 Workshop Build — Build Status

Status: safe backend connection checklist prepared.

## Added in v7.3
- Added a clearer Backend connection checklist inside AI Setup.
- Explained the future render request flow: frontend → backend → estimate → user confirmation → provider → image/fallback.
- Added a Before connecting checklist covering backend host, Replicate account, server-side key, estimate endpoint, mock render endpoint, and cost limit.
- Improved supporting notes for future Netlify/Cloudflare backend connection.

## Safety state
- Real rendering: disabled.
- Providers: disabled by default.
- API keys: not included and must remain server-side.
- Paid calls: locked; no paid rendering calls are made.

## Preserved
- Public beta tester flow, result board, Share page, More tools, AI Setup, tester page, plant overlay, report, export/share, save/load, history, Vision Board, backend proxy scaffold, Netlify placeholder files, render prompts, mock render flow, and cost estimates.

## Next likely step
- Choose the preferred backend host path and prepare the real estimate endpoint test plan without enabling paid rendering.
