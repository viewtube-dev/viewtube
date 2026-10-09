import { beforeEach, describe, expect, it } from "vitest"
import { resetVideoPackageRepositoryForTests } from "./video-package/VideoPackageRepository"
import { getContentBuild, resetContentBuildRepositoryForTests } from "./asset-engine/ContentBuildRepository"
import { savePublisherMetadataToProject } from "./publisherMetadataProjectPersistence"
import { ensureVideoPackageForProject } from "./video-package/ProjectVideoPackageBridge"

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
