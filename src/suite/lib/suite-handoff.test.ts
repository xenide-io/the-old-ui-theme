import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SUITE_HANDOFF_COVER_ID,
  SUITE_HANDOFF_STORAGE_KEY,
} from "./app-transition";
import {
  clearSuiteHandoffCover,
  playSuiteHandoffEnter,
} from "./suite-handoff";

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

function plantCover(): HTMLElement {
  const cover = document.createElement("div");
  cover.id = SUITE_HANDOFF_COVER_ID;
  document.body.appendChild(cover);
  document.documentElement.style.overflow = "hidden";
  document.documentElement.style.backgroundColor = "#173521";
  sessionStorage.setItem(SUITE_HANDOFF_STORAGE_KEY, "1");
  return cover;
}

beforeEach(() => {
  document.body.innerHTML = "";
  sessionStorage.clear();
  document.documentElement.style.overflow = "";
  document.documentElement.style.backgroundColor = "";
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("clearSuiteHandoffCover", () => {
  it("removes the cover, marker and boot paint", () => {
    plantCover();
    clearSuiteHandoffCover();
    expect(document.getElementById(SUITE_HANDOFF_COVER_ID)).toBeNull();
    expect(sessionStorage.getItem(SUITE_HANDOFF_STORAGE_KEY)).toBeNull();
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.documentElement.style.backgroundColor).toBe("");
  });
});

describe("playSuiteHandoffEnter", () => {
  it("opens the iris and clears the boot paint", () => {
    const cover = plantCover();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(performance.now() + 1_000);
      return 1;
    });

    playSuiteHandoffEnter();

    expect(cover.isConnected).toBe(false);
    expect(sessionStorage.getItem(SUITE_HANDOFF_STORAGE_KEY)).toBeNull();
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.documentElement.style.backgroundColor).toBe("");
  });

  it("flies the glyph back to the companion and restores it", async () => {
    const cover = plantCover();
    const glyph = document.createElement("span");
    glyph.setAttribute("data-suite-handoff-glyph", "");
    cover.appendChild(glyph);
    glyph.getBoundingClientRect = () => rect(692, 422, 56, 56);

    const stage = document.createElement("div");
    stage.setAttribute("data-test", "floating-assistant");
    const avatar = document.createElement("span");
    avatar.setAttribute("data-assistant-avatar", "");
    avatar.innerHTML = "<span>Dot</span>";
    avatar.getBoundingClientRect = () => rect(1300, 800, 56, 56);
    stage.appendChild(avatar);
    document.body.appendChild(stage);

    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(performance.now() + 1_000);
      return 1;
    });

    playSuiteHandoffEnter();
    expect(stage.style.visibility).toBe("hidden");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.querySelector("[data-suite-handoff-flight]")).toBeNull();
    expect(stage.style.visibility).toBe("");
  });

  it("unlocks the page when the cover never painted", () => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.backgroundColor = "#173521";
    sessionStorage.setItem(SUITE_HANDOFF_STORAGE_KEY, "1");

    playSuiteHandoffEnter();

    expect(document.documentElement.style.overflow).toBe("");
    expect(document.documentElement.style.backgroundColor).toBe("");
    expect(sessionStorage.getItem(SUITE_HANDOFF_STORAGE_KEY)).toBeNull();
  });
});
