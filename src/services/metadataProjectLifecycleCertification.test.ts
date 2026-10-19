import { describe, expect, it, beforeEach } from "vitest"
import type { Project } from "../types"
import {
  appendContentBuildEvent,
  attachAssetToContentBuild,
  bindYouTubeVideo,
  getContentBuild,
  listContentBuildEvents,
  resetContentBuildRepositoryForTests,
  setContentBuildSelection,
} from "./asset-engine/ContentBuildRepository"
import { projectPublishingPackage } from "./asset-engine/PublishingPackageProjection"
import { evaluateAlgorithmEvent } from "./brain/AlgorithmEvaluationEngine"
import type { AlgorithmIntelligenceEvent } from "./brain/AlgorithmIntelligenceEventLedger"
import {
  getVideoPackage,
  listVideoPackages,
  resetVideoPackageRepositoryForTests,
  saveVideoPackage,
} from "./video-package/VideoPackageRepository"
import { initializeProjectContentIdentity } from "./projects/ProjectContentIdentityService"

const seedProject = (): Project => ({
  id: "metadata-lifecycle-project",
  name: "Metadata lifecycle certification",
  videoTitle: "How a small metadata change is evaluated",
  status: "ideation",
  concept: "A deterministic metadata lifecycle fixture",
  plan: {
    concept: "A deterministic metadata lifecycle fixture",
    niche: "Creator education",
    format: "long",
  },
})

