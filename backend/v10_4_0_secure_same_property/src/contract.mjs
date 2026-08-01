import { SAFE_POLICY } from "./policy.mjs";

const CONSENTS = Object.freeze([
  "ownsOrMayUsePhoto",
  "acceptsProviderProcessing",
  "acceptsConceptOnlyResult",
  "acceptsNoVerdeAIStorage"
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeText(value, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validateRenderRequest(payload, policy = SAFE_POLICY) {
  const errors = [];
  if (!isPlainObject(payload)) {
    return { ok: false, errors: [{ code: "INVALID_BODY", message: "Request body must be an object." }] };
  }

  if (payload.build !== policy.build) {
    errors.push({ code: "WRONG_BUILD", message: `Expected ${policy.build}.` });
  }

  const sessionId = safeText(payload.sessionId, 120);
  if (!/^[a-zA-Z0-9_-]{12,120}$/.test(sessionId)) {
    errors.push({ code: "INVALID_SESSION", message: "A non-identifying session ID is required." });
  }

  const futureId = safeText(payload.futureId, 80);
  if (!policy.allowedFutureIds.includes(futureId)) {
    errors.push({ code: "INVALID_FUTURE", message: "Choose one supported future direction." });
  }

  const image = payload.image;
  if (!isPlainObject(image)) {
    errors.push({ code: "ONE_IMAGE_REQUIRED", message: "Exactly one prepared image is required." });
  } else {
    if (!policy.allowedMimeTypes.includes(image.mimeType)) {
      errors.push({ code: "INVALID_IMAGE_TYPE", message: "Prepared image must be JPEG or PNG." });
    }
    if (!Number.isInteger(image.byteCount) || image.byteCount < 1) {
      errors.push({ code: "INVALID_IMAGE_SIZE", message: "Prepared image byte count is required." });
    } else if (image.byteCount > policy.maxPreparedImageBytes) {
      errors.push({ code: "IMAGE_TOO_LARGE", message: "Prepared image exceeds the 2.5 MB limit." });
    }
    if (image.metadataStripped !== true) {
      errors.push({ code: "METADATA_NOT_STRIPPED", message: "The browser must re-encode the image before upload." });
    }
    if (safeText(image.dataRef, 40) !== "single-browser-image") {
      errors.push({ code: "INVALID_IMAGE_REFERENCE", message: "Only one in-memory browser image is accepted." });
    }
  }

  if (!isPlainObject(payload.consents)) {
    errors.push({ code: "CONSENT_REQUIRED", message: "All explicit confirmations are required." });
  } else {
    for (const key of CONSENTS) {
      if (payload.consents[key] !== true) {
        errors.push({ code: "CONSENT_REQUIRED", message: `Missing confirmation: ${key}.` });
      }
    }
  }

  const clues = payload.clues;
  if (!isPlainObject(clues)) {
    errors.push({ code: "CLUES_REQUIRED", message: "Property clues are required." });
  } else {
    for (const key of ["spaceType", "mainProblem", "desiredOutcome"]) {
      if (!safeText(clues[key], 160)) {
        errors.push({ code: "CLUES_REQUIRED", message: `Missing clue: ${key}.` });
      }
    }
  }

  if (payload.imageCount !== 1) {
    errors.push({ code: "ONE_IMAGE_ONLY", message: "This contract accepts exactly one output image." });
  }

  return {
    ok: errors.length === 0,
    errors,
    normalized: errors.length ? null : {
      build: policy.build,
      sessionId,
      futureId,
      image: {
        mimeType: image.mimeType,
        byteCount: image.byteCount,
        metadataStripped: true,
        dataRef: "single-browser-image"
      },
      consents: Object.fromEntries(CONSENTS.map((key) => [key, true])),
      clues: {
        spaceType: safeText(clues.spaceType, 160),
        mainProblem: safeText(clues.mainProblem, 160),
        desiredOutcome: safeText(clues.desiredOutcome, 160),
        preserve: safeText(clues.preserve, 500)
      },
      imageCount: 1
    }
  };
}

export function buildSamePropertyPrompt(request) {
  const checked = validateRenderRequest(request);
  if (!checked.ok) {
    const error = new Error("Cannot build a prompt from an invalid request.");
    error.code = "INVALID_RENDER_REQUEST";
    error.details = checked.errors;
    throw error;
  }

  const { clues, futureId } = checked.normalized;
  return [
    "Edit the supplied property photograph into one believable concept image.",
    `Selected direction: ${futureId}.`,
    `Space type: ${clues.spaceType}.`,
    `Main problem: ${clues.mainProblem}.`,
    `Desired outcome: ${clues.desiredOutcome}.`,
    clues.preserve ? `Must preserve: ${clues.preserve}.` : "",
    "Keep this exact same property, viewpoint, camera position, perspective, building footprint, roofline, doors, windows, fences, paths, trees, utilities and access routes unless the user explicitly asked to alter one.",
    "Change landscaping and reversible outdoor elements only.",
    "Do not invent another house, another yard, a different camera angle, extra rooms, impossible structures or hidden areas.",
    "Return one realistic concept image only.",
    "Label in the product UI: AI Concept Render · Not Final Design."
  ].filter(Boolean).join("\n");
}
