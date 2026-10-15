import type { VaultAsset, VaultAssetKind } from "@/types"

export type VaultMediaTool = "metadata" | "hash" | "preview" | "thumbnail" | "exif" | "transcribe" | "transcode"
export interface VaultGovernanceRecommendation {
  id: "confirm-rights" | "review-protected-asset" | "add-provenance" | "verify-metadata"
  label: string
  status: "recommended" | "complete" | "blocked"
  reason: string
}

/** Lists only currently wired local capabilities; it does not imply server/worker support. */
export const getVaultMediaToolSupport = (kind: VaultAssetKind): VaultMediaTool[] => {
  const common: VaultMediaTool[] = ["metadata", "hash"]
  if (kind === "image") return [...common, "preview", "exif"]
  if (kind === "video") return [...common, "preview", "thumbnail"]
  if (kind === "audio") return [...common, "preview"]
  return common
}

export const recommendVaultGovernanceActions = (asset: VaultAsset): VaultGovernanceRecommendation[] => {
  const metadata = asset.metadata || {}
  const rights = String(metadata.license || metadata.rightsStatus || "unknown").trim().toLowerCase()
  const actions: VaultGovernanceRecommendation[] = []
  if (!rights || ["unknown", "unset", "unverified"].includes(rights)) actions.push({
    id: "confirm-rights", label: "Confirm usage rights", status: "recommended",
    reason: "No verified rights/license status is recorded. This recommendation is not a legal clearance decision.",
  })
  if (String(metadata.lifecycle || "").toUpperCase() === "GOLDEN" || metadata.protected === true) actions.push({
    id: "review-protected-asset", label: "Review protected asset changes", status: "recommended",
    reason: "Protected content should be reviewed before a change or replacement.",
  })
  if (!metadata.contentHash) actions.push({
    id: "add-provenance", label: "Compute content hash", status: "recommended",
    reason: "A content hash helps compare file identity and detect duplicate candidates.",
  })
  if (!asset.mimeType || !metadata.byteSize) actions.push({
    id: "verify-metadata", label: "Verify file metadata", status: "recommended",
    reason: "MIME type or byte size is missing from the current record.",
  })
  return actions
}
