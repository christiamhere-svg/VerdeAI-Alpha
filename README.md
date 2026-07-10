# VerdeAI v3.3 Workshop Build

A static, low-cost VerdeAI public beta build focused on a polished **Property Futures Dashboard**.

## v3.3 focus

v3.3 makes the dashboard-style public tester experience the main screen:

- Your Property Today photo panel
- Six Possible Futures cards
- VerdeAI Recommendation panel
- Property Compass visual scorecard
- One clear Next Step
- 5-year Property Movie strip
- Optional AI Render Setup kept secondary and off by default

## What still works

Preserved from earlier builds:

- Photo upload
- Demo mode
- Shaded garden self-test
- Plant overlay preview
- Starter clue auto-analysis
- Reports
- Vision Board
- Save / Load
- Autosave session recovery
- Export tools
- Share Code
- AI render prompt scaffold
- Cost-aware mock render flow

## AI rendering status

Real paid image rendering is **not connected yet**. v3.3 keeps the setup, prompt builder, provider selector, and estimated cost flow from v3.2, but the public dashboard now treats those controls as optional and secondary.

Future versions should connect rendering through a backend proxy so API keys are not exposed in browser code.

## Run locally

```bash
npm test
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This remains a static-site friendly project. Copy the contents into the existing GitHub repository, commit, push, and GitHub Pages will deploy.
