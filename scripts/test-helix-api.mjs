import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

const url = process.env.HELIX_API_URL ?? "https://helix.diamondpigs.com/api/v1";
const apiKey = process.env.HELIX_API_KEY ?? process.env.NEXT_PUBLIC_HELIX_API_KEY;
const outputPromptId = Number(process.env.HELIX_OUTPUT_PROMPT_ID ?? 7);
const limitDays = Number(process.env.HELIX_LIMIT_DAYS ?? 90);

if (!apiKey) {
  console.error("Missing HELIX_API_KEY. Copy .env.example to .env.local and add your key.");
  process.exit(1);
}

const body = {
  action: "dashboard.snapshot",
  params: {
    output_prompt_id: outputPromptId,
    limit_days: limitDays,
  },
};

console.log(`POST ${url}`);
console.log(JSON.stringify(body, null, 2));
console.log("---");

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-DP-Api-Key": apiKey,
  },
  body: JSON.stringify(body),
});

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  console.error(`Non-JSON response (${res.status}):`, text.slice(0, 500));
  process.exit(1);
}

console.log(JSON.stringify(json, null, 2));

if (!res.ok || !json.ok) {
  process.exit(1);
}

if (Array.isArray(json.data)) {
  console.log("---");
  console.log(`Signals: ${json.data.length}`);
  for (const signal of json.data) {
    const points = Array.isArray(signal.values) ? signal.values.length : 0;
    console.log(`- ${signal.id} (${signal.category}) — ${points} points`);
  }
}
