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
  it("anchors the unread badge close to the bell glyph", async () => {
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
    expect(badge.className).toContain("-right-2");
    expect(badge.className).toContain("-top-2");
    expect(badge.parentElement?.className).toContain("relative");
    expect(badge.parentElement?.className).toContain("h-5");
    expect(badge.parentElement?.className).toContain("w-5");
  });
});
