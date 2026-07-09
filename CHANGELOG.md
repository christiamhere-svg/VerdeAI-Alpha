# CHANGELOG

## v2.4 — Workshop Build

### Development intent
v2.4 continues directly from the v2.3 repository. The project was not recreated from scratch. Existing static deployment, local browser storage, reports, overlays, futures, tester summary, optional mock backend, API scaffold, and smoke testing were preserved.

### Why v2.4 exists
Live mobile testing of v2.3 showed the core app worked, but the tester flow was still confusing. A real uploaded photo could still produce **Blank canvas / new build**, and the report was useful but too dependent on dropdown choices without explaining that limitation.

v2.4 focuses on making the clue-guided nature of the app obvious, useful, and less fake-feeling.

### Tester flow improvements
- Added **Photo uploaded / help me choose** as the safe default situation.
- Prevented new real-photo sessions from defaulting to **Blank canvas / new build**.
- Added clue coaching under the upload area explaining that the photo is used for overlays while full AI vision is not connected yet.
- Added starter suggestion chips that testers can tap instead of guessing dropdowns manually.
- Added clearer quick-start checklist behaviour: situation is no longer marked complete until a meaningful situation is selected.
- Updated progress messages after upload so testers know the next step.

### New starter suggestions
Added one-tap starter presets:
- Looks shaded / under cover
- Path/access feels awkward
- Overgrown or tired
- Utility object / tank / services
- Messy edges / bare soil

Each starter preset updates the situation, main problem, and property note so the analysis feels more grounded.

### New analysis categories
- Added **Under-building / shaded area** property situation.
- Added **Dark / shaded area** main problem.
- Added support for shade, access, edge, utility, columns, hard-surface, and bare-soil language in note signal detection.
- Added DNA scoring effects for shade, access, edges, utility clues, and under-building areas.
- Added shade/access/under-building effects to future ranking.

### Report and wording improvements
- Added a **Best first move** section near the top of the report.
- Added **Visible-site language** to reports so outputs can reference things like shade, hard surfaces, columns, access, bare soil, utilities, existing plants, and edges when those clues are selected.
- Reduced repeated wording in the report.
- Reworded the limitation note: v2.4 uses uploaded photos for overlays, but site interpretation is still clue-guided rule logic until real AI vision is connected.
- Updated recommendation wording to be more direct and less template-heavy.

### Visual overlay improvements
- Added under-building / shaded-area overlay geometry.
- Added dark/shaded-area overlay styling.
- Added shade-safe, service-access, low-light, and hard-edge overlay labels.
- Improved mobile readability of overlay body text.

### Mobile and accessibility polish
- Added mobile-friendly starter chips.
- Improved report and overlay text sizing on small screens.
- Preserved skip link, focus-visible states, keyboard-selectable future cards, and reduced-motion handling.

### Backend and API scaffold
- Updated optional mock backend to v2.4.0.
- Added `starterCue` handling to mock analyse responses.
- Added `needs-review`, `under-building`, and `shade-dark` support to backend logic.
- Updated OpenAPI scaffold with v2.4 starter clue and new constraint descriptions.

### Testing and validation
- Updated smoke test to check for starter suggestions, under-building option, shade/dark problem option, starter preset logic, visible-site language, and clue coach CSS.
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

## v2.3 — Previous baseline retained

v2.3 added the main-problem selector, improved tester checklist, specificity reasons, better overlays, report copying, local saves, mock backend updates, and GitHub Pages testing flow.
