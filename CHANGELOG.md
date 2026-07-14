# Changelog

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
