export class ProviderLockedError extends Error {
  constructor(message = "Provider calls are locked in VerdeAI v10.4.0.") {
    super(message);
    this.name = "ProviderLockedError";
    this.code = "PROVIDER_LOCKED";
  }
}

export async function callImageProvider() {
  throw new ProviderLockedError();
}
