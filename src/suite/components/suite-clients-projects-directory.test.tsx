import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
});
