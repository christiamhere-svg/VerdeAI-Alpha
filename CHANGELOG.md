# CHANGELOG — VerdeAI v3.2 Workshop Build

## Summary

v3.2 starts the AI rendering engine foundation while keeping VerdeAI safe, static-site friendly, and free to run by default. Real paid rendering is not connected yet. The app now explains this clearly and prepares prompts/cost estimates for a future provider connection.

## Added

- AI Render Setup tab with provider selection.
- Local API-key placeholder field for planning only.
- Connection/status card explaining that real rendering is optional and off by default.
- Estimated cost display for selected-future and six-future rendering.
- Cost-aware render controls: Render Selected Future and Render All 6 Futures.
- Mock render cards so the render flow can be tested without spending money.
- Render Prompt Builder for all six futures:
  - Belonging
  - Low-Maintenance / Sanctuary-style future
  - Wildlife / Sanctuary
  - Gathering
  - Productive
  - Maker
- Prompt copy buttons for each future.
- Provider abstraction constants for Replicate/FLUX, OpenAI image generation, and Stability AI planning.
- Backend mock render endpoint updated with provider/cost/prompt scaffold fields.

## Preserved

- Tester Page.
- Plant overlay preview.
- Photo upload.
- Demo mode.
- Shaded garden self-test.
- Analysis, reports, export, save/load, history, Vision Board, share code, autosave, and design refinements.

## Notes

- No real AI image provider is called in v3.2.
- API-key handling remains a scaffold only. A production version should use a backend proxy so keys are not exposed in the browser.
- Cost estimates are planning placeholders and should be verified against current provider pricing before activation.
