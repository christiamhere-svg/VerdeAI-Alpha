# CHANGELOG

## v2.3 — Workshop Build

### Development intent
v2.3 continues directly from the v2.2 repository. The project was not recreated from scratch. Existing static Netlify deployment, local browser storage, reports, overlays, futures, tester summary, optional mock backend, API scaffold, and smoke testing were preserved.

### First-time visitor and tester flow
- Added a new **Start here** quick-start card above the workspace.
- Added a live tester checklist for Photo, Situation, Main problem, and Analysis.
- Reworded the hero section to explain VerdeAI as a 60-second property-photo test rather than a gardening advice page.
- Updated tester-facing copy to reduce confusion for strangers opening the app without instructions.
- Added a photo-readiness card under the upload area so users know whether the app is using a real image, demo mode, or no image yet.

### Intake and property specificity
- Added a new **Main problem** selector with practical problem types:
  - Not sure yet
  - Too open / no purpose
  - Messy edge or ugly boundary
  - Needs privacy
  - Nobody really uses it
  - Too much upkeep
  - Drainage / water concern
  - Storage or clutter creep
  - Access feels awkward
- Added constraint profiles that influence future ranking, Property DNA, first actions, risk notes, overlay labels, and report wording.
- Expanded the analysis logic so results now combine property type, preferred direction, postcode clue, budget, maintenance tolerance, note signals, and the selected main problem.
- Added a **Why this feels specific** section to show testers why a result was chosen.
- Added a specificity score that increases when the tester provides a photo/demo, main problem, note, postcode, and design refinements.

### Visual overlays and concept presentation
- Improved overlay system with a visible “concept overlay” badge.
- Added a fourth overlay label for the main viewing line / lighting cue / first test area.
- Added varied overlay geometry per future type so cards no longer all look identical.
- Added constraint-aware overlay changes for privacy gaps, messy edges, access problems, and water/drainage risks.
- Added an overlay legend below the Compare view.
- Added clearer wording that overlays are concept labels, not real generated redesign renders yet.

### Planning and tester usefulness
- Added a **Best first move** banner above the future cards.
- Added constraint-specific first actions, including water tests, privacy screen tests, storage boundaries, maintenance simplification, and access-route checks.
- Added **Risk / Confidence Notes** to the Plan tab.
- Updated roadmap generation with a new “Before buying” step so testers avoid jumping straight to shopping.
- Updated reports and tester summaries to include the main problem, specificity reasons, and v2.3 limitations.

### Data, storage, and export
- Updated local storage keys to v2.3.
- Added legacy read support for v2.2 local projects, feedback, and history where available.
- Updated feedback CSV export to include the main problem / constraint column.
- Updated project JSON export filename to v2.3.

### Backend and API scaffold
- Updated optional mock backend to v2.3.0.
- Added `constraint` handling to mock future selection and mock analysis responses.
- Updated mock DNA scoring for privacy, access, maintenance, storage, and water-risk constraints.
- Updated OpenAPI scaffold with constraint, budget, and maintenance fields.
- Updated mock render response to allow four overlay labels.

### Accessibility and responsive polish
- Preserved skip link, focus-visible states, keyboard-selectable future cards, and reduced-motion handling.
- Added responsive styling for the quick-start checklist, clue pills, overlay legend, and four-column insight grid.
- Improved small-screen stacking so testers can use the app more comfortably on phones.

### Testing and validation
- Updated smoke test to check for v2.3-specific features: main problem selector, quick tester checklist, specificity reasoning, and quick-start CSS.
- Confirmed JavaScript syntax with Node.
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

## v2.2 — Previous baseline retained

v2.2 introduced the stronger static app foundation: photo upload, demo mode, six future cards, visual overlay labels, local reports, tester summaries, feedback save/export, saved projects, optional mock backend, Netlify static deploy files, and the initial smoke test.
