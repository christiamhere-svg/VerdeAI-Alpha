import { V1043_ALLOWED_FUTURES } from './request-envelope-v10_4_3.mjs';

export const V1070_PROMPT_BUILD = 'v10.7.0';

const FUTURE_GUIDANCE = Object.freeze({
  'feature-garden': 'Create a restrained feature garden with one clear focal planting composition, layered but not crowded.',
  'low-maintenance-haven': 'Create a low-maintenance landscape using durable massed planting, simple edges, and generous clear access.',
  'wildlife-haven': 'Create a native wildlife habitat garden with layered shelter, flowering plants, water-wise structure, and clear human access.',
  'food-garden': 'Create a practical food garden with productive beds, herbs, compact fruiting plants, and easy maintenance paths.',
  'office-workshop': 'Create a practical workshop or garden-office setting while keeping access clear and landscaping supportive rather than decorative.',
  minimalist: 'Create a calm minimalist landscape with a small plant palette, strong negative space, simple edging, and uncluttered access.',
  'gathering-space': 'Create a welcoming outdoor gathering space with practical seating, clear circulation, shade, and restrained planting.'
});

function clean(value, max = 220) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>`{}\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function buildSamePropertyPrompt({ selectedFutureId, propertySummary, preserveNote } = {}) {
  if (!V1043_ALLOWED_FUTURES.includes(selectedFutureId)) {
    throw Object.assign(new Error('Unsupported future selection.'), { code: 'UNSUPPORTED_FUTURE' });
  }
  const summary = clean(propertySummary, 260);
  const preserve = clean(preserveNote, 180);
  const direction = FUTURE_GUIDANCE[selectedFutureId] || FUTURE_GUIDANCE['feature-garden'];
  const lines = [
    'Edit the supplied property photograph into one believable finished landscape concept for this exact same property.',
    'Preserve the original camera position, perspective, property boundaries, building geometry, major trees, paths, driveways, fences, terrain, and recognisable site structure.',
    'Do not replace the location with a different property. Do not invent a new house, road, horizon, neighbouring building, pool, vehicle, person, sign, logo, or written text.',
    direction,
    'Use photorealistic materials, realistic plant scale, natural shadows, grounded planting, plausible access, and a coherent Australian residential landscape.',
    'Keep the result achievable rather than fantasy-like. Return one image only.'
  ];
  if (summary) lines.push(`Property context: ${summary}`);
  if (preserve) lines.push(`Important to preserve or keep clear: ${preserve}`);
  return lines.join('\n');
}

export function inspectPrompt(prompt) {
  const value = String(prompt ?? '');
  return Object.freeze({
    ok: value.length >= 300 && value.length <= 1800,
    containsSamePropertyInstruction: /exact same property/i.test(value),
    containsPreservationInstruction: /Preserve the original camera position/i.test(value),
    forbidsText: /written text/i.test(value),
    lineCount: value.split('\n').length,
    length: value.length
  });
}
