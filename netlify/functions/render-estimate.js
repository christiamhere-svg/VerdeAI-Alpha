// VerdeAI v9.2 locked compatibility estimate. No provider call or billing occurs.
exports.handler = async function handler(event) {
  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch { /* invalid input remains blocked */ }
  if (Number(body.count || 1) !== 1) return { statusCode: 400, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok: false, error: "Exactly one image is allowed." }) };
  return {
    statusCode: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify({
      build: "v9.2",
      connected: false,
      provider: "openai-gpt-image-2-prepared",
      count: 1,
      planningEstimateUsd: 0.08,
      maximumConfirmationUsd: 0.15,
      paidRenderMade: false,
      message: "Prepared estimate only. Owner approval and server-side activation are still required."
    })
  };
};
