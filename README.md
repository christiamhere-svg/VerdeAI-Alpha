# VerdeAI v3.1 Workshop Build

VerdeAI helps a tester upload a property photo, add one obvious clue, see plant-style overlay ideas, and copy/save a practical first move.

## v3.1 focus
This build shifts the product back toward a **public tester page** and clearer **plant-picture-style overlays**. The goal is simple: give the owner something they can show other people without walking them through every tab.

## Main features
- Dedicated **Tester Page** as the first screen.
- Large **Plant Overlay Preview** using the uploaded photo or built-in self-test image.
- Plant-style overlay sprites for shade planting, feature pots, edge planting, mulch zones, access routes, and habitat/food concepts.
- Built-in **Run shaded garden self-test** button.
- Photo upload with local image preparation/compression.
- One-tap starter clues that run analysis automatically.
- Rule-based property analysis.
- Overlay concept cards.
- Report tab and copyable full report.
- Vision Board synced to the latest analysis.
- Saved projects and autosave/session recovery.
- Export tab with tester invite, tester summary, JSON export, feedback CSV, and text-only Share Code.

## How to use the tester page
Open the app. The first tab is now **Tester Page**.

A tester can do this:

1. Upload one property photo, or use **Run shaded garden self-test**.
2. Tap the closest starter clue.
3. Look at the plant overlay preview.
4. Screenshot the overlay and copy the tester summary.

Expected shaded self-test result:

```text
Under-building / shaded area
Sheltered Shade Pocket
Dark / shaded area
```

## Local use
No build step is required.

```bash
python3 -m http.server 8000
```

Then open the served page in a browser.

## Tests

```bash
npm test
```

## Deployment
Upload the contents of this project folder to the existing GitHub Pages repository, or drag the full folder into Netlify.

## AI status
Real AI image recognition/rendering is not connected yet. VerdeAI currently uses the uploaded photo as the overlay base and relies on clue-guided rule logic. Plant overlays are visual mockups, not final AI-rendered landscape images.
