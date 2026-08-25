import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

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
});
