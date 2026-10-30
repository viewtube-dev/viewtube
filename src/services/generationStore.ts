import type { GenerationRecord, GenerationStatus } from "@/types"

const GENERATION_STORAGE_KEY = "vt_supertool_generations_v1"
export const GENERATION_RECORDS_CHANGED = "vt_generation_records_changed"

const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined"

const readRecords = (): GenerationRecord[] => {
 if (!canUseStorage()) return []
 try {
  const raw = localStorage.getItem(GENERATION_STORAGE_KEY)
  const parsed = raw ? JSON.parse(raw) : []
  return Array.isArray(parsed) ? (parsed as GenerationRecord[]) : []
 } catch (error) {
  console.warn("[generationStore] Failed to read records", error)
  return []
 }
}

const writeRecords = (records: GenerationRecord[], operation: "create" | "update" = "update") => {
 if (!canUseStorage()) return
 localStorage.setItem(GENERATION_STORAGE_KEY, JSON.stringify(records))
 window.dispatchEvent(new CustomEvent(GENERATION_RECORDS_CHANGED, {
  detail: { operation, count: records.length, latestId: records[0]?.id || null },
 }))
}

export const listGenerationRecords = (): GenerationRecord[] =>
 readRecords().sort((a, b) => b.updatedAt - a.updatedAt)

export const getGenerationRecord = (id: string): GenerationRecord | null =>
 listGenerationRecords().find((record) => record.id === id) || null

export const createGenerationRecord = (
 input: Omit<GenerationRecord, "id" | "createdAt" | "updatedAt">,
): GenerationRecord => {
 const now = Date.now()
 const record: GenerationRecord = {
  ...input,
  id: crypto.randomUUID(),
  createdAt: now,
  updatedAt: now,
 }
 const next = [record, ...readRecords()]
 writeRecords(next, "create")
 return record
}

export const updateGenerationRecord = (
 id: string,
 updates: Partial<GenerationRecord>,
): GenerationRecord | null => {
 const records = readRecords()
 let updatedRecord: GenerationRecord | null = null
 const next = records.map((record) => {
  if (record.id !== id) return record
  updatedRecord = {
   ...record,
   ...updates,
   updatedAt: Date.now(),
  }
  return updatedRecord
 })
 writeRecords(next)
 return updatedRecord
}

export const setGenerationStatus = (
 id: string,
 status: GenerationStatus,
 error?: string | null,
): GenerationRecord | null =>
 updateGenerationRecord(id, {
  status,
  error: error || null,
 })

export const clearGenerationRecords = () => {
 if (!canUseStorage()) return
 localStorage.removeItem(GENERATION_STORAGE_KEY)
 window.dispatchEvent(new CustomEvent(GENERATION_RECORDS_CHANGED, {
  detail: { operation: "clear", count: 0, latestId: null },
 }))
}
