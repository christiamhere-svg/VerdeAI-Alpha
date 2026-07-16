# VerdeAI v9.1.1 Hotfix Build

## Purpose

v9.1.1 is a focused deployment hotfix based on genuine live Android evidence from v9.1. The phone calibration interaction already worked; the remaining failure was visual contamination around the concept image.

## Fixed

- Added a new independent `dashboardConceptStageHost` for the visual result.
- The host is populated with `replaceChildren()` and never clones, moves, wraps, or reuses the legacy `Your Property Today` card.
- Added a runtime `assertConceptHostIntegrity()` check.
- The integrity check rejects intake, upload, privacy, situation, starter-clue, camera, legacy panel-title, and legacy panel-body nodes inside the concept host.
- Added a static and browser-test assertion that the concept host contains no legacy intake or privacy nodes.
- Removed the obsolete circular camera control from the concept presentation.
- Kept the labelled `Replace photo` action outside the visual panel under `Edit photo or clues`.
- Preserved the proven five-step phone calibration and enlarged drag targets.
- After `Done placing concept`, all handles, keep-clear boxes, editor outlines, access controls, and opportunity controls are hidden.
- Marker 5 remains only when it supports the first-move instruction.
- Added a photo-source warning outside the visual stage for screenshot-shaped uploads. If UI text is baked into the uploaded image, VerdeAI now explains that the original property photo must be selected.
- Confirmed refresh/session recovery restores the clean concept with the editor closed.
- Updated build and share-code identification to v9.1.1.

## Deployment integrity

Unique changed assets:

- `styles/main.v9.1.1.css`
- `js/app.v9.1.1.js`
- `config.v9.1.1.js`

The canonical compatibility files remain byte-identical to the versioned assets.

## Safety state

Unchanged:

- Real AI rendering disabled.
- Backend unconnected.
- API key absent from frontend code.
- Provider calls off.
- Paid calls locked.
