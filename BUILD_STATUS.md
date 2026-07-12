# VerdeAI v6.8 Workshop Build — Build Status

Status: Ready for GitHub commit / static deployment.

## Build focus
Backend host choice guidance for the first real AI rendering provider path.

## Completed
- Added “Which backend host should I use?” guide in AI Setup.
- Added recommended first path: keep GitHub Pages frontend, add one small backend/proxy.
- Compared Netlify Functions, Cloudflare Workers, Vercel, and small custom backend in plain English.
- Added recommended next setup step for server-side key + `/api/render/estimate` test.
- Preserved public beta tester flow and mock render flow.
- Paid rendering remains disabled by default.

## Safety
- No provider is connected.
- No API keys are included.
- No paid rendering calls are made.
- API keys must remain server-side only.

## Checks
- Frontend JavaScript syntax: passed.
- Backend JavaScript syntax: passed.
- JSON validation: passed.
- Smoke test: passed.
- ZIP integrity: passed.
