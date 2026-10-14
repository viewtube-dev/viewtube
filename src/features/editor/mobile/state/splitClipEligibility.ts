export type SplittableClipRange = { start: number; end: number };

/** True only when a finite playhead is safely inside a valid clip interval. */
export function canSplitClipAtPlayhead(
  clip: SplittableClipRange | null | undefined,
  playheadSec: number,
): boolean {
  if (!clip || !Number.isFinite(playheadSec)) return false;
  if (!Number.isFinite(clip.start) || !Number.isFinite(clip.end) || clip.end <= clip.start) return false;
  return playheadSec > clip.start + 0.001 && playheadSec < clip.end - 0.001;
}
