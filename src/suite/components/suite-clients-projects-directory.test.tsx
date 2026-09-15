import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SuiteClientsProjectsDirectory } from "@/suite/components/suite-clients-projects-directory";

describe("SuiteClientsProjectsDirectory", () => {
  afterEach(cleanup);

  it("uses roving focus and arrow keys for the icon radiogroup", async () => {
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
    const castle = screen.getByRole("radio", { name: "Castle" });
    const castleFlag = screen.getByRole("radio", { name: "Castle flag" });

    expect(castle).toHaveAttribute("tabindex", "0");
    expect(castleFlag).toHaveAttribute("tabindex", "-1");

    castle.focus();
    await user.keyboard("{ArrowRight}");
    expect(castleFlag).toHaveAttribute("aria-checked", "true");
    expect(castleFlag).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "Arena" })).toHaveFocus();
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
