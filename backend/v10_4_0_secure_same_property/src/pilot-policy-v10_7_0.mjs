export const V1070_BUILD = 'v10.7.0';
export const V1070_SCOPE = 'owner-private-single-image-pilot-v1';
export const V1070_PROVIDER = 'openai';
export const V1070_MODEL = 'gpt-image-2-2026-04-21';
export const V1070_ENDPOINT = 'https://api.openai.com/v1/images/edits';
export const V1070_MAX_INPUT_BYTES = 2_500_000;
export const V1070_MAX_OUTPUT_BYTES = 2_500_000;
export const V1070_MAX_EDGE = 2048;
export const V1070_MAX_JSON_BODY_BYTES = 3_700_000;
export const V1070_OUTPUT_SIZE = '1536x1024';
export const V1070_OUTPUT_QUALITY = 'medium';
export const V1070_OUTPUT_FORMAT = 'jpeg';
export const V1070_OUTPUT_COMPRESSION = 82;
export const V1070_MAX_REQUEST_COST_USD = 0.15;
export const V1070_TOTAL_BUDGET_USD = 10;
export const V1070_OUTPUT_ONLY_ESTIMATE_USD = 0.041;
export const V1070_SESSION_LIMIT = 1;
export const V1070_IP_LIMIT_24H = 2;
export const V1070_TIMEOUT_MS = 125_000;

function freezeDeep(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) freezeDeep(child);
  return Object.freeze(value);
}

export function validatePilotRuntimeConfig(config) {
  const errors = [];
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return freezeDeep({ ok: false, errors: ['config.object'] });
  }
  if (config.build !== V1070_BUILD) errors.push('build');
  if (config.scope !== V1070_SCOPE) errors.push('scope');
  if (config.environment !== 'server') errors.push('environment');
  if (config.provider !== V1070_PROVIDER) errors.push('provider');
  if (config.model !== V1070_MODEL) errors.push('model');
  if (config.endpoint !== V1070_ENDPOINT) errors.push('endpoint');
  if (config.pilotEnabled !== true) errors.push('pilotEnabled');
  if (config.infrastructureBuildApproved !== true) errors.push('infrastructureBuildApproved');
  if (config.paidPilotApproved !== true) errors.push('paidPilotApproved');
  if (config.publicDeploymentApproved !== false) errors.push('publicDeploymentApproved');
  if (config.ownerOnly !== true) errors.push('ownerOnly');
  if (config.cloudflareAccessRequired !== true) errors.push('cloudflareAccessRequired');
  if (config.providerCredentialLocation !== 'server-secret') errors.push('providerCredentialLocation');
  if (config.providerCredentialPresent !== true) errors.push('providerCredentialPresent');
  if (config.killSwitch !== false) errors.push('killSwitch');
  if (config.networkAllowed !== true) errors.push('networkAllowed');
  if (config.maxImagesPerRequest !== 1) errors.push('maxImagesPerRequest');
  if (config.maxOutputsPerRequest !== 1) errors.push('maxOutputsPerRequest');
  if (config.sessionLimit !== V1070_SESSION_LIMIT) errors.push('sessionLimit');
  if (config.ipLimit24h !== V1070_IP_LIMIT_24H) errors.push('ipLimit24h');
  if (config.automaticRetries !== 0) errors.push('automaticRetries');
  if (config.storeInputImages !== false) errors.push('storeInputImages');
  if (config.storeOutputImages !== false) errors.push('storeOutputImages');
  if (config.storePrompts !== false) errors.push('storePrompts');
  if (config.maxInputBytes !== V1070_MAX_INPUT_BYTES) errors.push('maxInputBytes');
  if (config.maxOutputBytes !== V1070_MAX_OUTPUT_BYTES) errors.push('maxOutputBytes');
  if (config.maxEdge !== V1070_MAX_EDGE) errors.push('maxEdge');
  if (config.outputSize !== V1070_OUTPUT_SIZE) errors.push('outputSize');
  if (config.outputQuality !== V1070_OUTPUT_QUALITY) errors.push('outputQuality');
  if (config.outputFormat !== V1070_OUTPUT_FORMAT) errors.push('outputFormat');
  if (config.outputCompression !== V1070_OUTPUT_COMPRESSION) errors.push('outputCompression');
  if (config.moderation !== 'auto') errors.push('moderation');
  if (config.maxRequestCostUsd !== V1070_MAX_REQUEST_COST_USD) errors.push('maxRequestCostUsd');
  if (config.totalBudgetUsd !== V1070_TOTAL_BUDGET_USD) errors.push('totalBudgetUsd');
  if (config.platformSpendLimitConfirmed !== true) errors.push('platformSpendLimitConfirmed');
  if (config.atomicRateLimiterAttached !== true) errors.push('atomicRateLimiterAttached');
  if (config.auditSinkMode !== 'redacted-metadata-only') errors.push('auditSinkMode');
  return freezeDeep({ ok: errors.length === 0, errors });
}

