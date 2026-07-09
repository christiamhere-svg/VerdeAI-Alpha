# VerdeAI v2.3 Workshop Build

VerdeAI helps people upload a property photo, discover what the place could become, compare possible futures, and choose one practical first move.

This package is a complete static app plus an optional mock backend scaffold. It is designed to remain cheap and simple to deploy while the product idea is still being tested.

## What changed in v2.3

- Added a clearer first-time tester flow with a quick-start checklist.
- Added a **Main problem** selector so results feel more specific and less generic.
- Added site clue pills, specificity score, and “Why this feels specific” explanations.
- Improved visual overlays with varied geometry, concept badges, four labels, and a Compare legend.
- Added a Best First Move banner and risk/confidence notes.
- Updated reports, tester summaries, JSON export, and feedback CSV to include the selected main problem.
- Updated optional mock backend and OpenAPI scaffold for the new `constraint` field.
- Preserved the static Netlify-ready architecture from v2.2.

## Run locally

From the project folder:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

On Windows, if `python3` does not work, try:

```bash
python -m http.server 8000
```

## Test locally

```bash
npm test
```

The smoke test checks that the required app files and v2.3 tester features exist.

## Deploy to Netlify

1. Unzip this package.
2. Drag the full `verdeai-v2.3` folder into Netlify.
3. No build command is required.
4. Open the Netlify link and test upload → analyse → compare → plan → report → save.

## Optional mock backend

The main app works without this backend. The backend is only a scaffold for later AI/API integration.

```bash
cd backend
npm install
npm start
```

Then test:

```text
http://localhost:8080/api/health
```

## Important limitation

v2.3 does **not** perform real AI image analysis or real AI rendering yet. It uses local rule-based analysis and overlay-style visual concepts so testers can experience the product flow without paid services.

The overlays are concept labels, not final rendered redesign images. Translation: it points at the idea, it does not magically landscape the yard. Yet.
