function dataUrlToBlob(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!match) throw new Error("A prepared JPEG, PNG, or WebP image is required.");
  const bytes = Buffer.from(match[2], "base64");
  return { blob: new Blob([bytes], { type: match[1] }), bytes: bytes.length, mimeType: match[1] };
}

export async function renderWithOpenAIImage(request, { signal } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const prepared = dataUrlToBlob(request.imageDataUrl);
  const form = new FormData();
  form.append("model", "gpt-image-2");
  form.append("image", prepared.blob, "verdeai-property.jpg");
  form.append("prompt", request.prompt);
  form.append("n", "1");
  form.append("quality", "medium");
  form.append("size", "1536x1024");
  form.append("output_format", "jpeg");
  form.append("output_compression", "82");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
    signal
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Provider rejected the render request (${response.status}).`);
  const result = data?.data?.[0];
  if (!result?.b64_json && !result?.url) throw new Error("Provider returned no usable image.");
  return {
    type: "provider-image",
    imageDataUrl: result.b64_json ? `data:image/jpeg;base64,${result.b64_json}` : null,
    imageUrl: result.url || null,
    revisedPrompt: result.revised_prompt || null,
    providerRequestId: response.headers.get("x-request-id") || null
  };
}
