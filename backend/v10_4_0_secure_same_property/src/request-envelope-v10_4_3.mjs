export const V1043_ALLOWED_FUTURES = Object.freeze([
  "feature-garden",
  "low-maintenance-haven",
  "wildlife-haven",
  "food-garden",
  "office-workshop",
  "minimalist"
]);

export const V1043_LOCKED_POLICY = Object.freeze({
  mode: "locked-request-envelope-local-only",
  backendConnected: false,
  providerCallsEnabled: false,
  paidCallsLocked: true,
  killSwitch: true,
  networkAllowed: false,
  imageCount: 1,
  outputCount: 1,
  automaticRetries: 0,
  storeInput: false,
  storeOutput: false,
  consentRequiredAtActivation: true
});

export function validateLockedRequestEnvelope(value) {
  const errors = [];
  if (!value || typeof value !== "object") return {ok:false, errors:["Envelope must be an object."]};
  if (value.contractBuild !== "v10.4.0") errors.push("contractBuild");
  if (value.preparationBuild !== "v10.4.2") errors.push("preparationBuild");
  if (value.bridgeBuild !== "v10.4.3") errors.push("bridgeBuild");
  if (value.mode !== "SAFE_LOCKED") errors.push("mode");
  if (value.selectedRecommendation?.count !== 1) errors.push("selectedRecommendation.count");
  if (!V1043_ALLOWED_FUTURES.includes(value.selectedRecommendation?.id)) errors.push("selectedRecommendation.id");
  if (value.input?.imageCount !== 1) errors.push("input.imageCount");
  if (value.input?.image?.mimeType !== "image/jpeg") errors.push("input.image.mimeType");
  if (!Number.isInteger(value.input?.image?.byteCount) || value.input.image.byteCount < 1 || value.input.image.byteCount > 2500000) errors.push("input.image.byteCount");
  if (!Number.isInteger(value.input?.image?.width) || !Number.isInteger(value.input?.image?.height) || Math.max(value.input.image.width,value.input.image.height) > 2048) errors.push("input.image.dimensions");
  if (value.input?.image?.metadataStripped !== true) errors.push("input.image.metadataStripped");
  if (value.input?.image?.orientationPreservedByBrowserDecode !== true) errors.push("input.image.orientationPreservedByBrowserDecode");
  if (value.input?.image?.dataRef !== "single-browser-prepared-image") errors.push("input.image.dataRef");
  if (value.output?.count !== 1 || value.output?.mimeType !== "image/jpeg" || value.output?.preserveSameProperty !== true || value.output?.automaticRetryCount !== 0) errors.push("output");
  if (value.output?.selectedFutureId !== value.selectedRecommendation?.id) errors.push("output.selectedFutureId");
  if (value.consent?.requiredAtActivation !== true || value.consent?.collected !== false) errors.push("consent");
  const p = value.policy || {};
  if (p.backendConnected !== false || p.providerCallsEnabled !== false || p.paidCallsLocked !== true || p.killSwitch !== true || p.networkAllowed !== false || p.imageCount !== 1 || p.outputCount !== 1 || p.automaticRetries !== 0 || p.storeInput !== false || p.storeOutput !== false) errors.push("policy");
  if (JSON.stringify(value).includes("data:image")) errors.push("serializedImageData");
  return {ok:errors.length === 0, errors};
}

export function lockedBridgeResponse() {
  return Object.freeze({
    status: 423,
    ok: false,
    accepted: false,
    code: "SAFE_LOCKED",
    providerCalled: false,
    billable: false,
    outputCreated: false
  });
}
