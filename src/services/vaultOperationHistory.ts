import type { VaultOperationReceipt } from "./vaultOperationPipeline"

const STORAGE_KEY = "vt_creator_vault_operation_history_v1"
const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined"

export const listVaultOperationHistory = (): VaultOperationReceipt[] => {
  if (!canUseStorage()) return []
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    return Array.isArray(parsed) ? parsed as VaultOperationReceipt[] : []
  } catch {
    return []
  }
}

export const recordVaultOperationReceipt = (receipt: VaultOperationReceipt): void => {
  if (!canUseStorage()) return
  const history = listVaultOperationHistory()
  if (history.some((item) => item.id === receipt.id)) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify([receipt, ...history].slice(0, 250)))
}
