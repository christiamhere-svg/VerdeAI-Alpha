# VerdeAI v3.5 Workshop Build

VerdeAI is a static-site public beta for exploring what a property could become from one photo, a few human clues, and a practical first move.

## v3.5 focus

v3.5 improves the public-facing Property Futures Dashboard so the six possible futures feel more premium, polished, and visually distinct before real AI rendering is connected.

## What is included

- Futures Dashboard as the main public tester experience.
- Your Property Today panel.
- Six possible future cards.
- VerdeAI recommendation panel.
- Property Compass.
- 5-year evolution strip.
- Tester Page.
- Plant overlay preview.
- Upload, demo mode, self-test, report, export, save/load, history, and Vision Board.
- AI Render Setup scaffold with provider selection, prompt builder, and cost estimate placeholders.

## AI rendering status

Real AI-rendered transformed images are **not connected yet**. v3.5 keeps rendering optional and safe. Render buttons still use mock/scaffold behaviour until a backend provider connection is added.

## Local testing

```bash
npm test
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This is a static site. It can be deployed to GitHub Pages, Netlify, or any static host.

## Next likely build

v3.6 should continue visual polish or begin the safe backend proxy path for one real AI rendering provider, depending on whether cost/API setup is ready.
