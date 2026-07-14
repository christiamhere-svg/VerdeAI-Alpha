# VerdeAI v8.5 Workshop Build — Build Status

Status: Ready for GitHub / Cloudflare Pages deployment and live-phone validation.

## Milestone completed
v8.5 prepares VerdeAI for a small public-tester batch by making local feedback reviewable, exportable, private by default, and more accessible—without connecting a backend or paid rendering.

## Feedback records
Every newly saved response contains:
- Build version and timestamp.
- Property situation and pattern.
- VerdeAI Recommended future.
- Tester Selected future.
- Useful / Confusing / Not believable reaction.
- Usefulness score and optional note.
- Preferred direction, main problem, starter clue, and test source.

Older v8.4-era local feedback is normalised into the new review format where possible.

## Local Feedback Review
- Added totals for all responses, Useful, Confusing, and Not believable.
- Shows the 12 most recent feedback records with recommendation, selection when different, situation, problem, note, build, and time.
- Supports deleting one response or clearing all feedback independently from saved projects.
- Remains local to the current browser/domain; no backend is required.

## Spreadsheet export
- CSV filename: `verdeai-v8-5-feedback.csv`.
- UTF-8 BOM improves Excel/spreadsheet compatibility.
- Includes ISO timestamp and readable local time.
- Includes explicit Recommendation and Selection columns.
- Includes reaction, score, optional note, scenario detail, source, and record ID.

## Privacy wording
The interface now explains in plain English:
- Uploaded photos are processed in the browser in the current static beta.
- VerdeAI does not send photos to a VerdeAI backend in this build.
- Autosaved sessions, saved projects, and feedback remain in the current browser/domain.
- Exporting, copying, or sharing is a deliberate user action.

## Accessibility pass
- Added a dedicated polite screen-reader status region.
- Added tab `aria-selected` and tab-panel `aria-hidden` states.
- Added Left/Right/Home/End keyboard movement between visible workspace tabs.
- Kept all tabs reachable by normal keyboard tabbing, including More Tools items.
- Quick-feedback controls expose pressed state.
- Photo privacy text is programmatically connected to the file input.
- Focus visibility was strengthened for tabs, links, and More Tools.
- Reduced-motion support remains active.
- Added increased-contrast and forced-colour support.

## Preserved product behaviour
- Four scenario-specific v8.4 analysis paths.
- Independent Recommended and Selected futures.
- Upload, demo mode, and shaded self-test.
- Starter clues, analysis, property overlays, and six future cards.
- Reports, design refinements, save/load, share code, export, history, and Vision Board.
- Tester Page, Design Studio, and AI Setup.
- v8.4 share-code import compatibility.

## Safe rendering state
- Real AI rendering: Disabled.
- Backend: Not connected yet.
- API key: Not added.
- Paid calls: Locked.
- Frontend provider secrets: None found.

## Validation completed
- JavaScript syntax check passed for both runtime copies.
- Automated project smoke test passed.
- Feedback unit test passed for new records, legacy migration, counts, and CSV output.
- HTML ID and ARIA target validation passed.
- CSS parsing passed with no parser errors.
- Duplicate runtime JS and CSS files are byte-for-byte synchronized.
- Required assets exist.
- Credential-pattern scan passed.
- Package metadata and visible build labels are v8.5.

## Browser-validation limitation
A local dynamic Chromium/Firefox/WebKit run was attempted. The execution environment blocked browser navigation to local test pages with `ERR_BLOCKED_BY_ADMINISTRATOR`, and Firefox/WebKit binaries could not be downloaded because container internet access is disabled. No claim of a completed three-engine visual test is made. The existing v8.4 phone layouts were preserved, and the v8.5 additions use standard responsive CSS; the deployment checklist below is still required.

No new external tester-feedback dataset was supplied with this milestone, so v8.5 builds the collection/review system rather than claiming evidence from testers who have not yet responded.

## Live-phone validation after deployment
1. Confirm `Build v8.5` appears in the header and footer.
2. Run the shaded self-test and tap Useful.
3. Open Saved and confirm Local Feedback Review shows one response with build, situation, recommendation, reaction, and time.
4. Select a future different from the recommendation, save another response, and confirm both Recommended and Selected are shown.
5. Add an optional note and confirm it appears in the review card.
6. Export the CSV and open it in a spreadsheet.
7. Test keyboard focus and arrow navigation on desktop.
8. Check the Saved / Feedback Review screen at phone width for clipping or horizontal scrolling.
9. Confirm the privacy wording is visible near photo upload.
10. Confirm AI Setup remains Disabled / Not connected yet / Not added / Locked.
