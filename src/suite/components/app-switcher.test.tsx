import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element -- this is the next/image test double.
    <img alt={alt} {...props} />
  ),
}));

import { AppSwitcher, type SuiteAppEntry } from "./app-switcher";

afterEach(() => {
  cleanup();
});

const APPS: SuiteAppEntry[] = [
  { slug: "tides", name: "Tides", description: "Projects", icon: "/tides.svg" },
  {
    slug: "turtletime",
    name: "TurtleTime",
    description: "Time",
    icon: "/time.svg",
  },
  {
    slug: "kraken",
    name: "Kraken",
    description: "Documents",
    icon: "/kraken.svg",
  },
  {
    slug: "shelly",
    name: "Shelly",
    description: "AI teammates",
    icon: "/shelly.svg",
  },
];

function TestDropdownMenu({
  trigger,
  children,
  "aria-label": ariaLabel,
}: {
  trigger: ReactNode;
  children: ReactNode;
  "aria-label": string;
}) {
  return (
    <div aria-label={ariaLabel}>
      {trigger}
      {children}
    </div>
  );
}

function TestDropdownItem({
  children,
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button data-dropdown-item="true" {...props}>
      {children}
    </button>
  );
}

describe("AppSwitcher", () => {
  it("keeps the current app out of the simple application list", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <AppSwitcher
        apps={APPS}
        currentApp="tides"
        onSelect={onSelect}
        mark={<span />}
        title={<span>Tides</span>}
        dropdownMenu={TestDropdownMenu}
        dropdownItem={TestDropdownItem}
      />,
    );

    const menu = document.querySelector("[data-test='app-switcher-menu']");
    expect(menu).not.toHaveClass("grid-cols-2");
    expect(menu).toHaveTextContent("Switch application");
    expect(
      document.querySelector("[data-test='switch-app-tides']"),
    ).not.toBeInTheDocument();
    const newTabButton = screen.getByRole("button", {
      name: "Open Kraken in a new tab",
    });
    expect(newTabButton).toHaveClass("absolute", "h-8");
    expect(newTabButton).toHaveStyle({ width: "2rem" });
    expect(newTabButton).toHaveAttribute("data-dropdown-item", "true");
    expect(
      screen.queryByRole("button", { name: "Open Tides in a new tab" }),
    ).not.toBeInTheDocument();

    await user.click(newTabButton);
    expect(onSelect).toHaveBeenCalledWith(APPS[2], { newTab: true });

    onSelect.mockClear();
    await user.click(
      document.querySelector("[data-test='switch-app-kraken']") as HTMLElement,
    );
    expect(onSelect).toHaveBeenCalledWith(APPS[2]);
  });
});
