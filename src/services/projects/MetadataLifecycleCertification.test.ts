import { beforeEach, describe, expect, it } from "vitest"
import type { Project } from "../../types"
import {
  addContentBuildVariant,
  appendContentBuildEvent,
  bindYouTubeVideo,
  createContentBuildAssetVersion,
  createContentBuildVariantGroup,
  getContentBuild,
  listContentBuildEvents,
  resetContentBuildRepositoryForTests,
  selectContentBuildVariant,
  setContentBuildSelection,
} from "../asset-engine/ContentBuildRepository"
import { evaluateAlgorithmEvent } from "../brain/AlgorithmEvaluationEngine"
import {
  findVideoPackageByProject,
  getVideoPackage,
  resetVideoPackageRepositoryForTests,
  saveVideoPackage,
} from "../video-package/VideoPackageRepository"
import { initializeProjectContentIdentity } from "./ProjectContentIdentityService"

const projectFixture = (): Project => ({
  id: "metadata-lifecycle-cert-project",
  name: "Metadata Lifecycle Certification",
  videoTitle: "The Certified Working Title",
  status: "ideation",
  concept: "Prove metadata package lineage through publication and measurement",
  plan: {
    concept: "Prove metadata package lineage through publication and measurement",
    niche: "ViewTube system certification",
    format: "long",
  },
})

const artifact = (
  id: string,
  kind: "title" | "thumbnail" | "description" | "tags",
  label: string,
  metadata: Record<string, unknown> = {},
) => ({
  id,
  kind,
  version: 1,
  label,
  sourceToolId: "metadata-master",
  vaultAssetId: id.replace(/^artifact:/, "asset:"),
  createdAt: "2026-10-13T12:00:00.000Z",
  metadata,
})

