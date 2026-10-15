export type VaultOperationKind = "archive" | "trash" | "restore" | "favorite" | "tag" | "mark-reviewed"
export type VaultOperationItemStatus = "pending" | "completed" | "failed"
export type VaultOperationReceiptStatus = "cancelled" | "completed" | "partial" | "failed"

export interface VaultOperationPreviewItem {
  assetId: string
  operation: VaultOperationKind
  parameters: Record<string, unknown>
  summary: string
}
export interface VaultOperationPlan {
  id: string
  operation: VaultOperationKind
  parameters: Record<string, unknown>
  createdAt: number
  preview: VaultOperationPreviewItem[]
}
export interface VaultOperationItemReceipt {
  assetId: string
  status: VaultOperationItemStatus
  detail: string
}
export interface VaultOperationReceipt {
  id: string
  planId: string
  operation: VaultOperationKind
  status: VaultOperationReceiptStatus
  createdAt: number
  completedAt: number
  items: VaultOperationItemReceipt[]
}
export type VaultOperationHandler = (input: VaultOperationPreviewItem) => Promise<{ ok: boolean; detail: string }> | { ok: boolean; detail: string }

const newId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  return `vault-op-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const createVaultOperationPlan = (input: {
  operation: VaultOperationKind
  assetIds: string[]
  parameters?: Record<string, unknown>
  now?: number
}): VaultOperationPlan => {
  if (!input.assetIds.length) throw new Error("Select at least one asset before planning an operation.")
  if (new Set(input.assetIds).size !== input.assetIds.length) throw new Error("Duplicate asset IDs are not allowed in one operation plan.")
  if (input.assetIds.some((id) => !id.trim())) throw new Error("Operation plan contains an empty asset ID.")
  const parameters = input.parameters || {}
  const labels: Record<VaultOperationKind, string> = {
    archive: "Archive asset", trash: "Move asset to trash", restore: "Restore asset",
    favorite: "Update favorite state", tag: "Apply tag", "mark-reviewed": "Mark as reviewed",
  }
  return {
    id: newId(), operation: input.operation, parameters, createdAt: input.now ?? Date.now(),
    preview: input.assetIds.map((assetId) => ({
      assetId, operation: input.operation, parameters, summary: labels[input.operation],
    })),
  }
}

export const executeVaultOperationPlan = async (
  plan: VaultOperationPlan,
  handler: VaultOperationHandler,
  options: { confirmed: boolean; now?: number },
): Promise<VaultOperationReceipt> => {
  const createdAt = options.now ?? Date.now()
  if (!options.confirmed) return {
    id: newId(), planId: plan.id, operation: plan.operation, status: "cancelled",
    createdAt, completedAt: createdAt,
    items: plan.preview.map((item) => ({ assetId: item.assetId, status: "pending", detail: "Cancelled before execution; no changes made." })),
  }
  const items: VaultOperationItemReceipt[] = []
  for (const item of plan.preview) {
    try {
      const result = await handler(item)
      items.push({ assetId: item.assetId, status: result.ok ? "completed" : "failed", detail: result.detail })
    } catch (error) {
      items.push({ assetId: item.assetId, status: "failed", detail: error instanceof Error ? error.message : "Operation failed." })
    }
  }
  const completed = items.filter((item) => item.status === "completed").length
  const failed = items.filter((item) => item.status === "failed").length
  const status: VaultOperationReceiptStatus = failed === 0 ? "completed" : completed === 0 ? "failed" : "partial"
  return { id: newId(), planId: plan.id, operation: plan.operation, status, createdAt, completedAt: Date.now(), items }
}
