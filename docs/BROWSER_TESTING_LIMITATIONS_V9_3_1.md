# VerdeAI v9.3.1 — Browser Testing Limitations

## Automated environment

The included workflow was tested with a local inline Chromium harness. It exercises photo upload, analysis, calibration completion, future switching, responsive layout and safe rendering state.

Tested viewport widths:

- 360 px
- 390 px
- 412 px
- 430 px
- 768 px
- 1440 px

## What automation verifies

- six future cards exist and are visible;
- the future panel is after the recommended result and before Optional AI Rendering;
- all six futures can update the main photo stage;
- Wildlife Haven can be selected;
- recommended and selected futures remain independent;
- the photo has full opacity, no image filter and no broad wash;
- each future produces a different SVG composition signature;
- calibration handles disappear after completion;
- marker 5 remains;
- no measured horizontal overflow at tested widths;
- real AI rendering remains disabled.

## What automation cannot prove

- finger-drag quality on a physical Android device;
- behaviour of the deployed host cache;
- refresh persistence on the user’s actual browser;
- whether a real person finds the botanical silhouettes convincing at first glance;
- suitability of plant species for climate, soil, pets or local regulations;
- photorealism;
- visual quality across every possible uploaded photograph.

## Evidence classification

The included PNGs are automated Chromium evidence using a controlled test photograph. They demonstrate layout and composition differences, not physical Android validation and not a final landscape design.

## Required next evidence

Capture at least:

1. the complete **Other possible futures** panel on Android;
2. Wildlife Haven selected on the main photograph;
3. Gathering Space on the same photograph;
4. Low-Maintenance Haven or Food Garden on the same photograph;
5. the same selected future after a full refresh.
