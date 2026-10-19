import { describe, expect, it } from 'vitest';
import { parseSrtCaptions } from './srtCaptionImport';

describe('parseSrtCaptions', () => {
  it('parses multiline captions and comma or dot milliseconds', () => {
    const source = '1\r\n00:00:01,250 --> 00:00:03,500\r\nFirst line\r\nsecond line\r\n\r\n2\r\n00:00:04.000 --> 00:00:05.125\r\nAnother cue';
    expect(parseSrtCaptions(source)).toEqual([
      { startSec: 1.25, endSec: 3.5, text: 'First line\nsecond line' },
      { startSec: 4, endSec: 5.125, text: 'Another cue' },
    ]);
  });

  it('sorts cues by time and ignores invalid or empty blocks', () => {
    const source = '2\n00:00:05,000 --> 00:00:06,000\nLater\n\n1\n00:00:01,000 --> 00:00:02,000\nEarlier\n\n3\n00:00:04,000 --> 00:00:03,000\nInvalid';
    expect(parseSrtCaptions(source).map((cue) => cue.text)).toEqual(['Earlier', 'Later']);
  });

  it('supports hour values and a UTF-8 BOM', () => {
    expect(parseSrtCaptions('\uFEFF1\n01:02:03,004 --> 01:02:04,000\nLong form')[0]).toEqual({
      startSec: 3723.004, endSec: 3724, text: 'Long form',
    });
  });

  it('returns an empty list for empty or malformed input', () => {
    expect(parseSrtCaptions('')).toEqual([]);
    expect(parseSrtCaptions('not a subtitle file')).toEqual([]);
  });
});
