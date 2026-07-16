# VerdeAI v9.0 Workshop Build

Date: 2026-07-15

## Purpose

Harden the v8.9.2 user-guided calibration editor for phone use without pretending a physical Android test occurred and without activating paid AI rendering.

## Calibration usability

- Reworked placement into five numbered steps: Ground, Keep clear, Access, Opportunity and First move.
- Added a compact current-step card with plain-English instructions.
- Added prominent **Done placing concept** actions above and below the property image.
- Reordered actions so Undo and Reset are easy to recognise.
- Added 98-unit SVG hit targets behind every active handle.
- Corrected handle aspect distortion so handles remain approximately circular on tall phone images.
- Added edge-safe display clamping so draggable handles remain reachable near photograph boundaries.
- Constrained usable-area corners to prevent a self-crossing ground polygon.
- Limited dragging to the currently selected step; inactive handles remain visible but cannot intercept touches.
- Fixed an internally detected collision where an inactive usable-area hit target could block an active keep-clear corner.
- Added pointer capture, pointer-cancel handling and drag scroll locking.
- Live geometry now updates while dragging: usable outline, access route, keep-clear mask and marker positions.
- Keep-clear labels are centred and enlarged.
- Added explicit Undo, Reset and Done validation.

## Mobile hierarchy

- Hides workspace navigation and the keyboard skip link while the calibration editor is open, preventing them from covering placement controls.
- Removed the experimental sticky finish bar after it was found to cover lower image handles in internal Chromium testing.
- Hides the concept-overlay disclaimer while editing to reduce obstruction; the disclaimer returns when placement is closed.
- Preserves Original, VerdeAI Concept and Selected Future modes.
- Preserves Recommendation and Selected independence.

## Persistence and compatibility

- Calibration continues to survive refresh, autosave recovery, manual save/load, future selection, reports, tab changes and session recovery.
- Share codes now use the `VERDEAI90:` prefix while continuing to import older supported prefixes.
- Updated visible, stored, configuration, package and scaffold identification to Build v9.0.
- Cache-busted active CSS, configuration and JavaScript assets with `v=9.0`.

## AI pilot state

- Added a visible AI Setup status: **One-image AI pilot — Prepared · not approved**.
- Real provider calls remain off.
- Kill switch and test mode remain on by default.
- No provider, backend host or budget has been selected on the owner's behalf.
- Updated the pilot recommendation: do not begin paid rendering until one physical-phone v9.0 calibration pass is supplied and approved.

## Evidence boundary

No live v8.9.2 Android screenshots showing the calibration editor were attached with the v9.0 prompt. The v8.9.1 screenshots remain valid evidence for the previously fixed disabled-button and duplicated-panel failures, but they do not prove v9.0 drag usability. All v9.0 interaction findings are labelled internal Chromium validation.

## Validation

- JavaScript and backend syntax passed.
- Smoke, feedback-evidence and static validation passed.
- Real courtyard-photo workflow passed in Chromium.
- Pointer drag scroll lock, edge clamping, active-tool isolation, Undo, Reset and Done passed.
- Save/reload and session persistence passed.
- Recommended versus Selected consistency passed.
- Widths 360, 390, 412 and 430 pixels passed with zero measured horizontal overflow.
- Desktop width 1440 pixels passed.
- Secret scan passed.
- ZIP integrity passed.

## Limitations

- No physical Android interaction test was supplied or performed.
- Chromium ran through an inline local harness, not the deployed Cloudflare URL.
- Firefox, Safari and WebKit were unavailable.
