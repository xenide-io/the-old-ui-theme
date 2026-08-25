import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { SuiteNotificationBell } from "./suite-notification-bell";

afterEach(() => {
  cleanup();
});

describe("SuiteNotificationBell", () => {
  it("anchors the unread badge to the button corner, not the bell glyph", async () => {
    render(
      <SuiteNotificationBell
        fetchNotifications={async () => ({
          notifications: [],
          unread_count: 12,
        })}
        markRead={async () => undefined}
        markAllRead={async () => undefined}
        dropdownMenu={({ trigger, "aria-label": label, children }) => (
          <div aria-label={label}>
            {trigger}
            {children}
          </div>
        )}
        cacheKey={null}
      />,
    );

    const badge = await waitFor(() => {
      const el = document.querySelector("span.bg-ph-brand");
      if (!el) throw new Error("missing badge");
      return el;
    });

    expect(badge.textContent).toBe("9+");
    expect(badge.className).toContain("translate-x-1/2");
    expect(badge.className).not.toContain("-translate-y");
    expect(badge.parentElement?.className).toContain("h-11");
    expect(badge.parentElement?.className).toContain("w-11");
  });
});
