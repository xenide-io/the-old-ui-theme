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

  it("shows Fluent emoji in their original colours", () => {
    const { container } = render(
      <SuiteEntityIcon
        label="Party"
        color="#123456"
        tinted
        imageUrl="https://media.xenide.io/svgrepo/fluent-emoji/1f389.svg"
      />,
    );
    const image = container.querySelector("img");
    expect(image).toHaveAttribute(
      "src",
      "https://media.xenide.io/svgrepo/fluent-emoji/1f389.svg",
    );
    expect((container.firstChild as HTMLElement).style.backgroundColor).toMatch(
      /^(transparent|rgba\(0, 0, 0, 0\))$/,
    );
  });

  it("masks single-colour icons so they follow the theme text colour", () => {
    const { container } = render(
      <SuiteEntityIcon
        label="Folder"
        imageUrl="https://media.xenide.io/svgrepo/office/folder.svg?mono=1"
      />,
    );
    // No <img>: the artwork is a mask painted with currentColor.
    expect(container.querySelector("img")).toBeNull();
    expect((container.firstChild as HTMLElement).style.color).toBe(
      "var(--ph-text-primary)",
    );
    const mask = container.querySelector<HTMLElement>("[aria-hidden='true'].bg-current");
    expect(mask).not.toBeNull();
    // The mask comes from Palette (CORS); the media host itself sends no CORS.
    expect(mask!.style.maskImage || mask!.style.webkitMaskImage).toContain(
      encodeURIComponent("https://media.xenide.io/svgrepo/office/folder.svg"),
    );
    expect(mask!.style.backgroundColor).toBe("");
  });

  it("uses the entity colour for a tinted single-colour icon", () => {
    const { container } = render(
      <SuiteEntityIcon
        label="Folder"
        color="#123456"
        tinted
        mono
        imageUrl="https://media.xenide.io/svgrepo/office/folder.svg"
      />,
    );
    expect(container.querySelector("img")).toBeNull();
    const mask = container.querySelector<HTMLElement>("[aria-hidden='true'].bg-current");
    expect(mask!.style.backgroundColor).toBe("rgb(18, 52, 86)");
  });
});
