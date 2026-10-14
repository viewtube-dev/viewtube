export type CropEdges = {
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
};

/** Calculate a centered, non-destructive crop matching a target aspect ratio. */
export function cropToAspectRatio(
  sourceWidth: number,
  sourceHeight: number,
  targetAspectRatio: number,
): CropEdges | null {
  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    !Number.isFinite(targetAspectRatio) ||
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    targetAspectRatio <= 0
  ) return null;

  const sourceAspectRatio = sourceWidth / sourceHeight;
  if (!Number.isFinite(sourceAspectRatio) || sourceAspectRatio <= 0) return null;
  if (Math.abs(sourceAspectRatio - targetAspectRatio) < 1e-9) {
    return { cropLeft: 0, cropRight: 0, cropTop: 0, cropBottom: 0 };
  }

  if (sourceAspectRatio > targetAspectRatio) {
    const totalCrop = 1 - targetAspectRatio / sourceAspectRatio;
    if (!Number.isFinite(totalCrop) || totalCrop < 0 || totalCrop > 0.98) return null;
    const edge = totalCrop / 2;
    return { cropLeft: edge, cropRight: edge, cropTop: 0, cropBottom: 0 };
  }

  const totalCrop = 1 - sourceAspectRatio / targetAspectRatio;
  if (!Number.isFinite(totalCrop) || totalCrop < 0 || totalCrop > 0.98) return null;
  const edge = totalCrop / 2;
  return { cropLeft: 0, cropRight: 0, cropTop: edge, cropBottom: edge };
}

/**
 * Calculate a centered-aspect crop positioned around a normalized focal point.
 * The focal point is kept inside the crop when possible; near the edges the
 * crop window clamps to the source bounds instead of exposing empty space.
 */
export function cropToAspectRatioAtFocalPoint(
  sourceWidth: number,
  sourceHeight: number,
  targetAspectRatio: number,
  focalX: number,
  focalY: number,
): CropEdges | null {
  if (
    !Number.isFinite(focalX) ||
    !Number.isFinite(focalY) ||
    focalX < 0 || focalX > 1 ||
    focalY < 0 || focalY > 1
  ) return null;

  const centered = cropToAspectRatio(sourceWidth, sourceHeight, targetAspectRatio);
  if (!centered) return null;

  const horizontalCrop = centered.cropLeft + centered.cropRight;
  if (horizontalCrop > 0) {
    const retainedWidth = 1 - horizontalCrop;
    const left = Math.min(horizontalCrop, Math.max(0, focalX - retainedWidth / 2));
    return {
      cropLeft: left,
      cropRight: horizontalCrop - left,
      cropTop: 0,
      cropBottom: 0,
    };
  }

  const verticalCrop = centered.cropTop + centered.cropBottom;
  if (verticalCrop > 0) {
    const retainedHeight = 1 - verticalCrop;
    const top = Math.min(verticalCrop, Math.max(0, focalY - retainedHeight / 2));
    return {
      cropLeft: 0,
      cropRight: 0,
      cropTop: top,
      cropBottom: verticalCrop - top,
    };
  }

  return centered;
}
