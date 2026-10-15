import type { VaultAsset } from "@/types"

export interface VaultAssetDifference {
  field: string
  left: unknown
  right: unknown
}
export interface VaultAssetComparison {
  leftId: string
  rightId: string
  identicalContentHash: boolean
  differences: VaultAssetDifference[]
}

const comparableFields: Array<{ label: string; get: (asset: VaultAsset) => unknown }> = [
  { label: "name", get: (asset) => asset.name },
  { label: "kind", get: (asset) => asset.kind },
  { label: "source", get: (asset) => asset.source },
  { label: "mimeType", get: (asset) => asset.mimeType },
  { label: "projectId", get: (asset) => asset.projectId },
  { label: "projectName", get: (asset) => asset.projectName },
  { label: "tags", get: (asset) => [...(asset.tags || [])].sort() },
  { label: "metadata.contentHash", get: (asset) => asset.metadata?.contentHash || null },
  { label: "metadata.lifecycle", get: (asset) => asset.metadata?.lifecycle || null },
  { label: "metadata.license", get: (asset) => asset.metadata?.license || asset.metadata?.rightsStatus || null },
  { label: "createdAt", get: (asset) => asset.createdAt },
  { label: "updatedAt", get: (asset) => asset.updatedAt },
]
const stable = (value: unknown): string => JSON.stringify(value ?? null)
const normalizedHash = (asset: VaultAsset): string => String(asset.metadata?.contentHash || "").trim().toLowerCase()

export const compareVaultAssets = (left: VaultAsset, right: VaultAsset): VaultAssetComparison => ({
  leftId: left.id,
  rightId: right.id,
  identicalContentHash: Boolean(normalizedHash(left) && normalizedHash(left) === normalizedHash(right)),
  differences: comparableFields.flatMap(({ label, get }) => {
    const a = get(left), b = get(right)
    return stable(a) === stable(b) ? [] : [{ field: label, left: a, right: b }]
  }),
})

export interface VaultDuplicateCandidateGroup {
  contentHash: string
  assetIds: string[]
  suggestedCanonicalId: string
}
export const groupVaultDuplicateCandidates = (assets: VaultAsset[]): VaultDuplicateCandidateGroup[] => {
  const groups = new Map<string, VaultAsset[]>()
  for (const asset of assets) {
    const hash = normalizedHash(asset)
    if (!hash) continue
    groups.set(hash, [...(groups.get(hash) || []), asset])
  }
  return [...groups.entries()]
    .filter(([, members]) => members.length > 1)
    .map(([contentHash, members]) => {
      const ordered = [...members].sort((a, b) => a.id.localeCompare(b.id))
      return { contentHash, assetIds: ordered.map((asset) => asset.id), suggestedCanonicalId: ordered[0].id }
    })
    .sort((a, b) => a.contentHash.localeCompare(b.contentHash))
}
