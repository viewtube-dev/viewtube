import { beforeEach, describe, expect, it, vi } from "vitest"
import { createContentBuild, listContentBuildEvents, resetContentBuildRepositoryForTests } from "./ContentBuildRepository"
import { beginPublishTransaction, completePublishStep, completePublishTransaction, failPublishTransaction, resetPublishTransactionRepositoryForTests } from "./PublishTransaction"
import { getApprovedPublishSnapshot, resetApprovedPublishSnapshotRepositoryForTests } from "./ApprovedPublishSnapshot"
import type { PublishingPackageProjection } from "./PublishingPackageProjection"

const projection=():PublishingPackageProjection=>({
 schemaVersion:1,contentBuildId:"cb-publish",projectId:"project-a",videoPackageId:"vp-a",revision:7,
 titleAssetId:"title-final",thumbnailAssetId:"thumb-final",scriptAssetId:"script-v4",storyboardAssetId:"story-v2",
 finalRenderAssetId:"render-final",descriptionAssetId:"description-final",tagsAssetId:"tags-final",endScreenAssetId:null,outroAssetId:null,
 scheduledAt:null,publishedVideoId:null,approval:{status:"approved"},checks:[],blockers:[],ready:true,missing:[],
})

describe("PublishTransaction",()=>{
 beforeEach(()=>{resetContentBuildRepositoryForTests();resetApprovedPublishSnapshotRepositoryForTests();resetPublishTransactionRepositoryForTests();createContentBuild({id:"cb-publish",channelId:"channel-a"})})

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
  const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (key, value) {
   if (key === "viewtube_content_build_publish_transactions_v2") throw new Error("quota exceeded")
   return Storage.prototype.setItem.call(this, key, value)
  })
  try {
   expect(() => beginPublishTransaction(projection())).toThrow(/could not persist publish transaction/i)
  } finally {
   setItem.mockRestore()
  }
 })

})
