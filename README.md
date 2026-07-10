# VerdeAI v3.0 Workshop Build

VerdeAI helps a tester upload a property photo, add a few human clues, generate property patterns, compare possible futures, and copy/save a practical first move.

## v3.0 focus
This build adds a built-in **shaded garden self-test** so the owner can check the complete flow without repeatedly uploading the same phone photo.

## Main features
- Static frontend, ready for GitHub Pages or Netlify.
- Photo upload with local image preparation/compression.
- One-tap starter clues.
- Rule-based property analysis.
- Overlay concept cards.
- Report tab and copyable full report.
- Vision Board.
- Saved projects.
- History.
- Export tab with tester invite, tester summary, JSON export, feedback CSV, and text-only Share Code.
- Autosave/session recovery.
- Built-in shaded-garden self-test.

## How to run the self-test
Open the app and click:

```text
Run shaded garden self-test
```

The app will simulate:

1. photo upload,
2. shaded starter clue,
3. analysis,
4. report generation,
5. Vision Board generation,
6. saved project creation.

Expected result:

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
Real AI image recognition/rendering is not connected yet. VerdeAI currently uses the uploaded photo as the overlay base and relies on clue-guided rule logic.
