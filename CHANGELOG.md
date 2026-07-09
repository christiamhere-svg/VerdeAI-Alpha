# CHANGELOG

## v2.5 — Workshop Build

### Development intent

v2.5 continues directly from the v2.4 repository. The project was not recreated from scratch. Existing static deployment, local browser storage, reports, overlays, futures, tester summary, optional mock backend, API scaffold, and smoke testing were preserved.

### Why v2.5 exists

Live mobile testing of v2.4 found a real bug: changing **Design** refinements could temporarily reset the report back to **Photo uploaded / help me choose** until **Analyse Property** was run again.

That made the app feel unstable. v2.5 fixes that stability issue and tightens the tabs testers use most.

### Stability fixes

- Added `analysisSnapshot` state to preserve the current analysis result after an analysis run.
- Added `captureAnalysisSnapshot()` after analysis completion.
- Added `restoreAnalysisSnapshot()` for design/report/compare/vision rendering.
- Added `clearAnalysisSnapshot()` when a new photo or starter clue intentionally makes the old analysis stale.
- Design refinements now restore the current analysis before rendering.
- Style intensity no longer triggers hidden re-analysis.
- Design controls now sync from state when projects load.
- Saved project load now preserves v2.5 analysis state and creates a snapshot if loading older v2.4 saved data.

### Report improvements

- Reduced repeated visible-site wording.
- Changed **Visible-site language** to clearer **Site clues used** wording.
- Cleaned property notes so starter-clue notes no longer show ugly truncated lines such as `Photo clue... low-l…`.
- Made `Why this direction` sound more natural and less like a template.
- Kept Design refinements in the report without letting them replace the current analysis.

### Vision Board improvements

- Vision Board now restores the current analysis before rendering.
- Vision Board labels now sync with the current overlay labels.
- For shaded / under-building analysis, Vision Board should show labels like:
  - low-light planting zone
  - keep column/service access
  - soften hard surface edge
  - main viewing line

### Tester clarity improvements

- Added clearer Report tab help text.
- Added clearer Design tab explanation that refinements are style-only.
- Added a stability note encouraging testers to tick **Cleaner / minimal** and confirm the analysis stays stable.
- Added clearer Export, History, Vision Board, and Saved tab helper text.
- Added mobile CSS polish for helper text and report wrapping.

### Backend and API scaffold

- Updated optional mock backend to v2.5.0.
- Updated API scaffold title/version to v2.5.
- Smoke test now checks for analysis snapshot functions, cleaned property notes, and v2.5 stability copy.

### Testing and validation

- Confirmed frontend JavaScript syntax with Node.
- Confirmed backend JavaScript syntax with Node.
- Confirmed JSON validity for API and futures data.
- Confirmed `npm test` passes.
- Confirmed final ZIP integrity.

### Known limitations

- Real AI vision analysis is still not connected.
- Real AI image generation / rendered redesigns are still not connected.
- Overlay positions are rule-based concept labels, not computer-vision placement.
- Postcode climate logic is still a lightweight clue system, not a real climate or plant database.
- Saving is still local browser storage only; no user accounts, cloud save, or share links yet.
- Very large uploaded photos may still make local storage heavy because image compression has not been added yet.

## v2.4 — Previous baseline retained

v2.4 added the safer **Photo uploaded / help me choose** default, starter suggestion chips, under-building/shaded-area logic, dark/shaded main problem, visible-site report language, improved overlays, and live mobile tester flow improvements.

## v2.3 — Previous baseline retained

v2.3 added the main-problem selector, improved tester checklist, specificity reasons, better overlays, report copying, local saves, mock backend updates, and GitHub Pages testing flow.
