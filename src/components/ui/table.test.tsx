import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Table } from "./Table";

describe("Table", () => {
  it("names its scroll region and renders a custom empty state", () => {
    render(
      <Table
        data={[] as Array<{ name: string }>}
        columns={[{ key: "name", header: "Name", cell: (row) => row.name }]}
        caption="People"
        emptyState="No people yet."
      />,
    );

    expect(screen.getByRole("region", { name: "People" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("cell", { name: "No people yet." })).toHaveAttribute("colspan", "1");
  });
});
