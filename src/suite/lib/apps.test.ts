import { describe, expect, it } from "vitest";

import { classifySuiteHref, suiteAppSlugForNotificationSource } from "./apps";

const BASES = {
  tides: "http://localhost:3001",
  turtletime: "http://localhost:3000",
  kraken: "http://localhost:3003",
};

describe("classifySuiteHref", () => {
  it("maps a Tides task URL to the Tides app and path", () => {
    const match = classifySuiteHref(
      "http://localhost:3001/dashboard/projects/abc/tasks/def",
      BASES,
      "http://localhost:3000",
    );
    expect(match).toEqual({
      slug: "tides",
      path: "/dashboard/projects/abc/tasks/def",
      sameApp: false,
    });
  });

  it("marks a same-origin TurtleTime link as sameApp", () => {
    const match = classifySuiteHref(
      "http://localhost:3000/tracker",
      BASES,
      "http://localhost:3000",
    );
    expect(match?.sameApp).toBe(true);
    expect(match?.path).toBe("/tracker");
  });

  it("ignores urls that are not a suite app", () => {
    expect(
      classifySuiteHref("https://example.com/x", BASES, "http://localhost:3000"),
    ).toBeNull();
  });
});

describe("suiteAppSlugForNotificationSource", () => {
  it("maps notification source names to suite apps", () => {
    expect(suiteAppSlugForNotificationSource("portal")).toBe("shellstack");
    expect(suiteAppSlugForNotificationSource("kraken")).toBe("kraken");
    expect(suiteAppSlugForNotificationSource("unknown")).toBeNull();
  });
});
