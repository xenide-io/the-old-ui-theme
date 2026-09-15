import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SuiteWorkspaceSwitcher } from "./workspace-switcher";

function TestDropdownMenu({
  trigger,
  children,
}: {
  trigger: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
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

describe("SuiteWorkspaceSwitcher", () => {
  afterEach(cleanup);

  it("uses menu items rather than listbox options for workspace choices", () => {
    render(
      <SuiteWorkspaceSwitcher
        name="Acme"
        currentId="acme"
        workspaces={[
          { id: "acme", name: "Acme" },
          { id: "globex", name: "Globex" },
        ]}
        onSelect={vi.fn()}
        dropdownMenu={TestDropdownMenu}
        dropdownItem={TestDropdownItem}
      />,
    );

    const currentWorkspace = screen.getByRole("button", { name: "Acme" });
    expect(currentWorkspace).toHaveAttribute("data-dropdown-item", "true");
    expect(currentWorkspace).toHaveAttribute("aria-current", "true");
    expect(currentWorkspace).not.toHaveAttribute("role", "option");
  });
});
