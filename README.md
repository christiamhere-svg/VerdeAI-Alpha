# VerdeAI v2.8 Workshop Build

VerdeAI helps people upload a property photo, choose one plain-English clue, compare possible property futures, and leave with one practical first move.

This package is a complete static app plus an optional mock backend scaffold. It stays cheap, easy to deploy, and useful for public tester feedback while full AI vision/rendering remains future work.

## What changed in v2.8

v2.8 was built directly from the existing v2.7 Workshop Build already available in this workspace. No new user upload was required and the project was not recreated from scratch.

This release focuses on **reducing Chris babysitting the test**. A stranger should now have a clearer path through the app without needing step-by-step coaching.

- Added a **Smart Next Action** card to the quick-start area.
- Added a **Show me what to do** button that guides the tester to the next useful step:
  - upload photo,
  - choose starter clue,
  - choose main problem,
  - analyse,
  - export handoff,
  - tester mode.
- Added Export next-step messaging so testers know what to copy or do next.
- Improved Tester Mode instructions around the new guided flow.
- Dashboard now shows the actual next share step from the same smart guidance logic.
- Tester Health now starts with the recommended next action.
- Preserved v2.7 tester invite, beta checklist, share code, dashboard readiness, and public handoff tools.
- Preserved v2.6 one-tap starter clue analysis and large-phone-photo compression.
- Preserved v2.5 analysis stability: Design refinements do not reset the current analysis.
- Preserved shaded / under-building improvements.
- Updated optional mock backend, OpenAPI scaffold, package metadata, docs, and smoke tests to v2.8.

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

The smoke test checks that required app files and v2.8 smart tester-flow features exist.

## Deploy to Netlify or GitHub Pages

This is a static app. No build command is required.

For Netlify:

1. Unzip this package.
2. Drag the full `verdeai-v2.8` folder into Netlify.
3. Open the generated link and test upload → smart next action → starter clue → overlay → export.

For GitHub Pages:

1. Copy the contents of `verdeai-v2.8` into the existing GitHub repository folder.
2. Commit and push.
3. Wait for Pages deployment.
4. Refresh the live VerdeAI URL and confirm the badge says `Workshop Build v2.8`.

## Suggested public tester pass

1. Open the live VerdeAI link.
2. Upload one real property photo.
3. Use **Next best action** if unsure.
4. Tap the closest starter clue.
5. Read the first overlay card and the Best first move.
6. Open Export and copy the Tester Summary or Tester Invite.
7. Save the project locally if the result is worth keeping.

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

v2.8 does **not** perform real AI image analysis or real AI rendering yet. It uses the uploaded photo as the overlay base, prepares/compresses that photo locally, then uses clue-guided rule logic for the analysis.

The overlays are concept labels, not final rendered redesign images. v2.8 is closer to a public tester beta, but real vision/rendering is still the big next leap.
