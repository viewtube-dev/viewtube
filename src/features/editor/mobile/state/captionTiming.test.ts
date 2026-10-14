import { describe, expect, it } from 'vitest';
import { resolveCaptionShiftDelta } from './captionTiming';

describe('resolveCaptionShiftDelta', () => {
  const cues = [{ startSec: 1, endSec: 2 }, { startSec: 3, endSec: 4 }];

  it('keeps a requested shift when the caption batch remains in bounds', () => {
    expect(resolveCaptionShiftDelta(cues, -0.5)).toBe(-0.5);
    expect(resolveCaptionShiftDelta(cues, 0.1)).toBe(0.1);
    expect(resolveCaptionShiftDelta(cues, 0.5)).toBe(0.5);
  });

  it('clamps a negative shift once for the whole batch to preserve relative timing', () => {
    expect(resolveCaptionShiftDelta(cues, -2)).toBe(-1);
  });

  it('returns zero for empty ranges, invalid deltas, and invalid starts', () => {
    expect(resolveCaptionShiftDelta([], 0.5)).toBe(0);
    expect(resolveCaptionShiftDelta(cues, Number.NaN)).toBe(0);
    expect(resolveCaptionShiftDelta([{ startSec: -2, endSec: -1 }], -0.5)).toBe(0);
    expect(resolveCaptionShiftDelta([{ startSec: 1, endSec: 1 }], 0.5)).toBe(0);
  });
});
