import { describe, expect, it } from 'vitest';
import { canSplitClipAtPlayhead } from './splitClipEligibility';

describe('canSplitClipAtPlayhead', () => {
  const clip = { start: 2, end: 8 };

  it('allows a split strictly inside the selected clip', () => {
    expect(canSplitClipAtPlayhead(clip, 5)).toBe(true);
  });

  it('rejects the clip boundaries and the minimum-edge guard band', () => {
    expect(canSplitClipAtPlayhead(clip, 2)).toBe(false);
    expect(canSplitClipAtPlayhead(clip, 8)).toBe(false);
    expect(canSplitClipAtPlayhead(clip, 2.0005)).toBe(false);
    expect(canSplitClipAtPlayhead(clip, 7.9995)).toBe(false);
  });

  it('rejects a missing clip or non-finite playhead', () => {
    expect(canSplitClipAtPlayhead(null, 5)).toBe(false);
    expect(canSplitClipAtPlayhead(undefined, 5)).toBe(false);
    expect(canSplitClipAtPlayhead(clip, Number.NaN)).toBe(false);
    expect(canSplitClipAtPlayhead(clip, Number.POSITIVE_INFINITY)).toBe(false);
  });
});
