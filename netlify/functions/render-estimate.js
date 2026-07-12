// VerdeAI v7.0 placeholder only. No paid provider calls are made.
exports.handler = async function handler() {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      connected: false,
      provider: 'replicate-flux-planned',
      estimatedCostUsd: 0,
      message: 'Render estimate placeholder only. Add server-side provider setup before paid rendering.'
    })
  };
};
