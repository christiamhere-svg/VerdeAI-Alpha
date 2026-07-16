# VerdeAI Build Status — v9.0 Workshop Build

**Status:** Deployment-ready static build  
**Date:** 2026-07-15  
**Build:** v9.0

## Milestone result

v9.0 completes an internal phone-width hardening pass for the calibration editor and leaves the secure one-image AI pilot prepared but unapproved.

## Physical-phone evidence table

| Evidence | Classification | Finding | v9.0 response |
|---|---|---|---|
| Live v8.9.1 Android screenshots supplied earlier | Genuine physical-phone evidence, previous build | Adjustment was disabled; old intake content was duplicated; camera control covered the photo | Fixed in v8.9.2 and preserved in v9.0 |
| Live v8.9.2 Android screenshots requested in the v9.0 prompt | Not supplied | No honest conclusion can be made about real-finger drag difficulty, browser chrome or physical-device performance | v9.0 does not claim a physical-phone pass |
| v9.0 Chromium courtyard screenshot | Internal browser evidence | Sticky workspace navigation and the focused skip link could cover calibration controls | Navigation and skip link are hidden only while calibration is open |
| v9.0 Chromium pointer test | Internal browser evidence | Inactive SVG hit targets could intercept a keep-clear corner; edge handles could become visually clipped | Inactive descendants cannot receive pointer events; handles are aspect-corrected and edge-clamped |
| v9.0 responsive tests at 360, 390, 412 and 430 px | Internal browser evidence | No horizontal overflow after hardening | Passed at all four widths |

## Calibration status

| Capability | Status |
|---|---|
| Five plain-English placement steps | Passed |
| Active-step-only dragging | Passed |
| Large touch targets | Passed in Chromium pointer simulation |
| Approximately circular handles on tall images | Passed |
| Edge-safe handles | Passed |
| Pointer capture and drag scroll lock | Passed in Chromium pointer simulation |
| Keep-clear masking | Passed |
| Access-route protection | Passed |
| Marker 5 movement | Passed |
| Undo | Passed |
| Reset to VerdeAI layout | Passed |
| Done placing concept | Passed |
| Save/reload persistence | Passed |
| Session recovery persistence | Passed |
| Physical Android fingers/browser chrome | Pending owner-supplied live test |

## Recommendation and selection

- VerdeAI Concept remains tied to `recommendedFutureId`.
- Selected Future remains tied to `selectedFutureId`.
- Selecting Productive Garden does not move the Gathering Space recommendation.
- Calibration alignment is shared without overwriting either future state.

## AI safety state

| Control | State |
|---|---|
| Real AI rendering | Disabled |
| Backend | Not connected yet |
| API key | Not added |
| Paid calls | Locked |
| Kill switch | On by default |
| Test mode | On by default |
| One-image pilot | Prepared · not approved |
| Provider | Owner approval required |
| Backend host | Owner approval required |
| Budget | Owner approval required |

## Pilot recommendation

**Do not begin paid rendering yet.** The code scaffold is sufficient for a later one-image pilot, but the calibration editor still needs one genuine v9.0 Android pass before photo upload is allowed to leave the browser. The next approval gate is evidence, not more scaffolding.

Minimum approval evidence:

1. A live v9.0 screenshot with calibration open.
2. A short note confirming Ground, Keep clear and marker 5 can be dragged with one finger.
3. A screenshot after refresh proving placement survives.
4. Owner decisions for provider, backend host and total budget cap.

## Validation boundary

Chromium used an inline local harness with the supplied courtyard crop. No deployed-host, physical Android, Firefox, Safari or WebKit test was performed.
