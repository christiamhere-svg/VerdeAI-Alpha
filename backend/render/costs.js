export const PROVIDER_COSTS = {
  mock: { label: "Mock / calibrated-overlay fallback", planningUsd: 0, maximumUsd: 0, enabled: true },
  "openai-gpt-image-2": { label: "OpenAI GPT Image 2", planningUsd: 0.08, maximumUsd: 0.15, enabled: false }
};

export function estimateRenderCost(provider = "mock", count = 1) {
  if (Number(count) !== 1) throw new Error("The secure pilot allows exactly one rendered image.");
  return Number((PROVIDER_COSTS[provider] || PROVIDER_COSTS.mock).planningUsd);
}

export function providerLabel(provider = "mock") {
  return (PROVIDER_COSTS[provider] || PROVIDER_COSTS.mock).label;
}
