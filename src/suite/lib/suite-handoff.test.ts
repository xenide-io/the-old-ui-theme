import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  SUITE_HANDOFF_COVER_ID,
  SUITE_HANDOFF_STORAGE_KEY,
} from "./app-transition";
import {
  clearSuiteHandoffCover,
  playSuiteHandoffEnter,
} from "./suite-handoff";

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
