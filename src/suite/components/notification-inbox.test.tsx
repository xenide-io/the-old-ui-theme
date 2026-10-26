import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { SuiteNotificationInbox } from './notification-inbox';
import type { SuiteNotification } from '../lib/suite-notifications';

afterEach(cleanup);

it('only marks the currently shown unread notifications', async () => {
  const user = userEvent.setup();
  const onMarkRead = vi.fn();
  const notifications: SuiteNotification[] = ['one', 'two'].map((id) => ({
    id, title: id, body: '', href: '', kind: 'mention', source_app: 'tides',
    read_at: null, created_at: '2026-10-26T00:00:00Z', workspace: 'workspace', organisation: null,
  }));
  render(<SuiteNotificationInbox notifications={notifications} description="Tides only" loading={false} onRetry={vi.fn()} onOpen={vi.fn()} onMarkRead={onMarkRead} />);
  await user.type(screen.getByRole('textbox', { name: 'Search notifications' }), 'one');
  await user.click(screen.getByRole('button', { name: 'Mark shown read' }));
  expect(onMarkRead).toHaveBeenCalledWith(['one']);
});
