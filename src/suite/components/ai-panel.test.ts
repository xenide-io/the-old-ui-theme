import { describe, expect, it } from 'vitest';

import { resolveSuiteAiLauncherPosition } from './ai-panel';

describe('resolveSuiteAiLauncherPosition', () => {
  it('docks to either edge and keeps the launcher inside the viewport', () => {
    expect(
      resolveSuiteAiLauncherPosition('left', -20, 1000, 800, 120, 40),
    ).toEqual({
      x: 12,
      y: 12,
    });
    expect(
      resolveSuiteAiLauncherPosition('right', 900, 1000, 800, 120, 40),
    ).toEqual({
      x: 868,
      y: 748,
    });
  });
});
