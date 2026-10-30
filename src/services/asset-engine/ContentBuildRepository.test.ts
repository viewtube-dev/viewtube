import { beforeEach, describe, expect, it } from "vitest"
import {
 addContentBuildAssetRelation,
 attachAssetToContentBuild,
 addContentBuildVariant,
 bindYouTubeVideo,
 createContentBuild,
 createContentBuildAssetVersion,
 createContentBuildVariantGroup,
 deriveLegacyContentBuildId,
 getContentBuild,
 listContentBuildEvents,
 listContentBuildMetadataHistory,
 recordContentBuildMetadataChange,
 appendContentBuildEvent,
 resetContentBuildRepositoryForTests,
 setContentBuildSelection,
 selectContentBuildVariant,
} from "./ContentBuildRepository"

describe("ContentBuild repository", () => {
 beforeEach(() => {
  resetContentBuildRepositoryForTests()
 })

 it("publishes a runtime invalidation event when canonical build history changes", () => {
  let received: Event | null = null
  const listener = (event: Event) => { received = event }
  window.addEventListener("vt_content_build_repository_changed", listener)
  try {
   createContentBuild({ id: "cb-runtime-invalidation", channelId: "channel-a" })
   expect(received).not.toBeNull()
   expect((received as CustomEvent).detail).toMatchObject({ contentBuildId: "cb-runtime-invalidation" })
  } finally {
   window.removeEventListener("vt_content_build_repository_changed", listener)
  }
 })

 it("creates one durable build projection with a creation event", () => {
  const build = createContentBuild({
   id: "cb-001",
   channelId: "channel-a",
   legacyProjectId: "project-a",
   profile: {
    subject: "Austerlitz",
    niche: "Napoleonic history",
    intention: "Eyewitness-driven historical narrative",
   },
  })

  expect(build).toMatchObject({
   id: "cb-001",
   revision: 1,
   channelId: "channel-a",
   legacyProjectId: "project-a",
   stage: "idea",
  })
  expect(listContentBuildEvents(build.id).map(event => event.eventType)).toEqual(["build.created"])
 })

 it("keeps assets, selections and lineage on the same ContentBuild", () => {
  createContentBuild({ id: "cb-002" })
  attachAssetToContentBuild("cb-002", "script-v6", { toolId: "script-architect" })
  attachAssetToContentBuild("cb-002", "thumbnail-v3", { toolId: "thumbnail-studio" })

  addContentBuildAssetRelation({
   contentBuildId: "cb-002",
   fromAssetId: "script-v6",
   toAssetId: "thumbnail-v3",
   relation: "generated-from",
   sourceToolId: "thumbnail-studio",
  })
  setContentBuildSelection("cb-002", "script", "script-v6", { final: true, toolId: "script-architect" })
  setContentBuildSelection("cb-002", "thumbnail", "thumbnail-v3", { final: true, toolId: "thumbnail-studio" })

  const build = getContentBuild("cb-002")
  expect(build?.assetIds).toEqual(expect.arrayContaining(["script-v6", "thumbnail-v3"]))
  expect(build?.selections).toMatchObject({ script: "script-v6", thumbnail: "thumbnail-v3" })
  expect(build?.relations).toContainEqual(expect.objectContaining({
   fromAssetId: "script-v6",
   toAssetId: "thumbnail-v3",
   relation: "generated-from",
  }))
  expect(listContentBuildEvents("cb-002").map(event => event.eventType)).toEqual(expect.arrayContaining([
   "asset.attached",
   "asset.relation.created",
   "asset.finalized",
  ]))
 })

 it("keeps repeated non-final selection idempotent while preserving explicit finalization", () => {
  createContentBuild({ id: "cb-selection" })

  setContentBuildSelection("cb-selection", "thumbnail", "thumb-a", {
   toolId: "project-builder",
   actorType: "creator",
  })
  setContentBuildSelection("cb-selection", "thumbnail", "thumb-a", {
   toolId: "video-package",
   actorType: "sync",
  })

  const selectedEvents = listContentBuildEvents("cb-selection")
   .filter(event => event.eventType === "asset.selected" && event.entityId === "thumbnail")
  expect(selectedEvents).toHaveLength(1)

  setContentBuildSelection("cb-selection", "thumbnail", "thumb-a", {
   toolId: "thumbnail-studio",
   actorType: "creator",
   final: true,
  })
  setContentBuildSelection("cb-selection", "thumbnail", "thumb-a", {
   toolId: "thumbnail-studio-retry",
   actorType: "creator",
   final: true,
  })

  const events = listContentBuildEvents("cb-selection")
  expect(events.filter(event => event.eventType === "asset.selected" && event.entityId === "thumbnail")).toHaveLength(1)
  expect(events.filter(event => event.eventType === "asset.finalized" && event.entityId === "thumbnail")).toHaveLength(1)
 })

 it("deduplicates lifecycle events by an explicit idempotency key", () => {
  createContentBuild({ id: "cb-idempotent-events" })
  const first = appendContentBuildEvent({
   contentBuildId: "cb-idempotent-events",
   eventType: "analytics.checkpoint",
   entityType: "analytics-checkpoint",
   entityId: "checkpoint-7d",
   idempotencyKey: "checkpoint:cb-idempotent-events:yt-7:7d",
   metadata: { checkpointId: "7d" },
  })
  const replay = appendContentBuildEvent({
   contentBuildId: "cb-idempotent-events",
   eventType: "analytics.checkpoint",
   entityType: "analytics-checkpoint",
   entityId: "checkpoint-7d",
   idempotencyKey: "checkpoint:cb-idempotent-events:yt-7:7d",
   metadata: { checkpointId: "7d" },
  })

  expect(replay.id).toBe(first.id)
  expect(listContentBuildEvents("cb-idempotent-events").filter(event =>
   event.idempotencyKey === "checkpoint:cb-idempotent-events:yt-7:7d"
  )).toHaveLength(1)
 })

 it("persists typed parent references and accepts delayed parent delivery", () => {
  createContentBuild({ id: "cb-delayed-lineage" })
  const child = appendContentBuildEvent({
   contentBuildId: "cb-delayed-lineage",
   eventType: "publish.transaction.completed",
   idempotencyKey: "lineage-child",
   parentEventIds: ["event:lineage-parent"],
  })

  expect(child.parentEventIds).toEqual(["event:lineage-parent"])
  expect(listContentBuildEvents("cb-delayed-lineage")).toContainEqual(expect.objectContaining({
   id: "event:lineage-child",
   parentEventIds: ["event:lineage-parent"],
  }))

  const parent = appendContentBuildEvent({
   contentBuildId: "cb-delayed-lineage",
   eventType: "analysis.completed",
   idempotencyKey: "lineage-parent",
  })
  expect(parent.id).toBe("event:lineage-parent")
  expect(listContentBuildEvents("cb-delayed-lineage")).toHaveLength(3)
 })

 it("rejects circular ancestry and idempotency replays with changed parents", () => {
  createContentBuild({ id: "cb-circular-lineage" })
  appendContentBuildEvent({
   contentBuildId: "cb-circular-lineage",
   eventType: "analytics.checkpoint",
   idempotencyKey: "lineage-a",
   parentEventIds: ["event:lineage-b"],
  })

  expect(() => appendContentBuildEvent({
   contentBuildId: "cb-circular-lineage",
   eventType: "analytics.checkpoint",
   idempotencyKey: "lineage-b",
   parentEventIds: ["event:lineage-a"],
  })).toThrow(/circular provenance/)

  expect(() => appendContentBuildEvent({
   contentBuildId: "cb-circular-lineage",
   eventType: "analytics.checkpoint",
   idempotencyKey: "lineage-a",
   parentEventIds: [],
  })).toThrow(/idempotency key was reused/)
 })

 it("rejects reuse of an idempotency key for a different event", () => {
  createContentBuild({ id: "cb-idempotency-conflict" })
  appendContentBuildEvent({
   contentBuildId: "cb-idempotency-conflict",
   eventType: "analytics.checkpoint",
   entityType: "analytics-checkpoint",
   entityId: "checkpoint-a",
   idempotencyKey: "shared-checkpoint-key",
  })

  expect(() => appendContentBuildEvent({
   contentBuildId: "cb-idempotency-conflict",
   eventType: "publish.transaction.completed",
   entityType: "publish-transaction",
   entityId: "transaction-b",
   idempotencyKey: "shared-checkpoint-key",
  })).toThrow(/idempotency key was reused/)
 })

 it("does not duplicate a post-publish YouTube binding when its write is replayed", () => {
  createContentBuild({ id: "cb-idempotent-binding", channelId: "channel-a" })
  const input = {
   contentBuildId: "cb-idempotent-binding",
   channelId: "channel-a",
   videoId: "yt-idempotent",
   status: "published" as const,
   publishedAt: "2026-10-15T00:00:00.000Z",
   idempotencyKey: "post-publish-binding:tx-1:snapshot-hash",
  }
  const first = bindYouTubeVideo(input)
  const eventCount = listContentBuildEvents("cb-idempotent-binding").length
  const replay = bindYouTubeVideo(input)

  expect(replay.revision).toBe(first.revision)
  expect(listContentBuildEvents("cb-idempotent-binding")).toHaveLength(eventCount)
  expect(replay.youtube?.videoId).toBe("yt-idempotent")
 })

 it("binds the same build to a published YouTube identity", () => {
  createContentBuild({ id: "cb-003", channelId: "channel-a" })
  const next = bindYouTubeVideo({
   contentBuildId: "cb-003",
   channelId: "channel-a",
   videoId: "yt-123",
   status: "published",
   publishedAt: "2026-09-20T22:00:00.000Z",
  })

  expect(next.youtube).toMatchObject({
   videoId: "yt-123",
   canonicalUrl: "https://www.youtube.com/watch?v=yt-123",
   status: "published",
  })
  const events = listContentBuildEvents("cb-003")
  expect(events[events.length - 1]?.eventType).toBe("youtube.bound")
 })

 it("records reconstructable metadata versions with field-level values and provenance", () => {
  createContentBuild({ id: "cb-metadata-history", legacyProjectId: "project-9", channelId: "channel-9" })
  const first = recordContentBuildMetadataChange({
   contentBuildId: "cb-metadata-history",
   metadataVersionId: "metadata-v1",
   operationId: "operation-generate-1",
   operation: "create",
   fields: [
    { field: "title", before: null, after: "A new title" },
    { field: "description", before: null, after: "A long description" },
   ],
   actorType: "brain",
   sourceToolId: "video-publisher",
   generationRecordId: "generation-44",
   promptRecipeId: "title-description-v3",
   promptRecipeVersion: "3.1.0",
   resultingAssetIds: ["title-asset-v1", "description-asset-v1"],
   approvedSnapshotId: "snapshot-8",
   approvedSnapshotHash: "hash-8",
   evidenceIds: ["analytics-baseline-1"],
   occurredAt: "2026-10-15T12:00:00.000Z",
  })
  const replay = recordContentBuildMetadataChange({
   contentBuildId: "cb-metadata-history",
   metadataVersionId: "metadata-v1",
   operationId: "operation-generate-1",
   operation: "create",
   fields: [
    { field: "title", before: null, after: "A new title" },
    { field: "description", before: null, after: "A long description" },
   ],
   actorType: "brain",
   sourceToolId: "video-publisher",
   generationRecordId: "generation-44",
   promptRecipeId: "title-description-v3",
   promptRecipeVersion: "3.1.0",
   resultingAssetIds: ["title-asset-v1", "description-asset-v1"],
   approvedSnapshotId: "snapshot-8",
   approvedSnapshotHash: "hash-8",
   evidenceIds: ["analytics-baseline-1"],
   occurredAt: "2026-10-15T12:00:00.000Z",
  })

  expect(first).toMatchObject({
   metadataVersionId: "metadata-v1",
   operationId: "operation-generate-1",
   fields: [
    { field: "title", before: null, after: "A new title" },
    { field: "description", before: null, after: "A long description" },
   ],
   promptRecipeVersion: "3.1.0",
   approvedSnapshotHash: "hash-8",
  })
  expect(replay.metadataVersionId).toBe(first.metadataVersionId)
  expect(listContentBuildMetadataHistory("cb-metadata-history")).toHaveLength(1)
  expect(listContentBuildEvents("cb-metadata-history").filter(event => event.entityId === "metadata-v1")).toHaveLength(1)
 })

 it("rejects reuse of an immutable metadata version ID with changed values", () => {
  createContentBuild({ id: "cb-metadata-immutable" })
  recordContentBuildMetadataChange({
   contentBuildId: "cb-metadata-immutable",
   metadataVersionId: "metadata-v1",
   operationId: "operation-1",
   operation: "edit",
   fields: [{ field: "title", before: "Old", after: "New" }],
   occurredAt: "2026-10-15T12:00:00.000Z",
  })

  expect(() => recordContentBuildMetadataChange({
   contentBuildId: "cb-metadata-immutable",
   metadataVersionId: "metadata-v1",
   operationId: "operation-1",
   operation: "edit",
   fields: [{ field: "title", before: "Old", after: "Different" }],
   occurredAt: "2026-10-15T12:00:00.000Z",
  })).toThrow(/metadata history is immutable/)
 })

 it("rejects duplicate field names in a single metadata version", () => {
  createContentBuild({ id: "cb-metadata-duplicate-field" })
  expect(() => recordContentBuildMetadataChange({
   contentBuildId: "cb-metadata-duplicate-field",
   metadataVersionId: "metadata-bad",
   operationId: "operation-bad",
   operation: "edit",
   fields: [
    { field: "title", before: "A", after: "B" },
    { field: "title", before: "B", after: "C" },
   ],
  })).toThrow(/unique per version/)
 })

 it("derives stable compatibility ids from legacy project/video scope", () => {
  expect(deriveLegacyContentBuildId({ projectId: "project 12" })).toBe("cb:project:project%2012")
  expect(deriveLegacyContentBuildId({ videoId: "abc123" })).toBe("cb:video:abc123")
  expect(deriveLegacyContentBuildId({})).toBeNull()
 })

 it("tracks versions and variant-group selection without replacing asset identity", () => {
  const build = createContentBuild({ id: "cb-variants" })
  const v1 = createContentBuildAssetVersion({
   contentBuildId: build.id,
   assetId: "thumb-a",
   slot: "thumbnail",
   label: "A",
   sourceToolId: "thumbnail-studio",
  })
  const v2 = createContentBuildAssetVersion({
   contentBuildId: build.id,
   assetId: "thumb-b",
   slot: "thumbnail",
   label: "B",
   parentVersionId: v1.id,
   parentAssetId: "thumb-a",
   sourceToolId: "thumbnail-studio",
  })
  const group = createContentBuildVariantGroup({
   contentBuildId: build.id,
   slot: "thumbnail",
   label: "Thumbnail candidates",
   sourceToolId: "thumbnail-studio",
  })
  addContentBuildVariant({
   contentBuildId: build.id,
   groupId: group.id,
   assetId: "thumb-a",
   versionId: v1.id,
   sourceToolId: "thumbnail-studio",
  })
  addContentBuildVariant({
   contentBuildId: build.id,
   groupId: group.id,
   assetId: "thumb-b",
   versionId: v2.id,
   sourceToolId: "thumbnail-studio",
  })
  selectContentBuildVariant({
   contentBuildId: build.id,
   groupId: group.id,
   assetId: "thumb-b",
   final: true,
   sourceToolId: "thumbnail-studio",
  })

  const snapshot = getContentBuild(build.id)!
  expect(snapshot.versions.map(version => version.version)).toEqual([1, 2])
  expect(snapshot.variantGroups[0].members).toHaveLength(2)
  expect(snapshot.variantGroups[0].finalAssetId).toBe("thumb-b")
  expect(snapshot.selections.thumbnail).toBe("thumb-b")
  expect(listContentBuildEvents(build.id).map(event => event.eventType)).toEqual(
   expect.arrayContaining(["asset.versioned", "asset.variant.created", "asset.finalized"]),
  )
 })

})
