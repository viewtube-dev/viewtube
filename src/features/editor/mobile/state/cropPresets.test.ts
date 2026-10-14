import { describe, expect, it } from 'vitest';
import { cropToAspectRatio, cropToAspectRatioAtFocalPoint } from './cropPresets';

describe('cropToAspectRatio', () => {
  it('crops a landscape source horizontally to a portrait target', () => {
    const crop = cropToAspectRatio(1920, 1080, 9 / 16);
    expect(crop).not.toBeNull();
    expect(crop?.cropLeft).toBeCloseTo(0.341796875, 8);
    expect(crop?.cropRight).toBeCloseTo(0.341796875, 8);
    expect(crop?.cropTop).toBe(0);
    expect(crop?.cropBottom).toBe(0);
  });

  it('crops a portrait source vertically to a landscape target', () => {
    const crop = cropToAspectRatio(1080, 1920, 16 / 9);
    expect(crop).not.toBeNull();
    expect(crop?.cropTop).toBeCloseTo(0.341796875, 8);
    expect(crop?.cropBottom).toBeCloseTo(0.341796875, 8);
    expect(crop?.cropLeft).toBe(0);
    expect(crop?.cropRight).toBe(0);
  });

  it('moves a landscape crop toward a right-side focal point', () => {
    const crop = cropToAspectRatioAtFocalPoint(1920, 1080, 9 / 16, 0.9, 0.5);
    expect(crop).not.toBeNull();
    expect(crop!.cropLeft).toBeGreaterThan(crop!.cropRight);
    expect(crop!.cropLeft + crop!.cropRight).toBeCloseTo(1 - (9 / 16) / (16 / 9), 8);
  });

  it('moves a landscape crop toward a left-side focal point', () => {
    const crop = cropToAspectRatioAtFocalPoint(1920, 1080, 9 / 16, 0.1, 0.5);
    expect(crop).not.toBeNull();
    expect(crop!.cropRight).toBeGreaterThan(crop!.cropLeft);
  });

  it('moves a portrait-source crop toward a lower focal point', () => {
    const crop = cropToAspectRatioAtFocalPoint(1080, 1920, 16 / 9, 0.5, 0.9);
    expect(crop).not.toBeNull();
    expect(crop!.cropTop).toBeGreaterThan(crop!.cropBottom);
  });

  it('rejects invalid focal points and preserves no-crop ratios', () => {
    expect(cropToAspectRatioAtFocalPoint(1920, 1080, 9 / 16, Number.NaN, 0.5)).toBeNull();
    expect(cropToAspectRatioAtFocalPoint(1920, 1080, 9 / 16, 0.5, 1.1)).toBeNull();
    expect(cropToAspectRatioAtFocalPoint(1600, 900, 16 / 9, 0.9, 0.1)).toEqual({
      cropLeft: 0, cropRight: 0, cropTop: 0, cropBottom: 0,
    });
  });

  it('returns no crop when source and target ratios match', () => {
    expect(cropToAspectRatio(1600, 900, 16 / 9)).toEqual({
      cropLeft: 0, cropRight: 0, cropTop: 0, cropBottom: 0,
    });
  });

  it('rejects invalid dimensions, ratios, and crops that exceed safe edge limits', () => {
    expect(cropToAspectRatio(0, 900, 16 / 9)).toBeNull();
    expect(cropToAspectRatio(1600, Number.NaN, 16 / 9)).toBeNull();
    expect(cropToAspectRatio(1600, 900, 0)).toBeNull();
    expect(cropToAspectRatio(10000, 1, 9 / 16)).toBeNull();
  });
});
