import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";

afterEach(cleanup);

describe("Tooltip", () => {
  it("opens when its trigger is hovered", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hover details" delayDuration={0}>
        <button type="button">Hover target</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover target" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Hover details");
  });

  it("opens on keyboard focus and exposes its description to assistive technology", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip content="Keyboard details" side="bottom">
          <button type="button">Focus target</button>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.tab();

    const trigger = screen.getByRole("button", { name: "Focus target" });
    const tooltip = await screen.findByRole("tooltip");
    expect(trigger).toHaveFocus();
    expect(tooltip).toHaveTextContent("Keyboard details");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("dismisses an open tooltip with Escape without moving focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Dismissible details">
        <button type="button">Dismiss target</button>
      </Tooltip>,
    );

    await user.tab();
    const trigger = screen.getByRole("button", { name: "Dismiss target" });
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
