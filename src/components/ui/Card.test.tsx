import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("renders an onClick card as a keyboard-operable button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Card title="Open report" onClick={onClick} />);

    const card = screen.getByRole("button", { name: "Open report" });
    expect(card).toHaveAttribute("type", "button");
    expect(card).toHaveClass("ph-card-interactive");

    await user.tab();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an href card as a link", () => {
    render(<Card title="Project settings" href="/settings" target="_blank" />);

    const card = screen.getByRole("link", { name: "Project settings" });
    expect(card).toHaveAttribute("href", "/settings");
    expect(card).toHaveAttribute("target", "_blank");
    expect(card).toHaveClass("ph-card-interactive");
  });

  it("keeps visual-only interactive cards as non-interactive containers", () => {
    render(<Card title="Card with actions" interactive />);

    expect(screen.getByText("Card with actions").closest(".ph-card")).toBeInstanceOf(
      HTMLDivElement,
    );
  });
});
