import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Display, Label, Lead, H1, SectionTitle } from "@/components/ui/Typography";

describe("typography scale", () => {
  it("puts marketing headings on the fluid classes", () => {
    render(
      <>
        <Display>Track time without ceremony</Display>
        <SectionTitle>Built for the suite</SectionTitle>
        <Lead>One scale across five apps.</Lead>
      </>,
    );

    expect(screen.getByText("Track time without ceremony")).toHaveClass("ph-hero-title");
    expect(screen.getByText("Built for the suite")).toHaveClass("ph-section-title");
    expect(screen.getByText("One scale across five apps.")).toHaveClass("ph-lead");
  });

  it("renders product headings without the marketing classes", () => {
    render(<H1>Reports</H1>);

    const heading = screen.getByRole("heading", { name: "Reports" });
    expect(heading).not.toHaveClass("ph-hero-title");
    expect(heading.className).toContain("font-bold");
  });

  it("forwards native props and refs to its semantic elements", () => {
    const headingRef = createRef<HTMLHeadingElement>();
    const labelRef = createRef<HTMLLabelElement>();

    render(
      <>
        <H1 ref={headingRef} id="reports-title" aria-describedby="reports-help">
          Native report heading
        </H1>
        <Label ref={labelRef} htmlFor="report-name">
          Report name
        </Label>
        <input id="report-name" />
      </>,
    );

    const heading = screen.getByRole("heading", { name: "Native report heading" });
    const label = screen.getByText("Report name");
    expect(heading).toHaveAttribute("aria-describedby", "reports-help");
    expect(label).toHaveAttribute("for", "report-name");
    expect(headingRef.current).toBe(heading);
    expect(labelRef.current).toBe(label);
  });
});
