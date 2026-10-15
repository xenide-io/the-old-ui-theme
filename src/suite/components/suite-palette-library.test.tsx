import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SuitePaletteLibrary } from "./suite-palette-library";
import { findPaletteIcons } from "@/suite/lib/palette-api";

vi.mock("@/suite/lib/palette-api", () => ({
  fetchPaletteLibrary: vi.fn().mockResolvedValue({
    collections: [
      {
        slug: "office",
        name: "Office",
        style: "line",
        featured: true,
        count: 1,
        preview: ["/office.svg"],
      },
    ],
  }),
  fetchPaletteCollection: vi.fn(),
  findPaletteIcons: vi.fn().mockResolvedValue({
    total: 1,
    results: [{ id: "rocket", name: "Rocket", collection: "office", tags: [], url: "/rocket.svg" }],
  }),
}));

afterEach(cleanup);

describe("SuitePaletteLibrary", () => {
  it("searches from the default view and keeps the query when changing type", async () => {
    const user = userEvent.setup();
    render(<SuitePaletteLibrary onPick={vi.fn()} />);

    const search = screen.getByRole("searchbox", { name: "Search icons" });
    await user.type(search, "rocket");
    await user.selectOptions(screen.getByRole("combobox", { name: "Filter by icon type" }), "duotone");

    expect(search).toHaveValue("rocket");
    await waitFor(() => expect(findPaletteIcons).toHaveBeenCalledWith({
      q: "rocket", collection: undefined, style: "duotone", limit: 120,
    }));
    expect(await screen.findByRole("button", { name: "Use Rocket" })).toBeVisible();
  });

  it("keeps labelled search and type controls and returns the picked icon", async () => {
    const onPick = vi.fn();
    const user = userEvent.setup();
    render(<SuitePaletteLibrary onPick={onPick} />);

    expect(screen.getByRole("searchbox", { name: "Search icons" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Filter by icon type" })).toHaveValue("all");
    await user.click(await screen.findByRole("button", { name: "Use Office" }));
    expect(onPick).toHaveBeenCalledWith({ url: "/office.svg", name: "Office" });
  });

  it("moves from search into options and restores trigger focus on Escape", async () => {
    const user = userEvent.setup();
    render(<SuitePaletteLibrary onPick={vi.fn()} />);

    const trigger = screen.getByRole("button", { name: "All libraries" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByText("Office")).toBeInTheDocument());

    const search = screen.getByRole("searchbox", { name: "Search libraries" });
    expect(search).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "All libraries" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: /Office/ })).toHaveFocus();
    await user.keyboard("{Escape}");

    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("listbox", { name: "Libraries" })).not.toBeInTheDocument();
  });
});
