# VerdeAI v5.1 Build Status

## Build
- Version: **v5.1**
- Type: Mobile navigation bug-fix release
- Status: Ready for GitHub Pages / static hosting

## Primary fix
The v5.0 live test showed that **Open AI Setup** and **More tools** could appear unresponsive on mobile. v5.1 makes AI Setup accessible through a visible top-level tab, direct fallback buttons, scroll-to-section behavior, and tap feedback.

## Verification completed
- Frontend JavaScript syntax check passed.
- Backend JavaScript syntax check passed.
- JSON validation passed.
- Smoke test passed.
- ZIP integrity test passed.

## Safe rendering status
- AI rendering remains optional and off by default.
- No paid rendering calls are made.
- No provider API keys are exposed in frontend code.
- Backend proxy is still required before real rendering can be connected.

## Recommended live test
1. Open v5.1 live.
2. Scroll to Optional AI Rendering.
3. Tap **Open AI Setup**.
4. Confirm the page jumps to AI Setup.
5. Tap **More tools** and confirm it opens or gives visible feedback.
6. Tap **Copy render checklist** and confirm copy feedback appears.
