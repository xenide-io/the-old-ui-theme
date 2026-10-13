export interface CalendarTimeSpan<T> {
  event: T;
  start: number;
  end: number;
}

/** Interval partitioning: touching entries can reuse a lane; only concurrent
 * entries need separate columns. No fanned/occluded titles. */
export function calendarTimeGroups<T>(spans: CalendarTimeSpan<T>[]) {
  const groups: {
    start: number;
    end: number;
    lanes: number;
    entries: (CalendarTimeSpan<T> & { lane: number })[];
  }[] = [];
  let laneEnds: number[] = [];
  for (const span of spans
    .filter(
      (span) =>
        Number.isFinite(span.start) &&
        Number.isFinite(span.end) &&
        span.end > span.start,
    )
    .toSorted((a, b) => a.start - b.start || b.end - a.end)) {
    let group = groups.at(-1);
    if (!group || span.start >= group.end) {
      group = { start: span.start, end: span.end, lanes: 0, entries: [] };
      groups.push(group);
      laneEnds = [];
    }
    let lane = laneEnds.findIndex((end) => end <= span.start);
    if (lane < 0) lane = laneEnds.length;
    laneEnds[lane] = span.end;
    group.end = Math.max(group.end, span.end);
    group.lanes = laneEnds.length;
    group.entries.push({ ...span, lane });
  }
  return groups;
}
