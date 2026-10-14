import { describe, expect, it } from 'vitest';
import { computeCropOutputDimensions, computeCropRectangle } from './imageCropExport';

describe('computeCropRectangle', () => {
  it('converts normalized edges into source pixels', () => {
    expect(computeCropRectangle(1920, 1080, {
      cropLeft: 0.1, cropRight: 0.1, cropTop: 0.05, cropBottom: 0.05,
    })).toEqual({ x: 192, y: 54, width: 1536, height: 972 });
  });

  it('returns the full source when crop edges are zero', () => {
    expect(computeCropRectangle(1600, 900, {
      cropLeft: 0, cropRight: 0, cropTop: 0, cropBottom: 0,
    })).toEqual({ x: 0, y: 0, width: 1600, height: 900 });
  });

  it('resizes the crop output while preserving its aspect ratio', () => {
    const rect = { x: 192, y: 54, width: 1536, height: 972 };
    expect(computeCropOutputDimensions(rect)).toEqual({ width: 1536, height: 972 });
    expect(computeCropOutputDimensions(rect, 1080)).toEqual({ width: 1080, height: 683 });
    expect(computeCropOutputDimensions(rect, 720)).toEqual({ width: 720, height: 456 });
  });

  it('rejects invalid or excessively large output widths', () => {
    const rect = { x: 0, y: 0, width: 100, height: 50 };
    expect(computeCropOutputDimensions(rect, 0)).toBeNull();
    expect(computeCropOutputDimensions(rect, 9000)).toBeNull();
    expect(computeCropOutputDimensions({ ...rect, width: 0 }, 720)).toBeNull();
  });

  it('rejects invalid dimensions and crop edges outside the safe range', () => {
    const noCrop = { cropLeft: 0, cropRight: 0, cropTop: 0, cropBottom: 0 };
    expect(computeCropRectangle(0, 900, noCrop)).toBeNull();
    expect(computeCropRectangle(1600, Number.NaN, noCrop)).toBeNull();
    expect(computeCropRectangle(1600, 900, { ...noCrop, cropLeft: -0.1 })).toBeNull();
    expect(computeCropRectangle(1600, 900, { ...noCrop, cropLeft: 0.7, cropRight: 0.4 })).toBeNull();
  });
});
