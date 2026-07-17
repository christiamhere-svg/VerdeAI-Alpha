# VerdeAI v9.2.2 — Approved Pilot Settings

Owner approval recorded on 17 July 2026.

## Approved decisions

| Decision | Approved setting |
|---|---|
| Rendering provider | OpenAI GPT Image 2 |
| Backend host | Cloudflare Worker Paid with a Durable Object guard |
| Total pilot allowance | US$10 total planning budget |
| Provider reservation cap | US$5 |
| Per-request reservation ceiling | US$0.15 |
| Invited testers | 10 |
| Session limit | One render per browser session |
| IP limit | Two render reservations per IP per 24 hours |
| VerdeAI image retention | No input or output image storage on VerdeAI servers |
| Result label | AI Concept Render · Not Final Design |

The US$0.15 value is a conservative VerdeAI reservation ceiling, not a guaranteed provider invoice. A failed or timed-out request may retain its reservation to avoid accidental overspend.

## One-render contract

The live endpoint accepts exactly one prepared property photograph and one selected future. There is no render-all-six route. The request must include:

- Build v9.2.2
- One invited pilot code
- One session ID
- Four explicit user confirmations
- Browser-resized, JPEG-re-encoded image data
- Metadata-stripped flag
- Image byte count below 2.5 MB
- Calibration-aware prompt and geometry
- US$0.15 maximum reservation confirmation

## Activation boundary

The owner decisions are compiled into the frontend and Worker configuration. Real calls still require all of the following deployment items:

1. A deployed Cloudflare Worker URL in `config.v9.2.2.js`.
2. `OPENAI_API_KEY` stored as a Worker secret.
3. `RATE_LIMIT_SALT` stored as a Worker secret.
4. `PILOT_INVITE_CODE_HASHES` stored as a Worker secret.
5. Worker health reporting every approved gate ready.

No API key or invited-code hash list belongs in the frontend package.
