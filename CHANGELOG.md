# VerdeAI Changelog

## v5.5 Workshop Build — Plain-English AI Render Setup

### Added
- Plain-English AI render status card:
  - Real AI rendering: Not connected
  - Cost risk: Locked
  - API keys: Server-side only
  - Current mode: Free concept boards
- New "What happens next?" render flow:
  1. Choose one future
  2. Preview prompt
  3. Preview cost
  4. Confirm one render
  5. Keep concept board if render fails
- Provider explainer cards for:
  - Replicate / FLUX
  - OpenAI image generation
  - Stability AI
- Provider status chips: planned / needs backend key.
- Developer details section for backend proxy contract.

### Changed
- Moved technical `/api/render` endpoint details lower behind a Developer details section.
- Reworded AI Setup so normal users can understand the safe rendering path before seeing implementation details.
- Improved render readiness checklist wording.
- Kept public beta tester flow unchanged.

### Safety
- Paid rendering remains disabled by default.
- No API keys are stored in frontend code.
- No paid API calls are made.
- Concept boards remain the fallback.
