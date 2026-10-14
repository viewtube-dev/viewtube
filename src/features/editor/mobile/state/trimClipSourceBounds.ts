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

/** Preserve source-time mapping when a media clip edge is trimmed inward. */
export function trimClipSourceBounds(
  clip: SourceAwareTrimClip,
  side: 'left' | 'right',
  requestedEdge: number,
): SourceBoundsPatch {
  const { start, end } = clip;
  const timelineDuration = end - start;
  const sourceIn = Number.isFinite(clip.sourceInSec) ? Number(clip.sourceInSec) : 0;
  const sourceOut = Number.isFinite(clip.sourceOutSec)
    ? Number(clip.sourceOutSec)
    : Number.isFinite(clip.sourceDurationSec)
      ? Number(clip.sourceDurationSec)
      : Number.NaN;

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(requestedEdge) ||
    timelineDuration <= 0 ||
    !Number.isFinite(sourceOut) ||
    sourceOut <= sourceIn
  ) return {};

  const sourcePerTimelineSecond = (sourceOut - sourceIn) / timelineDuration;
  if (!Number.isFinite(sourcePerTimelineSecond) || sourcePerTimelineSecond <= 0) return {};

  const edge = Math.max(start, Math.min(end, requestedEdge));
  if (side === 'left') {
    const nextSourceIn = Math.max(0, Math.min(sourceOut, sourceIn + (edge - start) * sourcePerTimelineSecond));
    return { sourceInSec: nextSourceIn, sourceOutSec: sourceOut };
  }

  const sourceDuration = Number.isFinite(clip.sourceDurationSec) ? Number(clip.sourceDurationSec) : sourceOut;
  const nextSourceOut = Math.max(sourceIn, Math.min(sourceDuration, sourceIn + (edge - start) * sourcePerTimelineSecond));
  return { sourceInSec: sourceIn, sourceOutSec: nextSourceOut };
}
