# VerdeAI Changelog

## v5.9 — Visual Mock Render Preview + First Provider Setup

- Improved the mock render result so it feels like a visual preview, not just a text confirmation.
- Added a larger mock render preview panel with selected future, concept-board fallback, cost, and safety labels.
- Added prompt summaries so users can understand what the future render is asking for without reading the full prompt.
- Added clear **No paid render was made** messaging inside mock results.
- Improved the **Confirm mock render** rehearsal so it is obvious this is a safe simulation only.
- Added a **First real provider setup** section explaining what is needed next:
  - backend hosting
  - server-side API key
  - provider account
  - cost estimate
  - render one image first
- Improved low-contrast Developer details styling.
- Kept all paid providers disabled by default.

## Preserved
- Public beta tester flow
- Property Futures Board
- Share page and clean tester result
- Upload, demo mode, shaded self-test
- Tester page, plant overlay, report, export/share
- Save/load, history, Vision Board
- AI Setup, backend proxy scaffold, render prompts, mock render flow, and cost estimates

## Safety
No paid provider connection is enabled. No API keys are included or exposed. Real rendering remains locked behind future backend setup and explicit cost confirmation.
