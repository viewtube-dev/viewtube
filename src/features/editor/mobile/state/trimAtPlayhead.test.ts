import { describe, expect, it } from 'vitest';
import { canTrimEdgeToPlayhead } from './trimAtPlayhead';

describe('canTrimEdgeToPlayhead', () => {
  const clip = { start: 2, end: 10 };

  it('allows a playhead safely inside the clip', () => {
    expect(canTrimEdgeToPlayhead(clip, 5)).toBe(true);
  });

  it('rejects playheads outside the clip and within the minimum-duration guard band', () => {
    expect(canTrimEdgeToPlayhead(clip, 1)).toBe(false);
    expect(canTrimEdgeToPlayhead(clip, 2)).toBe(false);
    expect(canTrimEdgeToPlayhead(clip, 2.05)).toBe(false);
    expect(canTrimEdgeToPlayhead(clip, 9.95)).toBe(false);
    expect(canTrimEdgeToPlayhead(clip, 10)).toBe(false);
    expect(canTrimEdgeToPlayhead(clip, 11)).toBe(false);
  });

  it('rejects invalid ranges and non-finite playheads', () => {
    expect(canTrimEdgeToPlayhead(null, 5)).toBe(false);
    expect(canTrimEdgeToPlayhead({ start: 10, end: 2 }, 5)).toBe(false);
    expect(canTrimEdgeToPlayhead(clip, Number.NaN)).toBe(false);
  });
});
