window.VERDEAI_CONFIG = {
  version: "9.2.2",
  apiBaseUrl: "",
  useBackend: true,
  staticMode: true,
  ownerApprovals: {
    provider: true,
    backendHost: true,
    pilotBudget: true,
    testerLimit: true,
    retentionPolicy: true
  },
  pilotApproved: true,
  provider: "openai-gpt-image-2",
  backendHost: "cloudflare-worker",
  pilotBudgetTotalUsd: 10,
  providerReservationCapUsd: 5,
  maxCostPerRenderUsd: 0.15,
  invitedTesterLimit: 10,
  perSessionLimit: 1,
  perIpDailyLimit: 2,
  retentionPolicy: "no-store",
  mockMode: false,
  killSwitch: false,
  providerCallsEnabled: true,
  paidCallsLocked: false,
  frontendApiKeyPresent: false,
  activationRequires: ["deployed Worker URL", "OPENAI_API_KEY Worker secret", "RATE_LIMIT_SALT Worker secret", "PILOT_INVITE_CODE_HASHES Worker secret"]
};
