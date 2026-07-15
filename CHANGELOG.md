# Changelog

## v8.9 — Constrained photo calibration and secure pilot preparation
- Added optional Help VerdeAI place the concept calibration directly beside the main property image.
- Added a draggable four-point usable-area polygon; concept layers are clipped inside it.
- Added up to four resizable keep-clear boxes; concept layers are masked away from protected structures and objects.
- Added a two-point protected access route that also removes concept layers beneath the route.
- Added draggable opportunity and first-move locations, with marker 5 linked to courtyard-specific reversible wording.
- Added Undo, Reset to VerdeAI layout, Done, large touch handles, keyboard arrow movement, status announcements, and reduced-motion-safe behaviour.
- Stored calibration with autosave, manual projects, reload, share/export state, Selected Future changes and session recovery.
- Added a dedicated courtyard/patio preset using containers, narrow edge planting, circulation, seating, lighting and surfaces rather than floating trees or assumed open soil.
- Kept VerdeAI Concept tied to Recommended and Selected Future tied to the tester selection.
- Moved the photo replacement control outside the photograph.
- Strengthened the disabled backend pilot scaffold with a hard kill switch, test mode, one-image restriction, privacy/render/cost confirmation, image limits, rate limits, timeout and mock fallback.
- Updated visible build labels, filenames, share prefix, docs and tests to v8.9.
- Kept real rendering disabled, backend unconnected, provider keys absent, and paid calls locked.

## v8.8 — Photo-first visual transformation layer
- Moved the property image ahead of recommendation text and long supporting sections in the generated board.
- Added a three-mode visual switch: `Original`, `VerdeAI Concept`, and `Selected Future`.
- Added a responsive static SVG overlay engine with perspective-shaped ground surfaces, planting masses, routes, focal zones, work pads, storage boundaries, seating, food beds, habitat, lighting, and material treatments.
- Added four scenario geometries for under-building/shade, blank canvas/front yard, overgrown recovery, and workshop/awkward access.
- Added six visibly different future treatments for Belonging, Sanctuary, Possibility/Wildlife, Gathering, Productive, and Maker/Workshop directions.
- Added five mapped markers for Existing access, Opportunity, Constraint, Intervention, and First move.
- Linked marker 5 to the current property-specific reversible first move.
- Added `View this future on my photo` to every future card and a compact return-to-photo action.
- Kept VerdeAI’s Recommended future independent from the tester’s Selected future while making the selected overlay update immediately.
- Reused the richer visual system in Tester Page and Compare.
- Shortened mobile future cards and removed duplicate supporting bullet lists.
- Updated visible build identification, download filenames, share-code prefix, backend scaffold metadata, and documentation to v8.8.
- Preserved the v8.7 feedback evidence boundary and all existing product functionality.
- Kept real AI rendering disabled, backend unconnected, API keys absent, and paid calls locked.

## v8.7 — Genuine tester evidence boundary
- Added explicit feedback evidence types: `Tester response`, `Owner / internal check`, and `Unclassified legacy`.
- Defaulted self-test, demo, and clue-only feedback to internal checks while uploaded-photo results default to tester responses; both remain manually adjustable.
- Prevented internal and unclassified records from contributing to tester trends, repeated-issue claims, recommendation-versus-selection percentages, or repeated-note wording.
- Added an Evidence filter and a clear boundary summary showing tester, internal, and unclassified counts.
- Added an optional issue-area tag for result specificity, photo/overlay, Recommended versus Selected, six futures, first move, navigation/mobile layout, save/copy/export, or other.
- Added repeated tester note wording detection that requires the same word or phrase across at least two genuine tester comments.
- Reworked grouped evidence into evidence types plus tester-only reactions, situations, recommendations, and selections.
- Expanded Feedback CSV export/import with `Evidence type` and `Issue area`; older CSV records without evidence classification are imported conservatively rather than promoted to tester evidence.
- Kept real tester and internal feedback from overwriting each other on the same unchanged result while retaining same-context duplicate updates within each evidence type.
- Updated visible build identification, filenames, share-code prefix, backend scaffold metadata, and deployment files to `Build v8.7`.
- Preserved all existing property futures functionality and kept real AI rendering disabled, backend unconnected, provider keys absent, and paid calls locked.

## v8.6 — Evidence-led feedback cycle
- Added reaction, situation, and build filters to Local Feedback Review.
- Added grouped evidence counts for reactions, property situations, VerdeAI recommendations, and tester selections.
- Added a compact recommendation-versus-selection summary with exact counts and the percentage of testers choosing a different future.
- Added cautious evidence interpretation: one response is labelled insufficient, and a repeated issue is only surfaced when at least two records support it.
- Added local Feedback CSV import so exported tester records can be merged without a backend; imports are size-limited, row-limited, and deduplicated by record ID.
- Expanded CSV export with `Selected different from recommendation`, evidence origin, context ID, and record ID fields.
- Prevented accidental duplicate one-tap feedback on the same unchanged board by updating the recent matching record instead.
- Fixed stale restore paths that forced loaded/recovered projects to version 8.4 and could corrupt build-version evidence.
- Preserved v8.5 feedback records, saved projects, sessions, legacy feedback migration, and older share-code import compatibility.
- Updated visible build identification and deployment metadata to Build v8.6.
- Kept real AI rendering disabled, backend unconnected, provider keys absent, and paid calls locked.

