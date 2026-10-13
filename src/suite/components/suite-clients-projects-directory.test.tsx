import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SuiteClientsProjectsDirectory } from "@/suite/components/suite-clients-projects-directory";

describe("SuiteClientsProjectsDirectory", () => {
  afterEach(cleanup);

  it("offers the Palette icon library instead of an RPG radiogroup", async () => {
    const user = userEvent.setup();

    render(
      <SuiteClientsProjectsDirectory
        clients={[]}
        projects={[]}
        canEdit
        onCreateClient={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "New client" }));

    expect(
      screen.getByRole("button", { name: "Browse library" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("moves focus between the mobile client list and detail view", async () => {
    const user = userEvent.setup();
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    try {
      render(
        <SuiteClientsProjectsDirectory
          clients={[{ id: "acme", name: "Acme" }]}
          projects={[]}
        />,
      );

      await user.click(screen.getByRole("option", { name: /Acme/ }));
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Back to clients" }),
        ).toHaveFocus(),
      );

      await user.click(screen.getByRole("button", { name: "Back to clients" }));
      await waitFor(() =>
        expect(screen.getByRole("option", { name: /Acme/ })).toHaveFocus(),
      );
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it("previews the client colour for new folders without choosing an icon or colour", async () => {
    const user = userEvent.setup();
    const create = vi.fn();
    render(
      <SuiteClientsProjectsDirectory
        clients={[{ id: "acme", name: "Acme", color: "#10b981" }]}
        projects={[]}
        canEdit
        onCreateProject={create}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Add project" }));
    const dialog = screen.getByRole("dialog");
    await user.type(
      within(dialog).getByRole("textbox", { name: "Name" }),
      "New folder",
    );
    expect(dialog.querySelector('[title="New folder"]')).toHaveStyle({
      color: "#10b981",
    });
    expect(dialog.querySelector("img")).toBeNull();
    await user.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "New folder",
        color: "",
        clientId: "acme",
        iconImageUrl: null,
        iconImageFile: null,
      }),
    );
  });
});
