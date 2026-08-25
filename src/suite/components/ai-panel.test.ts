import { describe, expect, it, vi } from "vitest";

import {
  consumePendingAskAiPrompt,
  consumeSuiteAskAiOpenFromLocation,
  openSuiteAskAi,
  pathWithSuiteAskAiOpen,
  persistSuiteAskAiOpen,
  readSuiteAskAiOpen,
  SUITE_ASK_AI_OPEN_KEY,
  SUITE_ASK_AI_OPEN_QUERY,
  SUITE_OPEN_ASK_AI_EVENT,
} from "./ai-panel";

describe("openSuiteAskAi", () => {
  it("queues a prompt for the panel that mounts after the event", () => {
    const onOpen = vi.fn();
    window.addEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);
    openSuiteAskAi({ prompt: "  Summarise this week  " });
    window.removeEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(consumePendingAskAiPrompt()).toBe("Summarise this week");
    expect(consumePendingAskAiPrompt()).toBeNull();
  });
});

describe("persistSuiteAskAiOpen", () => {
  it("remembers that Shelly was open across a same-tab navigation", () => {
    sessionStorage.removeItem(SUITE_ASK_AI_OPEN_KEY);
    persistSuiteAskAiOpen(true);
    expect(readSuiteAskAiOpen()).toBe(true);
    persistSuiteAskAiOpen(false);
    expect(readSuiteAskAiOpen()).toBe(false);
  });

  it("stamps a cross-app path so the destination can reopen Shelly", () => {
    expect(pathWithSuiteAskAiOpen("/tracker")).toBe(
      `/tracker?${SUITE_ASK_AI_OPEN_QUERY}=1`,
    );
    expect(pathWithSuiteAskAiOpen("/dashboard?scope=mine")).toBe(
      `/dashboard?scope=mine&${SUITE_ASK_AI_OPEN_QUERY}=1`,
    );
  });

  it("opens Shelly from a cross-app query and then strips it", () => {
    sessionStorage.removeItem(SUITE_ASK_AI_OPEN_KEY);
    window.history.replaceState(
      null,
      "",
      `/tracker?${SUITE_ASK_AI_OPEN_QUERY}=1`,
    );
    expect(consumeSuiteAskAiOpenFromLocation()).toBe(true);
    expect(readSuiteAskAiOpen()).toBe(true);
    expect(window.location.search).toBe("");
  });

  it("does not reopen Shelly from a leftover flag when switching apps", () => {
    persistSuiteAskAiOpen(true);
    window.history.replaceState(null, "", "/tracker");
    expect(consumeSuiteAskAiOpenFromLocation()).toBe(false);
  });
});
