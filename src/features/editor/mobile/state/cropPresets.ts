export type CropEdges = {
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
};

/**
 * Calculate a centered, non-destructive crop that matches a target aspect ratio.
 * Returns null for invalid dimensions/ratios or when the required crop exceeds
 * the editor's safe combined-edge limit.
 */
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
