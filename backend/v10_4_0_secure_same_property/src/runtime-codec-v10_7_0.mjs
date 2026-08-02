export const V1070_CODEC_BUILD = 'v10.7.0';

export function isJpeg(bytes) {
  return bytes instanceof Uint8Array && bytes.byteLength >= 4 &&
    bytes[0] === 0xff && bytes[1] === 0xd8 &&
    bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
}

export function base64ToBytes(value, maxEncodedLength = 4_000_000) {
  if (typeof value !== 'string' || value.length < 100 || value.length > maxEncodedLength) return null;
  try {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

export function bytesToBase64(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('Uint8Array required.');
  const chunkSize = 0x8000;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export async function sha256Hex(value) {
  const encoded = new TextEncoder().encode(String(value ?? ''));
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
