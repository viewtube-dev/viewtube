import {
  resolveVaultMediaOperationPlan,
  type VaultMediaOperation,
  type VaultMediaOperationAsset,
} from "./vaultMediaOperations"

export type VaultBatchItemStatus = "queued" | "succeeded" | "failed" | "skipped" | "cancelled"

export interface VaultBatchItemPlan {
  asset: VaultMediaOperationAsset
  status: "queued" | "skipped"
  reason: string | null
}

export interface VaultBatchPlan {
  allowed: boolean
  operation: VaultMediaOperation
  items: VaultBatchItemPlan[]
  reason: string | null
  maxSelection: number
}

export interface VaultBatchItemResult {
  assetId: string
  status: VaultBatchItemStatus
  outputAssetId?: string
  receipt?: string
  error?: string
}

export interface VaultBatchResult {
  operation: VaultMediaOperation
  status: "completed" | "partial" | "failed" | "cancelled"
  results: VaultBatchItemResult[]
  succeeded: number
  failed: number
  skipped: number
  cancelled: number
}

const MAX_BATCH_SELECTION = 50

/**
 * Builds a non-destructive batch plan. Every asset is preflighted independently
 * so one unsupported item does not conceal the other items' actionable results.
 * This is a client-side planner, not an authorization boundary or durable queue.
 */
export const planVaultBatchOperation = (input: {
  operation: VaultMediaOperation
  assets: VaultMediaOperationAsset[]
}): VaultBatchPlan => {
  const ids = input.assets.map((asset) => asset.id)
  if (!ids.length) {
    return { allowed: false, operation: input.operation, items: [], reason: "Select at least one asset.", maxSelection: MAX_BATCH_SELECTION }
  }
  if (ids.some((id) => typeof id !== "string" || !id.trim()) || new Set(ids).size !== ids.length) {
    return { allowed: false, operation: input.operation, items: [], reason: "The selection contains duplicate or missing asset IDs.", maxSelection: MAX_BATCH_SELECTION }
  }
  if (input.assets.length > MAX_BATCH_SELECTION) {
    return { allowed: false, operation: input.operation, items: [], reason: `Select no more than ${MAX_BATCH_SELECTION} assets per batch.`, maxSelection: MAX_BATCH_SELECTION }
  }

  const items = input.assets.map((asset): VaultBatchItemPlan => {
    const preflight = resolveVaultMediaOperationPlan({ operation: input.operation, assets: [asset] })
    return {
      asset,
      status: preflight.allowed ? "queued" : "skipped",
      reason: preflight.reason,
    }
  })
  const eligible = items.some((item) => item.status === "queued")
  return {
    allowed: eligible,
    operation: input.operation,
    items,
    reason: eligible ? null : "No selected assets meet this operation's preflight requirements.",
    maxSelection: MAX_BATCH_SELECTION,
  }
}

/**
 * Executes a validated batch sequentially and reports every item independently.
 * The caller supplies the real processor and remains responsible for registering
 * derivatives, operation receipts and source lineage in canonical services.
 */
export const runVaultBatchOperation = async <T extends { outputAssetId?: string; receipt?: string }>(input: {
  plan: VaultBatchPlan
  execute: (asset: VaultMediaOperationAsset) => Promise<T>
  signal?: AbortSignal
}): Promise<VaultBatchResult> => {
  if (!input.plan.allowed) {
    throw new Error(input.plan.reason || "This Vault batch is not eligible to run.")
  }

  const results: VaultBatchItemResult[] = input.plan.items.map((item) => ({
    assetId: item.asset.id,
    status: item.status === "skipped" ? "skipped" : "queued",
    ...(item.reason ? { error: item.reason } : {}),
  }))

  for (let index = 0; index < input.plan.items.length; index += 1) {
    const item = input.plan.items[index]
    const result = results[index]
    if (item.status === "skipped") continue
    if (input.signal?.aborted) {
      result.status = "cancelled"
      result.error = "Batch cancelled before this asset started."
      continue
    }
    result.status = "queued"
    try {
      const output = await input.execute(item.asset)
      result.status = "succeeded"
      if (output.outputAssetId) result.outputAssetId = output.outputAssetId
      if (output.receipt) result.receipt = output.receipt
    } catch (error) {
      result.status = "failed"
      result.error = error instanceof Error ? error.message : "Asset operation failed."
    }
  }

  const succeeded = results.filter((result) => result.status === "succeeded").length
  const failed = results.filter((result) => result.status === "failed").length
  const skipped = results.filter((result) => result.status === "skipped").length
  const cancelled = results.filter((result) => result.status === "cancelled").length
  const status = cancelled > 0
    ? "cancelled"
    : failed > 0 && succeeded > 0
      ? "partial"
      : failed > 0
        ? "failed"
        : "completed"

  return { operation: input.plan.operation, status, results, succeeded, failed, skipped, cancelled }
}
