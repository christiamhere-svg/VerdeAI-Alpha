# VerdeAI v9.2.2 Cloudflare Worker

Production backend for the owner-approved, one-image pilot.

## What it enforces

- OpenAI GPT Image 2 only
- Exactly one property image per request
- Build v9.2.2 frontend/Worker match
- Ten invited-code hashes
- Each invite code can reserve one request
- One render reservation per browser session
- Two render reservations per IP per 24 hours
- US$0.15 reservation per accepted request
- US$5 total provider reservation cap
- 2.5 MB prepared-image limit
- Four user confirmations plus explicit render confirmation
- Calibration-aware request fields
- 120-second timeout
- No automatic retry
- No VerdeAI image or prompt storage
- Non-sensitive operational logging only

## Install

```bash
npm install
```

## Generate private tester codes

```bash
npm run codes
```

This creates `pilot-codes-owner-only.txt`. Never commit, upload or publicly share that file. Put only its comma-separated hash list into the Worker secret.

## Add required secrets

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put RATE_LIMIT_SALT
npx wrangler secret put PILOT_INVITE_CODE_HASHES
```

## Validate and deploy

```bash
npm run check
npx wrangler deploy --dry-run
npm run deploy
```

## Emergency server lock

```bash
npm run safe-lock
```

The safe-lock config disables real rendering, enables the kill switch and test mode, and sets the spend and tester caps to zero.

## Important

The Worker URL must be inserted into the separate frontend package only after `/api/health` reports every approved gate ready. No secret belongs in the frontend.
