# VerdeAI v3.7 — Public Beta Dashboard Polish

VerdeAI helps people upload a property photo, discover possible futures for a place, and choose one practical first move.

This build focuses on making the Futures Dashboard feel more polished and understandable on mobile.

## What is included

- Futures Dashboard as the main public beta screen.
- Professional concept-board future cards.
- Stronger uploaded-photo visual anchor.
- Six distinct future options:
  - Belonging Garden
  - Sanctuary Garden
  - Gathering Space
  - Productive Garden
  - Maker / Workshop Yard
  - Possibility Garden
- Future-specific tags and design-intent notes.
- VerdeAI recommendation panel.
- Property Compass.
- 5-year evolution strip.
- Tester Page and plant overlay preview.
- Report, Export, Saved, History, Vision Board, and AI Setup.
- AI render prompt scaffold and cost estimate placeholders.

## AI rendering

Real AI image rendering is not connected in v3.7. The app still uses concept boards and overlay previews. The AI Setup section prepares the path for future provider connection, but no paid image calls are made.

Before connecting real rendering, VerdeAI still needs:

1. A safe backend proxy.
2. Provider selection, likely Replicate / FLUX, OpenAI image generation, or Stability AI.
3. API key handling outside frontend code.
4. Cost confirmation before rendering.
5. Fallback handling when rendering fails.

## Deployment

This is a static site package. Upload the full folder contents to the existing GitHub Pages project or deploy the folder to Netlify.

No build command is required.

## Test checklist

1. Open the live site.
2. Confirm badge says **Workshop Build v3.7**.
3. Run the shaded garden self-test.
4. Review the Futures Dashboard.
5. Copy a clean result.
6. Confirm save/load still works.
