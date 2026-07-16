# VerdeAI v9.2 — Owner Decision Brief

**Prepared:** 16 July 2026  
**Status:** Decision support only. Real rendering remains disabled.

## Recommendation

Use **OpenAI GPT Image 2** for the first image-editing pilot, called through a **Cloudflare Worker on the Workers Paid plan**.

This is the best fit for VerdeAI's current low-cost public-beta stage because:

- GPT Image 2 accepts an image input and produces an edited image through the Images edit endpoint.
- It supports high-fidelity image inputs, landscape output sizes, quality controls and JPEG output/compression.
- A Cloudflare Worker fits the current Cloudflare Pages deployment and stores the provider key as an encrypted secret rather than frontend JavaScript.
- The Worker scaffold can atomically enforce one render per session, per-IP limits, invited-tester limits and a total spend reservation through a Durable Object.
- The existing calibrated overlay remains the zero-cost fallback and the app does not depend on AI rendering to work.

## Practical decisions

| Decision | Recommended v9.2 pilot setting | Reason |
|---|---:|---|
| Image provider | OpenAI GPT Image 2 | Strong image editing, one provider to secure and evaluate, official cost calculator and API controls. |
| Backend host | Cloudflare Worker, Paid plan | Same platform family as the live Pages site, encrypted secrets, sufficient CPU allowance and simple proxy deployment. |
| Render configuration | One image edit, medium quality, 1536×1024 landscape, JPEG | Practical balance between detail, speed and cost for a property concept. |
| Planning cost | About **US$0.08 per request** | Medium 1536×1024 output is officially listed at US$0.041; image and text inputs add variable token cost. US$0.08 is a planning estimate, not a quote. |
| VerdeAI planning ceiling | **US$0.15 per request** | Conservative amount reserved before a request. It is not a guaranteed provider invoice; the first owner-only render must verify actual billing. |
| Total pilot budget | **US$10** | Allows one US$5 Worker month plus up to US$5 provider buffer. |
| Invited tester limit | **10 testers** | Enough to expose obvious usability/quality problems without turning the pilot into an uncontrolled public endpoint. |
| Per-session limit | **1 render** | Matches the product goal and removes repeat-click spending. |
| Per-IP limit | **2 renders per 24 hours** | Allows two legitimate testers behind one connection while reducing casual abuse. |
| App retention policy | **No VerdeAI server storage** | Input and output pass through the Worker and are returned to the browser; no R2/KV/database image storage. |
| Provider data disclosure | OpenAI API data is not used to train by default, but default abuse-monitoring logs may retain customer content for up to 30 days | This must be stated honestly in the confirmation screen/privacy policy. |
| Expected render time | Variable; allow up to **2 minutes**, with a **120-second** app timeout | OpenAI labels model speed “Medium” and warns complex prompts may take up to two minutes; no guaranteed SLA is published. |

## Approximate pilot scenarios

These are conservative **planning scenarios** using a US$0.15 VerdeAI reservation per request plus one US$5 Cloudflare Workers Paid month. The reservation limits how many requests VerdeAI permits; it does not independently guarantee the provider invoice. These scenarios exclude taxes, exchange-rate effects and any manual retries.

| Pilot | Provider maximum | Worker month | Conservative total |
|---|---:|---:|---:|
| Owner + 4 testers (5 images) | US$0.75 | US$5.00 | **US$5.75** |
| 10 invited testers (10 images) | US$1.50 | US$5.00 | **US$6.50** |
| 20 invited testers (20 images) | US$3.00 | US$5.00 | **US$8.00** |

If the Cloudflare account is already on Workers Paid, the marginal hosting cost may be zero within included usage. Do not assume that until the account is checked.

## Privacy risks

1. A property photograph may reveal a home, address clues, people, number plates, possessions, access points or security details.
2. During a real render, the resized photograph and prompt leave the browser and are processed by Cloudflare and the selected image provider.
3. “No VerdeAI server storage” does not mean “no provider processing or logging.” OpenAI documents default abuse-monitoring retention of up to 30 days and approval requirements for stronger retention controls.
4. Hashing IP/session identifiers reduces operational-log sensitivity but is not anonymity if combined with other information.
5. A generated result may unintentionally alter buildings, doors, windows, paths or property boundaries despite prompt instructions.

## Quality limitations

- The output is a visual concept, not a surveyed design, planting plan, engineering assessment or construction document.
- Image models can alter rooflines, openings, perspective, objects, shadows or access routes.
- Calibration coordinates guide the prompt but are not a pixel-perfect mask in v9.2.
- Plant species, climate suitability, mature size, drainage, utilities and structural safety are not guaranteed.
- Results may look polished while still being impractical. The “Not Final Design” label must remain attached.

## Safest smallest pilot configuration

- Invite 10 named testers privately; do not place the endpoint behind an unrestricted public button.
- One render per browser session and two per IP per day.
- Browser resize to a maximum 1536-pixel long edge.
- JPEG re-encode at approximately 82% quality; maximum prepared payload 2.5 MB.
- Require all four confirmations: privacy, image permission/use, maximum cost and concept-only disclaimer.
- Set the VerdeAI provider-budget reservation cap to US$5 and the total owner budget to US$10 including hosting.
- Before testers are invited, set provider-account budget controls where available and compare the first owner-only render against the provider usage dashboard.
- Use one approved provider only.
- Keep kill switch on until estimate, mock, rate-limit and budget-lock tests pass on the deployed Worker.
- Do not log raw IPs, prompts, photos, generated images or property notes.
- Do not store input/output images in Cloudflare storage.
- Do not retry automatically after timeout or provider failure.
- Always return the free calibrated overlay fallback.

## Decisions requiring explicit owner approval

Real provider calls must remain off until the owner explicitly approves all five:

1. **Provider:** OpenAI GPT Image 2.
2. **Backend:** Cloudflare Worker on the Workers Paid plan.
3. **Budget:** US$10 total pilot budget, with a US$5 VerdeAI provider-budget reservation cap and a US$0.15 planning ceiling per request; actual provider billing must be checked after the first owner-only render.
4. **Tester count:** 10 invited testers, one render per session and two per IP per day.
5. **Retention/deletion:** no VerdeAI server storage; provider processing and OpenAI's documented default abuse-monitoring retention disclosure accepted.

## Official sources checked

- OpenAI GPT Image 2 model: https://developers.openai.com/api/docs/models/gpt-image-2
- OpenAI image generation/editing, sizes, quality and cost calculator: https://developers.openai.com/api/docs/guides/image-generation
- OpenAI API pricing: https://openai.com/api/pricing/
- OpenAI API data controls: https://developers.openai.com/api/docs/guides/your-data
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Worker secrets: https://developers.cloudflare.com/workers/configuration/secrets/
