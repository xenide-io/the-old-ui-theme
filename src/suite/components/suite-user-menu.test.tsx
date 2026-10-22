import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DropdownItem, DropdownMenu } from "../../components/ui/DropdownMenu";
import { SuiteUserMenu } from "./suite-user-menu";
import { SuiteWorkspaceSwitcher } from "./workspace-switcher";

afterEach(cleanup);

describe("SuiteUserMenu workspace switching", () => {
  function fixture(showDetails = true) {
    const onSelect = vi.fn();
    const onSignOut = vi.fn();
    render(
      <SuiteUserMenu
        name="Daniel Okonkwo"
        email="daniel@example.com"
        subtitle="Design studio"
        showDetails={showDetails}
        settingsHref="/settings"
        onSignOut={onSignOut}
        workspaceMenu={
          <SuiteWorkspaceSwitcher
            inline
            name="Design studio"
            currentId="design"
            workspaces={[
              { id: "design", name: "Design studio" },
              { id: "product", name: "Product team" },
            ]}
            onSelect={onSelect}
            dropdownMenu={DropdownMenu}
            dropdownItem={DropdownItem}
          />
        }
      />,
    );
    return { onSelect, onSignOut };
  }

  it("shows the workspace in the footer and switches from the account menu", async () => {
    const user = userEvent.setup();
    const { onSelect } = fixture();
    const trigger = screen.getByRole("button", { name: "Account menu" });
    expect(trigger).toHaveTextContent("Design studio");
    expect(screen.queryByRole("button", { name: "Switch workspace" })).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole("menuitem", { name: "Design studio" })).toHaveAttribute("aria-current", "true");
    await user.click(screen.getByRole("menuitem", { name: "Product team" }));
    expect(onSelect).toHaveBeenCalledWith({ id: "product", name: "Product team" });
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("supports the collapsed avatar and restores focus after Escape", async () => {
    const user = userEvent.setup();
    fixture(false);
    const trigger = screen.getByRole("button", { name: "Account menu" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Design studio" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps sign out available and does not reselect the current workspace", async () => {
    const user = userEvent.setup();
    const { onSelect, onSignOut } = fixture();
    await user.click(screen.getByRole("button", { name: "Account menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Design studio" }));
    expect(onSelect).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Account menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
