import type { VaultAsset } from "@/types"
import { getVaultAttentionReasons } from "./vaultAttention"
import { isVaultAssetProtected } from "./vaultMutationPolicy"

export type VaultMaintenanceReason =
  | "Unassigned to a project"
  | "No tags"
  | "Flagged for review"
  | "Missing preview"
  | "Missing content hash"
  | "Duplicate content hash"
  | "Unknown rights status"

export interface VaultMaintenanceItem {
  assetId: string
  assetName: string
  reasons: VaultMaintenanceReason[]
  protected: boolean
  recommendedActions: Array<"assign-project" | "tag" | "review" | "generate-preview" | "compute-hash" | "resolve-duplicate" | "confirm-rights">
  updatedAt: number
}

const normalizeHash = (asset: VaultAsset): string =>
  String(asset.metadata?.contentHash || "").trim().toLowerCase()

export const buildVaultMaintenanceQueue = (assets: VaultAsset[]): VaultMaintenanceItem[] => {
  const hashCounts = new Map<string, number>()
  for (const asset of assets) {
    const hash = normalizeHash(asset)
    if (hash) hashCounts.set(hash, (hashCounts.get(hash) || 0) + 1)
  }

  return assets.map((asset) => {
    const metadata = asset.metadata || {}
    const reasons: VaultMaintenanceReason[] = []
    for (const reason of getVaultAttentionReasons(asset)) {
      if (reason === "Unassigned to a project" || reason === "No tags" || reason === "Flagged for review") reasons.push(reason)
      else if (metadata.needsAttention === true && reason.trim()) reasons.push("Flagged for review")
    }
    if (!asset.previewUrl) reasons.push("Missing preview")
    const hash = normalizeHash(asset)
    if (!hash) reasons.push("Missing content hash")
    else if ((hashCounts.get(hash) || 0) > 1) reasons.push("Duplicate content hash")
    const rights = String(metadata.license || metadata.rightsStatus || "unknown").trim().toLowerCase()
    if (!rights || rights === "unknown" || rights === "unset" || rights === "unverified") reasons.push("Unknown rights status")

    const uniqueReasons = [...new Set(reasons)]
    const protectedAsset = isVaultAssetProtected(asset)
    const recommendedActions: VaultMaintenanceItem["recommendedActions"] = []
    if (uniqueReasons.includes("Unassigned to a project")) recommendedActions.push("assign-project")
    if (uniqueReasons.includes("No tags")) recommendedActions.push("tag")
    if (uniqueReasons.includes("Flagged for review")) recommendedActions.push("review")
    if (uniqueReasons.includes("Missing preview")) recommendedActions.push("generate-preview")
    if (uniqueReasons.includes("Missing content hash")) recommendedActions.push("compute-hash")
    if (uniqueReasons.includes("Duplicate content hash")) recommendedActions.push("resolve-duplicate")
    if (uniqueReasons.includes("Unknown rights status")) recommendedActions.push("confirm-rights")
    // Protected assets remain visible in the queue; this service never recommends deletion.
    return { assetId: asset.id, assetName: asset.name, reasons: uniqueReasons, protected: protectedAsset, recommendedActions, updatedAt: asset.updatedAt }
  }).filter((item) => item.reasons.length > 0)
}
