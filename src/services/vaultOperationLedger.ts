export type VaultOperationStatus = "preview" | "queued" | "processing" | "completed" | "failed" | "cancelled"
export type VaultOperationType =
  | "metadata-edit" | "tag-update" | "archive" | "restore" | "image-transform"
  | "video-trim" | "video-proxy" | "video-transcode" | "frame-extract" | "audio-extract"
  | "compare" | "export" | "handoff" | "ai-suggestion"

export interface VaultOperationRecord {
  id: string
  type: VaultOperationType
  label: string
  status: VaultOperationStatus
  inputAssetIds: string[]
  outputAssetIds: string[]
  parameters: Record<string, unknown>
  receipt: string | null
  error: string | null
  createdAt: number
  updatedAt: number
  retryCount: number
}

const STORAGE_KEY = "vt_creator_vault_operations_v1"
const MAX_RECORDS = 200
const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined"

export const listVaultOperations = (): VaultOperationRecord[] => {
  if (!canUseStorage()) return []
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    return Array.isArray(parsed) ? parsed as VaultOperationRecord[] : []
  } catch {
    return []
  }
}

export const getVaultOperation = (id: string): VaultOperationRecord | null =>
  listVaultOperations().find((item) => item.id === id) || null

const persist = (items: VaultOperationRecord[]) => {
  if (canUseStorage()) localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECORDS)))
}

export const createVaultOperation = (input: {
  type: VaultOperationType
  label: string
  inputAssetIds: string[]
  parameters?: Record<string, unknown>
}): VaultOperationRecord => {
  const now = Date.now()
  const operation: VaultOperationRecord = {
    id: crypto.randomUUID(),
    type: input.type,
    label: input.label.trim() || "Vault operation",
    status: "preview",
    inputAssetIds: [...new Set(input.inputAssetIds.filter(Boolean))],
    outputAssetIds: [],
    parameters: { ...(input.parameters || {}) },
    receipt: null,
    error: null,
    createdAt: now,
    updatedAt: now,
    retryCount: 0,
  }
  persist([operation, ...listVaultOperations()])
  return operation
}

const ALLOWED_TRANSITIONS: Record<VaultOperationStatus, VaultOperationStatus[]> = {
  preview: ["queued", "cancelled"],
  queued: ["processing", "cancelled"],
  processing: ["completed", "failed"],
  failed: ["queued"],
  completed: [],
  cancelled: [],
}

export const transitionVaultOperation = (
  id: string,
  status: VaultOperationStatus,
  patch: Partial<Pick<VaultOperationRecord, "outputAssetIds" | "receipt" | "error" | "parameters">> = {},
): VaultOperationRecord | null => {
  const operations = listVaultOperations()
  const current = operations.find((item) => item.id === id)
  if (!current || !ALLOWED_TRANSITIONS[current.status].includes(status)) return null
  const updated: VaultOperationRecord = {
    ...current,
    ...patch,
    status,
    outputAssetIds: patch.outputAssetIds ? [...new Set(patch.outputAssetIds.filter(Boolean))] : current.outputAssetIds,
    parameters: patch.parameters ? { ...patch.parameters } : current.parameters,
    error: status === "failed" ? patch.error || "Operation failed." : status === "queued" || status === "completed" ? null : current.error,
    receipt: patch.receipt ?? current.receipt,
    retryCount: status === "queued" && current.status === "failed" ? current.retryCount + 1 : current.retryCount,
    updatedAt: Date.now(),
  }
  persist(operations.map((item) => item.id === id ? updated : item))
  return updated
}
