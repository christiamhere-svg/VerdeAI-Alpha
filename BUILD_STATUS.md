# VerdeAI v8.8 Workshop Build — Build Status

Status: Ready for GitHub / Cloudflare Pages deployment and real-phone visual calibration.

## Milestone completed
v8.8 is an intentional product-direction build. The uploaded property photo is now the main explanation of VerdeAI, rather than a secondary diagram beneath recommendation text.

The result begins with a photo-first concept panel offering three clear modes:
- **Original** — untouched photo.
- **VerdeAI Concept** — VerdeAI’s recommended future overlay.
- **Selected Future** — the tester’s currently selected future overlay.

The static overlay engine uses responsive inline SVG and CSS. No paid image provider, backend vision service, or frontend secret was added.

## v8.7 versus v8.8

| Area | v8.7 | v8.8 |
|---|---|---|
| Main explanation | Recommendation text and diagram-style markers | Large property image with layered concept treatment |
| Photo modes | Original and selected overlay in a separate Compare screen | Original, recommended concept, and selected future directly in the main result |
| Overlay geometry | Reusable zones and markers | Four scenario-specific perspective layouts |
| Future differences | Distinct concept cards | Six overlays that visibly change on the property photo |
| First move | Text below the result | Marker 5 on the photo plus matching legend entry |
| Future selection | Selected card updated reports and overlays | `View this future on my photo` immediately updates the main image |
| Mobile flow | Photo appeared after result summary | Photo-first panel appears before recommendation and long supporting sections |

## Overlay system created
- Responsive SVG layers sit over the actual uploaded photo or the built-in self-test image.
- Semi-transparent ground surfaces preserve orientation while showing proposed physical change.
- Paths, access ribbons, planting masses, work pads, storage boundaries, seating footprints, food beds, habitat clusters, lighting points, and focal features are drawn as lightweight vectors.
- Five numbered markers map to Existing access, Opportunity, Constraint, Intervention, and First move.
- Marker 5 uses the matching property-specific first move.
- The trust label reads `Concept Overlay · Not Final AI Render` and stays visually secondary.

## Tested scenario treatments

| Situation | Geometry and visual treatment | Expected recommendation in test |
|---|---|---|
| Under-building / shaded | Low-light mulch surface, protected dry route, shade planting masses, overhead constraint band, practical focal zone | Sanctuary Garden |
| Blank canvas / front yard | Perspective arrival path, strong edge planting, feature-tree position, open central relationship | Belonging Garden |
| Overgrown / tired | Retained structure, selective removal zone, revealed walking line, recovered edge planting | Possibility Garden |
| Workshop / awkward access | Wide bulky-item route, durable ground surface, permanent work pad, bounded storage, planting screen | Maker / Workshop Yard |

## Six future visual treatments
- **Belonging Garden:** arrival glow, welcome edge, path lighting, and social connection.
- **Sanctuary Garden:** broad mulch blanket, clean edge, repeated low foliage, and calm enclosure.
- **Possibility / Wildlife Garden:** layered habitat clusters, flowering points, and a small water/shelter cue.
- **Gathering Space:** defined floor, table/chair footprint, and evening string-light line.
- **Productive Garden:** perspective food beds, crop rows, and practical water route.
- **Maker / Workshop Yard:** work pad, storage boundary, protected route, screen planting, and direction arrow.

## Product behaviour preserved
- Photo upload, demo mode, self-test, starter clues, scenario analysis, recommendation, six futures, reports, save/load, session recovery, history, export, Vision Board, Tester Page, Design Studio, Feedback Review, evidence classification, CSV import/export, deduplication, AI Setup, privacy wording, and accessibility support remain present.
- Recommended and Selected futures remain independent.
- Selected future and visual mode persist through save/reload and session recovery.
- Existing localStorage keys remain unchanged to preserve browser data.
- v8.7 and earlier supported share codes remain importable; new exports use the `VERDEAI88` prefix.

## Safe rendering state
- Real AI rendering: Disabled.
- Backend: Not connected yet.
- API key: Not added.
- Paid calls: Locked.
- Frontend provider secrets: None found.

## Validation completed
- JavaScript syntax checks passed for both runtime copies.
- Automated project smoke test passed.
- Feedback evidence unit tests passed.
- Static HTML, ARIA, assets, CSS, synchronized-file, and credential-pattern validation passed.
- Chromium photo-first workflow passed at 390 × 844:
  - three visual modes;
  - five mapped markers and five legend entries;
  - four distinct scenario geometries;
  - six future-specific treatments;
  - Recommended versus Selected independence;
  - save/reload persistence;
  - Compare view reuse of the new overlay system;
  - zero horizontal overflow.
- Chromium desktop validation passed at 1440 × 900 with zero horizontal overflow.
- AI Setup remained Disabled / Not connected yet / Not added / Locked.
- ZIP integrity is checked during packaging.

## Browser and device boundary
The automated environment uses Chromium with the app loaded through an inline document harness because normal localhost navigation is blocked. This validates JavaScript behaviour, responsive layout, persistence, and generated SVG structure in Chromium. It is not a claim of:
- deployment to the live Cloudflare host;
- testing on Chris’s physical Android phone;
- Firefox validation;
- Safari/WebKit validation;
- photorealistic or pixel-aware placement on arbitrary property photos.

The overlays use scenario-aware presets, not computer vision. Their real value must now be judged against actual uploaded property photos.

## Live validation after deployment
1. Confirm `Build v8.8` appears in the header and footer.
2. Upload a real property photo and run analysis.
3. Confirm the photo-first panel appears before Recommendation + first move.
4. Switch Original → VerdeAI Concept → Selected Future.
5. Choose a future different from the recommendation and tap `View this future on my photo`.
6. Confirm the recommendation badge remains fixed while the selected overlay changes.
7. Confirm marker 5 matches the first-move wording.
8. Check 360–430 px Android widths for sticky-tab obstruction, clipping, and excessive height.
9. Save, refresh, and confirm selected future and visual mode persist.
10. Confirm AI Setup remains Disabled / Not connected yet / Not added / Locked.
