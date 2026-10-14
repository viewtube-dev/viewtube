import { describe, expect, it } from 'vitest';
import { trimClipSourceBounds } from './trimClipSourceBounds';

describe('trimClipSourceBounds', () => {
  const clip = {
    start: 10,
    end: 20,
    sourceInSec: 5,
    sourceOutSec: 15,
    sourceDurationSec: 30,
  };

  it('advances source-in when trimming the left edge inward', () => {
    expect(trimClipSourceBounds(clip, 'left', 12)).toEqual({
      sourceInSec: 7,
      sourceOutSec: 15,
    });
  });

  it('reduces source-out when trimming the right edge inward', () => {
    expect(trimClipSourceBounds(clip, 'right', 18)).toEqual({
      sourceInSec: 5,
      sourceOutSec: 13,
    });
  });

  it('respects source playback rate when timeline and source durations differ', () => {
    const fasterClip = { ...clip, sourceOutSec: 25 };
    expect(trimClipSourceBounds(fasterClip, 'left', 12)).toEqual({
      sourceInSec: 9,
      sourceOutSec: 25,
    });
  });

  it('leaves timeline-only clips unchanged', () => {
    expect(trimClipSourceBounds({ start: 2, end: 8 }, 'left', 3)).toEqual({});
  });

  it('does not move source bounds outside the valid source interval', () => {
    expect(trimClipSourceBounds({ ...clip, sourceInSec: 0 }, 'left', 8)).toEqual({
      sourceInSec: 0,
      sourceOutSec: 15,
    });
    expect(trimClipSourceBounds({ ...clip, sourceOutSec: 30 }, 'right', 22)).toEqual({
      sourceInSec: 5,
      sourceOutSec: 15,
    });
  });
});
