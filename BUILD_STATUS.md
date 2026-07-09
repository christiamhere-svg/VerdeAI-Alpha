# BUILD_STATUS — VerdeAI v2.8

## Build identity

- Product: VerdeAI
- Version: v2.8
- Mode: Autopilot Workshop Build
- Source base: v2.7 Workshop Build ZIP already available in the working environment
- Package type: Static web app with optional mock backend
- Deployment target: Netlify static deploy or GitHub Pages static deploy
- Build command: none required
- Primary goal: make VerdeAI easier to share with public testers without Chris having to guide every step

## Source-of-truth rule followed

The v2.7 repository ZIP already present in the workspace was unpacked and modified as the working base. The project was not recreated from scratch. Existing functionality was preserved and extended.

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
- Client-side image preparation/compression for large mobile photos.
- Demo mode for instant testing.
- Quick-start checklist.
- Public beta tester checklist.
- **Smart Next Action** card.
- **Show me what to do** next-action button.
- Photo-readiness status.
- Clue coach explaining why user inputs matter.
- Starter suggestion chips after photo upload.
- Starter suggestion chips auto-run analysis.
- Property situation intake.
- Preferred direction intake.
- Main problem intake.
- Optional postcode / climate clue.
- Budget and maintenance tolerance intake.
- User property note intake.
- Analyse Property action remains available.

### Smart Next Action logic

The next-action guide currently routes testers through:

1. Upload one property photo.
2. Tap the closest starter clue.
3. Choose the main problem if needed.
4. Analyse Property.
5. Open Export and copy a tester handoff.
6. Open Tester Mode once the loop is complete.

### Public tester handoff

- Export tab includes beta handoff readiness meter.
- Export tab includes next handoff action prompt.
- Copy Tester Invite.
- Copy Tester Summary.
- Copy Beta Checklist.
- Copy Share Code.
- Import Share Code.
- Download Project JSON.
- Alpha Readiness uses the same readiness checklist as Tester Mode and Dashboard.
- Dashboard shows beta readiness score and the smart next share step.
- Tester Health starts with the smart next action.

### Analysis stability

- Analysis snapshot captured after every analysis run.
- Design refinements restore the current analysis snapshot before rendering.
- Style intensity does not trigger hidden re-analysis.
- Report, Compare, Design, and Vision Board views restore the current analysis snapshot before rendering.
- Saved project load restores analysis data and design controls.
- Property clue changes can still deliberately trigger a new analysis.

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
- Vision Board reflects current overlay labels and adds tester handoff guidance.

### Planning and export

- Best first move banner.
- Next steps list.
- Action roadmap.
- “Before buying” step.
- Risk / confidence notes.
- 5-year property movie.
- Plant/material palette suggestions.
- Shorter printable full report.
- Copy report.
- Tester summary.
- Copy tester summary.
- Tester invite copy.
- Beta checklist copy.
- Text-only share code export/import.
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
- OpenAPI alpha scaffold updated for v2.8 fields.

## Validation completed

Commands/checks run:

```bash
node --check js/app.js
node --check backend/server.js
python3 -m json.tool package.json
python3 -m json.tool backend/package.json
python3 -m json.tool data/futures.json
python3 -m json.tool api/openapi-alpha.json
npm test
zip -T VerdeAI_v2.8_Workshop_Build.zip
```

Results:

- Frontend JavaScript syntax: passed.
- Backend JavaScript syntax: passed.
- Package JSON validation: passed.
- Backend package JSON validation: passed.
- Futures JSON validation: passed.
- OpenAPI JSON validation: passed.
- Smoke test: passed.
- Final ZIP integrity: passed.

## Manual test target for user

After GitHub Pages deploy:

1. Confirm badge says `Workshop Build v2.8`.
2. Upload the same shaded/under-building photo.
3. Use **Next best action** if unsure.
4. Tap **Looks shaded / under cover**.
5. Confirm analysis runs automatically.
6. Confirm result says **Under-building / shaded area**, **Sheltered Shade Pocket**, and **Dark / shaded area**.
7. Confirm overlay labels include low-light planting zone, keep column/service access, soften hard surface edge, and main viewing line.
8. Open Export and confirm next-step messaging appears.
9. Copy Tester Invite or Tester Summary.

## Known limitations

- Real AI image analysis is not connected yet.
- Real AI rendered redesign images are not connected yet.
- Overlay positions are concept zones, not computer-vision placement.
- Climate/postcode logic is basic and not yet a full plant/climate database.
- Saves are local to the current browser.
- Share codes do not include the uploaded photo.

## Build verdict

v2.8 is a better public tester beta candidate than v2.7 because it actively guides the tester through the next action instead of relying on Chris to explain the flow.
