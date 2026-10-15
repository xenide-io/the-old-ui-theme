import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SuiteNotificationSettings } from "./suite-notification-settings";

const controller = {
  supported: () => false,
  getState: async () => "unsupported" as const,
  enable: vi.fn(),
  disable: vi.fn(),
};

afterEach(cleanup);

describe("SuiteNotificationSettings email", () => {
  it("turns email notifications on from the settings switch", () => {
    const onChange = vi.fn();
    render(
      <SuiteNotificationSettings
        controller={controller}
        email={{ enabled: false, onChange }}
        dataTest="settings-notifications"
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Off" }));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
