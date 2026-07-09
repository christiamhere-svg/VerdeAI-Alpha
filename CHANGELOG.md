# CHANGELOG

## v2.8 — Smart Tester Flow Build

### Development intent

v2.8 continues directly from the v2.7 Workshop Build already available in the working environment. The project was not recreated from scratch. Existing static deployment, local browser storage, reports, overlays, futures, tester invite, tester summary, share code, optional mock backend, API scaffold, and smoke testing were preserved.

The main purpose of this build is to reduce the amount of manual guidance needed from Chris. The app now has a clearer internal “green thread” that tells a tester what to do next.

### Added

- Added **Smart Next Action** card in the quick-start area.
- Added **Show me what to do** button.
- Added next-action routing for:
  - photo upload,
  - starter clue selection,
  - main problem selection,
  - analysis,
  - Export handoff,
  - Tester Mode.
- Added `smartNextPlan()` to centralise the tester-flow decision logic.
- Added `handleSmartNextAction()` to guide the tester through the correct next step.
- Added `activateTab()` helper for consistent tab switching.
- Added Export next-step prompt so the Export tab explains the next handoff action.
- Added smart next action to Tester Health.
- Dashboard now uses the same next-action logic instead of a hard-coded next share step.
- Smoke test now checks for the Smart Next Action UI, logic, and CSS.

### Improved

- Hero copy now describes v2.8 as a clearer test handoff build.
- Tester Mode now tells testers to use the next-action prompt if they get lost.
- Export is clearer about what action should happen next.
- The report limitation note now mentions the smart tester-flow support.
- Share code import supports v2.8, v2.7, and v2.6 text-only share codes.

### Preserved from v2.7

- Copy Tester Invite.
- Copy Beta Checklist.
- Beta handoff readiness score.
- Export/Dashboard/Tester Mode handoff flow.
- Text-only Share Code export/import.
- Public beta checklist.

### Preserved from v2.6

- One-tap starter clue analysis.
- Client-side image preparation/compression for large phone photos.
- Cleaner reports and tester summaries.
- Improved empty states.

### Preserved from v2.5

- Design refinements stay style-only.
- Design refinements do not reset or weaken the current analysis.
- Analysis snapshot/restore logic remains active.
- Vision Board labels remain synced with current analysis.

### Preserved shaded/under-building improvements

- Under-building/shaded starter clue remains active.
- Shaded/under-building overlay labels remain specific:
  - low-light planting zone,
  - keep column/service access,
  - soften hard surface edge,
  - main viewing line.
- Report and overlay language still mentions shade, concrete columns, hard surfaces, low light, access, and service access when that clue is selected.

### Backend and API scaffold

- Updated optional mock backend to v2.8.0.
- Updated OpenAPI scaffold title/version to v2.8.
- Updated package metadata and smoke tests.

### Testing and validation

- Confirmed frontend JavaScript syntax with Node.
- Confirmed backend JavaScript syntax with Node.
- Confirmed JSON validity for API, package, backend package, and futures data.
- Confirmed `npm test` passes.
- Confirmed final ZIP integrity.

### Known limitations

- Real AI vision analysis is still not connected.
- Real AI image generation / rendered redesigns are still not connected.
- Overlay positions are rule-based concept labels, not computer-vision placement.
- Postcode climate logic is still a lightweight clue system, not a real climate or plant database.
- Saving is still local browser storage only; no user accounts or cloud save.
- Share codes do not include uploaded photos.

## v2.7 — Previous baseline retained

v2.7 added public tester handoff tools including Copy Tester Invite, Copy Beta Checklist, beta readiness scoring, and clearer Export/Dashboard/Tester Mode handoff flow.

## v2.6 — Previous baseline retained

v2.6 added public tester checklist improvements, one-tap starter clue analysis, client-side photo compression, text-only Share Code export/import, shorter reports, improved tester summaries, and clearer empty states.

## v2.5 — Previous baseline retained

v2.5 fixed the Design-refinement reset bug, added analysis snapshot/restore logic, synced Vision Board labels with analysis results, and cleaned repeated report wording.

## v2.4 — Previous baseline retained

v2.4 added the safer Photo uploaded / help me choose default, starter suggestion chips, under-building/shaded-area logic, dark/shaded main problem, visible-site report language, improved overlays, and live mobile tester flow improvements.
