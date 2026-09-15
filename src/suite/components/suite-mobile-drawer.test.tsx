import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SuiteMobileDrawer } from "./suite-mobile-drawer";

afterEach(cleanup);

describe("SuiteMobileDrawer", () => {
  it("puts one full-height scroller under the close row", () => {
    render(
      <SuiteMobileDrawer
        open
        onClose={() => {}}
        showCloseButton
        title="Kraken"
      >
        <p>Documents</p>
      </SuiteMobileDrawer>,
    );

    const body = document.querySelector(
      '[data-test="suite-mobile-drawer-body"]',
    );
    expect(body).not.toBeNull();
    expect(body).toHaveClass(
      "min-h-0",
      "flex-1",
      "overflow-y-auto",
      "suite-scroll-lock",
    );
    expect(body?.previousElementSibling).toHaveClass("h-14", "shrink-0");
  });

  it("uses a modal dialog that closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <SuiteMobileDrawer open onClose={onClose} showCloseButton>
        <a href="/documents">Documents</a>
      </SuiteMobileDrawer>,
    );

    expect(screen.getByRole("dialog", { name: "Navigation" })).toHaveAttribute(
      "aria-modal",
      "true",
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
