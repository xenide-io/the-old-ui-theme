import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SuitePaletteLibrary } from './suite-palette-library';
import { fetchPaletteEmojis, findPaletteIcons } from '@/suite/lib/palette-api';

vi.mock('@/suite/lib/palette-api', () => ({
  fetchPaletteIcons: vi.fn().mockResolvedValue({ collections: [{
    slug: 'office', name: 'Office', kind: 'icon', style: 'line', count: 1, preview: ['/office.svg'],
  }] }),
  fetchPaletteCollection: vi.fn().mockResolvedValue({ count: 1, icons: [{ id: 'office', name: 'Office', url: '/office.svg', tags: [] }] }),
  fetchPaletteEmojis: vi.fn(),
  findPaletteIcons: vi.fn().mockResolvedValue({ total: 1, results: [{ id: 'rocket', name: 'Rocket', collection: 'office', tags: [], url: '/rocket.svg' }] }),
  PALETTE_EMOJI_GROUPS: [
    { value: 'activities', label: 'Activities', short: 'Activities' },
    { value: 'animals-nature', label: 'Animals & nature', short: 'Nature' },
  ],
}));

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(fetchPaletteEmojis).mockResolvedValue({ total: 1, page: 1, page_size: 60, results: [{
    id: '1f389', name: 'Party popper', url: '/party.svg', tags: [], emoji: '🎉', hexcode: '1f389', group: 'activities', subgroup: 'event', variation: false,
  }] });
});

describe('SuitePaletteLibrary', () => {
  it('opens on Emoji when the current selection is a Fluent emoji', async () => {
    render(<SuitePaletteLibrary onPick={vi.fn()} selectedUrl="https://media.example/svgrepo/fluent-emoji/1f389.svg" />);
    expect(screen.getByRole('tab', { name: 'Emoji' })).toHaveAttribute('aria-selected', 'true');
  });

  it('starts with Fluent emoji, exposes the selection and returns its original URL', async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    render(<SuitePaletteLibrary onPick={onPick} selectedUrl="/party.svg" />);
    expect(screen.getByRole('tab', { name: 'Emoji' })).toHaveAttribute('aria-selected', 'true');
    const pick = await screen.findByRole('button', { name: 'Use Party popper' });
    expect(pick).toHaveAttribute('aria-pressed', 'true');
    await user.click(pick);
    expect(onPick).toHaveBeenCalledWith({ url: '/party.svg', name: 'Party popper' });
    expect(findPaletteIcons).not.toHaveBeenCalled();
  });

  it('opens each tab on a real category and only searches the whole library', async () => {
    const user = userEvent.setup();
    render(<SuitePaletteLibrary onPick={vi.fn()} />);
    const category = screen.getByRole('combobox', { name: 'Emoji category' });
    expect(screen.queryByRole('option', { name: 'All categories' })).not.toBeInTheDocument();
    expect(category).toHaveValue('activities');
    await waitFor(() => expect(fetchPaletteEmojis).toHaveBeenLastCalledWith({
      q: undefined, group: 'activities', include_variations: false, page: 1, size: 60,
    }));
    await user.type(screen.getByRole('searchbox', { name: 'Search emoji' }), 'party');
    await waitFor(() => expect(fetchPaletteEmojis).toHaveBeenLastCalledWith(expect.objectContaining({
      q: 'party', group: undefined,
    })));
    await user.click(screen.getByRole('tab', { name: 'Icons' }));
    const collection = await screen.findByRole('combobox', { name: 'Icon collection' });
    expect(screen.queryByRole('option', { name: 'All collections' })).not.toBeInTheDocument();
    expect(collection).toHaveValue('office');
  });

  it('keeps separate search queries and supports icon styles and pagination', async () => {
    const user = userEvent.setup();
    render(<SuitePaletteLibrary onPick={vi.fn()} />);
    await user.type(screen.getByRole('searchbox', { name: 'Search emoji' }), 'party');
    await user.click(screen.getByRole('tab', { name: 'Icons' }));
    const search = screen.getByRole('searchbox', { name: 'Search icons' });
    expect(search).toHaveValue('');
    await user.type(search, 'rocket');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by icon type' }), 'duotone');
    await waitFor(() => expect(findPaletteIcons).toHaveBeenLastCalledWith({
      q: 'rocket', collection: undefined, style: 'duotone', limit: 60, offset: 0,
    }));
    expect(await screen.findByRole('button', { name: 'Use Rocket' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Emoji' }));
    expect(screen.getByRole('searchbox', { name: 'Search emoji' })).toHaveValue('party');
    await user.click(screen.getByRole('tab', { name: 'Icons' }));
    expect(screen.getByRole('searchbox', { name: 'Search icons' })).toHaveValue('rocket');
  });

  it('filters emoji by category and includes variations only when requested', async () => {
    const user = userEvent.setup();
    render(<SuitePaletteLibrary onPick={vi.fn()} />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Emoji category' }), 'animals-nature');
    await user.click(screen.getByRole('checkbox', { name: 'Skin tones & variations' }));
    await waitFor(() => expect(fetchPaletteEmojis).toHaveBeenLastCalledWith({
      q: undefined, group: 'animals-nature', include_variations: true, page: 1, size: 60,
    }));
  });

  it('puts file selection in Upload, leaving search out of that tab', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();
    render(<SuitePaletteLibrary onPick={vi.fn()} onUpload={onUpload} />);
    await user.click(screen.getByRole('tab', { name: 'Upload' }));
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Drop an image or browse/ })).toBeVisible();
    const file = new File(['<svg/>'], 'icon.svg', { type: 'image/svg+xml' });
    await user.upload(screen.getByLabelText('Upload icon image'), file);
    expect(onUpload).toHaveBeenCalledWith(file);
    expect(screen.getByLabelText('Upload icon image')).toHaveValue('');
  });

  it('supports arrow-key tab navigation', async () => {
    const user = userEvent.setup();
    render(<SuitePaletteLibrary onPick={vi.fn()} onUpload={vi.fn()} />);
    screen.getByRole('tab', { name: 'Emoji' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Icons' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', screen.getByRole('tab', { name: 'Icons' }).id);
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Upload' })).toHaveFocus();
  });

  it('loads subsequent emoji pages and preserves previous items', async () => {
    vi.mocked(fetchPaletteEmojis).mockResolvedValueOnce({ total: 2, page: 1, page_size: 60, results: [{
      id: 'one', name: 'First', tags: [], url: '/first.svg', emoji: '🎉', hexcode: '1f389', group: 'activities', subgroup: 'event', variation: false,
    }] });
    render(<SuitePaletteLibrary onPick={vi.fn()} />);
    expect(await screen.findByRole('button', { name: 'Use First' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
    fireEvent.scroll(document.querySelector('[data-test="palette-scroll"]')!);
    await waitFor(() => expect(fetchPaletteEmojis).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })));
    expect(await screen.findByRole('button', { name: 'Use Party popper' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Use First' })).toBeVisible();
  });

  it('offers a retry after a failed request', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPaletteEmojis).mockRejectedValueOnce(new Error('Offline'));
    render(<SuitePaletteLibrary onPick={vi.fn()} />);
    await user.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('button', { name: 'Use Party popper' })).toBeVisible();
  });
});
