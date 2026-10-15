export type BrainLearningRecordType = "assetOutcome" | "brainOutcome" | "evaluation" | "learningCandidate"

export interface BrainLearningRecordEnvelope {
 recordType: BrainLearningRecordType
 record: { id: string; channelId?: string | null } & Record<string, unknown>
}

export interface BrainLearningPersistenceResult {
 persisted: number
 pending: number
 authenticated: boolean
}

const QUEUE_KEY = "vt_brain_learning_persistence_queue_v1"
const endpoint = (channelId: string) => `/api/brain-intelligence?channelId=${encodeURIComponent(channelId)}`

const getStorage = (): Storage | null => {
 try {
  if (typeof window !== "undefined" && window.localStorage) return window.localStorage
  return typeof localStorage === "undefined" ? null : localStorage
 } catch {
  return null
 }
}

const readQueue = (): BrainLearningRecordEnvelope[] => {
 const storage = getStorage()
 if (!storage) return []
 try {
  const value = JSON.parse(storage.getItem(QUEUE_KEY) || "[]")
  return Array.isArray(value) ? value.filter((item) =>
   item && typeof item === "object" &&
   ["assetOutcome", "brainOutcome", "evaluation", "learningCandidate"].includes(item.recordType) &&
   item.record && typeof item.record.id === "string" && item.record.id &&
   typeof item.record.channelId === "string" && item.record.channelId
  ) : []
 } catch {
  return []
 }
}

const writeQueue = (records: BrainLearningRecordEnvelope[]) => {
 try { getStorage()?.setItem(QUEUE_KEY, JSON.stringify(records.slice(-10000))) } catch { /* Keep the creator action independent of cache quota. */ }
}

const queueKey = (item: BrainLearningRecordEnvelope) => `${item.recordType}:${item.record.channelId}:${item.record.id}`

/**
 * Flush the local retry queue to the authenticated server endpoint. A 401 or
 * network error leaves records queued and explicitly unacknowledged.
 */
export const flushBrainLearningPersistence = async (channelId?: string): Promise<BrainLearningPersistenceResult> => {
 const queued = readQueue()
 const storage = getStorage()
 if (!channelId) {
  const channels = [...new Set(queued.map((item) => String(item.record.channelId || "")).filter(Boolean))]
  let persisted = 0
  let authenticated = true
  for (const channel of channels) {
   const result = await flushBrainLearningPersistence(channel)
   persisted += result.persisted
   authenticated = authenticated && result.authenticated
  }
  return { persisted, pending: readQueue().length, authenticated }
 }
 if (!storage || typeof window === "undefined") return { persisted: 0, pending: queued.length, authenticated: false }
 const pending = channelId ? queued.filter((item) => item.record.channelId === channelId) : queued
 let persisted = 0
 let authenticated = true
 for (let offset = 0; offset < pending.length; offset += 200) {
  const batch = pending.slice(offset, offset + 200)
  const currentQueue = readQueue()
  try {
   const response = await fetch(endpoint(String(batch[0]?.record.channelId || channelId || "")), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ learningRecords: batch }),
   })
   if (response.status === 401) {
    authenticated = false
    break
   }
   if (!response.ok) { authenticated = false; break }
   const result = await response.json() as { learningRecordCount?: number }
   if (Number(result.learningRecordCount) !== batch.length) {
    authenticated = false
    break
   }
   const sentKeys = new Set(batch.map(queueKey))
   writeQueue(currentQueue.filter((item) => !sentKeys.has(queueKey(item))))
   persisted += batch.length
  } catch {
   authenticated = false
   break
  }
 }
 return { persisted, pending: readQueue().length, authenticated }
}

/** Queue a durable record first, then attempt delivery; retries are idempotent. */
export const enqueueBrainLearningRecord = async <T extends { id: string; channelId?: string | null }>(
 channelId: string | null | undefined,
 recordType: BrainLearningRecordType,
 record: T,
): Promise<BrainLearningPersistenceResult> => {
 const normalizedChannelId = String(channelId || "").trim()
 if (!normalizedChannelId || !record?.id || String(record.channelId || "") !== normalizedChannelId) {
  return { persisted: 0, pending: readQueue().length, authenticated: false }
 }
 const storage = getStorage()
 if (!storage || typeof window === "undefined") return { persisted: 0, pending: 0, authenticated: false }
 const envelope: BrainLearningRecordEnvelope = { recordType, record: { ...record, channelId: normalizedChannelId } as Record<string, unknown> & { id: string; channelId: string } }
 const current = readQueue()
 const key = queueKey(envelope)
 writeQueue([...current.filter((item) => queueKey(item) !== key), envelope])
 return flushBrainLearningPersistence(normalizedChannelId)
}

/**
 * Hydrate the existing local ledgers from server-authoritative rows, preserving
 * local-only rows until their queued writes are acknowledged. This extends the
 * current Brain persistence endpoint instead of introducing a second API.
 */
export const hydrateBrainLearningFromPersistence = async (channelId: string) => {
 const normalizedChannelId = String(channelId || "").trim()
 if (!normalizedChannelId || typeof window === "undefined") return null
 const response = await fetch(endpoint(normalizedChannelId), { credentials: "include" })
 if (response.status === 401) return null
 if (!response.ok) throw new Error(`Brain learning persistence load failed (${response.status}).`)
 const durable = await response.json() as { learningRecords?: BrainLearningRecordEnvelope[] }
 const records = (durable.learningRecords || []).filter((item) =>
  item && typeof item === "object" &&
  ["assetOutcome", "brainOutcome", "evaluation", "learningCandidate"].includes(item.recordType) &&
  item.record && String(item.record.channelId || "") === normalizedChannelId &&
  typeof item.record.id === "string"
 )
 const [brain, assets, evaluations] = await Promise.all([
  import("./BrainOutcomeLedger"),
  import("./assetOutcomes"),
  import("../viewTubeEvaluationLedger"),
 ])
 brain.hydrateBrainOutcomes(records.filter((item) => item.recordType === "brainOutcome").map((item) => item.record as never))
 assets.hydrateAssetOutcomes(records.filter((item) => item.recordType === "assetOutcome").map((item) => item.record as never))
 evaluations.hydrateBrainLearningRecords({
  evaluations: records.filter((item) => item.recordType === "evaluation").map((item) => item.record as never),
  candidates: records.filter((item) => item.recordType === "learningCandidate").map((item) => item.record as never),
 })
 const sync = await flushBrainLearningPersistence(normalizedChannelId)
 return { channelId: normalizedChannelId, hydrated: records.length, ...sync }
}
