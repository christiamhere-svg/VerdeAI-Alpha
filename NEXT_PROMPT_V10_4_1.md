# Exact next VerdeAI prompt after v10.4.1 local approval

Continue VerdeAI from the locally verified v10.4.1 Local Frontend-to-Mock Integration.

Build v10.4.2 as the browser image-preparation milestone.

Requirements:

- Prepare exactly one browser image from the uploaded property photo.
- Re-encode locally to JPEG or PNG, strip metadata, preserve orientation, and keep the outdoor space readable.
- Enforce the 2.5 MB contract limit without uploading anything.
- Show before/after file size and dimensions in plain language.
- Keep the original photo visible and recoverable.
- Feed only metadata and an in-memory image reference into the v10.4.0 mock contract.
- Do not connect a URL, provider, API key, billing, Cloudflare, or paid calls.
- Keep provider calls off, paid calls locked, kill switch on, network forbidden, automatic retries zero, and one-image-only enforcement.
- Test desktop and Android locally before any repository commit or deployment.
