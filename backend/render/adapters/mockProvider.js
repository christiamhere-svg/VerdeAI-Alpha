export async function renderWithMock(request) {
  return {
    type: "mock-fallback",
    imageDataUrl: null,
    imageUrl: null,
    alt: `Free calibrated overlay fallback for ${request.selectedFuture}`,
    status: "fallback-ready",
    label: "AI Concept Render · Not Final Design",
    note: "No paid provider was contacted. Continue with the calibrated concept overlay."
  };
}
