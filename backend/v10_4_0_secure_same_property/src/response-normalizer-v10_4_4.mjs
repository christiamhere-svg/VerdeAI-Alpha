export const V1044_MAX_BYTES = 2500000;
export const V1044_MAX_EDGE = 2048;

function cleanText(value, fallback) {
  const text = String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);
  return text || fallback;
}

function base(state, raw, extra = {}) {
  return Object.freeze({
    build: "v10.4.4",
    normalised: true,
    state,
    status: Number.isInteger(raw?.status) ? raw.status : 0,
    code: cleanText(raw?.code, state.toUpperCase()),
    message: cleanText(raw?.message, "The exact uploaded photo remains available."),
    preserveOriginal: state !== "success",
    outputApplied: state === "success",
    providerCalled: raw?.providerCalled === true,
    billable: raw?.billable === true,
    ...extra
  });
}

export function normalizeGenerationResponse(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base("invalid", {}, {code:"INVALID_RESPONSE"});
  if (raw.status === 423 && raw.code === "SAFE_LOCKED" && raw.outputCreated === false && raw.accepted === false) {
    return base("locked", raw, {providerCalled:false,billable:false,preserveOriginal:true,outputApplied:false});
  }
  const claimedSuccess = raw.ok === true || raw.accepted === true || raw.outputCreated === true || (Number.isInteger(raw.status) && raw.status >= 200 && raw.status < 300);
  if (claimedSuccess) {
    const output = raw.output;
    const outputs = raw.outputs;
    const exactlyOne = output?.count === 1 && (!Array.isArray(outputs) || outputs.length === 1);
    const byteCount = output?.byteCount;
    const width = output?.width;
    const height = output?.height;
    const proof = output?.mimeType === "image/jpeg" && output?.preserveSameProperty === true && output?.samePropertyConfirmed === true && output?.metadataStripped === true && output?.dataRef === "single-normalized-output-image";
    const limits = Number.isInteger(byteCount) && byteCount > 0 && byteCount <= V1044_MAX_BYTES && Number.isInteger(width) && Number.isInteger(height) && width > 0 && height > 0 && Math.max(width,height) <= V1044_MAX_EDGE;
    if (!exactlyOne || !proof || !limits) return base("invalid", raw, {code:"INVALID_SUCCESS_RESPONSE",preserveOriginal:true,outputApplied:false});
    return base("success", raw, {code:"NORMALIZED_SUCCESS",preserveOriginal:false,outputApplied:true,output:Object.freeze({count:1,mimeType:"image/jpeg",byteCount,width,height,preserveSameProperty:true,samePropertyConfirmed:true,metadataStripped:true,dataRef:"single-normalized-output-image"})});
  }
  if (raw.ok === false || (Number.isInteger(raw.status) && raw.status >= 400)) return base("failure", raw, {code:cleanText(raw.code,"GENERATION_FAILED"),preserveOriginal:true,outputApplied:false});
  return base("invalid", raw, {code:"UNRECOGNIZED_RESPONSE",preserveOriginal:true,outputApplied:false});
}

export function fallbackDecision(normalized) {
  return Object.freeze({
    restoreOriginal: normalized?.state !== "success",
    keepConceptResult: true,
    removeUploadedPhoto: false,
    retryAutomatically: false,
    persistResponse: false
  });
}
