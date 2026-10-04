import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Stat } from "@/components/ui/Stat";

describe("Avatar status", () => {
  it("exposes its status to assistive technology with semantic theme tokens", () => {
    render(<Avatar label="JD" status="online" />);

    const status = screen.getByRole("img", { name: "online status" });
    expect(status).toHaveClass("bg-ph-success", "border-ph-surface");
  });

  it("uses semantic accent contrast and counts grouped children", () => {
    const { container } = render(
      <AvatarGroup max={1}>
        <Avatar label="JD" />
        <Avatar label="AR" />
      </AvatarGroup>,
    );

    expect(container.querySelector(".ph-avatar")).toHaveClass("text-[var(--ph-on-accent)]");
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(container.querySelectorAll(".ph-avatar")).toHaveLength(2);
  });
});

describe("Stat warning", () => {
  it("uses warning theme tokens instead of fixed colours", () => {
    render(<Stat label="Over budget" value="$120" tone="warning" />);

    const stat = screen.getByRole("article");
    expect(stat.className).not.toContain("amber");
    expect(screen.getByText("$120")).toHaveClass("text-ph-warning");
  });
});
