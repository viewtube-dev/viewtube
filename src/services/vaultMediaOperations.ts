export type VaultMediaOperation = "image-transform" | "video-trim" | "video-proxy" | "video-transcode" | "frame-extract" | "audio-extract"
export type VaultMediaOperationAsset = {
  id: string
  kind: string
  byteSize: number | null
  protected: boolean
}
export type VaultMediaOperationPlan = {
  allowed: boolean
  operation: VaultMediaOperation
  assetIds: string[]
  outputStrategy: "create-derivatives"
  reason: string | null
  maxSourceBytes: number
  maxSelection: number
}

const MAX_SOURCE_BYTES = 64 * 1024 * 1024
const MAX_SELECTION = 50
const EXPECTED_KIND: Record<VaultMediaOperation, string> = {
  "image-transform": "image",
  "video-trim": "video",
  "video-proxy": "video",
  "video-transcode": "video",
  "frame-extract": "video",
  "audio-extract": "video",
}

export const resolveVaultMediaOperationPlan = (input: {
  operation: VaultMediaOperation
  assets: VaultMediaOperationAsset[]
  overwriteSource?: boolean
}): VaultMediaOperationPlan => {
  const assetIds = [...new Set(input.assets.map((asset) => asset.id).filter(Boolean))]
  let reason: string | null = null
  if (!assetIds.length) reason = "Select at least one asset."
  else if (assetIds.length !== input.assets.length) reason = "The selection contains duplicate or missing asset IDs."
  else if (assetIds.length > MAX_SELECTION) reason = `Select no more than ${MAX_SELECTION} assets per operation.`
  else if (input.assets.some((asset) => asset.protected) && input.overwriteSource) reason = "protected assets cannot be overwritten; unlock is required before destructive changes."
  else if (input.overwriteSource) reason = "Vault media operations are non-destructive and always create derivatives."
  else if (input.assets.some((asset) => asset.kind !== EXPECTED_KIND[input.operation])) reason = `This operation requires ${EXPECTED_KIND[input.operation]} assets only.`
  else if (input.assets.some((asset) => asset.byteSize != null && asset.byteSize > MAX_SOURCE_BYTES)) reason = "Source files over 64 MB must be reduced or imported through a supported durable-processing path."
  return {
    allowed: reason === null,
    operation: input.operation,
    assetIds,
    outputStrategy: "create-derivatives",
    reason,
    maxSourceBytes: MAX_SOURCE_BYTES,
    maxSelection: MAX_SELECTION,
  }
}
