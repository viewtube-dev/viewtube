export type NormalizedCropEdges = {
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
};

export type CropRectangle = { x: number; y: number; width: number; height: number };

/** Convert normalized edge crops into a safe source-pixel rectangle. */
export function computeCropRectangle(
  sourceWidth: number,
  sourceHeight: number,
  crop: NormalizedCropEdges,
): CropRectangle | null {
  const values = [sourceWidth, sourceHeight, crop.cropLeft, crop.cropRight, crop.cropTop, crop.cropBottom];
  if (!values.every(Number.isFinite) || sourceWidth < 1 || sourceHeight < 1) return null;
  const edges = [crop.cropLeft, crop.cropRight, crop.cropTop, crop.cropBottom];
  if (edges.some((edge) => edge < 0 || edge > 0.98)) return null;
  if (crop.cropLeft + crop.cropRight > 0.98 || crop.cropTop + crop.cropBottom > 0.98) return null;
  const x = Math.floor(sourceWidth * crop.cropLeft);
  const y = Math.floor(sourceHeight * crop.cropTop);
  const right = Math.ceil(sourceWidth * (1 - crop.cropRight));
  const bottom = Math.ceil(sourceHeight * (1 - crop.cropBottom));
  const width = right - x;
  const height = bottom - y;
  if (width < 1 || height < 1) return null;
  return { x, y, width, height };
}

export function computeCropOutputDimensions(
  rect: CropRectangle,
  targetWidth?: number,
): { width: number; height: number } | null {
  if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width < 1 || rect.height < 1) return null;
  if (targetWidth === undefined) return { width: rect.width, height: rect.height };
  if (!Number.isFinite(targetWidth) || targetWidth < 1 || targetWidth > 8192) return null;
  const width = Math.round(targetWidth);
  const height = Math.max(1, Math.round((rect.height / rect.width) * width));
  return { width, height };
}

/** Export a browser-accessible image URL as a cropped PNG file without changing the source. */
export async function exportCroppedImageAsFile(
  sourceUrl: string,
  crop: NormalizedCropEdges,
  fileName = 'cropped-image.png',
  targetWidth?: number,
): Promise<File | null> {
  if (!sourceUrl || typeof document === 'undefined') return null;
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    let timeout: number | undefined;
    const finish = (file: File | null) => {
      if (settled) return;
      settled = true;
      if (timeout !== undefined) window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      resolve(file);
    };
    image.crossOrigin = 'anonymous';
    image.onerror = () => finish(null);
    image.onload = () => {
      const rect = computeCropRectangle(image.naturalWidth, image.naturalHeight, crop);
      if (!rect) return finish(null);
      const output = computeCropOutputDimensions(rect, targetWidth);
      if (!output) return finish(null);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = output.width;
        canvas.height = output.height;
        const context = canvas.getContext('2d');
        if (!context) return finish(null);
        context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, output.width, output.height);
        canvas.toBlob((blob) => {
          if (!blob) return finish(null);
          try {
            finish(new File([blob], fileName, { type: 'image/png', lastModified: Date.now() }));
          } catch {
            finish(null);
          }
        }, 'image/png');
      } catch {
        finish(null);
      }
    };
    timeout = window.setTimeout(() => finish(null), 15000);
    image.src = sourceUrl;
  });
}
