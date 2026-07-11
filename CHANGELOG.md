# VerdeAI Changelog

## v5.1 — Mobile AI Setup Navigation Fix

### Fixed
- Fixed the mobile navigation issue where **Open AI Setup** could appear to do nothing because the tab changed without moving the user to the AI Setup screen.
- Improved **More tools** feedback on mobile so tapping it gives visible open/close confirmation.
- Added a visible **AI Setup** top-level tab so users are not blocked if the More tools drawer is awkward in a mobile browser.

### Added
- Added fallback buttons near Optional AI Rendering:
  - **Open AI Setup**
  - **View render roadmap**
  - **Copy render checklist**
- Added a copyable render checklist for safe future provider setup.
- Added scroll/focus behavior when tabs are opened from buttons or helper links.

### Preserved
- Upload, demo, shaded self-test, result board, Share page, More tools, tester page, plant overlay, report, export/share, save/load, history, Vision Board, AI setup, render prompts, cost estimates, and mock render flow.

### Not connected yet
- Real AI image generation.
- Paid provider calls.
- Production backend proxy.
- Cloud image storage.
