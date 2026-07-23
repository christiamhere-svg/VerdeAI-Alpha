# VerdeAI v9.4.2 — Demo Grounding Hotfix

This hotfix fixes the evidence shown during local v9.4.1 testing.

- Demo mode now uses a bundled real overgrown-garden photograph instead of green placeholders.
- The demo starts with a photo-specific recovery calibration that excludes the upper boundary and stored materials.
- The protected access route still masks plants but is hidden from finished concepts and board previews.
- Foreground plants are moved inward and reduced slightly to prevent edge clipping and crowding.
- The calibrated overlay engine, Android touch controls, Recommended/Selected independence, refresh persistence and marker 5 remain unchanged.
- Backend, Cloudflare Worker, provider calls, real AI rendering and paid calls remain disabled.