export function createLockedPilotConfig() {
  return freezeDeep({
    build: V1070_BUILD,
    scope: V1070_SCOPE,
    environment: 'server',
    provider: V1070_PROVIDER,
    model: V1070_MODEL,
    endpoint: V1070_ENDPOINT,
    pilotEnabled: false,
    infrastructureBuildApproved: true,
    paidPilotApproved: false,
    publicDeploymentApproved: false,
    ownerOnly: true,
    cloudflareAccessRequired: true,
    providerCredentialLocation: 'server-secret',
    providerCredentialPresent: false,
    killSwitch: true,
    networkAllowed: false,
    maxImagesPerRequest: 1,
    maxOutputsPerRequest: 1,
    sessionLimit: V1070_SESSION_LIMIT,
    ipLimit24h: V1070_IP_LIMIT_24H,
    automaticRetries: 0,
    storeInputImages: false,
    storeOutputImages: false,
    storePrompts: false,
    maxInputBytes: V1070_MAX_INPUT_BYTES,
    maxOutputBytes: V1070_MAX_OUTPUT_BYTES,
    maxEdge: V1070_MAX_EDGE,
    outputSize: V1070_OUTPUT_SIZE,
    outputQuality: V1070_OUTPUT_QUALITY,
    outputFormat: V1070_OUTPUT_FORMAT,
    outputCompression: V1070_OUTPUT_COMPRESSION,
    moderation: 'auto',
    maxRequestCostUsd: V1070_MAX_REQUEST_COST_USD,
    totalBudgetUsd: V1070_TOTAL_BUDGET_USD,
    platformSpendLimitConfirmed: false,
    atomicRateLimiterAttached: false,
    auditSinkMode: 'redacted-metadata-only'
  });
}

export function publicPilotStatus(config = createLockedPilotConfig()) {
  const check = validatePilotRuntimeConfig(config);
  return freezeDeep({
    build: V1070_BUILD,
    scope: V1070_SCOPE,
    state: check.ok ? 'READY_FOR_OWNER_ONLY_LIVE_REQUEST' : 'SAFE_LOCKED',
    runtimeValidated: check.ok,
    provider: V1070_PROVIDER,
    model: V1070_MODEL,
    oneImage: true,
    oneOutput: true,
    automaticRetries: 0,
    inputStored: false,
    outputStored: false,
    promptStored: false,
    publicDeploymentApproved: false,
    outputOnlyEstimateUsd: V1070_OUTPUT_ONLY_ESTIMATE_USD,
    maxRequestCostPolicyUsd: V1070_MAX_REQUEST_COST_USD,
    totalBudgetPolicyUsd: V1070_TOTAL_BUDGET_USD,
    costEstimateIsNotAProviderHardCap: true,
    blockers: check.errors
  });
}
