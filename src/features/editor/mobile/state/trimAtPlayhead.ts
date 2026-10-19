export type TimelineClipRange = { start: number; end: number };

/** Only allow trim-to-playhead when a safe minimum duration remains on both sides. */
export function canTrimEdgeToPlayhead(
  clip: TimelineClipRange | null | undefined,
  playheadSec: number,
  minimumRemainingSec = 0.1,
): boolean {
  if (!clip || !Number.isFinite(playheadSec) || !Number.isFinite(clip.start) || !Number.isFinite(clip.end)) return false;
  if (!Number.isFinite(minimumRemainingSec) || minimumRemainingSec <= 0 || clip.end - clip.start <= minimumRemainingSec * 2) return false;
  return playheadSec > clip.start + minimumRemainingSec / 2
    && playheadSec < clip.end - minimumRemainingSec / 2;
}
