# CHANGELOG — VerdeAI v3.2 Workshop Build

## Summary
v3.2 moves VerdeAI toward the screenshot-style experience: a polished **Property Futures Dashboard** with today’s property, six possible futures, recommendation, compass, next steps, and a 5-year evolution strip. The goal is to make the public tester page feel more like something worth showing, not a developer console with decorative plants taped to it.

## Added
- New **Property Futures Dashboard** at the top of the Tester Page.
- **Your property today** visual card with photo/self-test state.
- **Six possible futures** dashboard grid:
  - Belonging Garden,
  - Low-Maintenance Haven,
  - Wildlife Haven,
  - Gathering Grove,
  - Productive Patch,
  - Maker Territory.
- Dashboard future cards with:
  - photo-based visual previews,
  - plant-style mini overlays,
  - quick bullet points,
  - match scores,
  - selectable future cards.
- Right-side dashboard stack:
  - VerdeAI recommendation,
  - Property compass,
  - Next steps,
  - Oracle reading.
- **5-year property movie** strip showing staged evolution.
- Dashboard actions:
  - Run shaded garden self-test,
  - Copy clean tester result,
  - Open plant overlay.
- New smoke-test checks for the property futures dashboard.

## Improved
- First impression now looks closer to a public property-futures product.
- Tester Page now leads with the visual dashboard before the older plant overlay preview.
- Future previews feel more like design directions and less like tabular test output.
- Mobile layout keeps the dashboard readable with stacked cards and horizontal evolution strip.
- Copyable tester result is shorter and cleaner than the full report.
- v3.1 plant overlay system is preserved and reused inside the dashboard.

## Preserved from v3.1 and earlier
- Plant Overlay Preview.
- Built-in shaded-garden self-test.
- Autosave and session recovery.
- One-tap starter clue analysis.
- Smart Next Action flow.
- Report, Vision Board, Saved, Export, Share Code, and Tester Mode.
- Design-refinement stability from v2.5.
- Shaded/under-building improvements from v2.4.
- Static-site compatibility for GitHub Pages and Netlify.

## Known limitations
- Real AI image recognition is still not connected.
- Future cards use concept overlays/mock visuals, not real generated redesign renders.
- Browser local storage remains local to the exact browser/domain.
