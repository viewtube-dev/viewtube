export interface CaptionTimeRange {
  startSec: number;
  endSec: number;
}

/**
 * Resolve one shared timing offset for a caption batch. Negative shifts clamp
 * once against the earliest cue, preserving spacing and overlaps across cues.
 */
export function resolveCaptionShiftDelta(
  ranges: readonly CaptionTimeRange[],
  requestedDeltaSec: number,
): number {
  if (!Number.isFinite(requestedDeltaSec) || requestedDeltaSec === 0 || !ranges.length) return 0;
  if (ranges.some((range) =>
    !Number.isFinite(range.startSec) ||
    !Number.isFinite(range.endSec) ||
    range.startSec < 0 ||
    range.endSec <= range.startSec
  )) return 0;
  const earliestStart = Math.min(...ranges.map((range) => range.startSec));
  return requestedDeltaSec < 0
    ? Math.max(requestedDeltaSec, -earliestStart)
    : requestedDeltaSec;
}
