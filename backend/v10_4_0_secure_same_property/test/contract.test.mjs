import test from "node:test";
import assert from "node:assert/strict";
import { validateRenderRequest, buildSamePropertyPrompt } from "../src/contract.mjs";

function validRequest() {
  return {
    build: "v10.4.0",
    sessionId: "session_123456789",
    futureId: "wildlife-haven",
    imageCount: 1,
    image: {
      mimeType: "image/jpeg",
      byteCount: 800_000,
      metadataStripped: true,
      dataRef: "single-browser-image"
    },
    clues: {
      spaceType: "Backyard / open garden",
      mainProblem: "Nobody really uses it",
      desiredOutcome: "Wildlife and habitat",
      preserve: "Keep the mature tree and side access clear."
    },
    consents: {
      ownsOrMayUsePhoto: true,
      acceptsProviderProcessing: true,
      acceptsConceptOnlyResult: true,
      acceptsNoVerdeAIStorage: true
    }
  };
}

test("accepts one complete safe request", () => {
  assert.equal(validateRenderRequest(validRequest()).ok, true);
});

test("rejects the wrong build", () => {
  const request = validRequest();
  request.build = "v10.3.2";
  assert.equal(validateRenderRequest(request).errors.some((e) => e.code === "WRONG_BUILD"), true);
});

test("rejects oversize images", () => {
  const request = validRequest();
  request.image.byteCount = 2_500_001;
  assert.equal(validateRenderRequest(request).errors.some((e) => e.code === "IMAGE_TOO_LARGE"), true);
});

test("rejects images that were not re-encoded", () => {
  const request = validRequest();
  request.image.metadataStripped = false;
  assert.equal(validateRenderRequest(request).errors.some((e) => e.code === "METADATA_NOT_STRIPPED"), true);
});

test("rejects missing consent", () => {
  const request = validRequest();
  request.consents.acceptsProviderProcessing = false;
  assert.equal(validateRenderRequest(request).errors.some((e) => e.code === "CONSENT_REQUIRED"), true);
});

test("rejects more than one output", () => {
  const request = validRequest();
  request.imageCount = 6;
  assert.equal(validateRenderRequest(request).errors.some((e) => e.code === "ONE_IMAGE_ONLY"), true);
});

test("builds a same-property preservation prompt", () => {
  const prompt = buildSamePropertyPrompt(validRequest());
  assert.match(prompt, /exact same property/i);
  assert.match(prompt, /camera position/i);
  assert.match(prompt, /roofline/i);
  assert.match(prompt, /one realistic concept image only/i);
  assert.match(prompt, /mature tree/i);
});
