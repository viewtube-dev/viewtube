import { beforeEach, describe, expect, it, vi } from "vitest"
import {
 createApprovedPublishSnapshot,
 getApprovedPublishSnapshot,
 persistApprovedPublishSnapshot,
 resetApprovedPublishSnapshotRepositoryForTests,
 verifyApprovedPublishSnapshot,
} from "./ApprovedPublishSnapshot"
import type { PublishingPackageProjection } from "./PublishingPackageProjection"

const projection = (): PublishingPackageProjection => ({
 schemaVersion: 1,
 contentBuildId: "cb-publish",
 projectId: "project-a",
 videoPackageId: "vp-a",
 revision: 7,
 titleAssetId: "title-final",
 thumbnailAssetId: "thumb-final",
 scriptAssetId: "script-v4",
 storyboardAssetId: "story-v2",
 finalRenderAssetId: "render-final",
 descriptionAssetId: "description-final",
 tagsAssetId: "tags-final",
 endScreenAssetId: "end-screen-final",
 outroAssetId: "outro-final",
 scheduledAt: "2026-09-30T18:00:00.000Z",
 publishedVideoId: null,
 approval: {
  status: "approved",
  approvedBy: "creator-1",
  approvedAt: "2026-09-24T18:00:00.000Z",
 },
 checks: [],
 blockers: [],
 ready: true,
 missing: [],
})

describe("ApprovedPublishSnapshot", () => {
 beforeEach(() => resetApprovedPublishSnapshotRepositoryForTests())

 it("freezes the exact approved package identity and assets", () => {
  const snapshot = createApprovedPublishSnapshot(projection())
  expect(snapshot.contentBuildId).toBe("cb-publish")
  expect(snapshot.contentBuildRevision).toBe(7)
  expect(snapshot.videoPackageId).toBe("vp-a")
  expect(snapshot.assets).toEqual({
   titleAssetId: "title-final",
   thumbnailAssetId: "thumb-final",
   finalRenderAssetId: "render-final",
   descriptionAssetId: "description-final",
   tagsAssetId: "tags-final",
   endScreenAssetId: "end-screen-final",
   outroAssetId: "outro-final",
  })
  expect(snapshot.approval).toEqual({
   approvedBy: "creator-1",
   approvedAt: "2026-09-24T18:00:00.000Z",
  })
 })

 it("creates the same stable identity for the same approved content", () => {
  const first = createApprovedPublishSnapshot(projection())
  const second = createApprovedPublishSnapshot(projection())
  expect(second.id).toBe(first.id)
  expect(second.hash).toBe(first.hash)
 })

 it("changes identity when an approved asset or schedule changes", () => {
  const first = createApprovedPublishSnapshot(projection())
  const changedAsset = createApprovedPublishSnapshot({ ...projection(), titleAssetId: "title-v2" })
  const changedSchedule = createApprovedPublishSnapshot({ ...projection(), scheduledAt: "2026-10-01T18:00:00.000Z" })
  expect(changedAsset.hash).not.toBe(first.hash)
  expect(changedSchedule.hash).not.toBe(first.hash)
 })

 it("rejects packages that are not ready and creator-approved", () => {
  expect(() => createApprovedPublishSnapshot({
   ...projection(),
   ready: false,
   missing: ["approval"],
   approval: { status: "ready" },
  })).toThrow(/ready and creator-approved/i)
 })

 it("detects mutation after snapshot creation", () => {
  const snapshot = createApprovedPublishSnapshot(projection())
  const tampered = { ...snapshot, assets: { ...snapshot.assets, titleAssetId: "title-tampered" } }
  expect(verifyApprovedPublishSnapshot(snapshot)).toBe(true)
  expect(verifyApprovedPublishSnapshot(tampered)).toBe(false)
 })

 it("persists the immutable approved snapshot by stable identity", () => {
  const saved = persistApprovedPublishSnapshot(projection())
  const loaded = getApprovedPublishSnapshot(saved.id)
  expect(loaded).toEqual(saved)
  expect(loaded?.hash).toBe(saved.hash)
 })

 it("does not mutate a persisted snapshot when the current package later changes", () => {
  const saved = persistApprovedPublishSnapshot(projection())
  persistApprovedPublishSnapshot({ ...projection(), titleAssetId: "title-later", revision: 8 })
  expect(getApprovedPublishSnapshot(saved.id)?.assets.titleAssetId).toBe("title-final")
  expect(getApprovedPublishSnapshot(saved.id)?.contentBuildRevision).toBe(7)
 })
 it("fails closed when browser storage refuses to persist an approved snapshot", () => {
  const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
   throw new Error("quota exceeded")
  })
  try {
   expect(() => persistApprovedPublishSnapshot(projection())).toThrow(/could not persist/i)
  } finally {
   setItem.mockRestore()
  }
 })

 it("refuses to overwrite malformed snapshot storage", () => {
  localStorage.setItem("viewtube_approved_publish_snapshots_v1", "{not-json")
  expect(() => persistApprovedPublishSnapshot(projection())).toThrow(/stored approved publish snapshots are unreadable/i)
  expect(localStorage.getItem("viewtube_approved_publish_snapshots_v1")).toBe("{not-json")
 })

 it("rejects tampered snapshots already present in browser storage", () => {
  const saved = persistApprovedPublishSnapshot(projection())
  const raw = localStorage.getItem("viewtube_approved_publish_snapshots_v1")
  expect(raw).toBeTruthy()
  const parsed = JSON.parse(raw as string)
  parsed[0].assets.titleAssetId = "tampered-after-persistence"
  localStorage.setItem("viewtube_approved_publish_snapshots_v1", JSON.stringify(parsed))
  expect(() => getApprovedPublishSnapshot(saved.id)).toThrow(/failed integrity verification/i)
  expect(() => persistApprovedPublishSnapshot({ ...projection(), revision: 8 })).toThrow(/failed integrity verification/i)
 })

})
