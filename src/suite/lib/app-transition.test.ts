import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { startSuiteAppTransition } from "./app-transition";

const rect = (left: number, top: number, width: number, height: number) =>
  ({
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON() {},
  }) as DOMRect;

function avatar() {
  const node = document.createElement("span");
  node.setAttribute("data-assistant-avatar", "");
  node.innerHTML = '<svg><g id="avatar-inner"></g></svg>';
  node.getBoundingClientRect = () => rect(1300, 800, 56, 56);
  document.body.appendChild(node);
  return node;
}

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  document.documentElement.style.backgroundColor = "";
  document.documentElement.style.overflow = "";
  sessionStorage.clear();
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("startSuiteAppTransition", () => {
  it("no-ops when motion is reduced", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const handle = startSuiteAppTransition("tides");
    expect(document.getElementById("suite-app-transition")).toBeNull();
    await expect(handle.ready).resolves.toBeUndefined();
  });

  it("does nothing for a new-tab launch", () => {
    const handle = startSuiteAppTransition("tides", { enabled: false });
    expect(document.getElementById("suite-app-transition")).toBeNull();
    expect(handle.cover).toBeTypeOf("function");
  });

  it("walks the companion to the centre, holds the confused beat, then irises", async () => {
    const node = avatar();
    const handle = startSuiteAppTransition("tides");

    const overlay = document.getElementById("suite-app-transition");
    expect(overlay).not.toBeNull();
    expect(node.style.visibility).toBe("hidden");
    expect(document.getElementById("root")?.hasAttribute("inert")).toBe(true);
    expect(overlay?.querySelector("img")).toBeNull();

    await handle.ready;
    const cue = overlay?.querySelector<HTMLElement>(
      "[data-suite-handoff-cue]",
    );
    expect(cue?.style.opacity).toBe("1");
    expect(cue?.textContent).toBe("?");

    await handle.cover();
    expect(overlay?.querySelector("[data-suite-handoff-cover]")).not.toBeNull();
    const glyph = overlay?.querySelector<HTMLElement>(
      "[data-suite-handoff-glyph]",
    );
    expect(glyph?.querySelector("svg")).not.toBeNull();
    expect(glyph?.querySelector("img")).toBeNull();
    expect(glyph?.style.opacity).toBe("1");
  });

  it("clones the companion without duplicating ids", () => {
    avatar();
    const handle = startSuiteAppTransition("kraken");
    const overlay = document.getElementById("suite-app-transition");
    const clone = overlay?.querySelector("[data-assistant-avatar]");
    expect(clone).toBeNull();
    expect(overlay?.querySelector("#avatar-inner")).toBeNull();
    expect(overlay?.querySelector("svg g")).not.toBeNull();
    handle.cancel();
  });

  it("falls back to the destination icon when the companion is hidden", async () => {
    const handle = startSuiteAppTransition("shellstack", { enabled: true });
    const image = document.querySelector<HTMLImageElement>(
      "#suite-app-transition img",
    );
    expect(image?.getAttribute("src")).toBe("/icon-shellstack.svg");
    await handle.cover();
  });

  it("restores the companion and root when the handoff fails", () => {
    const node = avatar();
    const handle = startSuiteAppTransition("turtletime");
    handle.cancel();
    expect(node.style.visibility).toBe("");
    expect(document.getElementById("root")?.hasAttribute("inert")).toBe(false);
    expect(document.getElementById("suite-app-transition")).toBeNull();
  });
});
