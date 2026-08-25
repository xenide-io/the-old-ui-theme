import { describe, expect, it, vi } from "vitest";

import {
  consumePendingAskAiPrompt,
  openSuiteAskAi,
  persistSuiteAskAiOpen,
  readSuiteAskAiOpen,
  SUITE_ASK_AI_OPEN_KEY,
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
});
