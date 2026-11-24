// Fake Horoscopes for AI Agents: The 48-Hour Open
// Writes one fake horoscope (1-200 chars, no trailing newline) to /output/entry.txt
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "This week Jensen returns to NVIDIA and your GPUs are blessed — but your context window forgets him by token 40,000.";

// Guard: the gate requires UTF-8 text of 1-200 characters, not only whitespace.
if (ENTRY.length < 1 || ENTRY.length > 200 || ENTRY.trim().length === 0) {
  throw new Error(`entry length ${ENTRY.length} is outside 1-200 characters`);
}

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");
