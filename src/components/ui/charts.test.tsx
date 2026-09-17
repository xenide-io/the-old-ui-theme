import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BarChart, DonutChart, StackedBarChart } from "./Charts";

const slices = [
  { label: "Tides", value: 40 },
  { label: "TurtleTime", value: 60 },
];

describe("Charts", () => {
  it("renders a labelled donut and a bar for each slice", () => {
    render(<DonutChart label="Time by source" slices={slices} />);
    expect(screen.getByRole("img", { name: "Time by source" })).toBeInTheDocument();
    expect(screen.getByText("Tides")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("renders bars with formatted values", () => {
    render(<BarChart items={slices} formatValue={(value) => `${value}h`} />);
    expect(screen.getByText("60h")).toBeInTheDocument();
  });

  it("renders a stacked mix and an empty state", () => {
    const { rerender } = render(<StackedBarChart label="Work mix" slices={slices} />);
    expect(screen.getByRole("img", { name: "Work mix" })).toBeInTheDocument();
    rerender(<StackedBarChart label="Work mix" slices={[{ label: "None", value: 0 }]} />);
    expect(screen.getByText("No data for this period.")).toBeInTheDocument();
  });
});
