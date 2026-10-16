import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OverflowTooltip, Tooltip, TooltipProvider } from "@/components/ui/Tooltip";

afterEach(cleanup);

/** jsdom never lays text out, so drive the truncation check directly. */
function mockTruncation(scrollWidth: number, clientWidth: number) {
  const scroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
  const client = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get: () => scrollWidth,
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => clientWidth,
  });
  return () => {
    if (scroll) Object.defineProperty(HTMLElement.prototype, "scrollWidth", scroll);
    if (client) Object.defineProperty(HTMLElement.prototype, "clientWidth", client);
  };
}

describe("Tooltip", () => {
  it("drops a native title so the browser tip cannot stack on the custom one", () => {
    render(
      <Tooltip content="Custom tip">
        <button type="button" title="Native tip">
          Target
        </button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Target" })).not.toHaveAttribute("title");
  });

  it("does not describe a control with a tip that only repeats its name", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Close">
        <button type="button" aria-label="Close">
          <span aria-hidden>×</span>
        </button>
      </Tooltip>,
    );

    await user.tab();
    const trigger = screen.getByRole("button", { name: "Close" });
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Close");
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

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

  it("keeps hoverable content open while the pointer moves from its trigger when opted in", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        content="Hoverable details"
        delayDuration={0}
        disableHoverableContent={false}
      >
        <button type="button">Hover target</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Hover target" });
    await user.hover(trigger);
    const tooltip = await screen.findByRole("tooltip");
    await user.unhover(trigger);
    await user.hover(tooltip);

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.unhover(tooltip);
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("closes when the trigger is left by default (content never blocks the pointer)", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Non-hoverable details" delayDuration={0}>
        <button type="button">Hover target</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Hover target" });
    await user.hover(trigger);
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    await user.unhover(trigger);

    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("flips to the opposite side when the requested side overflows the viewport", async () => {
    const user = userEvent.setup();
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 100 });
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        if (this.getAttribute("role") === "tooltip") {
          return new DOMRect(0, 0, 80, 20);
        }
        // Trigger sits at the very bottom: a "bottom" tooltip cannot fit below.
        return new DOMRect(40, 80, 20, 20);
      });

    try {
      render(
        <Tooltip content="Flip details" side="bottom" delayDuration={0}>
          <button type="button">Flip target</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button", { name: "Flip target" }));
      const tooltip = await screen.findByRole("tooltip");
      await waitFor(() => expect(tooltip).toHaveAttribute("data-side", "top"));
    } finally {
      rect.mockRestore();
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: originalInnerHeight,
      });
    }
  });

  it("keeps content within its collision padding", async () => {
    const user = userEvent.setup();
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 200 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 100 });
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        if (this.getAttribute("role") === "tooltip") {
          return new DOMRect(0, 0, 100, 30);
        }
        return new DOMRect(2, 2, 20, 20);
      });

    try {
      render(
        <Tooltip content="Padded details" collisionPadding={16} delayDuration={0}>
          <button type="button">Padded target</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button", { name: "Padded target" }));
      const tooltip = await screen.findByRole("tooltip");
      await waitFor(() => {
        // The requested top side has no room, so it flips below the trigger and
        // still respects the collision padding on both axes.
        expect(tooltip).toHaveAttribute("data-side", "bottom");
        expect(tooltip.parentElement).toHaveStyle({ left: "16px" });
        const top = parseFloat((tooltip.parentElement as HTMLElement).style.top);
        expect(top).toBeGreaterThanOrEqual(16);
        expect(top).toBeLessThanOrEqual(100 - 30 - 16);
      });
    } finally {
      rect.mockRestore();
      Object.defineProperty(window, "innerWidth", { configurable: true, value: originalInnerWidth });
      Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInnerHeight });
    }
  });
});

describe("OverflowTooltip", () => {
  it("reveals a clipped label without changing the label's own box", async () => {
    const restore = mockTruncation(300, 100);

    try {
      render(<OverflowTooltip text="A label that is definitely clipped" />);
      const label = await screen.findByText("A label that is definitely clipped");

      // The measured span stays full-width, and so does the Tooltip trigger
      // around it. An `inline-flex` trigger shrink-wraps to the full text,
      // which flips the measurement back and re-renders until React throws
      // "Maximum update depth exceeded".
      expect(label).toHaveClass("w-full");
      expect(label.parentElement).not.toBeNull();
      expect(label.parentElement).not.toHaveClass("inline-flex");
      expect(label.parentElement).toHaveClass("w-full");
    } finally {
      restore();
    }
  });

  it("stays quiet when the label already fits", async () => {
    const restore = mockTruncation(100, 100);

    try {
      render(<OverflowTooltip text="Short" />);
      const label = await screen.findByText("Short");

      expect(label).toHaveClass("w-full");
      expect(label).not.toHaveAttribute("aria-describedby");
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    } finally {
      restore();
    }
  });
});
