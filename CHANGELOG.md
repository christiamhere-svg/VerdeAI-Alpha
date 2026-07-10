# CHANGELOG — VerdeAI v3.1 Workshop Build

## Summary
v3.1 responds directly to live testing frustration. Instead of making the owner check every tab, this build creates a stronger public-facing tester page and adds plant-style overlays that sit directly on the property photo.

## Added
- Dedicated **Tester Page** as the first/default screen.
- Large **Plant Overlay Preview** panel.
- Plant-style overlay sprites layered over the photo/self-test image:
  - shade planting,
  - soft planting edge,
  - feature pot,
  - mulch zone,
  - clear access route,
  - habitat/food/maker variants.
- Public tester action cards:
  - Current result,
  - Plant overlay,
  - First move,
  - What to show testers.
- `Copy tester summary` directly on the Tester Page.
- Smoke-test coverage for Tester Page and plant overlay logic.

## Improved
- The first screen now feels like a page you can share with testers, not a developer dashboard.
- Future cards now show plant-style visual mockups in addition to abstract overlay labels.
- The shaded-garden self-test now produces a more visual result without requiring another photo upload.
- Tester invite/summary wording now points people toward the Tester Page and plant overlay.
- Dashboard, AI setup, deployment notes, and status text now reflect the plant overlay prototype.

## Preserved from v3.0
- Built-in shaded-garden self-test.
- Autosave and session recovery.
- One-tap starter clue analysis.
- Smart Next Action flow.
- Report, Vision Board, Saved, Export, Share Code, and Tester Mode.
- Design-refinement stability from v2.5.
- Shaded/under-building result improvements from v2.4.
- Static-site compatibility for GitHub Pages and Netlify.

## Known limitations
- Real AI image recognition is still not connected.
- Plant overlays are mockups, not true rendered landscape redesigns.
- Browser local storage remains local to the exact browser/domain.