describe("metadata/project lifecycle certification fixture", () => {
  beforeEach(() => {
    resetContentBuildRepositoryForTests()
    resetVideoPackageRepositoryForTests()
  })

  it("preserves one project/build/package identity from selected metadata option through analytics evaluation", () => {
    const identity = initializeProjectContentIdentity(projectFixture(), {
      channelId: "channel-certification",
      sourceToolId: "metadata-lifecycle-certification",
    })
    const { project, contentBuildId, videoPackageId } = identity

    expect(project.contentBuildId).toBe(contentBuildId)
    expect(videoPackageId).toBeTruthy()

    const titleA = "asset:title-option-a"
    const titleB = "asset:title-option-b"
    const thumbnail = "asset:thumbnail-option-a"
    const description = "asset:description-v1"
    const tags = "asset:tags-v1"
    const render = "asset:final-render-v1"

    const titleVersionA = createContentBuildAssetVersion({
      contentBuildId,
      assetId: titleA,
      slot: "title",
      label: "Title option A",
      sourceToolId: "metadata-master",
    })
    const titleVersionB = createContentBuildAssetVersion({
      contentBuildId,
      assetId: titleB,
      slot: "title",
      label: "Title option B",
      parentVersionId: titleVersionA.id,
      parentAssetId: titleA,
      sourceToolId: "metadata-master",
    })
    const titleGroup = createContentBuildVariantGroup({
      contentBuildId,
      slot: "title",
      label: "Metadata title alternatives",
      sourceToolId: "metadata-master",
    })
    addContentBuildVariant({
      contentBuildId,
      groupId: titleGroup.id,
      assetId: titleA,
      versionId: titleVersionA.id,
      label: "Option A",
      sourceToolId: "metadata-master",
    })
    addContentBuildVariant({
      contentBuildId,
      groupId: titleGroup.id,
      assetId: titleB,
      versionId: titleVersionB.id,
      label: "Option B",
      sourceToolId: "metadata-master",
    })
    selectContentBuildVariant({
      contentBuildId,
      groupId: titleGroup.id,
      assetId: titleB,
      final: true,
      sourceToolId: "metadata-master",
      actorType: "creator",
    })

    for (const [slot, assetId] of [
      ["thumbnail", thumbnail],
      ["description", description],
      ["tags", tags],
      ["final-render", render],
    ] as const) {
      setContentBuildSelection(contentBuildId, slot, assetId, {
        toolId: "metadata-master",
        actorType: "creator",
      })
    }

    const initialPackage = findVideoPackageByProject(project.id, contentBuildId)
    expect(initialPackage).not.toBeNull()
    const titleArtifactA = artifact("artifact:title-option-a", "title", "Title option A", { text: "Title option A" })
    const titleArtifactB = artifact("artifact:title-option-b", "title", "Title option B", { text: "Title option B" })
    const thumbnailArtifact = artifact("artifact:thumbnail-option-a", "thumbnail", "Thumbnail option A", { previewUrl: "https://example.invalid/thumbnail.png" })
    const descriptionArtifact = artifact("artifact:description-v1", "description", "Description v1", { text: "A certified description used by the lifecycle fixture." })
    const tagsArtifact = artifact("artifact:tags-v1", "tags", "Tags v1", { tags: ["metadata", "lifecycle", "certification"] })

    const packageToSave = {
      ...initialPackage!,
      contentBuildRevision: getContentBuild(contentBuildId)!.revision,
      version: initialPackage!.version + 1,
      identity: { ...initialPackage!.identity, workingTitle: "Title option B", updatedAt: "2026-10-13T12:01:00.000Z" },
      packaging: {
        ...initialPackage!.packaging,
        titleVariants: [titleArtifactA, titleArtifactB],
        selectedTitleId: titleArtifactB.id,
        thumbnailVariants: [thumbnailArtifact],
        selectedThumbnailId: thumbnailArtifact.id,
        description: descriptionArtifact,
        tags: tagsArtifact,
      },
      production: {
        ...initialPackage!.production,
        renderIds: [render],
      },
    }
    const savedPackage = saveVideoPackage(packageToSave)

    expect(savedPackage.id).toBe(videoPackageId)
    expect(savedPackage.projectId).toBe(project.id)
    expect(savedPackage.contentBuildId).toBe(contentBuildId)
    expect(savedPackage.packaging.selectedTitleId).toBe(titleArtifactB.id)
    expect(getVideoPackage(savedPackage.id)?.packaging.selectedTitleId).toBe(titleArtifactB.id)

    bindYouTubeVideo({
      contentBuildId,
      channelId: "channel-certification",
      videoId: "youtube-certification-video",
      status: "published",
      publishedAt: "2026-10-13T12:02:00.000Z",
      initialTitleAssetId: titleB,
      initialThumbnailAssetId: thumbnail,
      finalRenderAssetId: render,
      toolId: "metadata-lifecycle-certification",
    })

    const analyticsEvidenceId = "evidence:youtube-certification-video:24h"
    const checkpoint = appendContentBuildEvent({
      contentBuildId,
      eventType: "analytics.checkpoint",
      entityType: "metadata-package-outcome",
      entityId: "checkpoint:youtube-certification-video:24h",
      actorType: "analytics",
      toolId: "analytics-certification-fixture",
      evidenceIds: [analyticsEvidenceId],
      resultingState: {
        videoId: "youtube-certification-video",
        window: { kind: "24h", start: "2026-10-13T12:02:00.000Z", end: "2026-10-14T12:02:00.000Z" },
        metrics: { views: 120 },
        packageId: savedPackage.id,
        selectedTitleAssetId: titleB,
        selectedThumbnailAssetId: thumbnail,
      },
      metadata: {
        projectId: project.id,
        contentBuildId,
        videoId: "youtube-certification-video",
        packageId: savedPackage.id,
        evidenceId: analyticsEvidenceId,
        source: "deterministic-certification-fixture",
      },
      timestamp: "2026-10-14T12:02:00.000Z",
    })

    const now = Date.parse("2026-10-14T12:03:00.000Z")
    const evaluationEvent = {
      id: "evaluation-source:metadata-lifecycle-certification",
      channelId: "channel-certification",
      projectId: project.id,
      videoId: "youtube-certification-video",
      kind: "RECOMMENDATION_EXECUTED" as const,
      sourceSystem: "workflow" as const,
      parentEventIds: [checkpoint.id],
      evidenceIds: [analyticsEvidenceId],
      confidence: "medium" as const,
      title: "Metadata package update",
      summary: "Evaluate the published metadata package against its checkpoint.",
      evaluationTargets: [{
        metric: "views",
        direction: "increase" as const,
        baselineValue: 100,
        minimumRelativeChange: 0.1,
        windowHours: 24,
      }],
      checkpointAt: now - 60_000,
      metadata: { projectId: project.id, contentBuildId, packageId: savedPackage.id },
      createdAt: now - 86_400_000,
    }
    const evaluation = evaluateAlgorithmEvent({
      event: evaluationEvent,
      observations: [{
        metric: "views",
        value: 120,
        observedAt: now,
        evidenceId: analyticsEvidenceId,
      }],
      now,
    })

    const currentBuild = getContentBuild(contentBuildId)
    const events = listContentBuildEvents(contentBuildId)
    const checkpointIndex = events.findIndex(event => event.id === checkpoint.id)

    expect(currentBuild?.youtube).toMatchObject({
      videoId: "youtube-certification-video",
      status: "published",
      initialTitleAssetId: titleB,
      initialThumbnailAssetId: thumbnail,
      finalRenderAssetId: render,
    })
    expect(currentBuild?.selections).toMatchObject({
      title: titleB,
      thumbnail,
      description,
      tags,
      "final-render": render,
    })
    expect(currentBuild?.variantGroups.find(group => group.id === titleGroup.id)?.finalAssetId).toBe(titleB)
    expect(events.map(event => event.eventType)).toEqual(expect.arrayContaining([
      "build.created",
      "asset.versioned",
      "asset.variant.created",
      "asset.finalized",
      "youtube.bound",
      "analytics.checkpoint",
    ]))
    expect(checkpointIndex).toBeGreaterThan(events.findIndex(event => event.eventType === "youtube.bound"))
    expect(checkpoint.contentBuildId).toBe(contentBuildId)
    expect(checkpoint.evidenceIds).toContain(analyticsEvidenceId)
    expect(evaluation).toMatchObject({
      eventId: evaluationEvent.id,
      channelId: "channel-certification",
      status: "positive",
      evidenceIds: [analyticsEvidenceId],
    })
    expect(evaluation.targetResults[0]).toMatchObject({
      metric: "views",
      baselineValue: 100,
      observedValue: 120,
      status: "met",
    })
    expect(evaluationEvent.metadata).toMatchObject({
      projectId: project.id,
      contentBuildId,
      packageId: savedPackage.id,
    })

    const unavailableEvaluation = evaluateAlgorithmEvent({
      event: evaluationEvent,
      observations: [],
      now,
    })
    expect(unavailableEvaluation).toMatchObject({
      eventId: evaluationEvent.id,
      status: "insufficient_data",
      evidenceIds: [],
    })
  })
})
