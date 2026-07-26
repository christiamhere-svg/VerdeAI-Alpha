# VerdeAI Build Status

## Build
**v9.8.0 — Golden Same-Property Demo Board**

## Candidate status
Local candidate only. Not deployed. Physical desktop and Android approval is still required.

## Why this build exists
v9.7.1 improved the card layout but still behaved like an inspiration gallery: the six cards showed unrelated properties rather than six transformations of the same starting place.

v9.8.0 changes the example path so a tester can judge the real VerdeAI promise:

> One property. Six believable futures. The same place reimagined.

## What changed
- Replaced the six unrelated example photographs with six transformed views of the **same demonstration property**.
- Replaced the demo’s overgrown-garden starting photograph with the matching original property photograph.
- Added **Your property reimagined** labels to all six completed demo cards.
- Added a same-property five-year evolution strip using five matching stages.
- Updated the full-size selected-future view to compare:
  - the original property today;
  - the selected transformed future of that exact property.
- Kept user-upload rendering honest and unchanged: live transformation for arbitrary uploads is still not connected.
- Preserved all safety locks.

## Automated validation
- JavaScript syntax check passes.
- Desktop golden-demo browser test passes.
- Android golden-demo browser test passes.
- Six same-property future cards detected.
- Five same-property evolution frames detected.
- Zero horizontal overflow in automated desktop and Android tests.

## Safety
Real AI rendering is disabled. Backend is disconnected. Provider calls are off. API keys are absent. Paid calls are locked. Kill switch remains on.
