import { describe, expect, it } from "vitest";

import {
  DEFAULT_DATE_LOCALE,
  formatClock,
  formatDate,
  formatDateTime,
  formatLoggedTime,
  formatLongDate,
  formatShortDate,
  getDateLocale,
  initSuiteDates,
  setDateLocale,
  timeAgo,
  toDateLocaleKey,
  toISODate,
} from "./dates";

const SAMPLE = "2026-09-09T12:00:00Z";

describe("date formatting presets", () => {
  it("formats a compact day + short month", () => {
    expect(formatShortDate(SAMPLE)).toBe("9 Sep");
  });

  it("formats day + short month + year", () => {
    expect(formatDate(SAMPLE)).toBe("9 Sep 2026");
  });

  it("formats a long weekday date", () => {
    expect(formatLongDate(new Date(2026, 8, 9, 12))).toBe(
      "Wednesday, 9 September",
    );
  });

  it("formats date + clock", () => {
    expect(formatDateTime(new Date(2026, 8, 9, 9, 30))).toBe(
      "9 Sep 2026, 9:30 am",
    );
  });

  it("formats a 12-hour clock", () => {
    expect(formatClock(new Date(2026, 8, 9, 9, 30))).toBe("9:30 am");
  });

  it("returns the fallback for empty and invalid input", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatShortDate("")).toBe("");
    expect(formatShortDate("not-a-date")).toBe("");
  });

  it("formats durations from seconds", () => {
    expect(formatLoggedTime(9000)).toBe("2h 30m");
    expect(formatLoggedTime(1800)).toBe("30m");
    expect(formatLoggedTime(-10)).toBe("0m");
  });

  it("derives a local ISO day key", () => {
    expect(toISODate(new Date(2026, 8, 9, 23, 59))).toBe("2026-09-09");
  });
});

describe("relative time", () => {
  it("produces a localised relative phrase", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60_000);
    expect(timeAgo(fiveMinutesAgo)).toBe("5 minutes ago");
  });
});

describe("locale handling", () => {
  it("normalises BCP-47 tags to dayjs keys", () => {
    expect(toDateLocaleKey("en-AU")).toBe("en-au");
    expect(toDateLocaleKey("pt_BR")).toBe("pt-br");
    expect(toDateLocaleKey(undefined)).toBe("");
  });

  it("defaults to en and rejects unknown locales", async () => {
    setDateLocale("zz-zz");
    expect(getDateLocale()).toBe(DEFAULT_DATE_LOCALE);
  });

  it("loads and activates a supported locale", async () => {
    const applied = await initSuiteDates("de");
    expect(applied).toBe("de");
    expect(getDateLocale()).toBe("de");
    // Month names localise once the locale is registered.
    expect(formatShortDate(SAMPLE)).not.toBe("9 Sep");
    await initSuiteDates("en");
  });
});
