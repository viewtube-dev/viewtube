import type { VaultAsset } from "../types"

export type VaultAssetDeepLinkResolution =
 | { status: "none" }
 | { status: "asset-not-found"; assetId: string }
 | { status: "build-not-found"; assetId: string; contentBuildId: string }
 | { status: "scope-mismatch"; assetId: string; contentBuildId: string }
 | { status: "resolved"; assetId: string; contentBuildId: string | null }

export const buildVaultAssetHref = (assetId: string, contentBuildId: string): string => {
 const params = new URLSearchParams({ assetId, contentBuildId })
 return `/vault?${params.toString()}`
}

/**
 * Resolve a Brain result deep link against both canonical owners:
 * the Vault asset inventory and, when supplied, the matching ContentBuild.
 * Query parameters are navigation requests, never proof that an asset exists.
 */
export const resolveVaultAssetDeepLink = (input: {
 search: string
 assets: Pick<VaultAsset, "id">[]
 getBuildAssetIds: (contentBuildId: string) => string[] | null
}): VaultAssetDeepLinkResolution => {
 const params = new URLSearchParams(input.search)
 const assetId = params.get("assetId")?.trim()
 if (!assetId) return { status: "none" }

 const contentBuildId = params.get("contentBuildId")?.trim() || null
 if (!input.assets.some((asset) => asset.id === assetId)) {
  return { status: "asset-not-found", assetId }
 }
 if (!contentBuildId) return { status: "resolved", assetId, contentBuildId: null }

 const buildAssetIds = input.getBuildAssetIds(contentBuildId)
 if (!buildAssetIds) return { status: "build-not-found", assetId, contentBuildId }
 if (!buildAssetIds.includes(assetId)) return { status: "scope-mismatch", assetId, contentBuildId }
 return { status: "resolved", assetId, contentBuildId }
}
