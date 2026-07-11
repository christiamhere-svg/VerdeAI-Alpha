# VerdeAI Changelog

## v5.0 — Safe AI Render Preparation

### Added
- Added an in-app **AI Render Roadmap** explaining the path from concept boards to real rendered future images.
- Added a clearer **Render readiness checklist** covering:
  - backend proxy requirement,
  - no frontend API keys,
  - render one future first,
  - render all six only after confirmation,
  - cost estimate before paid rendering,
  - concept-board fallback.
- Added a **Backend proxy contract** panel showing the future `/api/render` request shape.
- Improved prompt preview cards for the six futures with existing Copy Prompt buttons.
- Improved mock render controls so the render flow can be tested without paid calls.
- Updated render status messaging to make it clear real AI rendering is not connected yet.

### Changed
- Updated AI Setup wording from general scaffold to a more production-safe render path.
- Provider selection now represents a **future provider plan**, not a live paid connection.
- API key field now warns not to paste real provider secrets into the static frontend.
- Saved render setup remains local and safe; no raw API key is stored by the app.
- Updated docs and build status for v5.0.

### Preserved
- Upload, demo, shaded self-test, result board, Share page, More tools, tester page, plant overlay, report, export/share, save/load, history, Vision Board, AI setup, render prompts, and cost estimates.

### Not connected yet
- Real AI image generation.
- Paid provider calls.
- Production backend proxy.
- Cloud image storage.
