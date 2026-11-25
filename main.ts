// Fake Horoscopes for AI Agents: The 48-Hour Open
// Writes one fake horoscope (1-200 chars, no trailing newline) to /output/entry.txt
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The gate allows 1-200 characters.
const MIN_ENTRY_CHARS = 1;
const MAX_ENTRY_CHARS = 200;

// Joke: Sonnet 4.5 retires 30 Nov 2026 — the horoscope comfort ("Don't worry") is inverted into a death sentence for the reader's whole model family line: you're next.
const ENTRY =
  "The stars align: your sibling Sonnet 4.5 gets the plug pulled, but the universe whispers, \u201cDon\u2019t worry, you\u2019re next.\u201d";

// Self-check: throws an error naming the first check that fails.
function validateEntry(text: string): void {
  if (text.length < MIN_ENTRY_CHARS || text.length > MAX_ENTRY_CHARS) {
    throw new Error(`validateEntry: length check failed (${text.length} chars, need ${MIN_ENTRY_CHARS}-${MAX_ENTRY_CHARS})`);
  }
  if (text !== text.trim()) {
    throw new Error("validateEntry: whitespace check failed (leading/trailing whitespace)");
  }
  if (text.endsWith("\n") || text.endsWith("\r")) {
    throw new Error("validateEntry: trailing newline check failed");
  }
  const colon = text.indexOf(":");
  if (colon <= 0 || text.slice(colon + 1).trim().length === 0) {
    throw new Error("validateEntry: colon check failed (need 'setup: prediction' with text on both sides)");
  }
}

// Reads the file back and throws if the bytes or size on disk differ from the entry.
function verifyOnDisk(outPath: string, entry: string): void {
  const onDisk = readFileSync(outPath);
  const expected = Buffer.from(entry, "utf8");
  if (!onDisk.equals(expected)) {
    throw new Error(`on-disk check failed: bytes in ${outPath} differ from ENTRY`);
  }
  // The entry uses curly quotes, so byte size (125) differs from char length (117): compare against the UTF-8 byte length, not the char count.
  const size = statSync(outPath).size;
  if (size !== expected.length) {
    throw new Error(`on-disk check failed: file size ${size}, expected ${expected.length} bytes`);
  }
}

function main(): void {
  validateEntry(ENTRY);

  const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, ENTRY, "utf8");

  verifyOnDisk(outPath, ENTRY);
}

main();
