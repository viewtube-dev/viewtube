import { describe, expect, it } from 'vitest';
import { rippleDeleteTimelineClips, slideTimelineClip, slipTimelineClip, splitTimelineClip, trimTimelineClip } from './vtE1TimelineOperations.js';

const clip = (id: string, start: number, end: number) => ({ id, trackId: 'v1', layerId: id, start, end, sourceInSec: start, sourceOutSec: end, keyframes: [] });

describe('VT_E1 timeline operations', () => {
  it('splits timeline and source offsets together', () => {
    const result = splitTimelineClip({ ...clip('a', 2, 8), sourceInSec: 10, sourceOutSec: 16 }, 5);
    expect(result?.left).toMatchObject({ start: 2, end: 5, sourceInSec: 10, sourceOutSec: 13 });
    expect(result?.right).toMatchObject({ start: 5, end: 8, sourceInSec: 13, sourceOutSec: 16 });
  });

  it('trims the source in-point with the left timeline edge', () => {
    expect(trimTimelineClip({ ...clip('a', 2, 8), sourceInSec: 10, sourceOutSec: 16 }, 'left', 3))
      .toMatchObject({ start: 3, end: 8, sourceInSec: 11, sourceOutSec: 16 });
  });

  it('trims the source out-point with the right timeline edge', () => {
    expect(trimTimelineClip({ ...clip('a', 2, 8), sourceInSec: 10, sourceOutSec: 16 }, 'right', 7, 20))
      .toMatchObject({ start: 2, end: 7, sourceInSec: 10, sourceOutSec: 15 });
  });

  it('rejects trims that would address source time before zero or past known duration', () => {
    expect(trimTimelineClip({ ...clip('a', 2, 8), sourceInSec: 0, sourceOutSec: 6 }, 'left', 1)).toBeNull();
    expect(trimTimelineClip({ ...clip('a', 2, 8), sourceInSec: 10, sourceOutSec: 16 }, 'right', 5, 12)).toBeNull();
  });

  it('slips without changing timeline edges', () => {
    expect(slipTimelineClip(clip('a', 2, 5), 3, 10)).toMatchObject({ start: 2, end: 5, sourceInSec: 5, sourceOutSec: 8 });
  });

  it('clamps source slip to the available media range while preserving the timeline slot', () => {
    const sourceWindow = { ...clip('a', 2, 5), sourceInSec: 1, sourceOutSec: 4 };
    expect(slipTimelineClip(sourceWindow, -10, 12)).toMatchObject({
      start: 2, end: 5, sourceInSec: 0, sourceOutSec: 3,
    });
    expect(slipTimelineClip(sourceWindow, 10, 12)).toMatchObject({
      start: 2, end: 5, sourceInSec: 9, sourceOutSec: 12,
    });
  });

  it('slides a contiguous clip by trimming its neighbors', () => {
    const result = slideTimelineClip([clip('a', 0, 3), clip('b', 3, 6), clip('c', 6, 10)], 'b', 1);
    expect(result.appliedDeltaSec).toBe(1);
    expect(result.clips.map((entry) => [entry.id, entry.start, entry.end])).toEqual([['a', 0, 4], ['b', 4, 7], ['c', 7, 10]]);
  });

  it('ripple deletes selected durations per track', () => {
    const result = rippleDeleteTimelineClips([clip('a', 0, 2), clip('b', 4, 6), clip('c', 7, 9)], ['b']);
    expect(result.map((entry) => [entry.id, entry.start, entry.end])).toEqual([['a', 0, 2], ['c', 5, 7]]);
  });
});
