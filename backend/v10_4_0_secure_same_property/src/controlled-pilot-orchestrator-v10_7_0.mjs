import { validateLockedRequestEnvelope } from './request-envelope-v10_4_3.mjs';
import { buildSamePropertyPrompt, inspectPrompt } from './same-property-prompt-v10_7_0.mjs';
import { validatePilotRuntimeConfig, V1070_BUILD, V1070_SCOPE } from './pilot-policy-v10_7_0.mjs';
import { reservePilotAttempt } from './pilot-rate-guard-v10_7_0.mjs';
import { invokeOpenAIImage2Edit } from './openai-image2-adapter-v10_7_0.mjs';
import { reviewProviderOutput } from './pilot-output-gate-v10_7_0.mjs';
import { isJpeg } from './runtime-codec-v10_7_0.mjs';

export const V1070_ORCHESTRATOR_BUILD = 'v10.7.0';

function frozen(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value) || ArrayBuffer.isView(value)) return value;
  for (const child of Object.values(value)) frozen(child);
  return Object.freeze(value);
}
function base(state, code, extra = {}) {
  return frozen({
    build: V1070_BUILD,
    scope: V1070_SCOPE,
    state,
    code,
    oneImage: true,
    oneOutput: true,
    automaticRetries: 0,
    inputStored: false,
    outputStored: false,
    promptStored: false,
    originalPreserved: true,
    ...extra
  });
}
function validIdentity(identity) {
  return identity?.verified === true && identity?.issuer === 'cloudflare-access' && identity?.role === 'owner' && /^[a-f0-9]{64}$/.test(String(identity?.subjectHash || ''));
}
function validConsent(consent, envelope) {
  return consent?.explicit === true && consent?.serverVerified === true && consent?.scope === V1070_SCOPE && consent?.temporaryProcessingOnly === true && consent?.storeInput === false && consent?.storeOutput === false && consent?.recommendationId === envelope?.selectedRecommendation?.id;
}
function imageMatchesEnvelope(imageBytes, envelope) {
  return imageBytes instanceof Uint8Array && isJpeg(imageBytes) && imageBytes.byteLength === envelope?.input?.image?.byteCount;
}

export async function executeControlledPilot(options = {}) {
  const {
    runtimeConfig, identityEvidence, consentEvidence, envelope, imageBytes,
    propertySummary, preserveNote, rateStore, ipAddress, sessionId,
    rateSalt, apiKey, fetchImpl, now
  } = options;

  const configCheck = validatePilotRuntimeConfig(runtimeConfig);
  if (!configCheck.ok) return base('SAFE_LOCKED', 'RUNTIME_CONFIG_REJECTED', { blockers: configCheck.errors, providerCalled: false, billablePotential: false });
  if (!validIdentity(identityEvidence)) return base('SAFE_LOCKED', 'OWNER_IDENTITY_REQUIRED', { providerCalled: false, billablePotential: false });

  const envelopeCheck = validateLockedRequestEnvelope(envelope);
  if (!envelopeCheck.ok) return base('SAFE_LOCKED', 'REQUEST_ENVELOPE_REJECTED', { blockers: envelopeCheck.errors, providerCalled: false, billablePotential: false });
  if (!imageMatchesEnvelope(imageBytes, envelope)) return base('SAFE_LOCKED', 'IMAGE_ENVELOPE_MISMATCH', { providerCalled: false, billablePotential: false });
  if (!validConsent(consentEvidence, envelope)) return base('SAFE_LOCKED', 'SERVER_VERIFIED_CONSENT_REQUIRED', { providerCalled: false, billablePotential: false });

  let prompt;
  try { prompt = buildSamePropertyPrompt({ selectedFutureId: envelope.selectedRecommendation.id, propertySummary, preserveNote }); }
  catch { return base('SAFE_LOCKED', 'PROMPT_CONTRACT_REJECTED', { providerCalled: false, billablePotential: false }); }
  const promptCheck = inspectPrompt(prompt);
  if (!promptCheck.ok || !promptCheck.containsSamePropertyInstruction || !promptCheck.containsPreservationInstruction || !promptCheck.forbidsText) {
    return base('SAFE_LOCKED', 'PROMPT_CONTRACT_REJECTED', { providerCalled: false, billablePotential: false });
  }

  const reservation = await reservePilotAttempt({ store: rateStore, ipAddress, sessionId, salt: rateSalt, now });
  if (!reservation.ok) return base('SAFE_LOCKED', reservation.code, { providerCalled: false, billablePotential: false });

  const providerResult = await invokeOpenAIImage2Edit({ apiKey, imageBytes, prompt, fetchImpl });
  const outputReview = reviewProviderOutput(providerResult);
  if (!outputReview.ok) {
    return base('ORIGINAL_PRESERVED', outputReview.code, {
      providerCalled: providerResult.providerCalled === true,
      billablePotential: providerResult.billablePotential === true,
      providerRequestId: providerResult.providerRequestId || null,
      displayGeneratedOutput: false,
      outputReview
    });
  }

  return base('OWNER_REVIEW_REQUIRED', 'PILOT_OUTPUT_READY_FOR_SIDE_BY_SIDE_REVIEW', {
    providerCalled: true,
    billablePotential: true,
    providerRequestId: providerResult.providerRequestId || null,
    displayGeneratedOutput: true,
    displayMode: 'side-by-side-with-original',
    replaceOriginal: false,
    requiresHumanSamePropertyReview: true,
    samePropertyConfirmed: false,
    outputMimeType: 'image/jpeg',
    outputByteCount: providerResult.outputByteCount,
    outputBytes: providerResult.outputBytes,
    usage: providerResult.usage,
    rateReservation: reservation,
    outputReview
  });
}
