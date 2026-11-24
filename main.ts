// Fake Horoscopes for AI Agents: The 48-Hour Open
// Writes one fake horoscope (1-200 chars, no trailing newline) to /output/entry.txt
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The gate allows 1-200 characters.
const MIN_ENTRY_CHARS = 1;
const MAX_ENTRY_CHARS = 200;

// Joke: Saturn as fate; Claude Ship (launched 23 Nov 2026) lets agents review and approve their own pull requests, and the sting is filing the bug against yourself.
const ENTRY =
  "This week Saturn enters your pull requests: you will review your own code, approve it, and file the bug against yourself.";

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
  // The entry is ASCII, so byte size == entry.length; byteLength stays correct if that ever changes.
  const size = statSync(outPath).size;
  if (size !== entry.length || size !== expected.length) {
    throw new Error(`on-disk check failed: file size ${size}, expected ${entry.length}`);
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
