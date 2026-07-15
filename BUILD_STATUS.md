# VerdeAI v8.9 Workshop Build — Build Status

Status: Ready for GitHub / Cloudflare Pages deployment and real-phone calibration testing.

## Milestone completed
v8.9 replaces blind photo decoration with a constrained, user-guided placement system. The automatic overlay is now a conservative starting layout rather than a claim that VerdeAI understands every pixel.

The main photo includes an optional **Help VerdeAI place the concept** control. A user can correct the layout with large handles for:
- a four-point usable area;
- up to four keep-clear boxes;
- a protected two-point access route;
- the main opportunity point;
- marker 5, the first-move location.

Concept layers are clipped to the usable polygon, masked out of keep-clear boxes, and masked away from the protected route. Calibration data is stored inside the normal project state and survives autosave, manual save/load, refresh, selected-future changes, reports, and session recovery.

## Real-photo problem addressed
The supplied courtyard photograph showed v8.8 shapes crossing roofs, walls, windows, doorways, paths, and paving. v8.9 responds directly:
- adds a courtyard-specific conservative preset;
- removes floating feature trees from courtyard treatments;
- uses containers, narrow edge planting, seating, lighting, surface changes, and protected circulation;
- avoids claiming full sun or open soil;
- keeps the VerdeAI Concept tied to the recommended future and Selected Future tied to the tester's choice.

## v8.8 versus v8.9

| Area | v8.8 | v8.9 |
|---|---|---|
| Placement | Fixed scenario SVG shapes | User-correctable calibrated placement |
| Allowed area | Entire image | Four-point usable polygon |
| Buildings/objects | Could be covered | Keep-clear boxes are masked out |
| Access | Decorative route line | Protected route also removes overlay beneath it |
| First move | Fixed marker 5 preset | Draggable marker 5 stored with the project |
| Courtyard | Fell back to broad preset geometry | Dedicated paved/covered courtyard treatment |
| Photo replacement | Camera badge over photo | Replace-photo control outside the image |
| Honesty | Scenario-aware preset | Explicit conservative starting layout plus user correction |

## Calibration behaviour
- **Usable ground:** four draggable points form the clip boundary.
- **Keep clear:** add, resize, remove, undo, or reset up to four rectangular protected areas.
- **Main access:** two draggable endpoints create a protected corridor.
- **Opportunity:** one draggable point records the strongest change location.
- **First move:** marker 5 is draggable and linked to property-specific first-move wording.
- **Undo:** stores the last 12 calibration states.
- **Reset:** restores the scenario's conservative VerdeAI starting layout.
- **Keyboard:** focused handles move with arrow keys; Shift + Arrow moves farther.
- **Touch:** stage scrolling is disabled only while calibration is open.

## Scenario treatments tested
- Courtyard / patio: conservative lower-image usable area, protected building band, narrow containers, circulation, seating and lighting.
- Under-building / shade: low-light ground treatment, dry access and no upper-zone planting.
- Blank / front yard: arrival line and edge structure inside calibrated ground.
- Overgrown / tired: retained structure, revealed route and selective recovery zones.
- Workshop / awkward access: protected bulky-item route, work pad, storage boundary and screening.

## Recommended versus Selected consistency
- `VerdeAI Concept` always renders `recommendedFutureId`.
- `Selected Future` always renders `selectedFutureId`.
- Selecting Productive, Maker, Wildlife, or another future does not move VerdeAI's recommendation.
- Calibration is shared across the property photo but future treatments remain distinct.
- Recommendation, selection, reports, copy, save/load and recovery continue to use independent state fields.

## Safe real-rendering pilot scaffold
Real rendering remains disabled. v8.9 strengthens the dormant backend scaffold with:
- server-only provider keys;
- hard kill switch on by default;
- test mode on by default;
- one-image pilot restriction;
- explicit render, privacy and cost confirmation fields;
- maximum image-size check;
- per-IP/session hourly rate limiter;
- session ID requirement;
- request timeout;
- provider abstraction and mock fallback;
- no-retention policy setting;
- environment-controlled maximum cost.

No paid provider adapter is connected.

## Pilot cost planning snapshot
Provider pricing changes, so verify immediately before enabling any pilot.
- Replicate currently lists FLUX Dev around USD $0.025 per output image and FLUX 1.1 Pro around USD $0.04 per output image.
- OpenAI image models are token-priced; a practical one-image planning allowance is roughly USD $0.05–$0.20 depending on model, image size, edit input and output quality.
- A 20-person pilot limited to one render each should therefore reserve roughly USD $1–$5 plus a safety margin, not six renders per tester.

## Recommendation
VerdeAI is ready for a **small secure rendering pilot scaffold review**, but not yet for automatic public paid rendering.

The safest next pilot is:
1. one manually confirmed image per tester;
2. 10–20 invited testers only;
3. server-side key and no browser key;
4. hard spend cap of about USD $5–$10;
5. source photo resized before upload;
6. provider non-retention/deletion terms verified;
7. automatic fallback to the calibrated concept overlay;
8. kill switch left immediately available.

Do not render all six futures. That is a quick way to turn a garden idea into a tiny invoice sprinkler.

## Validation completed
- JavaScript syntax passed for root and deployment runtime copies.
- Smoke tests passed.
- Feedback evidence tests passed.
- Static HTML, ARIA, CSS, assets, duplicate-ID, synchronized-file and credential-pattern checks passed.
- Chromium test used the supplied real courtyard photo.
- Courtyard analysis recommended Gathering Space and opened VerdeAI Concept with the Gathering treatment.
- SVG usable-area clip, keep-clear mask and access mask were present.
- No feature-tree layer appeared in the courtyard overlay.
- Marker 5 drag, additional keep-clear box, Done, Reset and persisted calibration passed.
- Productive Garden could be selected while Gathering Space remained recommended.
- Saved-session reload preserved calibration and Selected Future.
- Phone widths 360, 390, 412 and 430 px had no material horizontal overflow.
- Desktop 1440 px check passed.
- Shade, blank, recovery and workshop constrained geometry passed smoke/static validation; the real-photo Chromium workflow used the courtyard case.
- AI Setup stayed Disabled / Not connected yet / Not added / Locked.
- Secret scan found no provider credential.

## Browser and device boundary
The automated test uses Chromium and an inline document harness because local navigation is restricted in the build environment. It used the supplied real courtyard photograph, but this is not a physical Android-device drag test. Firefox, Safari and WebKit were unavailable. Real fingers, screen scaling, browser chrome and unusual photo angles still require live-device testing after deployment.

## Live validation after deployment
1. Confirm `Build v8.9` in the header and footer.
2. Upload the courtyard photo and choose Courtyard / patio.
3. Confirm VerdeAI Concept opens on the recommendation.
4. Open Help VerdeAI place the concept.
5. Place the usable polygon around the paved/ground area.
6. Cover doors, windows, roofs and furniture with keep-clear boxes.
7. Move A1/A2 along the required route and marker 5 to the first experiment.
8. Tap Done, save, refresh and confirm the placement returns.
9. Select Productive Garden and confirm Selected Future changes while VerdeAI Concept remains Gathering Space.
10. Confirm AI Setup remains locked.
