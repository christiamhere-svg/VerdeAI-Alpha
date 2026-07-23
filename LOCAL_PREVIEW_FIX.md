# VerdeAI v9.4.1 Local Preview Hotfix

## Fixed

The v9.4 package used an ES module script tag. Windows Edge blocks local `file://` module loading, so double-clicking `index.html` showed the static layout while none of the controls worked.

v9.4.1 loads the same verified JavaScript as a deferred classic script. Double-clicking `index.html` now runs Demo mode, the shaded self-test, photo upload, the six-future board, calibration and local persistence.

## Safety

No overlay logic, backend code, Cloudflare Worker settings, provider calls, paid calls or AI-render activation were changed. Real AI rendering remains disabled.
