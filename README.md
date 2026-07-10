# VerdeAI v3.2 Workshop Build

VerdeAI helps users upload a property photo, choose simple clues, compare possible futures, and get one practical next move.

## v3.2 focus

This build starts the AI rendering engine foundation without making paid image calls. Real rendering is optional, off by default, and clearly labelled as not connected yet.

## What works today

- Public tester page
- Plant overlay preview
- Photo upload / demo mode
- Shaded garden self-test
- Rule-based property analysis
- Six possible futures
- Reports and tester summaries
- Save/load and autosave
- Share code
- AI Render Setup scaffold
- Render prompt builder
- Mock render flow with cost estimates

## AI rendering status

Not connected yet. v3.2 prepares the UI, prompt generation, provider selection, and cost-aware flow. A future build can connect a backend proxy to providers such as Replicate/FLUX, OpenAI image generation, or Stability AI.

## Local testing

```bash
npm test
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This remains a static-site package. Upload the folder contents to GitHub Pages or Netlify as before.
