import { SAFE_POLICY, publicHealth } from "./policy.mjs";
import { renderResponse } from "./handler.mjs";

const sample = {
  build: "v10.4.0",
  sessionId: "local_session_123456",
  futureId: "wildlife-haven",
  imageCount: 1,
  image: {
    mimeType: "image/jpeg",
    byteCount: 500_000,
    metadataStripped: true,
    dataRef: "single-browser-image"
  },
  clues: {
    spaceType: "Backyard / open garden",
    mainProblem: "Nobody really uses it",
    desiredOutcome: "Wildlife and habitat",
    preserve: "Keep the mature tree and clear access."
  },
  consents: {
    ownsOrMayUsePhoto: true,
    acceptsProviderProcessing: true,
    acceptsConceptOnlyResult: true,
    acceptsNoVerdeAIStorage: true
  }
};

const health = publicHealth();
const render = await renderResponse(sample);
const passed =
  health.readyForRealCalls === false &&
  health.gates.killSwitch === true &&
  health.gates.paidCallsLocked === true &&
  render.status === 423 &&
  render.body.code === "SAFE_LOCKED";

console.log(JSON.stringify({
  build: SAFE_POLICY.build,
  passed,
  health,
  render: render.body.code
}, null, 2));

if (!passed) process.exitCode = 1;
