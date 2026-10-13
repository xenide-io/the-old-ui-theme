import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AnimatedMoon, TodayTimeIcon } from "./today-ui";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Today time icon", () => {
  it.each([0, 5, 18, 23])("shows the moon at %i:00 local time", (hour) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 13, hour));
    const { container } = render(<TodayTimeIcon />);
    expect(container.querySelector('path[fill="url(#animatedMoonBody)"]')).not.toBeNull();
  });

  it.each([6, 12, 17])("shows the sun at %i:00 local time", (hour) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 13, hour));
    const { container } = render(<TodayTimeIcon />);
    expect(container.querySelector('circle[fill="url(#animatedSunCenter)"]')).not.toBeNull();
  });

  it("uses a full-sized filled crescent rather than the narrow overlapping arcs", () => {
    const { container } = render(<AnimatedMoon className="h-7 w-7" />);
    expect(container.querySelector('path[fill="url(#animatedMoonBody)"]'))
      .toHaveAttribute("d", "M34 21.3A15 15 0 1 1 18.7 6a12 12 0 0 0 15.3 15.3Z");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
