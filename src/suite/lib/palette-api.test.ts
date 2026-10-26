import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPaletteEmojis, fetchPaletteIcons, findPaletteIcons, paletteIconSrc, setPaletteUrl } from './palette-api';

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
