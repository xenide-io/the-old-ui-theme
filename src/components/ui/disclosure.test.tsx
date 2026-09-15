import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Accordion } from "./Accordion";
import { CollapsibleSection } from "./CollapsibleSection";

describe("disclosure components", () => {
  it("keeps closed accordion content out of keyboard navigation", () => {
    render(
      <Accordion
        items={[{ id: "details", title: "Details", content: <a href="/more">More</a> }]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Details" });
    const content = document.getElementById(trigger.getAttribute("aria-controls")!);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveAttribute("aria-hidden", "true");
    expect(content).toHaveAttribute("inert");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(content).toHaveAttribute("aria-hidden", "false");
    expect(content).not.toHaveAttribute("inert");
  });

  it("keeps closed collapsible content out of keyboard navigation", () => {
    render(
      <CollapsibleSection title="Tokens" defaultOpen={false}>
        <button type="button">Copy token</button>
      </CollapsibleSection>,
    );

    const trigger = screen.getByRole("button", { name: "Tokens" });
    const content = document.getElementById(trigger.getAttribute("aria-controls")!);
    expect(content).toHaveAttribute("aria-hidden", "true");
    expect(content).toHaveAttribute("inert");
  });
});
