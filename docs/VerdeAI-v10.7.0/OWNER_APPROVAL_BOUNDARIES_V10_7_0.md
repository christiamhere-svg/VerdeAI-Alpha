# Owner approval boundaries — v10.7.0

The phrase `GO PILOT` authorises development and local verification of pilot infrastructure. It does not authorise deployment, secret configuration, provider traffic, or spending.

The runtime remains blocked unless every server-side condition is true:

- private pilot enabled;
- infrastructure build approved;
- paid pilot separately approved;
- public deployment still false;
- owner authenticated through Cloudflare Access;
- OpenAI credential present only as a server secret;
- kill switch deliberately off;
- provider network deliberately allowed;
- platform spend limit confirmed;
- atomic Durable Object rate limiter attached;
- explicit temporary-processing consent verified by the server;
- valid one-image request envelope supplied.

The browser cannot override these controls. A valid result is never treated as proof that it is the same property. It is shown beside the original and waits for human review.
