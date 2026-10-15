export type VaultImageOutputFormat = "image/png" | "image/jpeg" | "image/webp"

export interface VaultImageCrop {
  x: number
  y: number
  width: number
  height: number
}

export interface VaultImageTransform {
  crop: VaultImageCrop | null
  rotation: number
  flipHorizontal: boolean
  flipVertical: boolean
  resizeWidth: number | null
  resizeHeight: number | null
  preserveAspectRatio: boolean
  outputFormat: VaultImageOutputFormat
  quality: number
  brightness?: number
  contrast?: number
  saturation?: number
}

export interface VaultImageDimensions {
  width: number
  height: number
}

export interface VaultImageTransformResult {
  blob: Blob
  width: number
  height: number
  mimeType: VaultImageOutputFormat
  byteSize: number
}

const SUPPORTED_OUTPUT_FORMATS: VaultImageOutputFormat[] = ["image/png", "image/jpeg", "image/webp"]
const MAX_DIMENSION = 16384

const positiveInteger = (value: number, fallback: number, maximum = MAX_DIMENSION): number => {
  if (!Number.isFinite(value) || value <= 0) return fallback
  return Math.max(1, Math.min(maximum, Math.round(value)))
}

const normalizeRotation = (rotation: number): number => {
  const normalized = ((Math.round((Number.isFinite(rotation) ? rotation : 0) / 90) * 90) % 360 + 360) % 360
  return normalized
}

export const resolveVaultImageOutputDimensions = (
  sourceWidth: number,
  sourceHeight: number,
  options: Pick<VaultImageTransform, "resizeWidth" | "resizeHeight" | "preserveAspectRatio">,
): VaultImageDimensions => {
  const width = positiveInteger(sourceWidth, 1)
  const height = positiveInteger(sourceHeight, 1)
  const requestedWidth = options.resizeWidth == null ? null : positiveInteger(options.resizeWidth, width)
  const requestedHeight = options.resizeHeight == null ? null : positiveInteger(options.resizeHeight, height)

  if (requestedWidth == null && requestedHeight == null) return { width, height }
  if (!options.preserveAspectRatio) {
    return {
      width: requestedWidth ?? width,
      height: requestedHeight ?? height,
    }
  }

  const ratio = width / height
  if (requestedWidth != null && requestedHeight != null) {
    const scale = Math.min(requestedWidth / width, requestedHeight / height)
    return {
      width: positiveInteger(width * scale, 1),
      height: positiveInteger(height * scale, 1),
    }
  }
  if (requestedWidth != null) {
    return { width: requestedWidth, height: positiveInteger(requestedWidth / ratio, 1) }
  }
  return { width: positiveInteger((requestedHeight as number) * ratio, 1), height: requestedHeight as number }
}

export const normalizeVaultImageTransform = (
  transform: VaultImageTransform,
  sourceWidth: number,
  sourceHeight: number,
): VaultImageTransform => {
  const width = positiveInteger(sourceWidth, 1)
  const height = positiveInteger(sourceHeight, 1)
  const crop = transform.crop
    ? (() => {
        const x = Math.max(0, Math.min(width - 1, Math.round(Number.isFinite(transform.crop?.x) ? transform.crop.x : 0)))
        const y = Math.max(0, Math.min(height - 1, Math.round(Number.isFinite(transform.crop?.y) ? transform.crop.y : 0)))
        return {
          x,
          y,
          width: Math.max(1, Math.min(width - x, Math.round(Number.isFinite(transform.crop?.width) ? transform.crop.width : width))),
          height: Math.max(1, Math.min(height - y, Math.round(Number.isFinite(transform.crop?.height) ? transform.crop.height : height))),
        }
      })()
    : null

  const outputFormat = SUPPORTED_OUTPUT_FORMATS.includes(transform.outputFormat)
    ? transform.outputFormat
    : "image/png"

  return {
    crop,
    rotation: normalizeRotation(transform.rotation),
    flipHorizontal: Boolean(transform.flipHorizontal),
    flipVertical: Boolean(transform.flipVertical),
    resizeWidth: transform.resizeWidth == null || !Number.isFinite(transform.resizeWidth) || transform.resizeWidth <= 0
      ? null
      : positiveInteger(transform.resizeWidth, width),
    resizeHeight: transform.resizeHeight == null || !Number.isFinite(transform.resizeHeight) || transform.resizeHeight <= 0
      ? null
      : positiveInteger(transform.resizeHeight, height),
    preserveAspectRatio: transform.preserveAspectRatio !== false,
    outputFormat,
    quality: Math.max(0.1, Math.min(1, Number.isFinite(transform.quality) ? transform.quality : 0.92)),
    brightness: Math.max(-100, Math.min(100, Number.isFinite(transform.brightness) ? transform.brightness as number : 0)),
    contrast: Math.max(-100, Math.min(100, Number.isFinite(transform.contrast) ? transform.contrast as number : 0)),
    saturation: Math.max(-100, Math.min(100, Number.isFinite(transform.saturation) ? transform.saturation as number : 0)),
  }
}

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: VaultImageOutputFormat, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("The browser could not encode this image format."))
    }, mimeType, quality)
  })

