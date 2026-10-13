import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Sheet, SheetNumberCell } from "./Sheet";

afterEach(cleanup);

type Row = { id: string; name: string; hours: number };

function renderSheet(onCommit: (id: string, value: number | null) => Promise<void>) {
  const rows: Row[] = [
    { id: "a", name: "Brand", hours: 8 },
    { id: "b", name: "Portal", hours: 0 },
  ];
  render(
    <Sheet
      caption="Plan"
      getRowKey={(row) => row.id}
      groups={[{ key: "maya", label: "Maya", rows, cells: { hours: "8h" } }]}
      columns={[
        { key: "name", header: "Project", pinned: true, width: 200, cell: (row) => row.name },
        {
          key: "hours",
          header: "Week",
          align: "right",
          cell: (row) => (
            <SheetNumberCell
              column="hours"
              label={`${row.name} hours`}
              value={row.hours}
              onCommit={(value) => onCommit(row.id, value)}
            />
          ),
        },
      ]}
    />,
  );
}

describe("Sheet", () => {
  it("commits a changed cell once on Enter and moves focus to the row below", async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    renderSheet(onCommit);
    const brand = screen.getByLabelText("Brand hours");

    brand.focus();
    fireEvent.change(brand, { target: { value: "12" } });
    fireEvent.keyDown(brand, { key: "Enter" });
    fireEvent.blur(brand);

    await waitFor(() => expect(onCommit).toHaveBeenCalledWith("a", 12));
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Portal hours")).toHaveFocus();
  });

  it("saves the last row on Enter even though there is no row below to move to", async () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    renderSheet(onCommit);
    const portal = screen.getByLabelText("Portal hours");

    portal.focus();
    fireEvent.change(portal, { target: { value: "50" } });
    fireEvent.keyDown(portal, { key: "Enter" });

    await waitFor(() => expect(onCommit).toHaveBeenCalledWith("b", 50));
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid input without saving and reverts on Escape", () => {
    const onCommit = vi.fn().mockResolvedValue(undefined);
    renderSheet(onCommit);
    const brand = screen.getByLabelText("Brand hours");

    fireEvent.change(brand, { target: { value: "-3" } });
    fireEvent.blur(brand);
    expect(brand).toHaveAttribute("aria-invalid", "true");
    fireEvent.keyDown(brand, { key: "Escape" });

    expect(onCommit).not.toHaveBeenCalled();
    expect(brand).toHaveValue("8");
  });

  it("collapses a group to hide its rows but keeps the summary", () => {
    renderSheet(vi.fn());

    fireEvent.click(screen.getByRole("button", { name: /Maya/ }));

    expect(screen.queryByLabelText("Brand hours")).not.toBeInTheDocument();
    expect(screen.getByText("8h")).toBeInTheDocument();
  });
});
