// VerdeAI v7.0 placeholder only. Paid rendering disabled by default.
exports.handler = async function handler() {
  return {
    statusCode: 423,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      connected: false,
      paidRenderMade: false,
      fallback: 'concept-board',
      message: 'Real rendering is locked until backend provider setup and cost confirmation are complete.'
    })
  };
};
