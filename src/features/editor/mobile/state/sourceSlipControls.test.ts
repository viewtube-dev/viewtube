import { describe, expect, it } from 'vitest';
import { canSlipSourceWindow, SOURCE_SLIP_STEPS } from './sourceSlipControls';

describe('source slip controls', () => {
  it('uses fine 0.1-second controls plus one-second steps', () => {
    expect(SOURCE_SLIP_STEPS.map((step) => step.deltaSec)).toEqual([-1, -0.1, 0.1, 1]);
  });

  it('allows a source shift when the complete source window remains in bounds', () => {
    expect(canSlipSourceWindow(2, 5, 10, -1)).toBe(true);
    expect(canSlipSourceWindow(2, 5, 10, -0.1)).toBe(true);
    expect(canSlipSourceWindow(2, 5, 10, 0.1)).toBe(true);
    expect(canSlipSourceWindow(2, 5, 10, 1)).toBe(true);
  });

  it('disables each shift that would cross a source boundary', () => {
    expect(canSlipSourceWindow(0, 3, 10, -0.1)).toBe(false);
    expect(canSlipSourceWindow(0, 3, 10, -1)).toBe(false);
    expect(canSlipSourceWindow(7, 10, 10, 0.1)).toBe(false);
    expect(canSlipSourceWindow(7, 10, 10, 1)).toBe(false);
    expect(canSlipSourceWindow(0.5, 3.5, 10, -1)).toBe(false);
    expect(canSlipSourceWindow(6.5, 9.5, 10, 1)).toBe(false);
  });

  it('rejects invalid or out-of-range source windows', () => {
    expect(canSlipSourceWindow(Number.NaN, 3, 10, 0.1)).toBe(false);
    expect(canSlipSourceWindow(2, Number.POSITIVE_INFINITY, 10, 0.1)).toBe(false);
    expect(canSlipSourceWindow(2, 5, 0, 0.1)).toBe(false);
    expect(canSlipSourceWindow(-1, 2, 10, 0.1)).toBe(false);
    expect(canSlipSourceWindow(2, 11, 10, -0.1)).toBe(false);
  });
});
