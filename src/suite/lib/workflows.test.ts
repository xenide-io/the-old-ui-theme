import { describe, expect, it } from "vitest";
import {
  parseWorkflowPrefs,
  resolveWorkflows,
  type SuiteWorkflow,
} from "./workflows";

const defaults: SuiteWorkflow[] = [
  { label: "Explain", prompt: "Explain it." },
  { label: "Draft", prompt: "Draft it." },
];

describe("resolveWorkflows", () => {
  it("returns the defaults untouched when nothing is customised", () => {
    expect(resolveWorkflows(defaults, parseWorkflowPrefs(null))).toEqual(
      defaults,
    );
  });

  it("drops hidden defaults and appends custom workflows after the rest", () => {
    const prefs = {
      hidden: ["Explain"],
      custom: [{ id: "a", label: "Mine", prompt: "Do mine." }],
    };

    expect(resolveWorkflows(defaults, prefs)).toEqual([
      defaults[1],
      { label: "Mine", prompt: "Do mine." },
    ]);
  });
});

describe("parseWorkflowPrefs", () => {
  it("falls back to empty prefs for corrupt storage", () => {
    expect(parseWorkflowPrefs("{nope")).toEqual({ hidden: [], custom: [] });
  });

  it("ignores malformed custom entries and non-string hidden labels", () => {
    const raw = JSON.stringify({
      hidden: ["Explain", 4],
      custom: [{ id: "a", label: "Ok", prompt: "Go" }, { label: "No id" }, null],
    });

    expect(parseWorkflowPrefs(raw)).toEqual({
      hidden: ["Explain"],
      custom: [{ id: "a", label: "Ok", prompt: "Go" }],
    });
  });
});
