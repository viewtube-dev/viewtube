import { afterEach, describe, expect, it, vi } from "vitest"
import { enqueueBrainLearningRecord, flushBrainLearningPersistence } from "../BrainLearningPersistence"

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

 it("reports a short server acknowledgement as unauthenticated and keeps every unacknowledged record queued", async () => {
  const storage = makeStorage()
  vi.stubGlobal("window", { localStorage: storage })
  vi.stubGlobal("localStorage", storage)
  vi.stubGlobal("fetch", vi.fn(async () =>
   new Response(JSON.stringify({ ok: true, learningRecordCount: 0 }), { status: 200 }),
  ))

  const result = await enqueueBrainLearningRecord("channel-a", "brainOutcome", {
   id: "outcome-short-ack", channelId: "channel-a", outcome: "completed",
  })

  expect(result).toMatchObject({ persisted: 0, pending: 1, authenticated: false })
  const queued = JSON.parse(storage.getItem("vt_brain_learning_persistence_queue_v1") || "[]")
  expect(queued).toHaveLength(1)
  expect(queued[0].record.id).toBe("outcome-short-ack")
 })

})