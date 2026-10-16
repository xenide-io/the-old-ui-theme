import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Table } from "./Table";

afterEach(cleanup);

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

    expect(screen.getByRole("region", { name: "People" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(
      screen.getByRole("cell", { name: "No people yet." }),
    ).toHaveAttribute("colspan", "1");
  });

  it("applies per-row attributes from getRowProps", () => {
    const { container } = render(
      <Table
        data={[{ name: "Ada" }]}
        columns={[{ key: "name", header: "Name", cell: (row) => row.name }]}
        getRowProps={(row) => ({ "data-test": `row-${row.name}` })}
      />,
    );
    expect(container.querySelector('tr[data-test="row-Ada"]')).not.toBeNull();
  });

  it("lets report pages own their empty state without an extra table row", () => {
    render(
      <Table
        variant="report"
        caption="Run report"
        data={[] as Array<{ name: string }>}
        columns={[{ key: "name", header: "Crew", cell: (row) => row.name }]}
        emptyState={null}
      />,
    );
    expect(
      screen.getByRole("table", { name: "Run report" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Crew" })).toHaveAttribute(
      "scope",
      "col",
    );
    expect(screen.queryByRole("cell")).not.toBeInTheDocument();
  });
});
