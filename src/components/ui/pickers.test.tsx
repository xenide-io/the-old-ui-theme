import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ColorPicker } from "./ColorPicker";
import { DatePicker, describeDateKey, toDateKey } from "./DatePicker";

describe("DatePicker", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("keys a date by its local day, not its UTC day", () => {
    expect(toDateKey(new Date(2026, 9, 12, 0, 30))).toBe("2026-10-12");
  });

  it("describes today and tomorrow in words", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 12, 12));

    expect(describeDateKey("2026-10-12", "Add date")).toBe("Today");
    expect(describeDateKey("2026-10-13", "Add date")).toBe("Tomorrow");
    expect(describeDateKey("", "Add date")).toBe("Add date");
  });

  it("clears the date from the ✕ on the chip", async () => {
    const onChange = vi.fn();
    render(<DatePicker value="2026-10-12" onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Clear date" }));

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("hides the ✕ when no date is set", () => {
    render(<DatePicker value="" onChange={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Clear date" })).toBeNull();
  });
});

describe("ColorPicker", () => {
  afterEach(cleanup);

  it("offers presets in a popover and reports the chosen value", async () => {
    const onChange = vi.fn();
    render(<ColorPicker value="" onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Colour: Default" }));
    await userEvent.click(screen.getByRole("radio", { name: "Blue" }));

    expect(onChange).toHaveBeenCalledWith("#3b82f6");
  });

  it("accepts a typed hex value from the colour panel", async () => {
    const onChange = vi.fn();
    render(<ColorPicker value="" onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Colour: Default" }));
    const hex = screen.getByRole("textbox", { name: "Hex colour" });
    await userEvent.clear(hex);
    await userEvent.type(hex, "112233");

    expect(onChange).toHaveBeenLastCalledWith("#112233");
  });
});
