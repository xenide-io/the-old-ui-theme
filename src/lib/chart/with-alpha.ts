/**
 * Adds alpha to hex colours for Chart.js fills. Falls back to the input string for hsl/rgb/etc.
 */
export function withAlpha(color: string, alpha: number): string {
  const trimmed = color.trim();

  const hex8 = trimmed.match(/^#([\da-f]{8})$/i);
  if (hex8?.[1]) {
    const n = hex8[1];
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const hexLong = trimmed.match(/^#([\da-f]{6})$/i);
  if (hexLong?.[1]) {
    const n = hexLong[1];
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const hexShort = trimmed.match(/^#([\da-f]{3})$/i);
  if (hexShort?.[1]) {
    const [, h] = hexShort;
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return trimmed;
}
