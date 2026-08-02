import {
  V1070_ENDPOINT,
  V1070_MAX_INPUT_BYTES,
  V1070_MAX_OUTPUT_BYTES,
  V1070_MODEL,
  V1070_OUTPUT_COMPRESSION,
  V1070_OUTPUT_FORMAT,
  V1070_OUTPUT_QUALITY,
  V1070_OUTPUT_SIZE,
  V1070_TIMEOUT_MS
} from './pilot-policy-v10_7_0.mjs';
import { base64ToBytes, isJpeg } from './runtime-codec-v10_7_0.mjs';

export const V1070_ADAPTER_BUILD = 'v10.7.0';

function freezeDeep(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value) || ArrayBuffer.isView(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
}
function cleanRequestId(value) {
  const text = String(value || '').trim();
  return /^[a-zA-Z0-9._:-]{1,160}$/.test(text) ? text : null;
}
function safeMessage(value) {
  return String(value || 'Provider request failed.').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
}

export function inspectAdapterInput({ apiKey, imageBytes, prompt, fetchImpl } = {}) {
  const errors = [];
  if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(String(apiKey || ''))) errors.push('apiKey');
  if (!(imageBytes instanceof Uint8Array)) errors.push('imageBytes.type');
  else {
    if (imageBytes.byteLength < 100 || imageBytes.byteLength > V1070_MAX_INPUT_BYTES) errors.push('imageBytes.size');
    if (!isJpeg(imageBytes)) errors.push('imageBytes.jpeg');
  }
  if (typeof prompt !== 'string' || prompt.length < 300 || prompt.length > 1800) errors.push('prompt');
  if (typeof fetchImpl !== 'function') errors.push('fetchImpl');
  return freezeDeep({ ok: errors.length === 0, errors });
}

export async function invokeOpenAIImage2Edit({ apiKey, imageBytes, prompt, fetchImpl, timeoutMs = V1070_TIMEOUT_MS } = {}) {
  const input = inspectAdapterInput({ apiKey, imageBytes, prompt, fetchImpl });
  if (!input.ok) return freezeDeep({ ok: false, state: 'blocked', code: 'ADAPTER_INPUT_REJECTED', errors: input.errors, providerCalled: false, billablePotential: false });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    const form = new FormData();
    form.append('model', V1070_MODEL);
    form.append('image[]', new Blob([imageBytes], { type: 'image/jpeg' }), 'property.jpg');
    form.append('prompt', prompt);
    form.append('n', '1');
    form.append('size', V1070_OUTPUT_SIZE);
    form.append('quality', V1070_OUTPUT_QUALITY);
    form.append('output_format', V1070_OUTPUT_FORMAT);
    form.append('output_compression', String(V1070_OUTPUT_COMPRESSION));
    form.append('background', 'opaque');
    form.append('moderation', 'auto');

    response = await fetchImpl(V1070_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: controller.signal
    });
  } catch (error) {
    clearTimeout(timer);
    const timeout = error?.name === 'AbortError';
    return freezeDeep({
      ok: false,
      state: timeout ? 'timeout' : 'failure',
      code: timeout ? 'PROVIDER_TIMEOUT' : 'PROVIDER_NETWORK_FAILURE',
      message: safeMessage(error?.message),
      providerCalled: true,
      billablePotential: true,
      automaticRetryAttempted: false
    });
  }
  clearTimeout(timer);

  const providerRequestId = cleanRequestId(response.headers?.get?.('x-request-id'));
  let body;
  try { body = await response.json(); } catch { body = null; }
  if (!response.ok) {
    return freezeDeep({
      ok: false,
      state: 'failure',
      status: response.status,
      code: safeMessage(body?.error?.code || `HTTP_${response.status}`),
      message: safeMessage(body?.error?.message),
      providerRequestId,
      providerCalled: true,
      billablePotential: true,
      automaticRetryAttempted: false
    });
  }

  const items = Array.isArray(body?.data) ? body.data : [];
  if (items.length !== 1 || typeof items[0]?.b64_json !== 'string') {
    return freezeDeep({ ok: false, state: 'invalid', code: 'OUTPUT_COUNT_REJECTED', providerRequestId, providerCalled: true, billablePotential: true, automaticRetryAttempted: false });
  }
  const outputBytes = base64ToBytes(items[0].b64_json, 4_000_000);
  if (!(outputBytes instanceof Uint8Array) || !isJpeg(outputBytes)) {
    return freezeDeep({ ok: false, state: 'invalid', code: 'NON_JPEG_PROVIDER_OUTPUT', providerRequestId, providerCalled: true, billablePotential: true, automaticRetryAttempted: false });
  }
  if (outputBytes.byteLength > V1070_MAX_OUTPUT_BYTES) {
    return freezeDeep({ ok: false, state: 'invalid', code: 'OVERSIZED_PROVIDER_OUTPUT', providerRequestId, providerCalled: true, billablePotential: true, automaticRetryAttempted: false });
  }

  const usage = body?.usage && typeof body.usage === 'object' ? {
    totalTokens: Number.isFinite(body.usage.total_tokens) ? body.usage.total_tokens : null,
    inputTokens: Number.isFinite(body.usage.input_tokens) ? body.usage.input_tokens : null,
    outputTokens: Number.isFinite(body.usage.output_tokens) ? body.usage.output_tokens : null
  } : null;
  return freezeDeep({
    ok: true,
    state: 'provider-success',
    code: 'ONE_IMAGE_RECEIVED',
    providerRequestId,
    providerCalled: true,
    billablePotential: true,
    outputCount: 1,
    outputMimeType: 'image/jpeg',
    outputBytes,
    outputByteCount: outputBytes.byteLength,
    usage,
    automaticRetryAttempted: false
  });
}
