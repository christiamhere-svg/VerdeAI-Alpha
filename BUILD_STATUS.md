# VerdeAI v8.7 Workshop Build — Build Status

Status: Ready for GitHub / Cloudflare Pages deployment and genuine v8.7 tester evidence collection.

## Milestone completed
v8.7 protects the evidence boundary before any public-tester conclusion is made. Real tester responses, owner/internal checks, and older unclassified records are now stored and reviewed separately. The app also records an optional issue area and surfaces repeated tester note wording only when at least two genuine tester comments support it.

## Evidence table

| Finding | Evidence source | Supported conclusion | Action in v8.7 |
|---|---|---|---|
| No genuine v8.6 phone screenshots, tester comments, or exported Feedback CSV records were supplied with this request | Supplied project materials | No public-tester trend or highest-frequency user problem can be claimed | No scenario, overlay, recommendation, or navigation area was broadly redesigned on invented evidence |
| v8.6 local records did not explicitly distinguish real testers from owner/self-test activity | Internal source review and browser workflow test | Internal practice clicks could contaminate later tester metrics | Added explicit `Tester response`, `Owner / internal check`, and `Unclassified legacy` evidence types |
| Negative feedback did not have a structured place to say where the problem occurred | Internal source review | Future evidence could identify a reaction but not reliably locate the issue | Added an optional issue-area tag covering specificity, overlay, recommendation/selection, futures, first move, navigation, save/share, and other |
| Repeated wording in optional notes was not grouped | Internal source review | Repeated tester language could be missed during manual review | Added tester-only repeated-wording detection with a minimum of two separate genuine tester notes |
| Full self-test journey, selection, feedback separation, filtering, persistence, CSV export/import, and mobile layout | Internal Chromium harness | Core v8.7 workflow operates without horizontal overflow in the tested harness | Retained the existing product flow and added focused evidence-integrity tests |

## Highest-priority supported issue
No highest-frequency public-tester issue is supported because no genuine v8.6 tester dataset was supplied.

The highest-priority **internal evidence-integrity risk** was that owner/self-test feedback could sit beside real tester feedback and be interpreted as the same evidence. v8.7 fixes this by:
- defaulting self-test, demo, and clue-only feedback to `Owner / internal check`;
- defaulting a real uploaded-photo result to `Tester response`, with a visible override;
- importing older records without an evidence type as `Unclassified legacy` rather than silently promoting them to tester evidence;
- excluding internal and unclassified records from tester trends, recommendation disagreement, repeated-issue logic, and repeated-note wording;
- keeping internal records visible for debugging instead of deleting or hiding them.

## Feedback Review changes
- New Evidence filter: All evidence, Tester response, Owner / internal check, or Unclassified legacy.
- New evidence-boundary summary showing genuine tester, internal, and unclassified counts.
- Tester-only recommendation-versus-selection percentage.
- Tester-only reaction, situation, recommendation, and selection breakdowns.
- Evidence-type breakdown for all visible records.
- Optional issue-area tag stored per response.
- Repeated tester note wording shown only when the same word or phrase appears in at least two genuine tester comments.
- Per-record evidence type and issue area displayed in Local Feedback Review.
- CSV export/import now includes `Evidence type` and `Issue area`.
- Older v8.6 CSV files remain importable; missing evidence type is classified conservatively.

## Product behaviour preserved
- Photo upload, demo mode, shaded self-test, starter clues, scenario analysis, overlays, reports, save/load, export, history, Vision Board, Tester Page, Design Studio, Feedback Review, and AI Setup remain available.
- Recommended and Selected futures remain independent through selection, rendering, persistence, and CSV evidence capture.
- Existing localStorage keys remain unchanged to preserve browser data.
- v8.6 and earlier supported share codes remain importable.

## Safe rendering state
- Real AI rendering: Disabled.
- Backend: Not connected yet.
- API key: Not added.
- Paid calls: Locked.
- Frontend provider secrets: None found.

## Validation completed
- JavaScript syntax checks passed for both runtime copies.
- Automated project smoke test passed.
- Feedback evidence unit tests passed for internal/tester defaults, same-board separation, duplicate update, issue tags, tester-only trend thresholds, repeated wording, filters, CSV export/import, deduplication, and conservative legacy classification.
- Static HTML/ARIA/assets/CSS validation passed.
- Chromium mobile full-flow test passed at 390 × 844 in an inline harness:
  - shaded self-test;
  - scenario analysis and overlay key;
  - six futures;
  - Recommended versus Selected;
  - first move;
  - internal check plus explicitly classified tester response;
  - evidence filters and summaries;
  - saved project and feedback persistence;
  - CSV export/import and deduplication;
  - zero horizontal overflow.
- Chromium desktop Feedback Review test passed at 1440 × 900 with zero horizontal overflow.
- Runtime JS and CSS copies are byte-for-byte synchronized.
- Credential-pattern scan passed.
- ZIP integrity passed.

## Browser coverage boundary
The environment blocks normal browser navigation to local files and localhost with `ERR_BLOCKED_BY_ADMINISTRATOR`. Chromium was therefore tested at phone and desktop widths using an inline document harness with a storage-compatible localStorage substitute. This validates application logic and layout in Chromium, but it is not a claim of a physical-phone test, a live-host refresh, Firefox testing, or Safari/WebKit testing. No unsupported browser claim is made.

## Live validation after deployment
1. Confirm `Build v8.7` appears in the header and footer.
2. Run the shaded self-test and confirm Response source defaults to `Owner / internal check`.
3. Upload a real photo and confirm Response source defaults to `Real tester`.
4. Select a future different from VerdeAI’s recommendation and save tester feedback.
5. Open Saved and confirm the Tester count increases while internal checks remain separate.
6. Filter Evidence to `Tester response` and confirm internal records disappear from the filtered view.
7. Export CSV and confirm `Evidence type` and `Issue area` columns exist.
8. Refresh and confirm the board, selected future, saved project, and feedback remain.
9. Check the Saved screen on a real phone for clipping or sticky-navigation obstruction.
10. Confirm AI Setup remains Disabled / Not connected yet / Not added / Locked.
