# VerdeAI v2.4 Workshop Build

VerdeAI helps people upload a property photo, choose a few plain-English clues, compare possible property futures, and leave with one practical first move.

This package is a complete static app plus an optional mock backend scaffold. It is designed to stay cheap, easy to deploy, and useful for real tester feedback while full AI vision/rendering is still future work.

## What changed in v2.4

v2.4 is based on the live mobile test of v2.3. The big fix: after a real photo upload, the app no longer quietly defaults to **Blank canvas / new build**.

- Added **Photo uploaded / help me choose** as the safe default situation.
- Added starter suggestion chips after upload:
  - Looks shaded / under cover
  - Path/access feels awkward
  - Overgrown or tired
  - Utility object / tank / services
  - Messy edges / bare soil
- Added **Under-building / shaded area** as a property situation.
- Added **Dark / shaded area** as a main problem.
- Added clue coaching explaining why dropdowns matter while full AI vision is not connected.
- Added visible-site language for reports: shade, access, edges, columns, hard surfaces, bare soil, utilities, existing plants, and viewing lines.
- Reduced repeated report wording and added a clearer **Best first move** section.
- Improved mobile readability of overlay cards and report text.
- Updated optional backend, OpenAPI scaffold, and smoke tests for v2.4.

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

The smoke test checks that the required app files and v2.4 tester features exist.

## Deploy to Netlify or GitHub Pages

This is a static app. No build command is required.

For Netlify:

1. Unzip this package.
2. Drag the full `verdeai-v2.4` folder into Netlify.
3. Open the generated link and test upload → starter clue → analyse → overlay → report.

For GitHub Pages:

1. Copy the contents of `verdeai-v2.4` into the existing GitHub repository folder.
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

v2.4 does **not** perform real AI image analysis or real AI rendering yet. It uses the uploaded photo as the overlay base, then uses rule-based analysis guided by the tester’s selected clues.

The overlays are concept labels, not final rendered redesign images. Translation: it is less “magic wand” and more “useful garden brain with training wheels.”
