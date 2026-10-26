import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { House } from 'lucide-react';
import { SuiteSidebarLinks } from './sidebar-links';
import { SuiteSidebarSection, SuiteSidebarTree, type SuiteSidebarTreeNode } from './sidebar-tree';

afterEach(cleanup);

it('keeps selected utility links unchanged on hover in expanded and icon-only sidebars', () => {
  const items = [
    { href: '#selected', label: 'Selected', icon: House, active: true },
    { href: '#other', label: 'Other', icon: House },
  ];
  const { rerender } = render(<SuiteSidebarLinks items={items} />);
  for (const collapsed of [false, true]) {
    rerender(<SuiteSidebarLinks items={items} collapsed={collapsed} />);
    expect(screen.getByRole('link', { name: 'Selected' })).toHaveClass('ph-nav-highlight');
    expect(screen.getByRole('link', { name: 'Selected' })).not.toHaveClass('hover:bg-[var(--ph-surface-hover)]');
    expect(screen.getByRole('link', { name: 'Other' })).toHaveClass('hover:bg-[var(--ph-surface-hover)]');
  }
});

it('keeps expand controls separate from navigation, with consistent indentation and selection', async () => {
  const user = userEvent.setup();
  const navigate = vi.fn();
  function Fixture() {
    const [expanded, setExpanded] = useState(false);
    return <SuiteSidebarTree nodes={[{
      id: 'client', label: 'Client', href: '#client', onNavigate: navigate,
      expanded, onToggle: () => setExpanded((open) => !open),
      children: () => [{ id: 'project', label: 'Project', href: '#project', current: true }],
    }]} />;
  }
  render(<Fixture />);
  expect(screen.queryByRole('link', { name: 'Project' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Expand Client' }));
  expect(navigate).not.toHaveBeenCalled();
  const client = screen.getByRole('link', { name: 'Client' }).closest('[data-suite-tree-row]')!;
  const project = screen.getByRole('link', { name: 'Project' });
  expect(project).toHaveAttribute('aria-current', 'page');
  expect(client).toHaveStyle({ paddingLeft: '8px' });
  expect(project.closest('[data-suite-tree-row]')).toHaveStyle({ paddingLeft: '22px' });
  expect(project.closest('[data-suite-tree-row]')).toHaveAttribute('data-suite-tree-current', 'true');
  expect(project.closest('[data-suite-tree-row]')).toHaveClass('text-ph-mutedtext', 'min-h-8');
  expect(project.closest('[data-suite-tree-row]')).not.toHaveClass('font-semibold');
  await user.click(screen.getByRole('link', { name: 'Client' }));
  expect(navigate).toHaveBeenCalledOnce();
  screen.getByRole('button', { name: 'Collapse Client' }).focus();
  await user.keyboard('{Enter}');
  expect(screen.queryByRole('link', { name: 'Project' })).not.toBeInTheDocument();
});

it('does not recurse through cyclic host data', () => {
  const node: SuiteSidebarTreeNode = { id: 'cycle', label: 'Cycle', href: '#cycle', expanded: true };
  node.children = () => [node];
  render(<SuiteSidebarTree nodes={[node]} />);
  expect(screen.getAllByRole('link')).toHaveLength(1);
});

it('does not mount a collapsed section and supports keyboard expansion', async () => {
  const user = userEvent.setup();
  function Fixture() {
    const [expanded, setExpanded] = useState(false);
    return <SuiteSidebarSection id="clients" label="Clientspaces" expanded={expanded} onToggle={() => setExpanded((open) => !open)}><a href="#project">Project</a></SuiteSidebarSection>;
  }
  render(<Fixture />);
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  screen.getByRole('button', { name: 'Clientspaces' }).focus();
  await user.keyboard(' ');
  expect(screen.getByRole('link', { name: 'Project' })).toBeVisible();
});

it('matches Kraken section spacing and small icon-free workspace labels', () => {
  render(<SuiteSidebarSection id="workspace" label="Atlas Consulting" expanded onToggle={() => {}}><a href="#calendar">Calendar</a></SuiteSidebarSection>);
  const heading = screen.getByRole('button', { name: 'Atlas Consulting' });
  expect(heading).toHaveClass('text-xs', 'font-semibold');
  expect(heading.querySelectorAll('svg')).toHaveLength(1);
  expect(heading.parentElement).toHaveClass('pt-3', 'pb-1');
  expect(heading.closest('section')).toHaveClass('mb-0.5');
});
