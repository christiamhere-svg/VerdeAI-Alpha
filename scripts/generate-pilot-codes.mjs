import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const count = 10;
const codes = Array.from({ length: count }, (_, index) => {
  const token = crypto.randomBytes(12).toString("base64url");
  return `VAI-${String(index + 1).padStart(2, "0")}-${token}`;
});
const hashes = codes.map((code) => crypto.createHash("sha256").update(code).digest("hex"));
const out = path.resolve(process.cwd(), "pilot-codes-owner-only.txt");
fs.writeFileSync(out, [
  "VERDEAI v9.2.2 — OWNER-ONLY INVITE CODES",
  "Do not commit or upload this file. Give one code to each invited tester.",
  "",
  ...codes,
  "",
  "PILOT_INVITE_CODE_HASHES secret value:",
  hashes.join(",")
].join("\n"));
console.log(`Created ${out}`);
console.log("Keep the file private. Put only the comma-separated hashes into the Worker secret.");
