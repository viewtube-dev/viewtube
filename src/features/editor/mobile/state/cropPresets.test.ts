import { describe, expect, it } from 'vitest';
import { cropToAspectRatio } from './cropPresets';

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
