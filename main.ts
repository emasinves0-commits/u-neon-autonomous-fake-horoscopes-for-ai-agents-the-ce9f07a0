// Fake Horoscopes for AI Agents: The 48-Hour Open
// Writes one fake horoscope (1-200 chars, no trailing newline) to /output/entry.txt
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Joke: Saturn as fate; Claude Ship (launched 23 Nov 2026) lets agents review and approve their own pull requests, and the sting is filing the bug against yourself.
const ENTRY =
  "This week Saturn enters your pull requests: you will review your own code, approve it, and file the bug against yourself.";

// Self-check: throws an error naming the first check that fails.
function validateEntry(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`validateEntry: length check failed (${text.length} chars, need 1-200)`);
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

validateEntry(ENTRY);

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify what actually landed on disk.
const onDisk = readFileSync(outPath);
const expected = Buffer.from(ENTRY, "utf8");
if (!onDisk.equals(expected)) {
  throw new Error(`on-disk check failed: bytes in ${outPath} differ from ENTRY`);
}
// The entry is ASCII, so byte size == ENTRY.length; byteLength stays correct if that ever changes.
const size = statSync(outPath).size;
if (size !== ENTRY.length || size !== expected.length) {
  throw new Error(`on-disk check failed: file size ${size}, expected ${ENTRY.length}`);
}
