# VerdeAI v9.2 — Secure Pilot Architecture

## Request path

1. The existing browser analysis and five-step calibration produce the property situation, recommended future, selected future, usable ground, keep-clear areas, access route, opportunity point, marker 5 and first move.
2. The user chooses **Create one AI concept render**.
3. The confirmation dialog shows the situation, selected future, US$0.15 estimated planning ceiling with provider-billing caveat, privacy/image-use explanation and concept-only disclaimer.
4. The browser re-encodes the property photo to JPEG, maximum 1536-pixel long edge and maximum 2.5 MB. This removes ordinary EXIF/GPS metadata.
5. The browser submits exactly one request to VerdeAI's backend after all confirmations.
6. The Worker validates origin, count, image type/size, consent, cost, calibration, approval flags, kill switch, test mode and API-key presence.
7. A Durable Object atomically reserves session/IP/tester/budget allowance before a paid call.
8. The Worker sends one image edit request to the approved provider.
9. The generated image is returned directly to the browser without VerdeAI image storage.
10. Any block, timeout or provider error returns the free calibrated-overlay fallback.

## Provider abstraction

The backend contract uses a provider ID and adapter boundary. v9.2 prepares only:

- `mock` — always safe, no paid provider.
- `openai-gpt-image-2` — present but locked by default.

Other providers are deliberately not exposed in the UI. Adding another provider later must not weaken the one-image, consent, rate-limit, budget or fallback contract.

## Calibration-aware prompt payload

The prompt builder contains:

- Property situation and pattern.
- VerdeAI recommendation.
- User-selected future.
- Usable-ground polygon as image percentages.
- Keep-clear rectangles as image percentages.
- Protected access route points.
- Opportunity point.
- Marker 5 location.
- Property-specific first move.
- Instructions to preserve buildings, rooflines, doors, windows, walls, columns, paths and utilities.
- Instructions to change only permitted areas, avoid structural changes, avoid mature instant landscaping and produce a plausible early concept.
- Explicit inspiration-only disclaimer.

## Data handling

### Browser

Stores the normal static-beta photo/project locally as before. The temporary render-prepared image is kept in memory and excluded from saved render settings.

### VerdeAI Worker

No image database, object storage, KV image entry or prompt storage is configured. The input and result exist only while processing and returning the request.

### Durable Object

Stores only budget/rate-limit counters and hashed session identifiers. It does not receive the property image or prompt.

### Provider

Receives the prepared photo and prompt for the image-edit request. Provider data controls and retention must be disclosed and owner-approved before activation.

## Non-sensitive operational log fields

- event name
- timestamp
- build version
- hashed session identifier
- hashed IP identifier
- selected future ID
- prepared image byte count
- reserved maximum cost
- status / timeout / provider-error state

Excluded: raw IP, photo, image output, prompt, property note, address, postcode and API key.

## Browser and testing limitations

- v9.2 does not make a real provider request, so real latency, image quality, moderation outcomes and actual billed input tokens are unverified.
- Canvas re-encoding behaviour should be physically checked on Android, iPhone/Safari and desktop browsers with portrait, landscape and very large photos.
- The calibration coordinates are prompt guidance, not a provider mask. Structural preservation must be visually reviewed.
- Durable Object enforcement is scaffolded but not deployed or load-tested.
- Node's in-memory ledger is suitable only for local contract testing, not distributed production enforcement.
- Cloudflare account plan, billing status, observability settings and privacy configuration have not been inspected from this package.
- OpenAI account tier, billing, regional availability and project data-control eligibility have not been inspected.
- The live Cloudflare Pages site is not changed by this ZIP until it is deployed.
