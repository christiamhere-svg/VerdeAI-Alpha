# VerdeAI v9.1 Workshop Build

## Purpose

Preserve the successful Android calibration controls from v9.0 while cleaning the photo-first result, reducing editor clutter, preventing stale mixed-asset deployments, and proving calibration persistence in the browser harness.

## Genuine phone evidence used

Live v9.0 Android screenshots and the owner’s note confirmed that:

- calibration opened successfully;
- handles were easy to drag with one finger;
- keep-clear placement worked;
- marker 5 could be moved;
- Undo and Done were reachable;
- the page did not significantly fight the drag gesture;
- the old `Your Property Today` wrapper and privacy/setup content remained visible in the concept area;
- the camera control still appeared over the supplied photo presentation;
- inactive handles and labels made the editor unnecessarily busy;
- the completed result still looked too much like an editing screen.

## v9.1 changes

### Clean photo-only visual panel

- Replaced the concept stage’s CSS background-only photo with one dedicated `img.photo-concept-image` element.
- Added a strict visual-panel contract and runtime integrity marker.
- Defensively removes any intake form, upload drop zone, privacy panel, field grid, or legacy card that appears inside the photo visual host.
- Added unique v9.1 asset filenames:
  - `styles/main.v9.1.css`
  - `js/app.v9.1.js`
  - `config.v9.1.js`
- The unique filenames prevent Cloudflare or a browser from combining a new HTML file with an older app script.

### Cleaner calibration

- Preserved the five-step workflow and the proven large drag targets.
- Only handles belonging to the current step remain visible.
- Keep-clear boxes and labels appear only during the Keep clear step.
- The access-route editor line appears only during the Access step.
- Concept markers and the mode chip are hidden while calibration is open.
- The usable-area boundary remains as a quiet orientation guide.

### Clean finished presentation

- All calibration handles, keep-clear boxes, editor outlines, and step instructions disappear after `Done placing concept`.
- Only marker 5 remains on the finished image, connecting the picture to the practical first move.
- The finished photo keeps the concept overlay, compact recommendation label, legend, and first-move instruction.
- `Replace photo` remains outside the image under a collapsed `Edit photo or clues` disclosure.
- Privacy wording remains available under the disclosure rather than showing behind the photograph.

### Mobile behaviour

- Mobile workspace tabs now remain in normal document flow instead of sticking over the visual card.
- Verified no horizontal overflow at 360, 390, 412, and 430 pixels.
- Existing touch targets, pointer capture, edge clamping, and drag scroll locking remain unchanged.

### Persistence and consistency

- Browser validation confirms calibration survives Done, report/tab changes, future selection, autosave, manual save, reload, and session recovery.
- The restored editor stays closed until the user opens it.
- VerdeAI Concept continues to show the recommendation.
- Selected Future continues to show the tester’s selection.
- Recommended and Selected remain independent.

### Safety

- Real AI rendering remains disabled.
- Backend remains unconnected.
- API keys remain absent from frontend code.
- Provider calls remain off.
- Paid calls remain locked.

## Validation summary

Passed:

- JavaScript syntax;
- smoke tests;
- feedback evidence tests;
- static HTML/CSS/ARIA validation;
- clean visual-panel integrity checks;
- active-step-only calibration visibility;
- clean finished-result checks;
- recommendation/selection consistency;
- autosave, save/load, and refresh recovery;
- 360/390/412/430/1440 pixel layouts;
- credential scan;
- ZIP integrity.

## Known boundary

v9.1 has not yet been tested on a physical Android phone after deployment. Genuine v9.0 evidence supports the unchanged drag interaction, while v9.1 clean-panel and refresh-persistence findings are from Chromium automation.
