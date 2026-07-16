# VerdeAI v9.2 — Official Pricing Sources

Checked against official documentation on **16 July 2026**.

## OpenAI GPT Image 2

Official image-generation documentation lists GPT Image 2 output prices for common sizes:

| Quality | 1024×1024 | 1024×1536 | 1536×1024 |
|---|---:|---:|---:|
| Low | US$0.006 | US$0.005 | US$0.005 |
| Medium | US$0.053 | US$0.041 | **US$0.041** |
| High | US$0.211 | US$0.165 | US$0.165 |

The documentation also says image-edit request cost includes text input tokens, image input tokens and image output tokens. GPT Image 2 processes image inputs at high fidelity, so the final edit cost is greater than the output-only US$0.041 figure and varies with the input image.

VerdeAI therefore uses:

- US$0.08 planning estimate.
- US$0.15 VerdeAI planning/reservation ceiling per request.
- Actual-price verification immediately before activation.

Sources:

- https://developers.openai.com/api/docs/guides/image-generation
- https://openai.com/api/pricing/
- https://developers.openai.com/api/docs/models/gpt-image-2

## Cloudflare Workers

Official Workers pricing states:

- Workers Paid has a minimum **US$5 monthly** account charge.
- It includes 10 million requests and 30 million CPU milliseconds per month.
- Additional requests are US$0.30 per million and CPU is US$0.02 per million CPU milliseconds.
- Pages Functions are billed as Workers.
- The Free plan allows 100,000 requests per day but only 10 ms CPU per invocation.
- Workers Paid allows up to 5 minutes CPU per HTTP request, default 30 seconds, and network waiting does not count as CPU time.

The pilot's traffic is tiny, so the recommendation is based on predictability and limits, not request volume.

Sources:

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/configuration/secrets/

## Important caveats

- Prices are in US dollars unless the provider account says otherwise.
- Taxes, card fees and AUD conversion are not included.
- Providers can change pricing. Recheck the official pages immediately before enabling real calls.
- The US$0.15 shown in the UI is a VerdeAI request-reservation guardrail, not a guaranteed provider invoice. The backend can prevent requests after the reservation cap is exhausted, but it cannot know final provider billing in advance.
- Before inviting testers, set provider-account budget controls where available and compare the first owner-only request with the provider usage dashboard.
