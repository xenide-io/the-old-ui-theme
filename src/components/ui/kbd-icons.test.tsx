import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  CANONICAL_ICONS,
  OLD_UI_ICONS,
  PH_ICONS,
  PH_ICON_ALIASES,
  IconByName,
  IconInfo,
  IconOldWindow,
  IconTerminal,
} from "@/components/icons";
import { Kbd } from "@/components/ui/Kbd";

describe("Kbd", () => {
  it("renders shortcuts as separate, spoken keycaps", () => {
    render(<Kbd keys={["Command", "K"]} platform="mac" />);
    const shortcut = screen.getByLabelText("Command + K");

    expect(shortcut).toHaveClass("ph-keycap");
    expect(shortcut.querySelectorAll(".ph-shortcut-key")).toHaveLength(2);
    expect(shortcut).toHaveTextContent("⌘K");
  });

  it("keeps platform conversion explicit and preserves React nodes", () => {
    const { rerender } = render(<Kbd keys={["Control", "K"]} />);
    expect(screen.getByLabelText("Control + K")).toHaveTextContent("ControlK");

    rerender(<Kbd keys={[<span key="mod">Fn</span>, "K"]} aria-label="Function + K" />);
    expect(screen.getByLabelText("Function + K")).toHaveTextContent("FnK");
    expect(screen.getByLabelText("Function + K")).not.toHaveTextContent("[object Object]");
  });

  it("distinguishes a physical key from a code token", () => {
    render(
      <>
        <Kbd variant="key">Escape</Kbd>
        <Kbd variant="token">HogQL</Kbd>
      </>,
    );

    expect(screen.getByText("Escape")).toHaveClass("ph-keycap");
    expect(screen.getByText("HogQL")).toHaveClass("ph-code-token");
  });
});

describe("icons", () => {
  it("hides decorative icons but exposes labeled icons", () => {
    const { rerender } = render(<IconInfo data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");

    rerender(<IconInfo data-testid="icon" aria-label="Information" />);
    expect(screen.getByRole("img", { name: "Information" })).not.toHaveAttribute("aria-hidden");
  });

  it("honors size, forwards refs, and renders original glyphs", () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <>
        <IconTerminal ref={ref} size={16} data-testid="terminal" />
        <IconOldWindow aria-label="Old window" />
      </>,
    );

    expect(ref.current).toBe(screen.getByTestId("terminal"));
    expect(screen.getByTestId("terminal")).toHaveStyle({ width: "16px", height: "16px" });
    expect(screen.getByRole("img", { name: "Old window" })).toBeInTheDocument();
  });

  it("keeps aliases runtime-identical while originals stay canonical", () => {
    expect(PH_ICONS.grid).toBe(CANONICAL_ICONS.gridView);
    expect(PH_ICONS.play).toBe(CANONICAL_ICONS.playCircle);
    expect(PH_ICONS.warning).toBe(CANONICAL_ICONS.exclamation);
    expect(Object.keys(PH_ICON_ALIASES)).toEqual(expect.arrayContaining(["grid", "play", "warning"]));

    for (const name of Object.keys(OLD_UI_ICONS)) {
      expect(name in CANONICAL_ICONS).toBe(true);
    }
  });

  it("gives generated icons useful identities and forwards dynamic refs", () => {
    const ref = createRef<SVGSVGElement>();
    render(<IconByName ref={ref} name="grid" data-testid="dynamic-icon" />);

    expect(CANONICAL_ICONS.areaChart.displayName).toBe("IconAreaChart");
    expect(ref.current).toBe(screen.getByTestId("dynamic-icon"));
    expect(ref.current).toHaveAttribute("aria-hidden", "true");
  });
});
