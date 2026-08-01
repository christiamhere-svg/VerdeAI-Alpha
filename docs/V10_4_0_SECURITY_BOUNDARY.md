# VerdeAI v10.4.0 Security Boundary

## Purpose

Define and test the exact request contract for a future single same-property concept image without activating any provider or backend.

## Non-negotiable rules

1. One prepared property photo in.
2. One concept image out.
3. No render-all-six route.
4. Browser re-encodes the input and reports metadata stripped.
5. Maximum prepared input size: 2.5 MB.
6. Explicit permission, provider-processing, concept-only and no-VerdeAI-storage confirmations.
7. Preserve the exact property, viewpoint, building footprint, roofline, openings, access, utilities, fences, paths and retained trees unless the owner explicitly asks for a change.
8. No frontend API keys.
9. No prompt, image, property-note or raw-IP logging.
10. No automatic retries.
11. Free own-photo concept directions remain usable when generation is unavailable.
12. Real calls require a later owner-approved activation milestone and separate paid test.

## Current official-platform alignment

The future adapter is reserved for OpenAI GPT Image 2 image editing. Sensitive values must be Cloudflare Worker secrets rather than plaintext `vars` or committed local files. Module Worker structure is preferred. Durable Object bindings, if used later, must be configured per environment.

No platform connection is implemented in v10.4.0.
