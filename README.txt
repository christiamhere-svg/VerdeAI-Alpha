# VerdeAI Build v9.2.1

Owner-only activation-preparation release for the VerdeAI public beta property futures app.

## Deploy the static frontend

Upload the contents of this folder to the existing Cloudflare Pages project. No frontend build command is required.

## What deployment does

- Shows Build v9.2.1.
- Adds locked owner decision controls and a copyable approval request.
- Refines the mock failure-state cards.
- Keeps every paid-render gate closed.

## What deployment does not do

- It does not deploy or connect the backend.
- It does not add an API key.
- It does not contact OpenAI.
- It does not enable a paid render.
- It does not turn off the kill switch.

Run `npm test` for static and preservation validation. Run `npm run browser-test` where Playwright Chromium is available.
