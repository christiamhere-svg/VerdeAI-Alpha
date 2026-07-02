# VerdeAI Alpha Target Board v21

This build focuses on matching the target dashboard screen.

## Run

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/verdeai-alpha-target-board-v21/
```

## Test

- Upload a property photo
- Click Generate Futures
- Select future cards
- Watch recommendation, compass and property movie update


## New in v22

- Floating report button
- Slide-out test report panel
- Copy report
- Print report
- Report updates from selected future


## New in v23

- Build status tracker
- Generated renders folder
- Prepared project structure for upcoming AI render integration


## New in v24

- AI render integration interface design
- Product vision document
- Project structure prepared for replacing placeholder previews with real generated concepts


## New in v25

- Floating Compare button
- Before / Future comparison drawer
- Draggable comparison slider
- Selected future overlay updates live
- Closer to the target tester experience


## New in v26

- Implementation queue added.
- Project now transitions from UI recreation toward interactive editing.
- Next milestone: editable landscape canvas.


## New in v27

- Added production milestones.
- Development is now focused on replacing visual placeholders with interactive editing tools.
- Next major implementation target: editable landscape canvas.


## New in v28

- Editable Landscape Canvas
- Floating Canvas button
- Tap-to-place garden beds, paths, trees, seating and lights
- Drag placed objects around the uploaded photo
- Canvas items included in report


## New in v29

- Canvas object selection
- Drag placed objects
- Resize objects
- Rotate objects
- Delete selected object
- Save/load canvas layout in browser storage
- Active tool highlighting


## New in v30

- Export canvas layout to JSON
- Import canvas layout from JSON
- Better tester handoff for edited designs
- Canvas layouts can now move between browsers/devices


## New in v31

- Freehand drawing mode for garden beds
- Freehand drawing mode for paths
- SVG drawing layer over uploaded photo
- Undo / redo canvas history
- Export/import now includes drawn shapes
- Reports include drawn beds and paths


## New in v32

- Canvas layer visibility toggles
- Plants / Paths / Features layer groups
- Object labels on the canvas
- Layer visibility saved/exported/imported with layout
- Drawn shapes now belong to layer groups


## New in v33

- Resize handle on selected canvas objects
- Duplicate selected object
- Bring object to front
- Send object to back
- Z-order saved/exported with canvas objects
- Inspector controls extended


## New in v34

- Grid snap mode for canvas placement and dragging
- Visible grid overlay
- Lock/unlock selected object
- Locked objects cannot be moved or resized
- Grid and lock state saved/exported/imported


## New in v35

- Group nearby canvas objects
- Ungroup selected canvas group
- Move grouped objects together
- Visual group badge
- Selection box around groups
- Group state saved/exported with canvas layout


## New in v36

- Design summary panel
- Copy entire editable canvas design
- Paste copied design with offset
- Export design preview as PNG
- Canvas report now includes design counts


## New in v37

- Full project save file
- Full project open/import
- Local project manager
- Save and reopen multiple complete projects
- Project payload includes photo, selected future, canvas objects, drawn shapes, layers, grid state and report data
- Browser-local storage prepared for future cloud sync


## New in v38

- Measurement tool on landscape canvas
- Draw measurement lines over uploaded photo
- Measurement labels on canvas
- Set scale from a known real-world distance
- Total measured length panel
- Measurements saved/exported/imported with canvas and full project files
- Measurements included in reports

## New in v39

- Autosave current VerdeAI project
- Manual revision snapshots
- Restore autosaved project
- Restore/delete revision snapshots
- Revision history panel inside the editor
- Snapshots include photo, selected future, canvas objects, drawings, layers, measurements and scale


## New in v40

- Added a visible Public Alpha Workspace below the main board
- Live status cards for photo, design, measurements and autosave
- Large before/future preview visible without opening drawers
- Direct Open Designer action from the workspace
- This build is intentionally visually obvious, not just internal plumbing


## New in v41

- Added a visible inline Production Designer inside the Public Alpha Workspace
- Core editing no longer depends on opening the hidden canvas drawer
- Inline designer supports place, drag, resize, rotate and delete
- Inline freehand bed/path drawing
- Inline measurement tool
- Inline undo/redo/clear/export PNG
- Live inline inspector, summary and measurement panel
- Same underlying project state as the full canvas drawer


## New in v42

- Design variants A/B/C
- Save current canvas as Practical, Beautiful or Unexpected variant
- Switch between saved design variants
- Variants persist in browser storage
- Variants included in full project payloads and reports
- Inline designer now supports multiple alternate landscape layouts for the same property photo


## New in v43

- Major visible commercial UI polish sprint
- Main board now reads as Public Alpha Experience
- Dashboard spacing, typography, card styling, shadows and hierarchy substantially improved
- Main action now includes direct Open Designer workflow
- Property movie, cards, recommendation panel and designer received visual polish
- Responsive layout improved for tablet/mobile
- This sprint focuses on making VerdeAI feel closer to the target public Alpha screen, not adding hidden controls


## New in v44

- Major visible sprint: Target Public Alpha View
- Added polished presentation section matching the reference screen structure more closely
- Large "Your Property Today" panel
- Six future cards in commercial showcase layout
- Recommendation panel, compass, oracle reading and 5-year movie grouped in one tester-facing view
- Upload and edit actions available from the showcase
- This sprint focuses on visible product experience rather than hidden tooling


## New in v45

- Major visible sprint: Guided public Alpha flow
- Added Upload → Generate → Compare → Edit → Export journey
- Tester no longer needs to understand all tools before using VerdeAI
- Flow actions connect to upload, generation, showcase, future cycling, designer, variants, PNG export and report
- This sprint improves product experience rather than adding hidden controls


v46 continuation: Preparing commercial Alpha presentation sprint.


## v47 Commercial Alpha Sprint

- Added a prominent commercial dashboard at the top of the app.
- The first thing testers see now resembles the target reference more closely.
- Six futures, recommendation, compass and 5-year movie are visible immediately.
- Upload and future selection are wired into the existing state.
- This sprint prioritizes visible product feel over hidden tools.


## v48 Major Visible Sprint

- Added a large polished Concept Board directly under the commercial dashboard.
- Testers can now compare three strongest futures as big presentation panels.
- Selected future, confidence and best first action are visible in a decision strip.
- Concept cards update from the same uploaded photo and existing future state.
- This sprint prioritizes commercial visual experience over hidden tooling.


## v49 Major Visible Product Sprint

- Added polished commercial product shell above the older dashboard.
- Upload, generate, compare, before/after and edit actions are grouped into one modern user journey.
- Six futures now appear as a clean product selector.
- Recommendation panel, metrics and before/after slider are visible immediately.


## v50 Free Testable Page Sprint

- Reframed VerdeAI as a free test page rather than a commercial paid product.
- Added a clean tester-first page at the top of the app.
- Old prototype layers are hidden by default so testers see one simple experience.
- Flow is now: upload photo → generate futures → choose direction → compare → copy summary/feedback.
- This sprint prioritizes clarity, usability and testability.


## v51 Free Test Page Usability Sprint

- Added a visible 3-minute test dashboard.
- Added tester progress: photo, future, compare, summary.
- Added a clearer shareable result section.
- Copying summary now completes the test flow.


## v52 Free Test Page Sprint

- Added Quick Test Mode above the full page.
- First-time testers can now upload/use demo, choose a future, and copy a result from one screen.
- This reduces friction and makes the free Alpha easier to test on mobile.


## v53 Free Test Page Sprint

- Added an Instant Result card near the top of the free test page.
- Testers now see a clear result before needing to scroll through the full experience.
- Added quick copy and jump-to-futures actions.
- This keeps the page free, simple, and more useful for first-time testers.


## v54 Free Test Page Sprint

- Added a polished shareable result card.
- Testers now get a clear final output with image, direction, match, effort and first steps.
- Added copy result card and download JSON actions.
- This makes the free test page feel more complete and easier to share.


## v55 Free Alpha Finish Pass

- Added visible Free Public Alpha status bar.
- Added quick jump into Quick Test Mode.
- Improved tester-facing clarity and hover feel.
- Status updates when photo/future/result state changes.
- Continues simplifying the app toward a free testable page.


## v56 Free Test Page Sprint

- Added practical tester notes.
- Each future now explains the likely pattern, mistake to avoid, and first action.
- This makes the free test page more useful without adding complexity.


## Dashboard Rewrite Sprint 1

- Replaced the visible experience with a unified VerdeAI dashboard.
- Hidden older prototype/free-test layers instead of building more panels around them.
- Dashboard now presents: Property Today, Six Futures, Recommendation, Compass, Oracle, Movie and Next Steps in one coherent screen.
- Reuses existing future logic while creating a more professional target-dashboard experience.
