# VerdeAI v3.2 Workshop Build

VerdeAI helps a tester upload a property photo, compare six possible property futures, see plant-style overlay ideas, and copy/save a practical first move.

## v3.2 focus
This build adds a polished **Property Futures Dashboard** inspired by the target “What could your property become?” layout. It is still low-cost and static-site friendly, but the first screen now feels much closer to a public beta experience.

## Main features
- First-screen **Property Futures Dashboard**.
- **Your property today** visual card.
- **Six possible futures** dashboard cards.
- **VerdeAI recommendation** panel.
- **Property compass** scoring.
- **Next steps** panel.
- **5-year property movie** evolution strip.
- Large **Plant Overlay Preview** using the uploaded photo or built-in self-test image.
- Built-in **Run shaded garden self-test** button.
- Photo upload with local image preparation/compression.
- One-tap starter clues that run analysis automatically.
- Rule-based property analysis.
- Report tab and copyable full report.
- Vision Board synced to the latest analysis.
- Saved projects and autosave/session recovery.
- Export tab with tester invite, tester summary, JSON export, feedback CSV, and text-only Share Code.

## How to use the public tester flow
Open the app. The first tab is **Tester Page**.

A tester can do this:

1. Upload one property photo, or tap **Run shaded garden self-test**.
2. Review the six futures dashboard.
3. Open the plant overlay preview if they want the visual placement idea.
4. Copy the clean tester result or full report.

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
Real AI image recognition/rendering is not connected yet. VerdeAI currently uses the uploaded photo as the overlay base and relies on clue-guided rule logic. Plant overlays and dashboard futures are visual mockups, not final AI-rendered landscape images.
