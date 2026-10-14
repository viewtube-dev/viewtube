import { describe, expect, it } from 'vitest';
import { buildWaveformPeaks } from './audioWaveform';

describe('buildWaveformPeaks', () => {
  it('reduces channel samples into normalized peak bins', () => {
    const left = new Float32Array([0, 0.2, -0.7, 0, 0.1, 0]);
    const right = new Float32Array([0.1, 0, 0, 0.4, 0, 1.4]);
    expect(buildWaveformPeaks([left, right], 3)).toEqual([0.2, 0.7, 1]);
  });

  it('returns empty output for empty channels or invalid bin count', () => {
    expect(buildWaveformPeaks([], 16)).toEqual([]);
    expect(buildWaveformPeaks([new Float32Array()], 16)).toEqual([]);
    expect(buildWaveformPeaks([new Float32Array([1])], 0)).toEqual([]);
  });

  it('caps output size and ignores non-finite samples', () => {
    const peaks = buildWaveformPeaks([new Float32Array([Number.NaN, Number.POSITIVE_INFINITY, -0.5])], 1000);
    expect(peaks).toHaveLength(512);
    expect(peaks.every((value) => value >= 0 && value <= 1)).toBe(true);
  });
});
