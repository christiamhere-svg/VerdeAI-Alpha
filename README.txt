# VerdeAI v9.2.2

Owner-approved, one-real-render activation package for the VerdeAI public beta.

## Important

This frontend is deliberately shipped with an empty `apiBaseUrl` and no secrets. Deploy the separate Cloudflare Worker package first, add its three secrets, verify `/api/health`, then configure the Worker URL with:

```bash
node scripts/configure-worker-url.mjs https://YOUR-WORKER.workers.dev
```

After configuration, run `npm test`, deploy the frontend to Cloudflare Pages, and perform the owner-only first render described in `docs/OWNER_FIRST_RENDER_RUNBOOK_V9_2_2.md`.

The free calibrated overlay remains fully functional without the Worker.
