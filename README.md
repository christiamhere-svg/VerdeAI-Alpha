# VerdeAI v5.0 Workshop Build

VerdeAI turns a property photo and a few human clues into a Property Futures Board: today's property, six possible futures, a recommended direction, a first move, and a clean result to share with early testers.

## v5.0 focus

v5.0 starts the safe path toward real AI-rendered future images without exposing API keys or making paid calls.

## What's included

- Public result board
- Share-ready tester handoff
- Photo upload / demo / shaded self-test
- Plant overlay preview
- Six futures dashboard
- Report, Share, Saved, History, Vision Board, More tools
- AI Render Roadmap
- Render readiness checklist
- Backend proxy contract preview
- Prompt preview cards for all six futures
- Mock render result flow
- Cost estimates before rendering

## Important safety note

Real AI rendering is not connected in this build. Provider API keys must not be placed in frontend code. A production version should use a backend proxy such as `/api/render`, where API keys live in server environment variables and every paid call requires confirmation.

## Local testing

```bash
npm test
python3 -m http.server 8000
```

Then open the local page, run the shaded garden self-test, open Share, and open AI Setup.
