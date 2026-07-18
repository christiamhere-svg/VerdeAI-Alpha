# VerdeAI v9.2.2.1 Worker deployment hotfix

This package replaces the broken local-token deployment path.

## Safe default

`wrangler.jsonc` is the only default configuration and is deliberately locked:

- real rendering off
- kill switch on
- test mode on
- spend cap zero
- tester limit zero
- no OpenAI key required
- no provider can be contacted

`wrangler.production.jsonc` is separate and is not used by the default Cloudflare build.

## Recommended deployment: Cloudflare Workers Builds + GitHub

Put this folder in the existing VerdeAI GitHub repository as `cloudflare-worker`.

In Cloudflare:

1. Workers & Pages → Create application → Import a repository.
2. Select the VerdeAI GitHub repository.
3. Root directory: `/cloudflare-worker`.
4. Build command: leave blank.
5. Deploy command: `npx wrangler deploy`.
6. Production branch: `main`.
7. Save and Deploy.

The first deployment is safe-locked and needs no manual Cloudflare API token on the computer.

## Local validation (optional)

```bash
npm install
npm run check
npm run dry-run:safe
```

## Production activation later

Do not use the production configuration until the safe-locked Worker is deployed and `/api/health` is verified. Add the three Worker secrets in the Cloudflare dashboard, then intentionally deploy with:

```bash
npx wrangler deploy --config wrangler.production.jsonc
```

Required production secrets:

- `OPENAI_API_KEY`
- `RATE_LIMIT_SALT`
- `PILOT_INVITE_CODE_HASHES`

Never place these in frontend code or GitHub.
