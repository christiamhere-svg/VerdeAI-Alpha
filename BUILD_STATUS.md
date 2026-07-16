# VerdeAI Build Status — v9.1 Workshop Build

**Status:** Deployment-ready static build  
**Build:** v9.1  
**Primary outcome:** clean photo-first result without weakening the proven phone calibration controls

## Evidence boundary

| Evidence | Classification | Supported finding | v9.1 response |
|---|---|---|---|
| Live v9.0 Android calibration screenshots | Genuine physical-phone evidence | Handles were easy to drag; keep-clear and marker 5 worked; Undo and Done were reachable | Drag mechanics, hit targets, pointer capture, scroll lock, and five-step workflow preserved |
| Live v9.0 Android result screenshots | Genuine physical-phone evidence | Legacy `Your Property Today` content, privacy/setup text, and excessive editor clutter remained visible | Dedicated photo-only visual host, defensive legacy-content removal, active-step-only editor visibility, clean finished state |
| Owner note: “Dragging was easy!” | Genuine physical-phone evidence | The touch system should not be redesigned | No drag-gesture redesign was made |
| v9.1 Chromium visual workflow | Internal browser evidence | Clean panel, active-step isolation, clean Done state, recommendation/selection consistency | Passed |
| v9.1 Chromium refresh harness | Internal browser evidence | Calibration values and marker 5 restore while editor remains closed | Passed |
| v9.1 physical Android deployment | Not yet supplied | No claim about v9.1 device-specific layout, browser chrome, or refresh persistence | Required after deployment |
| Firefox/Safari/WebKit | Not tested | No cross-engine claim | Still outstanding |
| Public-tester comprehension | Not tested | No tester trend claimed | Still outstanding |

## Completed in v9.1

- Dedicated property-photo element inside the visual concept stage.
- Strict clean-panel integrity contract.
- Unique deployment asset filenames to prevent stale mixed versions.
- Active-step-only calibration controls.
- Keep-clear labels shown only when relevant.
- Finished result hides all editor geometry.
- Marker 5 remains as the sole finished-image marker.
- Replace-photo and privacy controls remain outside the image.
- Edit controls collapsed under `Edit photo or clues`.
- Mobile tabs no longer stick over the concept card.
- Calibration persistence verified through automated refresh and save/load checks.
- Build and share-code identifiers updated to v9.1.

## Validation

| Check | Result |
|---|---|
| JavaScript syntax | Passed |
| Smoke test | Passed |
| Feedback evidence unit test | Passed |
| Static validation | Passed |
| Clean visual-panel runtime assertion | Passed |
| Only active calibration controls visible | Passed |
| Finished editor geometry hidden | Passed |
| Finished marker count | One: marker 5 |
| Autosave / refresh recovery | Passed in Chromium harness |
| Manual save/load | Passed in Chromium harness |
| Recommended vs Selected | Passed |
| 360 px | 0 px overflow |
| 390 px | 0 px overflow |
| 412 px | 0 px overflow |
| 430 px | 0 px overflow |
| 1440 px | 0 px overflow |
| Credential scan | Passed |
| ZIP integrity | Passed before delivery |

## AI pilot decision

**No — do not enable paid AI rendering yet.**

The product is now much closer to a credible one-image pilot, and the secure scaffold remains suitable. One final live v9.1 Android confirmation is still advisable because:

1. the clean finished panel has not been seen on the deployed phone build;
2. full refresh persistence has only been proven automatically, not by a live-phone screenshot;
3. property photos should not leave the browser until that last usability and persistence check passes.

Keep the pilot state:

- kill switch on;
- test mode on;
- provider calls off;
- paid calls locked;
- API key absent from frontend code.

## Immediate live test after deployment

1. Confirm the badge says `Build v9.1`.
2. Open the courtyard project.
3. Open placement and confirm only the active step’s handles appear.
4. Tap Done and confirm all editor boxes and handles disappear.
5. Refresh the page.
6. Confirm marker 5 and the adjusted concept remain, with the editor closed.

## New-chat recommendation

Move the project to a new chat **after v9.1 is deployed and the two live screenshots above are captured**. That is the next clean milestone boundary: calibrated overlays are stable, and the following chat can focus solely on the secure one-image rendering pilot decision.
