export type SourceAwareTrimClip = {
  start: number;
  end: number;
  sourceInSec?: number;
  sourceOutSec?: number;
  sourceDurationSec?: number;
};

export type SourceBoundsPatch = {
  sourceInSec?: number;
  sourceOutSec?: number;
};

/**
 * Preserve the source-time mapping when a media clip's timeline edge is trimmed.
 * This function intentionally only trims within the current clip interval; it
 * does not invent source frames when the timeline edge is dragged outward.
 */
export function trimClipSourceBounds(
  clip: SourceAwareTrimClip,
  side: 'left' | 'right',
  requestedEdge: number,
): SourceBoundsPatch {
  const { start, end } = clip;
  const timelineDuration = end - start;
  const sourceIn = Number.isFinite(clip.sourceInSec) ? Number(clip.sourceInSec) : 0;
  const sourceOutCandidate = Number.isFinite(clip.sourceOutSec)
    ? Number(clip.sourceOutSec)
    : Number.isFinite(clip.sourceDurationSec)
      ? Number(clip.sourceDurationSec)
      : Number.NaN;

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(requestedEdge) ||
    timelineDuration <= 0 ||
    !Number.isFinite(sourceOutCandidate) ||
    sourceOutCandidate <= sourceIn
  ) return {};

  const sourceSpan = sourceOutCandidate - sourceIn;
  const sourcePerTimelineSecond = sourceSpan / timelineDuration;
  if (!Number.isFinite(sourcePerTimelineSecond) || sourcePerTimelineSecond <= 0) return {};

  const edge = Math.max(start, Math.min(end, requestedEdge));
  if (side === 'left') {
    const nextSourceIn = Math.max(0, Math.min(sourceOutCandidate, sourceIn + (edge - start) * sourcePerTimelineSecond));
    return { sourceInSec: nextSourceIn, sourceOutSec: sourceOutCandidate };
  }

  const sourceDuration = Number.isFinite(clip.sourceDurationSec)
    ? Number(clip.sourceDurationSec)
    : sourceOutCandidate;
  const nextSourceOut = Math.max(sourceIn, Math.min(sourceDuration, sourceIn + (edge - start) * sourcePerTimelineSecond));
  return { sourceInSec: sourceIn, sourceOutSec: nextSourceOut };
}
