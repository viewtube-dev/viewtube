import { afterEach, describe, expect, it, vi } from "vitest"
import { enqueueBrainLearningRecord, flushBrainLearningPersistence, hydrateBrainLearningFromPersistence } from "../BrainLearningPersistence"
import { listBrainOutcomes } from "../BrainOutcomeLedger"

const makeStorage = () => {
 const values = new Map<string, string>()
 return {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, String(value)) },
  removeItem: (key: string) => { values.delete(key) },
  clear: () => values.clear(),
  key: (index: number) => [...values.keys()][index] ?? null,
  get length() { return values.size },
 } as Storage
}

afterEach(() => vi.unstubAllGlobals())

describe("BrainLearningPersistence", () => {
 it("acknowledges a channel-scoped durable write and clears its retry queue", async () => {
  const storage = makeStorage()
  vi.stubGlobal("window", { localStorage: storage })
  vi.stubGlobal("localStorage", storage)
  const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
   const body = JSON.parse(String(init?.body || "{}")) as { learningRecords?: unknown[] }
   return new Response(JSON.stringify({ ok: true, learningRecordCount: body.learningRecords?.length || 0 }), { status: 200 })
  })
  vi.stubGlobal("fetch", fetchMock)

  const result = await enqueueBrainLearningRecord("channel-a", "brainOutcome", {
   id: "outcome-a", channelId: "channel-a", outcome: "completed",
  })

  expect(result).toMatchObject({ persisted: 1, pending: 0, authenticated: true })
  expect(fetchMock).toHaveBeenCalledOnce()
  expect(String(fetchMock.mock.calls[0][0])).toContain("channelId=channel-a")
  expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).learningRecords).toEqual([
   { recordType: "brainOutcome", record: { id: "outcome-a", channelId: "channel-a", outcome: "completed" } },
  ])
 })

 it("retains unacknowledged records after 401 and retries them when a session becomes available", async () => {
  const storage = makeStorage()
  vi.stubGlobal("window", { localStorage: storage })
  vi.stubGlobal("localStorage", storage)
  const fetchMock = vi.fn()
   .mockResolvedValueOnce(new Response("{}", { status: 401 }))
   .mockResolvedValueOnce(new Response(JSON.stringify({ learningRecordCount: 1 }), { status: 200 }))
  vi.stubGlobal("fetch", fetchMock)

  const first = await enqueueBrainLearningRecord("channel-a", "evaluation", {
   id: "evaluation-a", channelId: "channel-a", outcome: "positive",
  })
  expect(first).toMatchObject({ persisted: 0, pending: 1, authenticated: false })

  const retried = await flushBrainLearningPersistence("channel-a")
  expect(retried).toMatchObject({ persisted: 1, pending: 0, authenticated: true })
  expect(fetchMock).toHaveBeenCalledTimes(2)
 })
 it("reports an incomplete acknowledgement as unsuccessful and keeps records queued", async () => {
  const storage = makeStorage()
  vi.stubGlobal("window", { localStorage: storage })
  vi.stubGlobal("localStorage", storage)
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ learningRecordCount: 0 }), { status: 200 }))
  vi.stubGlobal("fetch", fetchMock)

  const result = await enqueueBrainLearningRecord("channel-a", "brainOutcome", {
   id: "outcome-unacknowledged", channelId: "channel-a", outcome: "completed",
  })

  expect(result).toMatchObject({ persisted: 0, pending: 1, authenticated: false })
  expect(fetchMock).toHaveBeenCalledOnce()
 })

 it("preserves records enqueued while an earlier batch is awaiting server acknowledgement", async () => {
  const storage = makeStorage()
  vi.stubGlobal("window", { localStorage: storage })
  vi.stubGlobal("localStorage", storage })

  let resolveInFlight: ((response: Response) => void) | undefined
  let call = 0
  const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
   call += 1
   if (call === 1 || call === 3) return new Response("{}", { status: 401 })
   if (call === 2) {
    return await new Promise<Response>((resolve) => { resolveInFlight = resolve })
   }
   return new Response(JSON.stringify({
    learningRecordCount: (JSON.parse(String(init?.body || "{}")).learningRecords || []).length,
   }), { status: 200 })
  })
  vi.stubGlobal("fetch", fetchMock)

  await enqueueBrainLearningRecord("channel-a", "brainOutcome", {
   id: "outcome-first", channelId: "channel-a", outcome: "completed",
  })
  const inFlight = flushBrainLearningPersistence("channel-a")
  await Promise.resolve()
  await enqueueBrainLearningRecord("channel-a", "brainOutcome", {
   id: "outcome-second", channelId: "channel-a", outcome: "completed",
  })

  resolveInFlight?.(new Response(JSON.stringify({ learningRecordCount: 1 }), { status: 200 }))
  const result = await inFlight

  expect(result).toMatchObject({ persisted: 1, pending: 1, authenticated: true })
  const storedQueue = JSON.parse(String(storage.getItem("vt_brain_learning_persistence_queue_v1")))
  expect(storedQueue.map((item: { record: { id: string } }) => item.record.id)).toEqual(["outcome-second"])
 })

})

 it("rehydrates channel-scoped outcomes from durable storage after local browser data is lost", async () => {
  const storage = makeStorage()
  vi.stubGlobal("window", { localStorage: storage, dispatchEvent: vi.fn() })
  vi.stubGlobal("localStorage", storage)
  const durableRecord = {
   recordType: "brainOutcome",
   record: {
    id: "durable-outcome-after-reload",
    channelId: "channel-rehydration",
    outcome: "completed",
    sourceRecordId: "asset-outcome-1",
    traceId: "generation-trace-1",
    createdAt: 123,
   },
  }
  const fetchMock = vi.fn(async (url: string) => {
   if (String(url).includes("channelId=channel-rehydration")) {
    return new Response(JSON.stringify({ learningRecords: [durableRecord] }), { status: 200 })
   }
   return new Response(JSON.stringify({ learningRecords: [] }), { status: 200 })
  })
  vi.stubGlobal("fetch", fetchMock)

  const result = await hydrateBrainLearningFromPersistence("channel-rehydration")

  expect(result).toMatchObject({
   channelId: "channel-rehydration",
   hydrated: 1,
   persisted: 0,
   pending: 0,
   authenticated: true,
  })
  expect(listBrainOutcomes("channel-rehydration")).toContainEqual(expect.objectContaining({
   id: "durable-outcome-after-reload",
   channelId: "channel-rehydration",
   sourceRecordId: "asset-outcome-1",
   traceId: "generation-trace-1",
  }))
  expect(fetchMock).toHaveBeenCalledTimes(1)
 })
