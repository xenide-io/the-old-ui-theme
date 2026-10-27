import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPaletteEmojis, fetchPaletteIcons, findPaletteIcons, hasMonoIcon, monoIconUrl, paletteIconBase, paletteIconSrc, paletteMaskSrc, setPaletteUrl } from './palette-api';

afterEach(() => { vi.unstubAllGlobals(); setPaletteUrl(null); });

describe('Palette client', () => {
  it('uses separate icon and emoji endpoints', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetch);
    setPaletteUrl('https://api.example.test/api/palette');
    await fetchPaletteIcons();
    await fetchPaletteEmojis({ q: 'party popper', page: 2 });
    await findPaletteIcons({ q: 'rocket', offset: 60 });
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      'https://api.example.test/api/palette/icons',
      'https://api.example.test/api/palette/emojis?q=party+popper&page=2',
      'https://api.example.test/api/palette/icons/search?q=rocket&offset=60',
    ]);
  });

  it('never recolours Fluent emoji or uploaded images', () => {
    const emoji = 'https://media.xenide.io/svgrepo/fluent-emoji/1f389.svg';
    expect(paletteIconSrc(emoji, '#ef4444')).toBe(emoji);
    expect(paletteIconSrc('/uploads/icon.png', '#ef4444')).toBe('/uploads/icon.png');
    expect(paletteIconSrc('https://media.xenide.io/svgrepo/office/folder.svg', '#ef4444')).toContain('/render?');
  });
});

describe('monochrome icon hints', () => {
  it('marks single-colour Palette SVGs and leaves emoji alone', () => {
    const icon = 'https://media.xenide.io/svgrepo/office/folder.svg';
    expect(monoIconUrl(icon)).toBe(`${icon}?mono=1`);
    expect(hasMonoIcon(monoIconUrl(icon))).toBe(true);
    expect(paletteIconBase(`${icon}?mono=1`)).toBe(icon);
    const emoji = 'https://media.xenide.io/svgrepo/fluent-emoji/1f389.svg';
    expect(monoIconUrl(emoji)).toBe(emoji);
    expect(hasMonoIcon(emoji)).toBe(false);
  });

  it('masks through Palette, which is the only origin with CORS', () => {
    setPaletteUrl('https://palette.example.test');
    const icon = 'https://media.xenide.io/svgrepo/office/folder.svg';
    expect(paletteMaskSrc(`${icon}?mono=1`)).toBe(
      `https://palette.example.test/render?src=${encodeURIComponent(icon)}`,
    );
  });

  it('keeps existing query strings and never doubles the hint', () => {
    expect(monoIconUrl('https://media.xenide.io/svgrepo/a/b.svg?v=2')).toBe(
      'https://media.xenide.io/svgrepo/a/b.svg?v=2&mono=1',
    );
    const marked = 'https://media.xenide.io/svgrepo/a/b.svg?mono=1';
    expect(monoIconUrl(marked)).toBe(marked);
    expect(hasMonoIcon('https://media.xenide.io/svgrepo/a/b.svg?mono=10')).toBe(false);
  });
});