const createCanvas = (width: number, height: number): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } => {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas rendering is unavailable in this browser.")
  return { canvas, context }
}

/** Performs an actual browser Canvas transformation and returns encoded image bytes. */
export const transformVaultImage = async (
  source: Blob,
  requestedTransform: VaultImageTransform,
): Promise<VaultImageTransformResult> => {
  if (typeof document === "undefined") throw new Error("Image editing requires a browser environment.")
  if (!source.type.startsWith("image/")) throw new Error("Select a supported image asset before editing.")

  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await createImageBitmap(source)
    const transform = normalizeVaultImageTransform(requestedTransform, bitmap.width, bitmap.height)
    const crop = transform.crop || { x: 0, y: 0, width: bitmap.width, height: bitmap.height }
    const cropped = createCanvas(crop.width, crop.height)
    cropped.context.filter = `brightness(${100 + (transform.brightness || 0)}%) contrast(${100 + (transform.contrast || 0)}%) saturate(${100 + (transform.saturation || 0)}%)`
    cropped.context.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

    const swapsAxes = transform.rotation === 90 || transform.rotation === 270
    const rotatedWidth = swapsAxes ? crop.height : crop.width
    const rotatedHeight = swapsAxes ? crop.width : crop.height
    const rotated = createCanvas(rotatedWidth, rotatedHeight)
    rotated.context.translate(rotatedWidth / 2, rotatedHeight / 2)
    rotated.context.rotate((transform.rotation * Math.PI) / 180)
    rotated.context.scale(transform.flipHorizontal ? -1 : 1, transform.flipVertical ? -1 : 1)
    rotated.context.drawImage(cropped.canvas, -crop.width / 2, -crop.height / 2)

    const dimensions = resolveVaultImageOutputDimensions(rotatedWidth, rotatedHeight, {
      resizeWidth: transform.resizeWidth,
      resizeHeight: transform.resizeHeight,
      preserveAspectRatio: transform.preserveAspectRatio,
    })
    const output = createCanvas(dimensions.width, dimensions.height)
    output.context.drawImage(rotated.canvas, 0, 0, dimensions.width, dimensions.height)
    const blob = await canvasToBlob(output.canvas, transform.outputFormat, transform.quality)
    return {
      blob,
      width: dimensions.width,
      height: dimensions.height,
      mimeType: transform.outputFormat,
      byteSize: blob.size,
    }
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("The image could not be decoded or transformed.")
  } finally {
    bitmap?.close()
  }
}

export const DEFAULT_VAULT_IMAGE_TRANSFORM: VaultImageTransform = {
  crop: null,
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  resizeWidth: null,
  resizeHeight: null,
  preserveAspectRatio: true,
  outputFormat: "image/png",
  quality: 0.92,
  brightness: 0,
  contrast: 0,
  saturation: 0,
}
