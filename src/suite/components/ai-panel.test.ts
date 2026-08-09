import { describe, expect, it } from 'vitest';

import {
  resolveSuiteAiLauncherPosition,
  resolveSuiteAiNearestEdge,
  resolveSuiteAiPanelSide,
} from './ai-panel';

describe('resolveSuiteAiLauncherPosition', () => {
  it('docks to every edge and keeps the launcher inside the viewport', () => {
    expect(
      resolveSuiteAiLauncherPosition('left', 900, -20, 1000, 800, 120, 40),
    ).toEqual({ x: 12, y: 12 });
    expect(
      resolveSuiteAiLauncherPosition('right', 0, 900, 1000, 800, 120, 40),
    ).toEqual({ x: 868, y: 748 });
    expect(
      resolveSuiteAiLauncherPosition('top', -20, 900, 1000, 800, 120, 40),
    ).toEqual({ x: 12, y: 12 });
    expect(
      resolveSuiteAiLauncherPosition('bottom', 900, -20, 1000, 800, 120, 40),
    ).toEqual({ x: 868, y: 748 });
  });
});

describe('resolveSuiteAiNearestEdge', () => {
  it('docks to the closest of all four edges', () => {
    expect(resolveSuiteAiNearestEdge(10, 400, 120, 40, 1000, 800)).toBe('left');
    expect(resolveSuiteAiNearestEdge(870, 400, 120, 40, 1000, 800)).toBe(
      'right',
    );
    expect(resolveSuiteAiNearestEdge(440, 10, 120, 40, 1000, 800)).toBe('top');
    expect(resolveSuiteAiNearestEdge(440, 740, 120, 40, 1000, 800)).toBe(
      'bottom',
    );
  });
});

describe('resolveSuiteAiPanelSide', () => {
  it('opens from the docked horizontal edge or the launcher half', () => {
    expect(resolveSuiteAiPanelSide('left', 500, 1000)).toBe('left');
    expect(resolveSuiteAiPanelSide('right', 500, 1000)).toBe('right');
    expect(resolveSuiteAiPanelSide('top', 100, 1000)).toBe('left');
    expect(resolveSuiteAiPanelSide('bottom', 900, 1000)).toBe('right');
  });
});
