import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SuitePaletteLibrary } from "./suite-palette-library";

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
  findPaletteIcons: vi.fn(),
}));

afterEach(cleanup);

describe("SuitePaletteLibrary", () => {
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
