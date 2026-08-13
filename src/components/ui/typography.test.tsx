import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Display, Lead, H1, SectionTitle } from "@/components/ui/Typography";

describe("typography voices", () => {
  it("gives marketing display the serif hero class and keeps product H1 sans", () => {
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
});
