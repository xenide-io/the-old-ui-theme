#!/usr/bin/env node
/**
 * Compare local Lemon glyphs with PostHog open-source icons.tsx.
 * Usage: node scripts/sync-posthog-icons.mjs
 *
 * Downloads: frontend/src/lib/lemon-ui/icons/icons.tsx
 * Reports path mismatches — Material-only icons (bell, volume, …) are expected.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const POSTHOG_URL =
  "https://raw.githubusercontent.com/PostHog/posthog/master/frontend/src/lib/lemon-ui/icons/icons.tsx";
const LOCAL = resolve("src/components/icons/icons.tsx");
const CACHE = resolve("scripts/.posthog-icons.tsx");

function extractPhBlock(source, name) {
  const start = source.indexOf(`export function ${name}(`);
  if (start < 0) return null;
  const next = source.indexOf("\nexport function Icon", start + 10);
  return source.slice(start, next > 0 ? next : start + 4000);
}

function extractOurBlock(source, name) {
  const start = source.indexOf(`export const ${name} =`);
  if (start < 0) return null;
  const next = source.indexOf("\nexport const Icon", start + 10);
  const nextFn = source.indexOf("\nexport function Icon", start + 10);
  const end = [next, nextFn].filter((x) => x > 0).sort((a, b) => a - b)[0] || start + 4000;
  return source.slice(start, end);
}

function normPaths(block) {
  if (!block) return "";
  const fills = [...block.matchAll(/fill\(\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
  const ds = [...block.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  const attrs = [...block.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
  return [...fills, ...ds, ...attrs].join("|").replace(/\s/g, "");
}

async function main() {
  const response = await fetch(POSTHOG_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch PostHog icons: ${response.status}`);
  }
  const ph = await response.text();
  writeFileSync(CACHE, ph);

  const local = readFileSync(LOCAL, "utf8");
  const phNames = new Set([...ph.matchAll(/export function (Icon\w+)/g)].map((m) => m[1]));
  const ourNames = [...local.matchAll(/export const (Icon\w+)/g)]
    .map((m) => m[1])
    .filter((n) => n !== "IconSpinner");

  const shared = ourNames.filter((n) => phNames.has(n));
  const materialOnly = ourNames.filter((n) => !phNames.has(n));
  const mismatches = shared.filter(
    (n) => normPaths(extractPhBlock(ph, n)) !== normPaths(extractOurBlock(local, n)),
  );

  console.log(`Compared ${shared.length} shared icons with PostHog master.`);
  if (mismatches.length) {
    console.log("\nPath mismatches (update src/components/icons/icons.tsx):");
    mismatches.forEach((n) => console.log(`  - ${n}`));
  } else {
    console.log("All shared PostHog icons match.");
  }
  console.log(`\nMaterial-only icons (${materialOnly.length}): ${materialOnly.join(", ")}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
