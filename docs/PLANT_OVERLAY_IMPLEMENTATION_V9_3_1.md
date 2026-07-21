# VerdeAI v9.3.1 — Plant Overlay Implementation Notes

## Purpose

v9.3.1 is a focused browser-only hotfix for two release-blocking problems found on Android: the six-future picker was missing, and the overlay treatment hid too much of the uploaded photograph.

## Future-selection repair

The six future cards now live in a dedicated top-level `#futureSelectionPanel` immediately after the recommended result. The panel is not dependent on the old nested dashboard layout.

A runtime safeguard, `ensureFutureSelectionPanel()`, verifies the panel exists, unhides it and moves it back to the correct position if stale layout behaviour places it elsewhere. Selection is announced through `#futureSelectionStatus`, and the selected card receives an explicit active state.

The future set is:

1. Feature Garden
2. Low-Maintenance Haven
3. Wildlife Haven
4. Gathering Space
5. Food Garden
6. Maker / Workshop Yard

The internal future IDs are preserved so saved projects and existing recommendation logic continue to work.

## Clear-photo treatment

The property image remains at opacity `1` with `filter: none`. The former full-image depth wash is disabled. Site geometry remains visible only as faint ground and access cues.

Individual plants retain contact shadows and subtle highlights so they sit on the ground plane without tinting the building, roofline or the entire photograph.

## Botanical vocabulary

The local SVG system now includes:

- irregular groundcover clusters;
- foliage mounds;
- ferns;
- strappy plants;
- flowering perennials;
- flowering and non-flowering shrubs;
- taller screening forms;
- feature trees;
- herbs;
- productive beds.

Forms vary by scale, rotation, spacing, layer and overlap. Rear planting is slightly quieter, middle planting carries the main structure, and foreground planting supplies depth and grounding.

## Distinct composition recipes

### Feature Garden

One focal anchor uses the opportunity point. Supporting mounds, perennials and lower planting frame it without filling the whole usable area.

### Low-Maintenance Haven

Repeated strappy plants, foliage mounds and low groundcovers create a restrained rhythm with strong negative space.

### Wildlife Haven

The densest recipe uses mixed screens, ferns, flowering perennials, shrubs and groundcovers in irregular groups. The opportunity point becomes a habitat anchor.

### Gathering Space

Planting frames the perimeter while an open social surface remains in the centre. The access route stays protected.

### Food Garden

Three perspective productive beds, herbs and edge planting create recognisable working areas while leaving movement space.

### Maker / Workshop Yard

A practical work surface, storage boundary and restrained edge planting preserve working access and reduce visual clutter.

## Calibration and safety masks

All future compositions remain inside the calibrated usable-ground clip path. Keep-clear regions and the protected access route remain masked. The opportunity point and marker 5 continue to influence focal and first-move planting.

After **Done placing concept**, calibration handles and outlines are removed while marker 5 remains visible.

## Compatibility

Photo upload, demo mode, shaded self-test, reports, history, export, saved projects, autosave and refresh recovery remain on the existing code paths. Recommended and selected futures remain separate values.

## Rendering boundary

These are free calibrated concept overlays. They are not photorealistic renders, final designs or species-accurate planting plans. Real AI rendering remains disabled.
