import { listVaultAssets, setVaultAssetState, updateVaultAsset } from "./vaultAdapter"
import { createVaultOperationPlan, executeVaultOperationPlan, type VaultOperationKind, type VaultOperationReceipt } from "./vaultOperationPipeline"
import { recordVaultOperationReceipt } from "./vaultOperationHistory"

export const executeVaultBatchOperation = async (input: {
  operation: VaultOperationKind
  assetIds: string[]
  parameters?: Record<string, unknown>
  confirmed: boolean
}): Promise<VaultOperationReceipt> => {
  const plan = createVaultOperationPlan(input)
  const receipt = await executeVaultOperationPlan(plan, ({ assetId, operation, parameters }) => {
    const asset = listVaultAssets().find((item) => item.id === assetId)
    if (!asset) return { ok: false, detail: "Asset not found; no change made." }
    let updated = null
    if (operation === "archive") updated = setVaultAssetState(assetId, { archived: true })
    else if (operation === "trash") updated = setVaultAssetState(assetId, { trashed: true })
    else if (operation === "restore") updated = setVaultAssetState(assetId, { archived: false, trashed: false })
    else if (operation === "favorite") {
      if (typeof parameters.favorite !== "boolean") return { ok: false, detail: "Favorite operation requires a boolean favorite parameter." }
      updated = updateVaultAsset(assetId, { metadata: { ...(asset.metadata || {}), favorite: parameters.favorite } })
    } else if (operation === "tag") {
      const tag = String(parameters.tag || "").trim()
      if (!tag) return { ok: false, detail: "Tag operation requires a non-empty tag." }
      const tags = asset.tags || []
      updated = updateVaultAsset(assetId, { tags: tags.some((item) => item.toLowerCase() === tag.toLowerCase()) ? tags : [...tags, tag] })
    } else if (operation === "mark-reviewed") {
      updated = updateVaultAsset(assetId, { metadata: { ...(asset.metadata || {}), needsAttention: false, reviewedAt: Date.now() } })
    }
    return updated
      ? { ok: true, detail: `${operation} completed.` }
      : { ok: false, detail: `${operation} was rejected by the local Vault lifecycle policy or asset adapter.` }
  }, { confirmed: input.confirmed })
  recordVaultOperationReceipt(receipt)
  return receipt
}
