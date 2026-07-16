# Cloudflare Worker secure-pilot scaffold

Preferred v9.2 backend preparation. It is intentionally locked.

Do not add secrets or deploy real calls until the owner approves provider, backend, budget, tester count and retention policy.

After approval only:
1. Change approved variables deliberately.
2. Add encrypted secrets with `wrangler secret put OPENAI_API_KEY` and `wrangler secret put RATE_LIMIT_SALT`.
3. Keep one-image-only guards and Durable Object reservation logic.
4. Test `/api/render/estimate` before enabling real rendering.
5. Turn the kill switch off last.

The Worker does not write input photos, prompts or output images to storage. Its operational logs contain hashes, byte counts, status, future ID and timing state only.
