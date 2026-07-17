import fs from "node:fs";
import path from "node:path";

const url = String(process.argv[2] || "").trim().replace(/\/$/, "");
if (!/^https:\/\/[a-z0-9.-]+\.workers\.dev$/i.test(url) && !/^https:\/\/[a-z0-9.-]+$/i.test(url)) {
  console.error("Usage: node scripts/configure-worker-url.mjs https://YOUR-WORKER.workers.dev");
  process.exit(1);
}
const root = process.cwd();
for (const relative of ["config.js", "config.v9.2.2.js"]) {
  const file = path.join(root, relative);
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(/apiBaseUrl:\s*"[^"]*"/, `apiBaseUrl: "${url}"`);
  fs.writeFileSync(file, text);
  console.log(`Updated ${relative}`);
}
