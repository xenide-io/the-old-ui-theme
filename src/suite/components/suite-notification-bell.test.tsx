import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { SuiteNotificationsProvider } from "../lib/suite-notifications";
import { SuiteNotificationBell } from "./suite-notification-bell";

afterEach(() => {
  cleanup();
});

describe("SuiteNotificationBell", () => {
  it("anchors the unread badge close to the bell glyph", async () => {
    render(
      <SuiteNotificationsProvider
        fetchNotifications={async () => ({
          notifications: [],
          unread_count: 12,
        })}
        markRead={async () => undefined}
        markAllRead={async () => undefined}
        cacheKey={null}
      >
        <SuiteNotificationBell
          dropdownMenu={({ trigger, "aria-label": label, children }) => (
            <div aria-label={label}>
              {trigger}
              {children}
            </div>
          )}
        />
      </SuiteNotificationsProvider>,
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

  it("keeps each responsive bell dropdown open state independent", () => {
    render(
      <SuiteNotificationsProvider
        fetchNotifications={async () => ({
          notifications: [],
          unread_count: 0,
        })}
        markRead={async () => undefined}
        markAllRead={async () => undefined}
        cacheKey={null}
      >
        <SuiteNotificationBell
          dataTest="desktop-notifications"
          dropdownMenu={({
            trigger,
            children,
            open,
            onOpenChange,
            triggerId,
          }) => (
            <div>
              <button
                id={triggerId}
                type="button"
                onClick={() => onOpenChange?.(!open)}
              >
                {trigger}
              </button>
              {open ? (
                <div data-test={`${triggerId}-panel`}>{children}</div>
              ) : null}
            </div>
          )}
        />
        <SuiteNotificationBell
          dataTest="mobile-notifications"
          dropdownMenu={({
            trigger,
            children,
            open,
            onOpenChange,
            triggerId,
          }) => (
            <div>
              <button
                id={triggerId}
                type="button"
                onClick={() => onOpenChange?.(!open)}
              >
                {trigger}
              </button>
              {open ? (
                <div data-test={`${triggerId}-panel`}>{children}</div>
              ) : null}
            </div>
          )}
        />
      </SuiteNotificationsProvider>,
    );

    fireEvent.click(document.getElementById("desktop-notifications-trigger")!);

    expect(
      document.querySelector(
        '[data-test="desktop-notifications-trigger-panel"]',
      ),
    ).not.toBeNull();
    expect(
      document.querySelector(
        '[data-test="mobile-notifications-trigger-panel"]',
      ),
    ).toBeNull();
  });
});
