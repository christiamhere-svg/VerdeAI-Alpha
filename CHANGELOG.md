# Changelog

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
