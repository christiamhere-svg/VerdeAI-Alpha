# VerdeAI Build Status

## Build
**v9.7.1 — Aspirational Board Layout Repair**

## Candidate status
Local candidate only. Not deployed. Physical desktop and Android approval is still required.

## Why this repair was needed
The v9.7.0 screenshot proved that the new direction was closer, but still too cramped and too busy:
- the property-map inset covered too much of each inspiration image,
- the card text was too dense,
- the cards did not resemble the clean six-futures benchmark closely enough,
- several inspiration images were weak or mismatched.

## What changed
- Removed the property-photo inset from every future card.
- Kept the real property photo in the dedicated **Your Property Today** column and the full-size selected-future view.
- Rebuilt the six futures as clean image-first cards in a genuine 3 × 2 desktop board.
- Added coloured future headers, one large inspiration image, three short highlights, and one clear action.
- Shortened the recommendation explanation so the right column is easier to scan.
- Replaced four weak inspiration images:
  - Feature Garden,
  - Low-Maintenance Haven,
  - Food Garden,
  - Maker / Workshop Yard.
- Preserved recommendation/selection independence, calibration, persistence, and all safety locks.

## Automated evidence
- `node -c app.js` passes with no syntax errors.
- Build version updated to **v9.7.1** in runtime, config, HTML, and versioned deployment files.

## Safety
Real AI rendering is disabled. Backend is disconnected. Provider calls are off. API keys are absent. Paid calls are locked. Kill switch remains on.
