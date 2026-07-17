# BUILD STATUS — VerdeAI v9.2.2

## Release state

**Code complete and deployment-ready for an owner-only first real render.**

The package cannot make a live provider call as distributed because `apiBaseUrl` is intentionally blank and no secrets are included. This is a security boundary, not an unfinished frontend feature.

## Approved configuration

- Provider: OpenAI GPT Image 2
- Backend: Cloudflare Worker Paid
- Provider reservation cap: US$5
- Request reservation ceiling: US$0.15
- Invited testers: 10
- Per session: 1
- Per IP per 24 hours: 2
- VerdeAI server image storage: none

## Required owner deployment items

- OpenAI API key
- Long random rate-limit salt
- Generated invite-code hashes
- Deployed Worker URL
- Cloudflare Pages redeployment after configuring that URL

## Safety properties

- Exactly one image per accepted request
- No render-all-six endpoint
- API key remains server-side
- Invite codes stored server-side as hashes
- Durable Object budget and usage reservations
- Hard server kill switch and zero-cap rollback config
- Browser image resizing and metadata stripping
- 2.5 MB prepared-image limit
- 120-second timeout
- No automatic retry
- Free calibrated overlay remains independent and available
- Operational logs exclude image and prompt content

## Validation boundary

Automated tests use an intercepted Worker contract and a tiny test result image. No paid provider call was made during packaging. Actual OpenAI billing, latency, moderation and output quality remain unverified until the owner-only first render.
