# VerdeAI v2.5 Workshop Build

VerdeAI helps people upload a property photo, choose a few plain-English clues, compare possible property futures, and leave with one practical first move.

This package is a complete static app plus an optional mock backend scaffold. It is designed to stay cheap, easy to deploy, and useful for real tester feedback while full AI vision/rendering is still future work.

## What changed in v2.5

v2.5 is based on live mobile testing of v2.4. The main bug fixed: changing **Design** refinements could temporarily reset the report back to **Photo uploaded / help me choose** until Analyse Property was run again.

v2.5 keeps the current analysis stable while style refinements change.

- Added an analysis snapshot system so the selected situation, primary pattern, secondary pattern, main problem, DNA, noticed lines, selected future, and overlay logic stay locked after analysis.
- Design refinements are now style-only and should not reset or weaken the property analysis.
- Removed `styleIntensity` from the auto-analysis input list so style changes do not trigger a hidden re-analysis.
- Synced design checkbox and intensity controls when loading saved projects.
- Synced Vision Board labels with the current analysis result.
- Improved shaded / under-building Vision Board labels: low-light planting zone, keep column/service access, soften hard surface edge, and main viewing line.
- Reduced repeated wording in reports, especially repeated shade/access/site-clue language.
- Cleaned ugly truncated property-note lines like `Photo clue... low-l…`.
- Updated Report, Design, Export, History, Vision Board, and Saved tab help text for first-time testers.
- Updated optional backend, OpenAPI scaffold, and smoke tests to v2.5.

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

The smoke test checks that required app files and v2.5 stability features exist.

## Deploy to Netlify or GitHub Pages

This is a static app. No build command is required.

For Netlify:

1. Unzip this package.
2. Drag the full `verdeai-v2.5` folder into Netlify.
3. Open the generated link and test upload → starter clue → analyse → design refinement → report → save.

For GitHub Pages:

1. Copy the contents of `verdeai-v2.5` into the existing GitHub repository folder.
2. Commit and push.
3. Wait for Pages deployment.

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

v2.5 does **not** perform real AI image analysis or real AI rendering yet. It uses the uploaded photo as the overlay base, then uses rule-based analysis guided by the tester’s selected clues.

The overlays are concept labels, not final rendered redesign images. It is still a useful garden brain with training wheels — but now the wheels are at least bolted on properly.
