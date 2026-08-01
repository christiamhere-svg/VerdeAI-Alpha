# VerdeAI v10.4.0 — Secure Same-Property Backend Scaffold

This is a **local contract and safety milestone**, not a connected backend.

## What it adds

- A strict one-input / one-output render request contract.
- Same-property prompt construction with explicit structure and viewpoint preservation.
- Image type, byte-size, metadata-stripping, clue and consent validation.
- A provider adapter that always throws `PROVIDER_LOCKED`.
- A health contract that never reports real-call readiness.
- Sanitised operational event logging without prompts, photos, image data, property notes or raw session IDs.
- Node tests using built-in tools only; no dependency installation and no network access.

## Safety state

- Backend connected: **no**
- Provider calls: **off**
- Paid calls: **locked**
- Kill switch: **on**
- API key: **absent**
- Network use: **forbidden**
- VerdeAI input storage: **none**
- VerdeAI output storage: **none**
- Automatic retries: **zero**
- Real renders possible: **no**

## Run locally

From this folder:

```powershell
node --test
node .\src\self-check.mjs
```

No Cloudflare account, API key, npm install, provider account or payment is required.
