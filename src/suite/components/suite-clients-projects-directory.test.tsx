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

  it("shows a failed save inside the editor and keeps the draft", async () => {
    const user = userEvent.setup();
    render(
      <SuiteClientsProjectsDirectory
        clients={[]}
        projects={[]}
        canEdit
        onCreateClient={vi
          .fn()
          .mockRejectedValue(new Error("Name is already in use."))}
      />,
    );
    await user.click(screen.getByRole("button", { name: "New client" }));
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByRole("textbox", { name: "Name" }), "Acme");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "Name is already in use.",
    );
    expect(within(dialog).getByRole("textbox", { name: "Name" })).toHaveValue(
      "Acme",
    );
  });

  it("does not open an editor for read-only workspace members", async () => {
    const user = userEvent.setup();
    const update = vi.fn();
    render(
      <SuiteClientsProjectsDirectory
        clients={[{ id: "acme", name: "Acme" }]}
        projects={[{ id: "project", name: "Website", clientId: "acme" }]}
        canEdit={false}
        onUpdateProject={update}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Website/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
  });

  it("keeps client navigation and project creation in the compact browser", async () => {
    const user = userEvent.setup();
    const create = vi.fn();
    const { container } = render(
      <SuiteClientsProjectsDirectory
        compact
        clients={[
          { id: "acme", name: "Acme" },
          { id: "atlas", name: "Atlas" },
        ]}
        projects={[{ id: "project", name: "Client portal", clientId: "atlas" }]}
        canEdit
        onCreateClient={vi.fn()}
        onCreateProject={create}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute("data-compact", "true");
    await user.click(screen.getByRole("option", { name: /Atlas/ }));
    expect(
      screen.getByRole("button", { name: /Client portal/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New client" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add project" }));
    const dialog = screen.getByRole("dialog");
    await user.type(
      within(dialog).getByRole("textbox", { name: "Name" }),
      "Compact project",
    );
    await user.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Compact project", clientId: "atlas" }),
    );
  });

  it("allows project creation with no clients in compact mode", async () => {
    const user = userEvent.setup();
    render(
      <SuiteClientsProjectsDirectory
        compact
        clients={[]}
        projects={[]}
        canEdit
        onCreateProject={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Add project" }));
    expect(
      screen.getByRole("dialog", { name: "New project" }),
    ).toBeInTheDocument();
  });

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
      screen.getByRole("button", { name: "Choose icon" }),
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
    expect(dialog.querySelector('[data-icon-label="New folder"]')).toHaveStyle({
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
