import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./Progress";

describe("Progress", () => {
  it("normalises invalid ranges and associates its visible label", () => {
    render(<Progress label="Upload" value={200} max={0} showPercentage />);

    const progressbar = screen.getByRole("progressbar", { name: "Upload" });
    expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveStyle({ width: "100%" });
  });
});
