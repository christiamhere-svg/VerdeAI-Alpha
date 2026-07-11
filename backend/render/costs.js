export const PROVIDER_COSTS = {
  mock: { label: "Mock / concept board fallback", oneImageUsd: 0, sixImagesUsd: 0, enabled: true },
  "replicate-flux": { label: "Replicate / FLUX", oneImageUsd: 0.04, sixImagesUsd: 0.24, enabled: false },
  "openai-image": { label: "OpenAI image generation", oneImageUsd: 0.08, sixImagesUsd: 0.48, enabled: false },
  "stability-ai": { label: "Stability AI", oneImageUsd: 0.06, sixImagesUsd: 0.36, enabled: false }
};

export function estimateRenderCost(provider = "mock", count = 1) {
  const info = PROVIDER_COSTS[provider] || PROVIDER_COSTS.mock;
  const safeCount = Math.max(1, Math.min(Number(count) || 1, 6));
  return Number((info.oneImageUsd * safeCount).toFixed(2));
}

export function providerLabel(provider = "mock") {
  return (PROVIDER_COSTS[provider] || PROVIDER_COSTS.mock).label;
}
