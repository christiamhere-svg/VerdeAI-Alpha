// VerdeAI v9.2 locked compatibility endpoint. Preferred pilot host: Cloudflare Worker.
exports.handler = async function handler() {
  return {
    statusCode: 423,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify({
      build: "v9.2",
      connected: false,
      providerCallsOff: true,
      paidRenderMade: false,
      killSwitchOn: true,
      countAllowed: 1,
      fallback: "calibrated-overlay",
      message: "One-image AI rendering remains locked pending explicit owner approval and server-side activation."
    })
  };
};
