import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createContentBuild, getContentBuild, listContentBuildEvents, resetContentBuildRepositoryForTests } from "./ContentBuildRepository"
import { beginPublishTransaction, completePublishStep, completePublishTransaction, failPublishTransaction, resetPublishTransactionRepositoryForTests } from "./PublishTransaction"
import { getApprovedPublishSnapshot, resetApprovedPublishSnapshotRepositoryForTests } from "./ApprovedPublishSnapshot"
import type { PublishingPackageProjection } from "./PublishingPackageProjection"

const projection=():PublishingPackageProjection=>({
 schemaVersion:1,contentBuildId:"cb-publish",projectId:"project-a",videoPackageId:"vp-a",revision:7,
 titleAssetId:"title-final",thumbnailAssetId:"thumb-final",scriptAssetId:"script-v4",storyboardAssetId:"story-v2",
 finalRenderAssetId:"render-final",descriptionAssetId:"description-final",tagsAssetId:"tags-final",endScreenAssetId:null,outroAssetId:null,
 scheduledAt:null,publishedVideoId:null,approval:{status:"approved"},checks:[],blockers:[],ready:true,missing:[],
})

const createTestStorage = () => {
 const values = new Map<string, string>()
 return {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { values.set(key, String(value)) },
  removeItem: (key: string) => { values.delete(key) },
 }
}

