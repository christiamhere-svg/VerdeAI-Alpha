# CHANGELOG — VerdeAI v3.0 Workshop Build

## Summary
v3.0 is a self-test/public-beta-prep build. It keeps the existing v2.9 static-site architecture and adds a built-in shaded-garden test flow so the owner can check VerdeAI without repeatedly uploading the same phone photo.

## Added
- Built-in **Run shaded garden self-test** buttons in the hero, quick start area, and Tester Mode.
- Self-test simulates:
  - photo loaded,
  - shaded / under-cover starter clue,
  - under-building situation,
  - dark / shaded main problem,
  - analysis complete,
  - report ready,
  - Vision Board ready,
  - Saved project card created.
- Embedded lightweight SVG self-test image, so no external assets or uploads are required.
- Self-test history entries for easier debugging.
- v3.0 local-storage keys with v2.9/v2.8/v2.7/v2.6/v2.5/v2.4/v2.3/v2.2 compatibility.
- Smoke-test coverage for the self-test runner, self-test image, and self-test UI.

## Improved
- Hero copy now explains that v3.0 can test the shaded garden flow without another upload.
- Tester Mode now includes an owner shortcut for checking the app before sending it to strangers.
- Saved projects now receive a self-test card named `Self-test: Sheltered Shade Pocket → Belonging Garden`.
- Export, Report, Vision Board, and Saved remain connected to the same analysis state after self-test.

## Preserved from v2.9
- Autosave and session recovery.
- One-tap starter clue analysis.
- Smart Next Action flow.
- Report, Vision Board, Saved, Export, Share Code, and Tester Mode.
- Design-refinement stability from v2.5.
- Shaded/under-building result improvements from v2.4.
- Static-site compatibility for GitHub Pages and Netlify.

## Known limitations
- Real AI image recognition is still not connected.
- Rendered future images are still overlay prototypes, not true AI-generated landscape concepts.
- Browser local storage remains local to the exact browser/domain.
