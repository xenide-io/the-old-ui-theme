import { useState } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import {
  SuiteNotificationsProvider,
  useSuiteNotifications,
  type SuiteNotificationsResponse,
} from "./suite-notifications";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

function Page() {
  const [draft, setDraft] = useState("");
  const { unreadCount } = useSuiteNotifications();
  return (
    <>
      <input
        aria-label="Draft"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <output aria-label="Unread">{unreadCount}</output>
    </>
  );
}

it("changes inbox scope without remounting the page or accepting late old-workspace responses", async () => {
  const user = userEvent.setup();
  let resolveOld!: (value: SuiteNotificationsResponse) => void;
  const oldRequest = new Promise<SuiteNotificationsResponse>((resolve) => {
    resolveOld = resolve;
  });
  sessionStorage.setItem(
    "workspace-a",
    JSON.stringify({ notifications: [], unread_count: 5 }),
  );
  const fetchNotifications = vi
    .fn()
    .mockReturnValueOnce(oldRequest)
    .mockResolvedValue({ notifications: [], unread_count: 2 });
  const props = { fetchNotifications, markRead: vi.fn(), markAllRead: vi.fn() };
  const view = render(
    <SuiteNotificationsProvider {...props} cacheKey="workspace-a">
      <Page />
    </SuiteNotificationsProvider>,
  );
  await waitFor(() =>
    expect(screen.getByLabelText("Unread")).toHaveTextContent("5"),
  );
  await user.type(screen.getByLabelText("Draft"), "Keep this filter");
  view.rerender(
    <SuiteNotificationsProvider {...props} cacheKey="workspace-b">
      <Page />
    </SuiteNotificationsProvider>,
  );
  expect(screen.getByLabelText("Unread")).not.toHaveTextContent("5");
  await waitFor(() =>
    expect(screen.getByLabelText("Unread")).toHaveTextContent("2"),
  );
  resolveOld({ notifications: [], unread_count: 9 });
  await oldRequest;
  await waitFor(() =>
    expect(screen.getByLabelText("Unread")).toHaveTextContent("2"),
  );
  expect(screen.getByLabelText("Draft")).toHaveValue("Keep this filter");
});
