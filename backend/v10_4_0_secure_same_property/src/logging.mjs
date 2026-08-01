import { createHash } from "node:crypto";

export function pseudonymousKey(value, salt = "local-test-only") {
  return createHash("sha256").update(`${salt}:${String(value || "")}`).digest("hex").slice(0, 16);
}

export function safeOperationalEvent(input = {}) {
  return {
    event: String(input.event || "unknown").slice(0, 60),
    build: String(input.build || "unknown").slice(0, 30),
    outcome: String(input.outcome || "unknown").slice(0, 40),
    sessionKey: pseudonymousKey(input.sessionId),
    futureId: String(input.futureId || "").slice(0, 80),
    imageByteCount: Number.isFinite(input.imageByteCount) ? input.imageByteCount : 0,
    timestamp: new Date(input.timestamp || Date.now()).toISOString()
  };
}

export function containsSensitiveContent(event) {
  const serialized = JSON.stringify(event);
  return /data:image|base64|prompt|photo|imageData|rawIp|propertyNotes/i.test(serialized);
}
