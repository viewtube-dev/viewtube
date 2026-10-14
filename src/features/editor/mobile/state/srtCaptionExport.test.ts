import { describe, expect, it } from 'vitest';
import { buildSrtCaptions } from './srtCaptionExport';

describe('buildSrtCaptions', () => {
  it('sorts cues by timeline and formats timestamps to milliseconds', () => {
    expect(buildSrtCaptions([
      { startSec: 2, endSec: 3.25, text: 'Second cue' },
      { startSec: 0.2, endSec: 1.05, text: 'First cue' },
    ])).toBe(
      '1\n00:00:00,200 --> 00:00:01,050\nFirst cue\n\n' +
      '2\n00:00:02,000 --> 00:00:03,250\nSecond cue\n',
    );
  });

  it('preserves multiline caption text and carries rounded milliseconds', () => {
    expect(buildSrtCaptions([
      { startSec: 59.9996, endSec: 61, text: 'line one\nline two' },
    ])).toBe('1\n00:01:00,000 --> 00:01:01,000\nline one\nline two\n');
  });

  it('supports hours beyond one and skips invalid or empty cues', () => {
    expect(buildSrtCaptions([
      { startSec: -1, endSec: 1, text: 'negative' },
      { startSec: 1, endSec: 1, text: 'zero duration' },
      { startSec: 2, endSec: 3, text: '   ' },
      { startSec: 3600, endSec: 3601, text: 'hour mark' },
    ])).toBe('1\n01:00:00,000 --> 01:00:01,000\nhour mark\n');
  });

  it('returns an empty string when there are no valid cues', () => {
    expect(buildSrtCaptions([])).toBe('');
    expect(buildSrtCaptions([{ startSec: Number.NaN, endSec: 2, text: 'invalid' }])).toBe('');
  });
});
