import { describe, expect, it } from "vitest";
import { COMPANION_APP_THEMES, companionThemeId } from "./companion-provider";

describe("companion app themes", () => {
  it("maps each app to its fixed light and dark theme", () => {
    expect(COMPANION_APP_THEMES).toEqual({
      shellstack: { light: "pastel-sky", dark: "powershell" },
      tides: { light: "microsoft-onenote", dark: "rose-pine-moon" },
      turtletime: { light: "google-sheets", dark: "turtletime" },
      kraken: { light: "sepia-light", dark: "sepia-dark" },
      shelly: { light: "pastel-sky", dark: "shelly" },
    });
  });

  it("resolves the current app and mode, with no choice for unknown hosts", () => {
    expect(companionThemeId("turtletime", "light")).toBe("google-sheets");
    expect(companionThemeId("turtletime", "dark")).toBe("turtletime");
    expect(companionThemeId(undefined, "dark")).toBeUndefined();
  });
});
