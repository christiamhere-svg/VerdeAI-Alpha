# VerdeAI Build Status — v8.9.2 Hotfix

## Status

**Ready for static Cloudflare Pages deployment.**

This focused hotfix repairs the real-phone v8.9.1 failure where a restored board showed an active recommendation but the analysis state remained incomplete, leaving calibration disabled and hiding the concept SVG.

## Real-phone evidence addressed

| Evidence from live v8.9.1 | v8.9.2 response |
|---|---|
| `Adjust placement after analysis` remained disabled despite an active Gathering Space recommendation | Analysed-state recovery now uses persisted analysis evidence instead of trusting one stale Boolean flag |
| VerdeAI Concept showed no overlay | Concept rendering now synchronizes the analysed state before deciding whether to draw the overlay |
| Calibration did not open from a restored project | The top and result buttons call one robust calibration-opening path |
| Old property-input/privacy content appeared in the visual area | Visual host receives a module-integrity marker and defensive cleanup; editing actions live outside the photo |
| Replace-photo control obscured the photograph | Dashboard replacement control is outside the image |

## Analysis-state synchronization

A valid analysed board is restored when durable evidence exists, including:

- prior analysis snapshot;
- generated property DNA or noticed findings;
- a valid property scenario and recommendation;
- an uploaded/demo/self-test source;
- a previous analysis timestamp.

The synchronization path is used by:

- fresh analysis;
- page refresh and autosave recovery;
- manual project loading;
- demo mode;
- shaded self-test;
- share-code import;
- dashboard controls;
- concept visual rendering.

## Calibration behavior

After an analysed board is available:

- **Adjust concept placement** is enabled;
- tapping it activates Futures Board;
- visual mode changes to **VerdeAI Concept**;
- **Help VerdeAI place the concept** opens;
- usable-area, keep-clear, access-route, opportunity, and marker-5 handles render;
- focus and scrolling move to the visual module;
- calibration remains stored with autosave and saved projects.

## Visual-panel integrity

The visual module contains only:

- Original / VerdeAI Concept / Selected Future controls;
- one property image;
- the matching concept overlay;
- compact context and legend;
- calibration controls while open.

`Replace photo` and `Edit photo or clues` are placed outside the image. Intake, privacy, and clue controls are not generated inside the visual host.

## Deployment integrity

Active frontend resources are cache-busted as:

- `styles/main.css?v=8.9.2`
- `config.js?v=8.9.2`
- `js/app.js?v=8.9.2`

The header, footer, runtime state, configuration, tests, and package metadata identify **Build v8.9.2**.

AI Setup includes:

**Calibration module: Ready**

## Validation completed

- JavaScript syntax: passed.
- Smoke tests: passed.
- Feedback evidence tests: passed.
- Static HTML/CSS/ARIA/assets/duplicate-ID validation: passed.
- Fresh uploaded-photo analysis: passed.
- Autosave recovery with a deliberately stale `analysisComplete: false` state: passed.
- Manual save/load and refresh persistence: passed.
- Demo-mode calibration entry: passed.
- Shaded-self-test calibration entry: passed.
- Recommendation overlay consistency: passed.
- Calibration editor handles: passed.
- 360, 390, 412, and 430 px phone widths: passed with no material horizontal overflow.
- 1440 px desktop check: passed.
- Secret scan: passed.
- ZIP integrity: passed after final packaging.

## Safety state

- Real AI rendering: **Disabled**
- Backend: **Not connected yet**
- API key: **Not added**
- Paid calls: **Locked**
- Calibration module: **Ready**

No provider credential was added to frontend code.

## Browser-testing limitations

Chromium ran through an inline local harness because normal local navigation was restricted. The supplied screenshots came from the live Android test, but this package was not deployed to the live Cloudflare address from the build environment. Firefox, Safari, and WebKit were unavailable. A physical-phone confirmation remains required after deployment.

## Live confirmation checklist

1. Confirm the page shows **Build v8.9.2**.
2. Refresh the existing analysed courtyard project.
3. Confirm **Adjust concept placement** is enabled without rerunning analysis.
4. Open it and confirm all calibration controls appear.
5. Confirm Gathering Space creates a visible concept treatment.
6. Confirm Original removes the treatment and Selected Future follows the tester selection.
7. Confirm AI Setup says **Calibration module: Ready** while all rendering locks remain active.
