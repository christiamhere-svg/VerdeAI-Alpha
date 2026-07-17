# VerdeAI v9.2.2 — Browser and Testing Limitations

## Validated in this package

- Static source and preservation checks
- JavaScript syntax checks
- Cloudflare Worker contract checks
- One-image-only enforcement
- Server-secret boundary checks
- Approved spend, tester and retention settings
- Chromium interaction harness at 360, 390, 412, 430 and 1440 CSS pixels
- Mocked ready Worker health response
- Mocked successful provider response
- Timeout, provider-failure and budget/access-lock UI states
- Local browser safe lock and explicit readiness re-check
- Zero detected horizontal overflow in automated viewports

## Not validated without owner deployment

- The actual Cloudflare account and Paid Workers plan
- Real Worker URL, DNS and CORS behaviour
- The owner’s OpenAI API key, billing state, organisation verification or image-model access
- A real OpenAI image-edit response
- Actual provider charge, latency, moderation or visual quality
- Durable Object behaviour under real concurrent traffic
- Physical Android or iPhone testing of the v9.2.2 live result
- Safari and Firefox
- Real invited-code distribution and tester behaviour

## Important operational limitation

The Worker conservatively reserves US$0.15 before contacting the provider. A timeout or provider failure does not automatically release that reservation. This deliberately favours budget safety over maximum use of the US$5 reservation cap.

The result image is kept in the active browser tab only. Refreshing, closing or discarding the tab can remove it unless the user saves it locally through normal browser controls.
