import { beforeEach, describe, expect, it } from "vitest"
import { resetVideoPackageRepositoryForTests } from "./video-package/VideoPackageRepository"
import { getContentBuild, resetContentBuildRepositoryForTests } from "./asset-engine/ContentBuildRepository"
import { savePublisherMetadataToProject } from "./publisherMetadataProjectPersistence"
import { createVersionedAsset } from "./assetEngine"
import { ensureVideoPackageForProject } from "./video-package/ProjectVideoPackageBridge"
import { findVideoPackageByProject } from "./video-package/VideoPackageRepository"

const project = {
  id: "project-publisher-persistence",
  contentBuildId: "cb-publisher-persistence",
  name: "Publisher Persistence Test",
  status: "active",
  videoTitle: "Original title",
  description: "",
  tags: "",
  plan: { concept: "Test concept", niche: "Testing" },
} as any

describe("Publisher metadata project persistence", () => {
  beforeEach(() => {
    localStorage.clear()
    resetVideoPackageRepositoryForTests()
    resetContentBuildRepositoryForTests()
  })

  it("saves title, description and tags into the canonical ContentBuild and Video Package", () => {
    ensureVideoPackageForProject(project, { channelId: "channel-1", sourceToolId: "video-publisher" })

    const result = savePublisherMetadataToProject(project, "channel-1", {
      title: "Saved publisher title",
      description: "Saved publisher description",
      tags: "one, two",
      category: "22",
      visibility: "private",
    }, { mode: "current", now: "2026-10-08T12:00:00.000Z" })

    const build = getContentBuild(project.contentBuildId)
    expect(result.videoPackageId).toBeTruthy()
    expect(build?.selections.title).toBeTruthy()
    expect(build?.selections.description).toBeTruthy()
    expect(build?.selections.tags).toBeTruthy()
    expect(build?.selections["metadata-package"]).toBe(result.packageOptionAssetId)
  })

  it("saves Publisher metadata into a local-draft package without a connected channel", () => {
    const result = savePublisherMetadataToProject(project, null, {
      title: "Offline test title",
      description: "Saved without account authentication",
      tags: "local, testing",
    }, { mode: "current", now: "2026-10-13T12:00:00.000Z" })

    const videoPackage = findVideoPackageByProject(project.id, project.contentBuildId)
    expect(result.videoPackageId).toBeTruthy()
    expect(videoPackage?.channelId).toBe(`local-draft:${project.id}`)
    expect(getContentBuild(project.contentBuildId)?.selections["metadata-package"]).toBe(result.packageOptionAssetId)
  })

  it("round-trips canonical thumbnail and final-video asset references into the selected package", () => {
    ensureVideoPackageForProject(project, { channelId: "channel-1", sourceToolId: "video-publisher" })
    const context = {
      contentBuildId: project.contentBuildId,
      projectId: project.id,
      projectName: project.name,
      stage: "metadata" as const,
    }
    const thumbnail = createVersionedAsset({
      sourceToolId: "video-publisher",
      sourceKind: "studio-tool",
      payloadKind: "metadata",
      name: "Canonical thumbnail",
      summary: "Test thumbnail asset",
      kind: "image",
      url: "https://example.test/thumbnail.png",
      mimeType: "image/png",
      slot: "thumbnail",
      context,
    }).asset
    const finalVideo = createVersionedAsset({
      sourceToolId: "video-publisher",
      sourceKind: "studio-tool",
      payloadKind: "metadata",
      name: "Final video",
      summary: "Test final video asset",
      kind: "video",
      url: "https://example.test/final.mp4",
      mimeType: "video/mp4",
      slot: "final-render",
      context,
    }).asset

    const saved = savePublisherMetadataToProject(project, "channel-1", {
      title: "Media round-trip",
      description: "Keep canonical asset identities",
      tags: "media, round-trip",
      thumbnailAssetId: thumbnail.id,
      finalVideoAssetId: finalVideo.id,
    }, {
      mode: "current",
      thumbnailAsset: {
        id: thumbnail.id,
        name: thumbnail.name,
        url: thumbnail.url,
        previewUrl: thumbnail.previewUrl,
        mimeType: thumbnail.mimeType,
      },
      finalVideoAsset: {
        id: finalVideo.id,
        name: finalVideo.name,
        url: finalVideo.url,
        previewUrl: finalVideo.previewUrl,
        mimeType: finalVideo.mimeType,
      },
    })

    const build = getContentBuild(project.contentBuildId)!
    expect(build.selections.thumbnail).toBe(thumbnail.id)
    expect(build.selections["final-render"]).toBe(finalVideo.id)
    expect(build.selections["metadata-package"]).toBe(saved.packageOptionAssetId)

    const videoPackage = findVideoPackageByProject(project.id, project.contentBuildId)
    expect(videoPackage?.packaging.selectedThumbnailId).toBe(`publisher:thumbnail:${thumbnail.id}`)
    expect(videoPackage?.packaging.thumbnailVariants).toContainEqual(expect.objectContaining({
      id: `publisher:thumbnail:${thumbnail.id}`,
      vaultAssetId: thumbnail.id,
      metadata: expect.objectContaining({
        url: "https://example.test/thumbnail.png",
        previewUrl: "https://example.test/thumbnail.png",
        mimeType: "image/png",
      }),
    }))
    expect(videoPackage?.production.renderIds).toContain(finalVideo.id)
  })

  it("saves an option without replacing the currently selected package option", () => {
    ensureVideoPackageForProject(project, { channelId: "channel-1", sourceToolId: "video-publisher" })

    const current = savePublisherMetadataToProject(project, "channel-1", {
      title: "Current title",
      description: "Current description",
      tags: "current",
    }, { mode: "current" })

    const currentTitleAssetId = getContentBuild(project.contentBuildId)?.selections.title
    const option = savePublisherMetadataToProject(project, "channel-1", {
      title: "Alternative title",
      description: "Alternative description",
      tags: "alternative",
    }, { mode: "option" })

    const build = getContentBuild(project.contentBuildId)!
    expect(option.packageOptionAssetId).not.toBe(current.packageOptionAssetId)
    expect(build.selections["metadata-package"]).toBe(current.packageOptionAssetId)
    expect(build.variantGroups.find(group => group.slot === "metadata-package")?.members.length).toBe(2)
    expect(build.selections.title).toBe(currentTitleAssetId)
  })
})
