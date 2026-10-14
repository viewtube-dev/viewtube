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
  const starts = ranges
    .map((range) => range.startSec)
    .filter((start) => Number.isFinite(start) && start >= 0);
  if (!starts.length || starts.length !== ranges.length) return 0;
  const earliestStart = Math.min(...starts);
  return requestedDeltaSec < 0
    ? Math.max(requestedDeltaSec, -earliestStart)
    : requestedDeltaSec;
}
