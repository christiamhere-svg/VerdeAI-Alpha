import { V1070_MAX_OUTPUT_BYTES, V1070_OUTPUT_SIZE } from './pilot-policy-v10_7_0.mjs';

export const V1070_OUTPUT_GATE_BUILD = 'v10.7.0';

function freeze(value) { return Object.freeze(value); }
function isJpeg(bytes) {
  return bytes instanceof Uint8Array && bytes.byteLength >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
}

export function reviewProviderOutput(providerResult) {
  if (!providerResult?.ok) {
    return freeze({
      ok: false,
      state: 'ORIGINAL_PRESERVED',
      code: providerResult?.code || 'PROVIDER_FAILED',
      displayGeneratedOutput: false,
      replaceOriginal: false,
      requiresHumanSamePropertyReview: false,
      automaticRetry: false
    });
  }
  const bytes = providerResult.outputBytes;
  if (providerResult.outputCount !== 1 || providerResult.outputMimeType !== 'image/jpeg') {
    return freeze({ ok: false, state: 'ORIGINAL_PRESERVED', code: 'OUTPUT_CONTRACT_REJECTED', displayGeneratedOutput: false, replaceOriginal: false, requiresHumanSamePropertyReview: false, automaticRetry: false });
  }
  if (!isJpeg(bytes) || bytes.byteLength > V1070_MAX_OUTPUT_BYTES) {
    return freeze({ ok: false, state: 'ORIGINAL_PRESERVED', code: 'OUTPUT_FILE_REJECTED', displayGeneratedOutput: false, replaceOriginal: false, requiresHumanSamePropertyReview: false, automaticRetry: false });
  }
  return freeze({
    ok: true,
    state: 'OWNER_REVIEW_REQUIRED',
    code: 'VALID_FILE_AWAITING_SAME_PROPERTY_REVIEW',
    displayGeneratedOutput: true,
    displayMode: 'side-by-side-with-original',
    replaceOriginal: false,
    samePropertyConfirmed: false,
    requiresHumanSamePropertyReview: true,
    requestedSize: V1070_OUTPUT_SIZE,
    outputMimeType: 'image/jpeg',
    outputByteCount: bytes.byteLength,
    automaticRetry: false,
    persistOutput: false
  });
}