describe("metadata/project lifecycle certification", () => {
  beforeEach(() => {
    resetContentBuildRepositoryForTests()
    resetVideoPackageRepositoryForTests()
  })

  it("preserves one Project → ContentBuild → metadata package → published binding → analytics → evaluation lineage", () => {
    const project = seedProject()
    const identity = initializeProjectContentIdentity(project, {
      channelId: "channel-metadata-fixture",
      sourceToolId: "metadata-master",
    })

    expect(identity.project.contentBuildId).toBe(identity.contentBuildId)
    expect(identity.videoPackageId).toBeTruthy()
    expect(listVideoPackages()).toHaveLength(1)

    const titleAssetId = "metadata-title-option-a"
    const thumbnailAssetId = "metadata-thumbnail-option-a"
    attachAssetToContentBuild(identity.contentBuildId, titleAssetId, {
      toolId: "metadata-master",
    })
    attachAssetToContentBuild(identity.contentBuildId, thumbnailAssetId, {
      toolId: "metadata-master",
    })
    setContentBuildSelection(identity.contentBuildId, "title", titleAssetId, {
      final: true,
      toolId: "metadata-master",
      actorType: "creator",
    })
    setContentBuildSelection(identity.contentBuildId, "thumbnail", thumbnailAssetId, {
      final: true,
      toolId: "metadata-master",
      actorType: "creator",
    })

    const initialPackage = getVideoPackage(identity.videoPackageId!)
    expect(initialPackage).not.toBeNull()
    const packageWithMetadata = {
      ...initialPackage!,
      packaging: {
        ...initialPackage!.packaging,
        titleVariants: [{
          id: titleAssetId,
          kind: "title" as const,
          version: 1,
          label: "Candidate title A",
          sourceToolId: "metadata-master",
          vaultAssetId: titleAssetId,
          createdAt: "2026-10-13T12:00:00.000Z",
        }],
        thumbnailVariants: [{
          id: thumbnailAssetId,
          kind: "thumbnail" as const,
          version: 1,
          label: "Candidate thumbnail A",
          sourceToolId: "metadata-master",
          vaultAssetId: thumbnailAssetId,
          createdAt: "2026-10-13T12:00:00.000Z",
        }],
        selectedTitleId: titleAssetId,
        selectedThumbnailId: thumbnailAssetId,
      },
    }
    const savedPackage = saveVideoPackage(packageWithMetadata)
    const reloadedPackage = getVideoPackage(savedPackage.id)

    expect(reloadedPackage?.projectId).toBe(project.id)
    expect(reloadedPackage?.contentBuildId).toBe(identity.contentBuildId)
    expect(reloadedPackage?.packaging.selectedTitleId).toBe(titleAssetId)
    expect(reloadedPackage?.packaging.selectedThumbnailId).toBe(thumbnailAssetId)

    bindYouTubeVideo({
      contentBuildId: identity.contentBuildId,
      channelId: "channel-metadata-fixture",
      videoId: "yt-metadata-fixture",
      status: "published",
      publishedAt: "2026-10-13T12:00:00.000Z",
    })

    const projection = projectPublishingPackage(reloadedPackage!)
    expect(projection).toMatchObject({
      projectId: project.id,
      contentBuildId: identity.contentBuildId,
      videoPackageId: savedPackage.id,
      titleAssetId,
      thumbnailAssetId,
      publishedVideoId: "yt-metadata-fixture",
    })

    const evidenceId = "analytics-evidence:metadata-lifecycle-fixture"
    const checkpoint = appendContentBuildEvent({
      contentBuildId: identity.contentBuildId,
      eventType: "analytics.checkpoint",
      entityType: "published-video",
      entityId: "yt-metadata-fixture",
      actorType: "analytics",
      toolId: "analytics",
      evidenceIds: [evidenceId],
      metadata: {
        projectId: project.id,
        videoPackageId: savedPackage.id,
        videoId: "yt-metadata-fixture",
        windowId: "before-after-fixture-window",
        measuredMetric: "views",
      },
      timestamp: "2026-10-13T12:05:00.000Z",
    })

    const sourceEvent: AlgorithmIntelligenceEvent = {
      id: "evaluation-source:metadata-lifecycle-fixture",
      channelId: "channel-metadata-fixture",
      projectId: project.id,
      videoId: "yt-metadata-fixture",
      kind: "CHECKPOINT_REACHED",
      sourceSystem: "evaluation",
      sourceId: checkpoint.id,
      parentEventIds: [checkpoint.id],
      evidenceIds: [evidenceId],
      confidence: "high",
      title: "Metadata update measurement checkpoint",
      summary: "Deterministic test-only checkpoint for lifecycle certification.",
      evaluationTargets: [{
        metric: "views",
        direction: "increase",
        baselineValue: 100,
        minimumRelativeChange: 0.1,
      }],
      checkpointAt: Date.parse("2026-10-12T12:00:00.000Z"),
      metadata: {
        projectId: project.id,
        contentBuildId: identity.contentBuildId,
        videoPackageId: savedPackage.id,
        checkpointEventId: checkpoint.id,
      },
      createdAt: Date.parse("2026-10-13T12:06:00.000Z"),
    }
    const evaluation = evaluateAlgorithmEvent({
      event: sourceEvent,
      observations: [{
        metric: "views",
        value: 130,
        observedAt: Date.parse("2026-10-13T12:05:00.000Z"),
        evidenceId,
      }],
      now: Date.parse("2026-10-13T12:07:00.000Z"),
    })

    const build = getContentBuild(identity.contentBuildId)
    const events = listContentBuildEvents(identity.contentBuildId)
    expect(build?.youtube?.videoId).toBe("yt-metadata-fixture")
    expect(build?.selections).toMatchObject({
      title: titleAssetId,
      thumbnail: thumbnailAssetId,
    })
    expect(events.map(event => event.eventType)).toEqual(expect.arrayContaining([
      "build.created",
      "asset.attached",
      "asset.finalized",
      "youtube.bound",
      "analytics.checkpoint",
    ]))
    expect(events.every(event => event.contentBuildId === identity.contentBuildId)).toBe(true)
    expect(checkpoint.evidenceIds).toContain(evidenceId)
    expect(sourceEvent.parentEventIds).toContain(checkpoint.id)
    expect(evaluation).toMatchObject({
      eventId: sourceEvent.id,
      channelId: "channel-metadata-fixture",
      status: "positive",
      evidenceIds: [evidenceId],
    })
    expect(listVideoPackages()).toHaveLength(1)
  })
})