describe("PublishTransaction",()=>{
 beforeEach(()=>{vi.stubGlobal("localStorage",createTestStorage());resetContentBuildRepositoryForTests();resetApprovedPublishSnapshotRepositoryForTests();resetPublishTransactionRepositoryForTests();createContentBuild({id:"cb-publish",channelId:"channel-a"})})
 afterEach(()=>vi.unstubAllGlobals())

 it("locks canonical assets and returns the same transaction for the same final render",()=>{
  const first=beginPublishTransaction(projection())
  const second=beginPublishTransaction({...projection(),revision:8,titleAssetId:"title-later"})
  expect(second.id).toBe(first.id)
  expect(second.assetLock.titleAssetId).toBe("title-final")
  expect(second.assetLock.projectionRevision).toBe(7)
  expect(second.approvedSnapshotId).toBe(first.approvedSnapshotId)
  expect(second.approvedSnapshotHash).toBe(first.approvedSnapshotHash)
  expect(getApprovedPublishSnapshot(first.approvedSnapshotId)?.assets.titleAssetId).toBe("title-final")
 })

 it("resumes a failed transaction instead of creating a duplicate upload transaction",()=>{
  const first=beginPublishTransaction(projection())
  const uploaded=completePublishStep({transactionId:first.id,step:"upload-video",youtubeVideoId:"youtube-123",receipt:{uploaded:true}})
  failPublishTransaction(first.id,"apply-metadata",new Error("network"))
  const resumed=beginPublishTransaction(projection())
  expect(resumed.id).toBe(first.id)
  expect(resumed.youtubeVideoId).toBe("youtube-123")
  expect(uploaded.youtubeVideoId).toBe("youtube-123")
 })

 it("starts a new transaction when a newly approved final render changes",()=>{
  const first=beginPublishTransaction(projection())
  const second=beginPublishTransaction({...projection(),revision:8,finalRenderAssetId:"render-v2"})
  expect(second.id).not.toBe(first.id)
  expect(second.approvedSnapshotId).not.toBe(first.approvedSnapshotId)
  expect(second.assetLock.finalRenderAssetId).toBe("render-v2")
 })
 it("records the published package against the canonical ContentBuild stream exactly once",()=>{
  const transaction=beginPublishTransaction(projection())
  completePublishStep({
   transactionId:transaction.id,
   step:"upload-video",
   youtubeVideoId:"youtube-published",
   youtubeBinding:{status:"uploaded"},
  })
  completePublishStep({
   transactionId:transaction.id,
   step:"verify-remote-state",
   youtubeVideoId:"youtube-published",
   youtubeBinding:{status:"published",publishedAt:"2026-10-13T22:00:00.000Z"},
  })
  completePublishTransaction(transaction.id)
  completePublishTransaction(transaction.id)
  const publishedEvents=listContentBuildEvents("cb-publish").filter(event=>event.eventType==="package.published")
  expect(publishedEvents).toHaveLength(1)
  expect(publishedEvents[0]).toMatchObject({
   entityType:"publishing-package",
   entityId:"vp-a",
   metadata:expect.objectContaining({
    videoPackageId:"vp-a",
    approvedSnapshotId:transaction.approvedSnapshotId,
    youtubeVideoId:"youtube-published",
    publicationState:"published",
   }),
  })
 })

 it("refuses to resume a transaction whose approved snapshot is missing", () => {
  const first = beginPublishTransaction(projection())
  resetApprovedPublishSnapshotRepositoryForTests()
  expect(() => beginPublishTransaction(projection())).toThrow(/approved snapshot.*(missing|integrity|binding)/i)
  expect(first.approvedSnapshotId).toBeTruthy()
 })

 it("refuses to complete a transaction whose locked assets do not match its approved snapshot", () => {
  const transaction = beginPublishTransaction(projection())
  const stored = localStorage.getItem("viewtube_content_build_publish_transactions_v2")
  expect(stored).toBeTruthy()
  const parsed = JSON.parse(stored as string)
  parsed[0].assetLock.titleAssetId = "tampered-title"
  localStorage.setItem("viewtube_content_build_publish_transactions_v2", JSON.stringify(parsed))
  expect(() => completePublishStep({ transactionId: transaction.id, step: "apply-metadata" }))
   .toThrow(/approved snapshot.*(integrity|binding|locked assets)/i)
 })

 it("refuses to create a transaction over unreadable transaction storage", () => {
  localStorage.setItem("viewtube_content_build_publish_transactions_v2", "{not-json")
  expect(() => beginPublishTransaction(projection())).toThrow(/publish transaction storage is unreadable/i)
  expect(localStorage.getItem("viewtube_content_build_publish_transactions_v2")).toBe("{not-json")
 })

 it("surfaces transaction storage write failures instead of returning an unrecorded transaction", () => {
  const originalSetItem = globalThis.localStorage.setItem
  const setItem = vi.spyOn(globalThis.localStorage, "setItem").mockImplementation((key: string, value: string) => {
   if (key === "viewtube_content_build_publish_transactions_v2") throw new Error("quota exceeded")
   return originalSetItem(key, value)
  })
  try {
   expect(() => beginPublishTransaction(projection())).toThrow(/could not persist publish transaction/i)
  } finally {
   setItem.mockRestore()
  }
 })

 it("refuses to start publishing when only volatile in-memory persistence is available", () => {
  vi.stubGlobal("localStorage", undefined)
  try {
   expect(() => beginPublishTransaction(projection())).toThrow(/persistent browser storage/i)
  } finally {
   vi.unstubAllGlobals()
  }
 })

 it("does not rebind an already-completed upload step to a conflicting YouTube video", () => {
  const transaction = beginPublishTransaction(projection())
  completePublishStep({ transactionId: transaction.id, step: "upload-video", youtubeVideoId: "youtube-original" })
  const duplicate = completePublishStep({ transactionId: transaction.id, step: "upload-video", youtubeVideoId: "youtube-conflict" })
  expect(duplicate.youtubeVideoId).toBe("youtube-original")
  expect(getContentBuild("cb-publish")?.youtube?.videoId).toBe("youtube-original")
 })

 it("preserves completed upload state while retrying a failed metadata step", () => {
  const transaction = beginPublishTransaction(projection())
  completePublishStep({ transactionId: transaction.id, step: "upload-video", youtubeVideoId: "youtube-retry" })
  failPublishTransaction(transaction.id, "apply-metadata", new Error("temporary metadata failure"))

  const resumed = beginPublishTransaction(projection())
  expect(resumed.id).toBe(transaction.id)
  expect(resumed.steps["upload-video"]?.status).toBe("completed")
  expect(resumed.steps["apply-metadata"]?.status).toBe("failed")

  const retried = completePublishStep({
   transactionId: resumed.id,
   step: "apply-metadata",
   receipt: { retry: true, applied: true },
  })
  expect(retried.steps["upload-video"]?.status).toBe("completed")
  expect(retried.steps["apply-metadata"]?.status).toBe("completed")
  expect(listContentBuildEvents("cb-publish").filter(event => event.eventType === "publish.transaction.started")).toHaveLength(1)
 })

 it("refuses transaction completion before the remote YouTube state is verified", () => {
  const transaction = beginPublishTransaction(projection())
  completePublishStep({ transactionId: transaction.id, step: "upload-video", youtubeVideoId: "youtube-unverified" })
  expect(() => completePublishTransaction(transaction.id)).toThrow(/before remote verification/i)
  expect(beginPublishTransaction(projection()).status).not.toBe("completed")
 })

})
