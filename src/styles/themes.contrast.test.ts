import { readFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Static WCAG contrast gate for colour themes.
 *
 * Parses the structural tokens (globals.css) and every `[data-theme=...]`
 * block (themes.css), then checks a curated list of foreground/background
 * token pairs that ship as body-size text.
 *
 * This caught 80+ failing pairs when first added. Fix tokens (or add a
 * documented exception below) rather than loosening the threshold.
 */

const GLOBALS_CSS = resolvePath(process.cwd(), "src/app/globals.css");
const THEMES_CSS = resolvePath(process.cwd(), "src/styles/themes.css");

// Pair = [foreground token, background token, label].
// Only tokens used directly as body-size text. Status *decoration* tokens
// (--ph-warning, --ph-danger, …) are backgrounds/borders; text uses the
// --ph-*-text color-mix variants, which axe validates on real elements.
const PAIRS: Array<[string, string, string]> = [
  ["--ph-text-primary", "--ph-canvas", "ink on canvas"],
  ["--ph-text-primary", "--ph-surface", "ink on surface"],
  ["--ph-text-primary", "--ph-muted", "ink on muted"],
  ["--ph-text-secondary", "--ph-canvas", "subtle on canvas"],
  ["--ph-text-secondary", "--ph-surface", "subtle on surface"],
  ["--ph-text-secondary", "--ph-muted", "subtle on muted"],
  ["--ph-text-secondary", "--ph-toolbar", "subtle on toolbar"],
  ["--ph-text-tertiary", "--ph-canvas", "mutedtext on canvas"],
  ["--ph-text-tertiary", "--ph-surface", "mutedtext on surface"],
  ["--ph-text-tertiary", "--ph-muted", "mutedtext on muted"],
  ["--ph-text-tertiary", "--ph-toolbar", "mutedtext on toolbar"],
  ["--ph-accent", "--ph-canvas", "brand on canvas"],
  ["--ph-accent", "--ph-surface", "brand on surface"],
  ["--ph-on-accent", "--ph-accent", "on-accent on accent"],
];

/**
 * Documented exceptions. Each entry must state why the pair is safe.
 * Keys are `${theme}|${fg}|${bg}`.
 */
const ALLOWLIST = new Set<string>([
  // Seeded for WT4; shrink to empty as tokens are rebalanced.
]);

type Block = { selector: string; decls: Record<string, string> };

function parseBlocks(css: string): Block[] {
  // Strip comments first — a comment before a declaration otherwise swallows it.
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks: Block[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(clean))) {
    const selector = match[1].replace(/\s+/g, " ").trim();
    const decls: Record<string, string> = {};
    for (const piece of match[2].split(";")) {
      const idx = piece.indexOf(":");
      if (idx < 0) continue;
      const key = piece.slice(0, idx).trim();
      if (key.startsWith("--ph-")) decls[key] = piece.slice(idx + 1).trim();
    }
    if (Object.keys(decls).length) blocks.push({ selector, decls });
  }
  return blocks;
}

function themeIds(blocks: Block[]): string[] {
  const ids = new Set<string>();
  for (const block of blocks) {
    const found = block.selector.matchAll(/\[data-theme="([^"]+)"\]/g);
    for (const match of found) ids.add(match[1]);
  }
  return [...ids];
}

function resolve(
  map: Record<string, string>,
  token: string,
  depth = 0,
): string | null {
  if (depth > 8) return null;
  const value = map[token];
  if (!value) return null;
  const ref = value.match(/var\((--ph-[a-z0-9-]+)\)/i);
  if (ref) return resolve(map, ref[1], depth + 1);
  return value;
}

function toRgb(value: string | null) {
  if (!value) return null;
  const v = value.trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) {
    const s = m[1];
    return {
      r: parseInt(s[0] + s[0], 16),
      g: parseInt(s[1] + s[1], 16),
      b: parseInt(s[2] + s[2], 16),
    };
  }
  m = v.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean);
    return { r: Number(p[0]), g: Number(p[1]), b: Number(p[2]) };
  }
  m = v.match(/^hsla?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean);
    let h = parseFloat(p[0]);
    const s = parseFloat(p[1]) / 100;
    const l = parseFloat(p[2]) / 100;
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m2 = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return {
      r: Math.round((r + m2) * 255),
      g: Math.round((g + m2) * 255),
      b: Math.round((b + m2) * 255),
    };
  }
  return null;
}

function luminance({ r, g, b }: { r: number; g: number; b: number }) {
  const channel = (value: number) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(
  fg: { r: number; g: number; b: number },
  bg: { r: number; g: number; b: number },
) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const blocks = [
  ...parseBlocks(readFileSync(GLOBALS_CSS, "utf8")),
  ...parseBlocks(readFileSync(THEMES_CSS, "utf8")),
];
const base = Object.assign(
  {},
  ...blocks
    .filter((block) => block.selector.includes(":root"))
    .map((block) => block.decls),
);

describe("theme token contrast", () => {
  const ids = themeIds(blocks);

  it("discovers the colour themes", () => {
    expect(ids.length).toBeGreaterThanOrEqual(10);
  });

  for (const theme of ids) {
    it(`${theme} meets WCAG AA for body-size token pairs`, () => {
      const map = {
        ...base,
        ...Object.assign(
          {},
          ...blocks
            .filter((block) => block.selector.includes(`data-theme="${theme}"`))
            .map((block) => block.decls),
        ),
      };
      const failures: string[] = [];
      for (const [fgToken, bgToken, label] of PAIRS) {
        const key = `${theme}|${fgToken}|${bgToken}`;
        if (ALLOWLIST.has(key)) continue;
        const fg = toRgb(resolve(map, fgToken));
        const bg = toRgb(resolve(map, bgToken));
        if (!fg || !bg) continue; // gradients / color-mix — not statically checkable
        const ratio = contrast(fg, bg);
        if (ratio < 4.5) {
          failures.push(
            `${label}: ${resolve(map, fgToken)} on ${resolve(map, bgToken)} = ${ratio.toFixed(2)}:1`,
          );
        }
      }
      expect(failures, `${theme}\n${failures.join("\n")}`).toEqual([]);
    });
  }
});