## v8.5 — Local feedback review, privacy, and accessibility
- Expanded every tester feedback record to include build version, timestamp, property situation, property pattern, VerdeAI recommendation, tester-selected future, reaction, score, optional note, preferred direction, main problem, starter clue, and test source.
- Added migration logic so older locally stored feedback remains readable instead of being discarded.
- Added a Local Feedback Review area with total, Useful, Confusing, and Not believable counts plus the 12 most recent records.
- Added per-record deletion and a separate Clear Feedback action without affecting saved projects.
- Rebuilt Feedback CSV export with spreadsheet-friendly column names, UTF-8 BOM, ISO and local timestamps, recommendation and selection fields, optional notes, and record IDs.
- Shortened the copied tester invitation for text, Messenger, or Facebook while keeping the reply request clear.
- Added plain-English privacy wording beside photo upload, in Tester Mode, and in Saved: photos, project data, and feedback remain in the current browser unless deliberately exported or shared.
- Stopped feedback score/note typing from rerunning the property analysis.
- Added a screen-reader status region, clearer pressed states for quick feedback, tab ARIA state, keyboard arrow navigation, stronger focus visibility, increased-contrast support, forced-colour support, and retained reduced-motion behaviour.
- Updated visible build identification, filenames, share-code prefix, backend scaffold metadata, and deployment files to `Build v8.5`.
- Kept v8.4 share-code import compatibility.
- Preserved the v8.4 scenario engine, independent Recommended/Selected states, uploads, self-test, reports, save/load, export, history, Vision Board, Tester Page, Design Studio, and safe AI Setup.

## v8.4 — Multi-scenario credibility and tester handoff
- Added distinct scenario rules for under-building/shade, blank canvas/front yard, overgrown/tired garden, and workshop/shed/awkward-access areas.
- Added quick starter clues for `Mostly blank / open` and `Workshop / storage area` so testers can reach those scenarios without guessing.
- Made pattern diagnosis, future ranking, overlay labels, recommendation reasoning, and first moves change meaningfully by situation.
- Added scenario weighting before score normalization so the visible percentages remain readable while the ranking reflects the property problem.
- Updated the four expected best fits: Sanctuary Garden for deep shade, Belonging Garden for a blank canvas, Possibility Garden for an overgrown recovery, and Maker / Workshop Yard for work/access flow.
- Added a persistent `recommendedFutureId` so VerdeAI's recommendation is independent from the tester's selected future.
- Preserved Recommended and Selected through design refinements, reports, dashboard/tab changes, local save, and reload.
- Updated report and share text to state both Recommended and Selected when they differ.
- Rebuilt the copied tester result into a short property-specific handoff suitable for text or Facebook: best fit, why, first move, overlay summary, and one reply prompt.
- Added one-tap `Useful`, `Confusing`, and `Not believable` feedback controls to the dashboard and tester feedback area.
- Added a compact after-comparison first-move reminder below the six futures.
- Reduced post-analysis mobile clutter by hiding recovery/setup cards and keeping the main board in a clearer result-first order.
- Verified six future cards at 390 px without horizontal overflow or runtime errors.
- Updated visible build identification to `Build v8.4`.
- Preserved upload, demo mode, self-test, starter clues, analysis, overlays, reports, save/load, export, history, Vision Board, Tester Page, Design Studio, and AI Setup.

## v8.3 — Overlay and Six Possible Futures polish
- Added a visible `Build v8.3` label in the header and build/safety footer.
- Reworked phone overlays into four numbered markers with a matching key below the property photo.
- Added the numbered overlay key to the main dashboard photo as well as Tester Page and Compare.
- Replaced emoji plant stickers with softer abstract planting masses, access bands, and material zones.
- Added one section-level `Concept Board · Not AI Render` trust label and shortened repeated per-card warnings.
- Gave all six futures distinct photo treatments while preserving the same property image as the visual anchor.
- Rebuilt mobile concept boards as one photo plus a compact plan inset, reducing card height and repeated visual blocks.
- Shortened future-card copy and reduced duplicate tags while retaining design intent and property-specific context.
- Combined status wording to `Recommended · Selected` when both states apply.
- Fixed a snapshot bug that reset the chosen future back to the recommendation after selection. Recommended and Selected now remain independent.
- Preserved upload, clues, analysis, reports, save/load, export, history, Vision Board, Tester Page, and AI Setup.

## v8.2 — Real-phone result-board cleanup
- Collapsed the completed setup checklist into a compact Result ready strip after analysis.
- Removed the repeated no-upload self-test card once a board already exists.
- Changed the post-analysis coach from public-feedback instructions to a direct View result action.
- Fixed generated-board scrolling so the sticky workspace tabs no longer cover the result heading.
- Rebuilt the top result card around one answer: best-fit future, why it fits, and the first move.
- Removed the three stacked mobile counters and hid the oversized 100% readiness block on phones.
- Shortened top actions to Compare futures and Copy result.
- Kept board-readiness detail available on larger screens without letting it outrank the recommendation.
- Preserved upload, clues, analysis, overlays, reports, save/load, export, history, Vision Board, and AI Setup.

## v8.1 — Mobile result-board hierarchy
- Reworked the generated result summary so the current best-fit future is the headline rather than a generic “result ready” message.
- Added a clearly labelled First move callout near the top of the result board.
- Compressed result cues and board-readiness information for quicker mobile scanning.
- Reduced repeated setup/share content after a board is generated on small screens.
- Kept upload, self-test, futures jump, and result-copy controls available in a compact mobile control area.
- Changed future-card status wording to `Concept Board`, `Recommended`, and `Selected`.
- Strengthened the active future-card border and selection state.
- Removed the duplicated match score from future-card footers.
- Reduced the height of mobile concept boards and hid low-priority material chips to shorten the six-card comparison scroll.
- Added keyboard activation and `aria-pressed` state to Property Futures Board cards.

## Safety
- Real AI rendering remains disabled.
- Backend remains not connected yet.
- API key remains not added.
- Paid calls remain locked.
- No provider key is stored in frontend code.
- Short walkthrough video remains future roadmap only.
