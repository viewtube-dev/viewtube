import { describe, expect, it } from 'vitest';
import { sourceFrameTime } from './videoFrameCapture';

describe('sourceFrameTime', () => {
  it('maps the timeline playhead to the correct source time after trimming and slipping', () => {
    expect(sourceFrameTime(14, 10, 3, 30)).toBe(7);
  });

  it('supports capturing the first source frame at clip start', () => {
    expect(sourceFrameTime(10, 10, 0, 30)).toBe(0);
  });

  it('clamps the frame time before the source duration boundary', () => {
    expect(sourceFrameTime(40, 10, 25, 30)).toBe(29.999);
  });

  it('rejects a playhead before the selected clip or invalid source metadata', () => {
    expect(sourceFrameTime(9, 10, 0, 30)).toBeNull();
    expect(sourceFrameTime(Number.NaN, 10, 0, 30)).toBeNull();
    expect(sourceFrameTime(11, 10, 0, 0)).toBeNull();
  });
});
