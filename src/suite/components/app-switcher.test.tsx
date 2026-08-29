import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: ComponentPropsWithoutRef<"img">) => <img {...props} />,
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
    slug: "nakama",
    name: "Nakama",
    description: "AI teammates",
    icon: "/nakama.svg",
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
  return <button {...props}>{children}</button>;
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
    expect(newTabButton).toHaveClass("absolute", "h-8", "w-8");
    expect(
      screen.queryByRole("button", { name: "Open Tides in a new tab" }),
    ).not.toBeInTheDocument();

    await user.click(newTabButton);
    expect(onSelect).toHaveBeenCalledWith(APPS[2], { newTab: true });
  });
});
