# BUILD_STATUS — VerdeAI v2.4

## Build identity

- Product: VerdeAI
- Version: v2.4
- Mode: Workshop Build
- Source base: v2.3 uploaded/current repository ZIP
- Package type: Static web app with optional mock backend
- Deployment target: Netlify static deploy or GitHub Pages static deploy
- Build command: none required
- Primary goal: improve live mobile tester experience after v2.3 testing

## Source-of-truth rule followed

The v2.3 repository ZIP was unpacked and modified as the working base. The project was not recreated from scratch. Existing functionality was preserved and extended.

## Current working features

### Core app
- Static `index.html` app.
- `styles/main.css` responsive styling.
- `js/app.js` frontend engine.
- `config.js` static/backend configuration switch.
- Netlify-ready `netlify.toml` and `_redirects`.
- GitHub Pages-compatible static structure.

### Tester flow
- Photo upload and preview.
- Demo mode for instant testing.
- Quick-start checklist.
- Photo-readiness status.
- Clue coach explaining why user inputs matter.
- Starter suggestion chips after photo upload.
- Property situation intake.
- Preferred direction intake.
- Main problem intake.
- Optional postcode / climate clue.
- Budget and maintenance tolerance intake.
- User property note intake.
- Analyse Property action.

### Analysis engine
- Rule-based property analysis.
- Situation profiles for help-me-choose, blank canvas, front yard, backyard, foundation edge, side yard, courtyard, under-building/shaded area, workshop/shed, overgrown garden, utility zone, and slope/drainage.
- Main-problem constraint profiles including dark/shaded area.
- Note signal detection for privacy, shade, access, edge, utility, wildlife, food, low-maintenance, gathering, maker/workshop, value, and water/drainage.
- Future ranking and match scoring.
- Property DNA generation.
- Site clue pills.
- Visible-site language generation.
- Specificity score.
- “Why this feels specific” explanations.
- Constraint-aware first move generation.

### Visual concept engine
- Six future concept cards.
- Clickable/keyboard-selectable future cards.
- Uploaded photo used as the visual base.
- Demo visual base when no photo is supplied.
- Concept overlay badge.
- Four overlay labels.
- Future-specific overlay geometry.
- Under-building/shade overlay geometry.
- Constraint-aware overlay labels.
- Compare tab with original and selected future overlay.
- Overlay legend.

### Planning and export
- Best first move banner.
- Next steps list.
- Action roadmap.
- “Before buying” step.
- Risk / confidence notes.
- 5-year property movie.
- Plant/material palette suggestions.
- Printable full report.
- Copy report.
- Tester summary.
- Copy tester summary.
- JSON project export.
- Local saved project save/load/delete.
- Feedback save.
- Feedback CSV export.
- Project history timeline.
- Climate profile display.
- Maintenance calendar.
- Vision board summary.

### Backend/API scaffold
- Optional Express mock backend.
- `/api/health` mock health check.
- `/api/analyse` mock analysis endpoint.
- `/api/futures` mock future composer endpoint.
- `/api/render` mock render endpoint.
- `/api/report` mock report endpoint.
- OpenAPI alpha scaffold updated for v2.4 fields.

## Validation completed

Commands/checks run:

```bash
node --check js/app.js
node --check backend/server.js
python3 -m json.tool data/futures.json
python3 -m json.tool api/openapi-alpha.json
npm test
zip -T VerdeAI_v2.4_Workshop_Build.zip
```

Results:

- Frontend JavaScript syntax: passed.
- Backend JavaScript syntax: passed.
- Futures JSON validation: passed.
- OpenAPI JSON validation: passed.
- Smoke test: passed.
- Final ZIP integrity: passed.

## Known limitations / not yet done

- No real AI image vision yet.
- No real AI image rendering yet.
- No user accounts.
- No cloud save or share links.
- No real plant database.
- No real geospatial/climate API.
- Browser local storage can be cleared by the user/device.
- Uploaded photos are not compressed yet; very large images may make local save heavy.
- Overlay placement is still rule-based and approximate.

## Recommended next build: v2.5

Priority order:

1. Add client-side image compression before local save/export.
2. Add a dedicated tester result page suitable for screenshots/sharing.
3. Add simple share/import codes so testers can send results without accounts.
4. Add overlay editing controls: move label, hide label, change label wording, and intensity.
5. Add richer postcode/climate lookup using static data first, then API later.
6. Add more property pattern profiles and problem-specific warnings.
7. Add optional “I don’t know” guided question flow for testers who dislike dropdowns.

## GitHub commit suggestion

```bash
git add .
git commit -m "Build VerdeAI v2.4 guided tester flow"
git push
```
