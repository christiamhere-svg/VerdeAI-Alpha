export async function renderWithMock(request) {
  return {
    type: "mock-image",
    imageUrl: null,
    alt: `Mock concept render for ${request.selectedFuture || request.futureId}`,
    status: "fallback-ready",
    note: "No paid provider was called. Use the concept board as the safe preview until a backend provider is configured.",
    overlayLabels: ["design zone", "plant palette", "access line", "future test area"]
  };
}
