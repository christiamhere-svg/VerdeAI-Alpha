# Botanical Asset Implementation — v9.3.2

## What changed

v9.3.2 replaces the previous repeated SVG symbols with procedural botanical geometry generated in the browser. The output remains a free calibrated concept overlay; it is not a provider-generated image.

## Asset families

The overlay engine now generates:

- irregular groundcover rosettes;
- herbs and compact foliage;
- ornamental grasses with varied curved blades;
- strappy foliage with pointed leaves;
- ferns with rachises and paired leaflets;
- flowering perennials with stems, leaves, and flower heads;
- rounded and irregular shrubs;
- flowering shrubs;
- taller screening shrubs;
- feature trees with trunks, branches, and varied leaf clusters;
- edible beds with planted rows.

## Controlled variation

Each plant receives a deterministic seed based on its type, position, rotation, and purpose. The seed varies:

- leaf angle;
- leaf length and width;
- branching;
- stem height;
- flower-head size;
- canopy density;
- rotation;
- overall scale.

The same property state remains visually stable after rerendering, while neighbouring plants do not look like exact clones.

## Grounding and depth

- Every plant includes a contact shadow.
- Foreground plants retain the strongest detail and opacity.
- Middle plants use slightly softer contrast.
- Rear plants use lower opacity, reduced saturation, and light blur.
- Plant scale increases gradually toward the foreground.
- Broad colour washes remain disabled so the photo stays readable.
- SVG overflow is clipped to the image stage.

## Calibration behaviour

The existing usable-ground clip path, keep-clear mask, and protected-access mask still constrain all generated vegetation. Marker 5 is drawn outside the clipped treatment and remains visible after completion.

## Limitations

This is still clue-guided browser composition rather than scene understanding. It cannot identify every real object in an arbitrary photograph. Users must use calibration keep-clear zones where buildings, equipment, stored materials, or access areas need protection.
