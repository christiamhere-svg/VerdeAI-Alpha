import { SAFE_POLICY, publicHealth } from "./policy.mjs";
import { validateRenderRequest, buildSamePropertyPrompt } from "./contract.mjs";
import { safeOperationalEvent } from "./logging.mjs";

export function healthResponse(policy = SAFE_POLICY) {
  return { status: 200, body: publicHealth(policy) };
}

export async function renderResponse(payload, policy = SAFE_POLICY) {
  const validation = validateRenderRequest(payload, policy);
  if (!validation.ok) {
    return {
      status: 400,
      body: {
        ok: false,
        code: "INVALID_RENDER_REQUEST",
        errors: validation.errors
      }
    };
  }

  const event = safeOperationalEvent({
    event: "render-reservation-denied",
    build: policy.build,
    outcome: "safe-locked",
    sessionId: validation.normalized.sessionId,
    futureId: validation.normalized.futureId,
    imageByteCount: validation.normalized.image.byteCount
  });

  if (
    policy.killSwitch ||
    policy.paidCallsLocked ||
    !policy.providerCallsEnabled ||
    !policy.backendConnected ||
    !policy.allowNetwork
  ) {
    return {
      status: 423,
      body: {
        ok: false,
        code: "SAFE_LOCKED",
        message: "Real same-property generation is not active.",
        fallback: "Keep the exact uploaded photo and concept directions available.",
        event
      }
    };
  }

  buildSamePropertyPrompt(validation.normalized);
  return {
    status: 501,
    body: {
      ok: false,
      code: "PROVIDER_ADAPTER_NOT_INSTALLED",
      message: "No provider adapter exists in this scaffold."
    }
  };
}
