# Exact next VerdeAI prompt after v10.4.0 local approval

Continue VerdeAI from the locally verified v10.4.0 Secure Same-Property Backend Scaffold.

The local contract, hard lock, validation, prompt preservation, sanitised logging and automated tests have passed. No provider, Cloudflare deployment, API key, paid request or live-site change has occurred.

Build v10.4.1 as the local frontend-to-mock-contract integration milestone.

Requirements:

- Connect the v10.3.2 own-photo result to the local mock contract only.
- Add one clearly optional action for the recommended future, never six renders.
- Keep the exact uploaded photo visible before and after the mock flow.
- Show preparation, consent, safe-lock, timeout and fallback states.
- Do not connect a URL, provider, API key, billing or Cloudflare.
- Keep provider calls off, paid calls locked and kill switch on.
- Test desktop and Android locally before any repository commit or deployment.
