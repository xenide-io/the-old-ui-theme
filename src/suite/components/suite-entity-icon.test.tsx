import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { automaticEntityColour, SuiteEntityIcon } from "./suite-entity-icon";

afterEach(cleanup);

describe("SuiteEntityIcon fallback", () => {
  it("uses a coloured folder only when no image was specified", () => {
    const { container, rerender } = render(<SuiteEntityIcon label="Acme" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.firstChild).toHaveStyle({
      color: automaticEntityColour("Acme"),
    });
    expect(automaticEntityColour("Acme")).not.toBe(
      automaticEntityColour("Beta"),
    );
    rerender(<SuiteEntityIcon label="Project" color="#123456" />);
    expect(container.firstChild).toHaveStyle({ color: "#123456" });
    rerender(
      <SuiteEntityIcon
        label="Acme"
        imageUrl="https://example.com/custom.svg"
      />,
    );
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.com/custom.svg",
    );
    expect(container.firstChild).not.toHaveStyle({
      backgroundColor: `${automaticEntityColour("Acme")}18`,
    });
  });
});
