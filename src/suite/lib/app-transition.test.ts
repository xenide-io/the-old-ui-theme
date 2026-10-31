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
  node.innerHTML = '<svg data-companion="dot"><g class="terminal-body"><path fill="var(--ph-canvas)" stroke="url(#g)" /><g class="face-pose"><path /></g></g></svg>';
  node.getBoundingClientRect = () => rect(1300, 800, 56, 56);
  document.body.appendChild(node);
  return node;
}

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
  document.documentElement.style.backgroundColor = "";
  document.documentElement.style.overflow = "";
  sessionStorage.clear();
  window.name = "";
});

afterEach(() => {
  document.body.innerHTML = "";
  window.name = "";
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

  it("walks the companion to the centre, changes palette, then closes the iris", async () => {
    avatar();
    const handle = startSuiteAppTransition("tides");

    const overlay = document.getElementById("suite-app-transition");
    expect(overlay).not.toBeNull();
    expect(document.getElementById("root")?.hasAttribute("inert")).toBe(true);
    expect(overlay?.querySelector("img")).toBeNull();
    expect(overlay?.querySelector("[data-suite-handoff-cue]")).toBeNull();
    expect(
      overlay?.querySelectorAll("[data-suite-handoff-companion]").length,
    ).toBe(1);

    await handle.ready;
    await handle.cover();
    expect(overlay?.querySelector("[data-suite-handoff-cover]")).not.toBeNull();
    const stages = overlay?.querySelectorAll<HTMLElement>(
      "[data-suite-handoff-companion]",
    );
    expect(stages?.[0]?.querySelector(".suite-handoff-dot")).not.toBeNull();
  });

  it("uses the destination palette for the connection link", async () => {
    avatar();
    const handle = startSuiteAppTransition("kraken");
    const overlay = document.getElementById("suite-app-transition");
    await handle.ready;
    await handle.cover();
    const target = overlay?.querySelectorAll<HTMLElement>(
      "[data-suite-handoff-companion]",
    )[0];
    const body = target?.querySelector(".terminal-body > path");
    expect(body?.getAttribute("fill")).toBe("#fafafa");
    handle.cancel();
  });

  it("falls back to the connection link when the avatar is hidden", async () => {
    const handle = startSuiteAppTransition("shellstack", { enabled: true });
    const stages = document.querySelectorAll(
      "#suite-app-transition [data-suite-handoff-companion] svg",
    );
    expect(stages.length).toBe(1);
    expect(document.querySelector("#suite-app-transition img")).toBeNull();
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
