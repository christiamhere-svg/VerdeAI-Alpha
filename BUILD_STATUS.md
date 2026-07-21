# Build Status — VerdeAI v9.3.1 Plant Overlay and Future Selection Hotfix

## Build state

**Deployment package:** complete  
**JavaScript syntax:** passed  
**Static validation:** passed  
**Automated Chromium workflow:** passed  
**Physical Android validation:** pending  
**Tester-ready claim:** not yet made

## Confirmed v9.3 defects addressed

- The missing **Other possible futures** panel is restored after the recommended result.
- Six future cards are visible and selectable at tested phone and desktop widths.
- Wildlife Haven can be selected independently of the recommended future.
- The uploaded photograph remains at full opacity with no broad green wash.
- Future cards preview each composition on the actual property photograph.
- Plant recipes use different placement structures rather than colour changes alone.

## Automated evidence

Chromium validation completed the normal photo-analysis workflow, opened the dedicated photo stage, finished calibration, selected all six futures and captured each result. It verified:

- six visible future cards;
- future panel located after the recommended result and before Optional AI Rendering;
- six distinct SVG composition signatures;
- three or more different plant-count structures across the six futures;
- Wildlife Haven selectable;
- recommended and selected futures remain independent;
- photograph opacity `1`, image filter `none`, broad wash hidden;
- editor handles absent after **Done placing concept**;
- marker 5 retained;
- no horizontal overflow at 360, 390, 412, 430, 768 and 1440 pixels;
- real AI rendering disabled and paid calls locked.

## Hard release gate

The code and browser evidence satisfy the functional hotfix requirements. The release gate remains open until the deployed build is tested on a physical Android phone using a real uploaded property photograph.

Do not call v9.3.1 tester-ready until Android evidence confirms:

- all six futures remain visible and reachable;
- the photograph is clear and recognisable;
- Wildlife Haven changes the main photograph immediately;
- the six compositions look genuinely different at phone size;
- plants feel grounded rather than floating or pasted on;
- calibration placement and refresh persistence still work.

## Known limitation

The free overlay is a calibrated concept illustration, not a photorealistic render or species-accurate planting plan. It should communicate scale, layering, open space and planting structure at first glance without pretending to be a finished design.

## Safety state

Real AI rendering is disabled. Backend use, provider calls and paid calls remain locked. No Cloudflare or activation changes are included in this build.
