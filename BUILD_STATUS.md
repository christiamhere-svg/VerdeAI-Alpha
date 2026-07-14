# VerdeAI v8.4 Workshop Build — Build Status

Status: Ready for GitHub / Cloudflare Pages deployment.

## Milestone completed
v8.4 completes a four-scenario public-tester credibility and handoff pass before any real AI rendering is connected.

## Scenario matrix
| Situation | Primary pattern | Recommended future | First-move emphasis |
|---|---|---|---|
| Under-building / shaded | Sheltered Shade Pocket | Sanctuary Garden | Read the light, protect access, and mark one low-light zone clear of columns/services. |
| Blank canvas / open front yard | Blank Canvas | Belonging Garden | Mark one destination, one open zone, and one boundary before buying. |
| Overgrown / tired garden | Recovery Garden | Possibility Garden | Clear one inspection strip, flag what stays, and reassess before further removal. |
| Workshop / shed / awkward access | Working Yard | Maker / Workshop Yard | Tape the bulky-item route and set one storage boundary that cannot invade it. |

## Credibility improvements
- Scenario-specific language now changes the diagnosis, ranked futures, overlay zones, recommendation rationale, and first move.
- Blank/open and workshop/storage quick clues were added to the starter suggestions.
- Generic one-size-fits-all outputs were replaced with concrete actions tied to shade, openness, retained habitat, work pads, access lines, and storage creep.
- Future ranking uses scenario weighting internally and a normalized visible match score.

## Recommended versus Selected
- VerdeAI’s recommendation is stored independently as `recommendedFutureId`.
- A tester may choose another future without losing the recommendation.
- Recommendation and selection remained correct after a design refinement, report/dashboard tab changes, save, and reload.
- Reports and copied results distinguish `Recommended` from `Selected` when they differ.

## Tester handoff
- Copied results are shorter and designed for text or Facebook.
- The copy includes: property situation, best fit, why it fits, first move, three overlay priorities, and one feedback request.
- Dashboard and feedback panels include one-tap `Useful`, `Confusing`, and `Not believable` reactions.
- The first move is repeated once after the six-future comparison so it is not lost at the end of the scroll.

## Mobile pass
- Browser validation ran at 390 × 844.
- Six cards rendered and remained selectable.
- Body width matched the viewport: no horizontal overflow.
- Post-analysis setup/recovery clutter is hidden on phones.
- The result order keeps the answer and property photo ahead of lower-priority detail.

## Preserved functionality
- Photo upload, demo mode, and shaded self-test.
- Starter clues and clue-guided analysis.
- Property overlay and six future cards.
- Design Studio, reports, save/load, export, history, and Vision Board.
- Tester Page, feedback export, and AI Setup.
- Backend proxy scaffold and mock-render planning.

## Safety retained
- Real AI rendering: Disabled.
- Backend: Not connected yet.
- API key: Not added.
- Paid calls: Locked.
- No provider secret is stored in frontend code.

## Validation completed
- JavaScript syntax checks passed.
- Automated project smoke test passed.
- Four dynamic Chromium scenario runs produced the expected recommendation.
- No runtime exceptions were recorded.
- Recommended/Selected stability passed after selection, refinement, tab changes, save, and load.
- One-tap feedback stored the reaction and recommended future locally.
- Six future cards rendered at phone width without horizontal overflow.
- AI Setup retained `Disabled / Not connected yet / Not added / Locked`.
- Duplicate runtime JS and CSS files were synchronized.
- Required-file, credential-pattern, and ZIP-integrity checks passed.

## Live phone validation after deployment
1. Confirm `Build v8.4` appears in the header or footer.
2. Run each of the four situations in the scenario matrix and confirm the recommended future changes.
3. In the workshop scenario, select Belonging Garden and confirm Maker remains `Recommended` while Belonging becomes `Selected`.
4. Apply a refinement, change tabs, save, reload, and confirm both states remain correct.
5. Copy the tester result and confirm it is short enough to send without editing.
6. Tap a one-touch feedback reaction and confirm the saved message appears.
7. Confirm AI Setup still shows Disabled / Not connected yet / Not added / Locked.
