# VerdeAI v10.7.0 — Controlled Owner-Only Pilot Infrastructure

This build adds the first real-provider-capable server infrastructure for one private same-property image edit. It remains unconfigured, undeployed, disconnected, and safe-locked.

## What it contains

- Cloudflare Worker request boundary.
- Cloudflare Access owner identity gate.
- Atomic Durable Object rate limiter.
- OpenAI GPT Image 2 edit adapter.
- One input image and one output image only.
- No automatic retries.
- No application storage of input images, output images, or prompts.
- Original-photo fallback and mandatory side-by-side owner review.
- Server-only activation flags, credential location, kill switch, and network gate.

## What it does not do

- It does not alter `index.html`.
- It does not connect the current public website to the Worker.
- It does not configure Cloudflare.
- It does not add an OpenAI API key.
- It does not deploy anything.
- It does not make a real provider request.
- It does not approve a paid request.

`GO PILOT` approved development of this infrastructure only. A separate explicit approval is still required before one paid owner test.
