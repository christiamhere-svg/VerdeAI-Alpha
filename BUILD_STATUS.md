# VerdeAI v8.6 Workshop Build — Build Status

Status: Ready for GitHub / Cloudflare Pages deployment and live-phone evidence collection.

## Milestone completed
v8.6 turns Local Feedback Review into an evidence-led workspace. It adds filters, grouped counts, recommendation-versus-selection metrics, cautious repeated-issue logic, CSV import, and persistence checks without connecting a backend or paid rendering.

## Evidence supported by supplied tester material
- No v8.5 phone screenshots, tester comments, or Feedback CSV records were supplied with this build request.
- Therefore, no public-tester conclusion is claimed and no scenario was rewritten on invented evidence.
- Earlier owner screenshots from v8.1/v8.2 informed previous mobile cleanup, but they are not treated as v8.5 public-tester evidence.

## Internal findings and fixes
- Found two stale restore paths that forced loaded projects and recovered sessions back to version `8.4`. This could mislabel later feedback. Both now use the current `BUILD_VERSION`.
- Found that repeated one-tap reactions on the same unchanged board could create accidental duplicate evidence. v8.6 updates the recent same-context response instead of stacking duplicates.
- Added a CSV import path so feedback exported from tester devices can be merged locally without a backend.
- Added explicit evidence language: one response is a clue, not a trend; a repeated issue requires at least two supporting records.

## Feedback Review
- Filters: reaction, property situation, and build version.
- Summary: responses, Useful, Confusing, Not believable, and different-choice count.
- Recommendation disagreement: percentage and exact comparable-record count.
- Grouped evidence: reactions, situations, VerdeAI recommendations, and tester selections.
- Evidence insight: identifies a repeated negative scenario/reaction only when at least two records support it.
- CSV import: local-only, 2 MB limit, maximum 1,000 rows per import, record-ID deduplication.
- CSV export: includes disagreement status, evidence origin, context ID, and record ID.

## Persistence and compatibility
- Current session, saved projects, and feedback continue using existing localStorage keys to preserve v8.5 browser data.
- v8.5 and v8.4 share codes remain importable.
- Loaded/recovered projects are upgraded to Build v8.6 while preserving Recommended and Selected futures.
- Legacy feedback normalization remains active.

## Safe rendering state
- Real AI rendering: Disabled.
- Backend: Not connected yet.
- API key: Not added.
- Paid calls: Locked.
- Frontend provider secrets: None found.

## Validation completed
- JavaScript syntax checks passed for both runtime copies.
- Automated project smoke test passed.
- Feedback unit tests passed for record capture, same-context update, filters, disagreement metrics, evidence thresholds, CSV export, CSV parse/import, and legacy normalization.
- Static HTML/ARIA/assets/CSS validation passed.
- Chromium mobile and desktop rendering passed in an inline test harness, including self-test, different future selection, feedback save, filters, saved project state, storage-preserving document reload, Feedback Review, CSV export/import, deduplication, and no horizontal overflow.
- Runtime JS and CSS copies are byte-for-byte synchronized.
- Credential-pattern scan passed.
- ZIP integrity passed.

## Browser coverage boundary
The environment blocked normal browser navigation—even to local files and localhost—with `ERR_BLOCKED_BY_ADMINISTRATOR`. Chromium was therefore tested at phone and desktop widths using an inline document harness with a storage-compatible localStorage substitute. This validates layout and application logic but is not a claim of a native live-host refresh or real-device test. Firefox and Safari/WebKit were not available locally, so no claim of testing in those engines is made.

## Live validation after deployment
1. Confirm `Build v8.6` appears in the header and footer.
2. Run the shaded self-test and select a future different from the recommendation.
3. Save Useful feedback, then open Saved and confirm the Different choice metric is `1`.
4. Filter by reaction, situation, and build; reset filters.
5. Refresh the page and confirm the board, saved project, and feedback remain.
6. Export CSV, then import it in a clean browser profile and confirm the record appears once.
7. Check the Saved screen at phone width for horizontal scrolling.
8. Confirm AI Setup remains Disabled / Not connected yet / Not added / Locked.
