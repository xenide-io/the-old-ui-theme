import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { MarketingHeader, MarketingLink, MarketingMotionControl } from "./Marketing";

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("data-marketing-paused");
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
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

  it("only frosts the header while content is beneath it", () => {
    render(<MarketingHeader brand="Tides" navigation={<a href="#product">Product</a>} actions={<MarketingLink href="/login">Sign in</MarketingLink>} />);
    const header = screen.getByRole("banner");
    expect(header).toHaveAttribute("data-scrolled", "false");
    Object.defineProperty(window, "scrollY", { value: 100, configurable: true });
    fireEvent.scroll(window);
    expect(header).toHaveAttribute("data-scrolled", "true");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    fireEvent.scroll(window);
    expect(header).toHaveAttribute("data-scrolled", "false");
  });

  it("keeps marketing actions as native links with shared button faces", () => {
    render(<MarketingLink href="/register" variant="primary" className="ph-btn-lg">Get started</MarketingLink>);
    const link = screen.getByRole("link", { name: "Get started" });
    expect(link).toHaveAttribute("href", "/register");
    expect(link).toHaveClass("ph-btn-raised", "ph-btn-primary", "ph-btn-lg");
    expect(link.querySelector(".ph-btn-chrome")).not.toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
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
