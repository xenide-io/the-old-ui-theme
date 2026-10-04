import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { MarketingHeader, MarketingMotionControl } from "./Marketing";

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-marketing-paused");
});

describe("marketing controls", () => {
  it("names navigation and exposes shared focus targets", () => {
    render(
      <MarketingHeader
        brand={<a href="https://example.com">ShellStack</a>}
        navigation={<a href="https://example.com/features">Features</a>}
        actions={<a href="https://example.com/login">Log in</a>}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Product navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ShellStack" })).toBeInTheDocument();
  });

  it("pauses and resumes landing animation state", async () => {
    const user = userEvent.setup();
    render(<MarketingMotionControl />);

    const control = screen.getByRole("button", { name: "Pause landing animations" });
    await user.click(control);
    expect(control).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-marketing-paused");

    await user.click(control);
    expect(control).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement).not.toHaveAttribute("data-marketing-paused");
  });
});
