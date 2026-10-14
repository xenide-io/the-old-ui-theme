import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BrandSpinner } from "./BrandSpinner";

afterEach(cleanup);

describe("BrandSpinner", () => {
  it.each(["timer", "columns", "orbit", "ink", "squares"] as const)(
    "renders the %s app graphic with an accessible label",
    (variant) => {
      const { container } = render(<BrandSpinner variant={variant} size="lg" label="Loading page" />);
      expect(screen.getByRole("status", { name: "Loading page" })).toHaveAttribute("data-variant", variant);
      expect(container.querySelector("svg")).toHaveAttribute("width", "56");
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      if (variant === "squares") {
        expect(container.querySelectorAll("rect")).toHaveLength(2);
        expect(container.querySelector("g")).toHaveClass("motion-safe:animate-spin");
      }
    },
  );
  it("keeps orbit gradient references unique when multiple loaders render", () => {
    const { container } = render(
      <>
        <BrandSpinner variant="orbit" size="sm" label="Loading team" />
        <BrandSpinner variant="orbit" size="lg" label="Loading projects" />
      </>,
    );
    const gradients = container.querySelectorAll("linearGradient");
    expect(gradients[0].id).not.toBe(gradients[1].id);
    expect(
      screen.getByRole("status", { name: "Loading team" }).querySelector("svg"),
    ).toHaveAttribute("width", "20");
    expect(
      screen
        .getByRole("status", { name: "Loading projects" })
        .querySelector("svg"),
    ).toHaveAttribute("width", "56");
    expect(
      container.querySelector(`[stroke="url(#${gradients[1].id})"]`),
    ).not.toBeNull();
  });

  it("stops SVG animation when reduced-motion preference changes", () => {
    const original = window.matchMedia;
    let notify: (() => void) | undefined;
    const media = {
      matches: false,
      addEventListener: vi.fn((_event: string, listener: () => void) => {
        notify = listener;
      }),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => media),
    });

    try {
      const { container, unmount } = render(<BrandSpinner variant="ink" />);
      expect(container.querySelectorAll("animateTransform")).toHaveLength(2);
      act(() => {
        media.matches = true;
        notify?.();
      });
      expect(container.querySelectorAll("animateTransform")).toHaveLength(0);
      unmount();
      expect(media.removeEventListener).toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: original,
      });
    }
  });
});
