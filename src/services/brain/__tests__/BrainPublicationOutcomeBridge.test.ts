// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { listAlgorithmIntelligenceEvents } from "../AlgorithmIntelligenceEventLedger"
import { recordBrainPublicationIdentityReceipt } from "../BrainPublicationOutcomeBridge"
import type { ContentBuildSnapshot } from "../../asset-engine/contracts"
import type { ContentBuildPublishTransaction } from "../../asset-engine/PublishTransaction"

const transaction = (): ContentBuildPublishTransaction => ({
 id: "publish-1", contentBuildId: "build-1", videoPackageId: "package-1", idempotencyKey: "key-1",
 approvedSnapshotId: "snapshot-1", approvedSnapshotHash: "hash-1", status: "completed",
 steps: { "verify-remote-state": { status: "completed" } },
 assetLock: {
  projectionRevision: 8, titleAssetId: "title-1", thumbnailAssetId: "thumbnail-1",
  finalRenderAssetId: "render-1", descriptionAssetId: "description-1", tagsAssetId: "tags-1",
  scheduledAt: null, lockedAt: "2026-10-15T00:00:00.000Z",
 },
 youtubeVideoId: "video-1", startedAt: "2026-10-15T00:00:00.000Z",
 updatedAt: "2026-10-15T01:00:00.000Z", completedAt: "2026-10-15T01:00:00.000Z",
})

const build = (): ContentBuildSnapshot => ({
 schemaVersion: 1, id: "build-1", revision: 9, channelId: "channel-1", legacyProjectId: "project-1",
 profile: {} as ContentBuildSnapshot["profile"], stage: "published", assetIds: [], selections: {},
 relations: [], versions: [], variantGroups: [], workflow: {} as ContentBuildSnapshot["workflow"],
 youtube: { videoId: "video-1", status: "published", publishedAt: "2026-10-15T01:00:00.000Z" } as ContentBuildSnapshot["youtube"],
 createdAt: "2026-10-14T00:00:00.000Z", updatedAt: "2026-10-15T01:00:00.000Z",
})

beforeEach(() => localStorage.clear())

describe("Brain publication identity bridge", () => {
 it("preserves immutable publication, snapshot, asset and scope lineage without claiming performance", () => {
  const result = recordBrainPublicationIdentityReceipt({ transaction: transaction(), build: build() })
  expect(result.receipt).toMatchObject({
   channelId: "channel-1", contentBuildId: "build-1", videoPackageId: "package-1",
   youtubeVideoId: "video-1", approvedSnapshotId: "snapshot-1", approvedSnapshotHash: "hash-1",
   finalRenderAssetId: "render-1", projectAssociationStatus: "snapshot-only",
  })
  expect(result.event.kind).toBe("PUBLICATION_CONFIRMED")
  expect(result.event.metadata.performanceEvaluated).toBe(false)
  expect(result.event.metadata.causalAttribution).toBe("not-assessed")
  expect(result.event.evaluationTargets).toEqual([])
 })

 it("is idempotent for a repeated publication transaction", () => {
  const input = { transaction: transaction(), build: build() }
  const first = recordBrainPublicationIdentityReceipt(input)
  const replay = recordBrainPublicationIdentityReceipt(input)
  expect(first.receipt.id).toBe(replay.receipt.id)
  expect(replay.idempotentReplay).toBe(true)
  expect(listAlgorithmIntelligenceEvents({ channelId: "channel-1" }).filter((event) => event.kind === "PUBLICATION_CONFIRMED")).toHaveLength(1)
 })

 it("rejects an unverified or mismatched publication", () => {
  expect(() => recordBrainPublicationIdentityReceipt({
   transaction: { ...transaction(), status: "running" }, build: build(),
  })).toThrow(/completed publish transaction/)
  expect(() => recordBrainPublicationIdentityReceipt({
   transaction: transaction(), build: { ...build(), youtube: { videoId: "other", status: "published" } as ContentBuildSnapshot["youtube"] },
  })).toThrow(/does not match/)
 })
})
