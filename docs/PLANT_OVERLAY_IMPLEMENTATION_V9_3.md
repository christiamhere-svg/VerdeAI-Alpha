# VerdeAI v9.3 — Plant Overlay Implementation

## Scope

v9.3 changes only the free calibrated concept layer. Real AI rendering, backend activation, provider calls, pricing work, and feedback-system work were deliberately excluded.

## What changed

The previous large translucent geometry has been replaced by an inline SVG botanical system. The same uploaded property photograph remains the base layer.

The overlay engine now supplies reusable symbols for:

- low groundcover
- rounded shrubs
- flowering shrubs
- ornamental grasses
- tall screening plants
- focal trees
- herbs
- productive garden beds

Each symbol includes overlapping foliage, tonal variation, contact shadowing, highlights, and a consistent ground origin. The symbols are composed in three depth groups: rear structure, middle shrubs/use zones, and foreground planting.

## Calibration behaviour

The current four-point usable-ground polygon remains the outer clip path. Keep-clear rectangles and the protected access route remain subtraction masks. Planting therefore disappears automatically when it crosses a protected structure or route.

The opportunity point controls the main focal planting for feature-led and habitat-led futures. Marker 5 controls a smaller first-move plant or test element. Both update whenever calibration changes.

## Future recipes

- **Belonging Garden:** framed planting, a focal tree, flowering support and a clear central approach.
- **Sanctuary Garden:** restrained repeated grasses, repeated shrubs, clean edges and stronger negative space.
- **Possibility Garden:** the densest composition, mixed screening, flowering shrubs, habitat layers and varied texture.
- **Gathering Space:** planting around the edges of a preserved social area with a simple table-and-chair concept.
- **Productive Garden:** recognisable productive beds, herbs, edible foliage and working access.
- **Maker / Workshop Yard:** minimal edge planting and screening around protected work and storage zones.

These are different structures, not recoloured copies.

## Rendering safety

All assets are inline SVG generated in the browser. No photo or overlay is uploaded. `config.v9.3.js` keeps the backend disconnected, mock mode on, the kill switch on, provider calls off, and paid calls locked.

## Known limitation

These are calibrated concept illustrations, not plant-species identification or photorealistic renders. Browser evidence confirms layout behaviour, but physical Android testing is still required before calling v9.3 tester-ready.
