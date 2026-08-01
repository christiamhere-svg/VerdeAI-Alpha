export const FUTURE_IDS = Object.freeze([
  "feature-garden",
  "low-maintenance-haven",
  "wildlife-haven",
  "food-garden",
  "office-workshop",
  "minimalist"
]);

export const SAFE_POLICY = Object.freeze({
  build: "v10.4.0",
  mode: "local-contract-only",
  provider: "gpt-image-2",
  providerCallsEnabled: false,
  paidCallsLocked: true,
  killSwitch: true,
  backendConnected: false,
  allowNetwork: false,
  maxImagesPerRequest: 1,
  maxPreparedImageBytes: 2_500_000,
  allowedMimeTypes: Object.freeze(["image/jpeg", "image/png"]),
  allowedFutureIds: FUTURE_IDS,
  timeoutMs: 120_000,
  automaticRetries: 0,
  storeInputImages: false,
  storeOutputImages: false,
  logPromptText: false,
  logImageData: false,
  resultLabel: "AI Concept Render · Not Final Design"
});

export function publicHealth(policy = SAFE_POLICY) {
  return {
    ok: true,
    build: policy.build,
    mode: policy.mode,
    readyForRealCalls: false,
    gates: {
      backendConnected: policy.backendConnected,
      providerCallsEnabled: policy.providerCallsEnabled,
      paidCallsLocked: policy.paidCallsLocked,
      killSwitch: policy.killSwitch,
      apiKeyPresent: false,
      networkAllowed: policy.allowNetwork
    },
    retention: {
      inputStoredByVerdeAI: policy.storeInputImages,
      outputStoredByVerdeAI: policy.storeOutputImages
    }
  };
}
