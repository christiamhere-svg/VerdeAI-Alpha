import {validateLockedRequestEnvelope, V1043_ALLOWED_FUTURES} from "./request-envelope-v10_4_3.mjs";

export const V1045_SCOPE = "same-property-single-image-v1";
export const V1045_MAX_BYTES = 2500000;
export const V1045_MAX_EDGE = 2048;
export const V1045_MAX_COST_USD = 0.15;
export const V1045_TOTAL_BUDGET_USD = 10;

function frozen(value){
  if (!value || typeof value !== "object") return value;
  const copy = Array.isArray(value)
    ? value.map(frozen)
    : Object.fromEntries(Object.entries(value).map(([key,item]) => [key,frozen(item)]));
  return Object.freeze(copy);
}
function result(state, code, errors = [], extra = {}){
  return frozen({
    build:"v10.4.5",
    boundary:"server-only-owner-approved-transport",
    state,
    code,
    errors:[...errors],
    activationConditionsMet:state === "ready-boundary",
    transportInvocationAllowed:false,
    transportInvoked:false,
    providerCalled:false,
    billable:false,
    outputCreated:false,
    ...extra
  });
}
function isIsoDate(value){
  if (typeof value !== "string" || value.length < 20 || value.length > 40) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

export function validateServerActivationConfig(config){
  const errors=[];
  if (!config || typeof config !== "object" || Array.isArray(config)) return {ok:false,errors:["config.object"]};
  if (config.build !== "v10.4.5") errors.push("build");
  if (config.configurationSource !== "server-environment") errors.push("configurationSource");
  if (config.environment !== "server") errors.push("environment");
  if (config.ownerApproved !== true) errors.push("ownerApproved");
  if (!/^verdeai-owner-[a-z0-9-]{8,80}$/.test(String(config.approvalId || ""))) errors.push("approvalId");
  if (config.approvalVersion !== "v10.4.5") errors.push("approvalVersion");
  if (config.approvalScope !== V1045_SCOPE) errors.push("approvalScope");
  if (config.backendConnected !== true) errors.push("backendConnected");
  if (config.providerCallsEnabled !== true) errors.push("providerCallsEnabled");
  if (config.paidCallsLocked !== false) errors.push("paidCallsLocked");
  if (config.killSwitch !== false) errors.push("killSwitch");
  if (config.networkAllowed !== true) errors.push("networkAllowed");
  if (config.providerCredentialPresent !== true) errors.push("providerCredentialPresent");
  if (config.providerCredentialLocation !== "server-secret") errors.push("providerCredentialLocation");
  if (!/^[a-z0-9][a-z0-9._-]{2,80}$/.test(String(config.transportAdapterId || ""))) errors.push("transportAdapterId");
  if (config.maxImagesPerRequest !== 1) errors.push("maxImagesPerRequest");
  if (config.maxOutputsPerRequest !== 1) errors.push("maxOutputsPerRequest");
  if (config.maxPreparedImageBytes !== V1045_MAX_BYTES) errors.push("maxPreparedImageBytes");
  if (config.maxEdge !== V1045_MAX_EDGE) errors.push("maxEdge");
  if (config.automaticRetries !== 0) errors.push("automaticRetries");
  if (config.storeInputImages !== false) errors.push("storeInputImages");
  if (config.storeOutputImages !== false) errors.push("storeOutputImages");
  if (typeof config.maxCostUsd !== "number" || config.maxCostUsd <= 0 || config.maxCostUsd > V1045_MAX_COST_USD) errors.push("maxCostUsd");
  if (typeof config.totalBudgetUsd !== "number" || config.totalBudgetUsd <= 0 || config.totalBudgetUsd > V1045_TOTAL_BUDGET_USD) errors.push("totalBudgetUsd");
  return {ok:errors.length===0,errors};
}

export function validateServerConsentEvidence(consent, envelope){
  const errors=[];
  if (!consent || typeof consent !== "object" || Array.isArray(consent)) return {ok:false,errors:["consent.object"]};
  if (consent.collected !== true) errors.push("collected");
  if (consent.explicit !== true) errors.push("explicit");
  if (consent.source !== "server-verified-consent") errors.push("source");
  if (consent.scope !== V1045_SCOPE) errors.push("scope");
  if (consent.termsVersion !== "v10.4.5") errors.push("termsVersion");
  if (consent.photoUse !== "temporary-processing") errors.push("photoUse");
  if (consent.outputCount !== 1) errors.push("outputCount");
  if (consent.storeInput !== false) errors.push("storeInput");
  if (consent.storeOutput !== false) errors.push("storeOutput");
  if (consent.sessionBound !== true) errors.push("sessionBound");
  if (!/^vda-consent-[a-z0-9-]{8,80}$/.test(String(consent.consentId || ""))) errors.push("consentId");
  if (!isIsoDate(consent.capturedAt)) errors.push("capturedAt");
  if (!V1043_ALLOWED_FUTURES.includes(consent.recommendationId)) errors.push("recommendationId");
  if (consent.recommendationId !== envelope?.selectedRecommendation?.id) errors.push("recommendationMismatch");
  return {ok:errors.length===0,errors};
}

export function inspectActivationBoundary({serverConfig, consentEvidence, envelope, transport} = {}){
  const envelopeCheck = validateLockedRequestEnvelope(envelope);
  if (!envelopeCheck.ok) return result("locked","REQUEST_ENVELOPE_REJECTED",envelopeCheck.errors,{requires:["valid-one-image-one-output-envelope"]});
  const configCheck = validateServerActivationConfig(serverConfig);
  if (!configCheck.ok) return result("locked","SERVER_CONFIGURATION_REQUIRED",configCheck.errors,{requires:["explicit-server-configuration","owner-approval"]});
  const consentCheck = validateServerConsentEvidence(consentEvidence,envelope);
  if (!consentCheck.ok) return result("locked","SERVER_VERIFIED_CONSENT_REQUIRED",consentCheck.errors,{requires:["explicit-server-verified-consent"]});
  if (transport !== undefined && typeof transport !== "function") return result("locked","TRANSPORT_ADAPTER_INVALID",["transport.function"]);
  if (typeof transport !== "function") return result("locked","TRANSPORT_NOT_ATTACHED",["transport.missing"],{configurationValidated:true,consentValidated:true,envelopeValidated:true});
  return result("ready-boundary","BOUNDARY_READY_NO_TRANSPORT_CALL",[],{
    configurationValidated:true,
    consentValidated:true,
    envelopeValidated:true,
    transportAttached:true,
    futureInvocationRequiresSeparateBuild:true,
    selectedFutureId:envelope.selectedRecommendation.id,
    inputCount:1,
    outputCount:1
  });
}

export function publicActivationHealth(options = {}){
  const boundary = inspectActivationBoundary(options);
  return frozen({
    ok:true,
    build:"v10.4.5",
    readyForRealCalls:false,
    state:boundary.state,
    code:boundary.code,
    activationConditionsMet:boundary.activationConditionsMet,
    transportAttached:boundary.transportAttached === true,
    transportInvocationAllowed:false,
    transportInvoked:false,
    providerCalled:false,
    billable:false,
    outputCreated:false
  });
}
