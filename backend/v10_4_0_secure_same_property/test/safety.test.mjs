import test from "node:test";
import assert from "node:assert/strict";
import { SAFE_POLICY, publicHealth } from "../src/policy.mjs";
import { renderResponse } from "../src/handler.mjs";
import { safeOperationalEvent, containsSensitiveContent } from "../src/logging.mjs";
import { callImageProvider, ProviderLockedError } from "../src/provider-lock.mjs";

const request = {
  build: "v10.4.0",
  sessionId: "session_123456789",
  futureId: "minimalist",
  imageCount: 1,
  image: {
    mimeType: "image/png",
    byteCount: 400_000,
    metadataStripped: true,
    dataRef: "single-browser-image"
  },
  clues: {
    spaceType: "Narrow side access",
    mainProblem: "Too much upkeep",
    desiredOutcome: "A cleaner, simpler look",
    preserve: "Keep access clear."
  },
  consents: {
    ownsOrMayUsePhoto: true,
    acceptsProviderProcessing: true,
    acceptsConceptOnlyResult: true,
    acceptsNoVerdeAIStorage: true
  }
};

test("default policy is hard locked", () => {
  assert.equal(SAFE_POLICY.providerCallsEnabled, false);
  assert.equal(SAFE_POLICY.paidCallsLocked, true);
  assert.equal(SAFE_POLICY.killSwitch, true);
  assert.equal(SAFE_POLICY.backendConnected, false);
  assert.equal(SAFE_POLICY.allowNetwork, false);
});

test("health never claims real readiness", () => {
  assert.equal(publicHealth().readyForRealCalls, false);
});

test("a valid request is still blocked", async () => {
  const result = await renderResponse(request);
  assert.equal(result.status, 423);
  assert.equal(result.body.code, "SAFE_LOCKED");
});

test("provider adapter always throws", async () => {
  await assert.rejects(callImageProvider(), ProviderLockedError);
});

test("operational log excludes prompt, photo and raw session", () => {
  const event = safeOperationalEvent({
    event: "render-reservation-denied",
    build: "v10.4.0",
    outcome: "safe-locked",
    sessionId: "secret-session-value",
    futureId: "minimalist",
    imageByteCount: 400_000
  });
  assert.equal(containsSensitiveContent(event), false);
  assert.equal(JSON.stringify(event).includes("secret-session-value"), false);
});
