import type { VaultAsset } from "../types"

export type VaultMutationKind = "metadata-edit" | "archive" | "trash" | "restore" | "permanent-delete"

const lifecycleOf = (asset: Pick<VaultAsset, "metadata">): string =>
  String(asset.metadata?.lifecycle || "DRAFT").toUpperCase()

export const isVaultAssetProtected = (asset: Pick<VaultAsset, "metadata">): boolean =>
  asset.metadata?.protected === true
  || (lifecycleOf(asset) === "GOLDEN" && asset.metadata?.protected !== false)

/** Local lifecycle guard only; account/workspace authorization must be enforced separately. */
export const canMutateVaultAsset = (
  asset: Pick<VaultAsset, "metadata">,
  mutation: VaultMutationKind,
): boolean => {
  const metadata = asset.metadata || {}
  const lifecycle = lifecycleOf(asset)
  const protectedAsset = isVaultAssetProtected(asset)
  switch (mutation) {
    case "metadata-edit":
      return !metadata.trashedAt && lifecycle !== "TRASHED"
    case "archive":
    case "trash":
      return !protectedAsset && !metadata.trashedAt && lifecycle !== "TRASHED"
    case "restore":
      return Boolean(metadata.archivedAt || metadata.trashedAt || lifecycle === "ARCHIVED" || lifecycle === "TRASHED")
    case "permanent-delete":
      return !protectedAsset && Boolean(metadata.trashedAt || lifecycle === "TRASHED")
    default: {
      const exhaustive: never = mutation
      return exhaustive
    }
  }
}
