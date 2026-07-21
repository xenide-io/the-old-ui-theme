import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

describe("first-slice components", () => {
  it("forwards a button ref and exposes loading state", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} loading>Save changes</Button>);

    expect(ref.current).toBe(screen.getByRole("button", { name: "Save changes" }));
    expect(ref.current).toBeDisabled();
    expect(ref.current).toHaveAttribute("aria-busy", "true");
  });

  it("uses the same tactile chrome for every filled variant", () => {
    const { rerender } = render(<Button variant="signal">Launch</Button>);
    expect(screen.getByRole("button", { name: "Launch" })).toHaveClass("ph-btn-raised");
    expect(screen.getByRole("button", { name: "Launch" }).querySelector(".ph-btn-chrome")).toBeInTheDocument();

    rerender(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button", { name: "Delete" }).querySelector(".ph-btn-chrome")).toBeInTheDocument();
  });

  it("associates input help and error messages", () => {
    const { rerender } = render(
      <Input label="Email" helperText="Use your work address" />,
    );

    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("Use your work address");

    rerender(<Input label="Email" error="Enter a valid email address" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleErrorMessage("Enter a valid email address");
  });

  it("keeps cards static unless explicitly interactive", () => {
    const { rerender } = render(<Card title="Static card" />);
    expect(screen.getByText("Static card").closest(".ph-card")).not.toHaveClass("ph-card-interactive");

    rerender(<Card title="Interactive card" interactive />);
    expect(screen.getByText("Interactive card").closest(".ph-card")).toHaveClass("ph-card-interactive");
  });

  it("forwards badge attributes and keeps static alerts out of live regions", () => {
    render(
      <>
        <Badge data-testid="badge">Live</Badge>
        <Alert title="Saved" />
        <Alert title="Background sync complete" live="polite" />
      </>,
    );

    expect(screen.getByTestId("badge")).toHaveTextContent("Live");
    expect(screen.getByText("Saved").closest(".ph-alert")).not.toHaveAttribute("role");
    expect(screen.getByRole("status")).toHaveTextContent("Background sync complete");
  });

  it("closes the modal with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    function Fixture() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open settings</button>
          <Modal
            open={open}
            onClose={() => {
              onClose();
              setOpen(false);
            }}
            title="Workspace settings"
          >
            <button type="button">Save settings</button>
          </Modal>
        </>
      );
    }

    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Workspace settings" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveFocus();
  });
});
