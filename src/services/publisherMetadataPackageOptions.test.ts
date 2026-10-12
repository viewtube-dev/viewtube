import { beforeEach, describe, expect, it } from "vitest"
import { getContentBuild, resetContentBuildRepositoryForTests } from "./asset-engine/ContentBuildRepository"
import { ensureVideoPackageForProject } from "./video-package/ProjectVideoPackageBridge"
import { findVideoPackageByProject, resetVideoPackageRepositoryForTests } from "./video-package/VideoPackageRepository"
import { savePublisherMetadataToProject } from "./publisherMetadataProjectPersistence"
import { listPublisherMetadataPackageOptions, selectPublisherMetadataPackageOption } from "./publisherMetadataPackageOptions"

const project = {
  id: "project-publisher-options",
  contentBuildId: "cb-publisher-options",
  name: "Publisher Options Test",
  status: "active",
  videoTitle: "Original",
  description: "",
  tags: "",
  plan: {},
} as any

describe("Publisher metadata package options", () => {
  beforeEach(() => {
    localStorage.clear()
    resetVideoPackageRepositoryForTests()
    resetContentBuildRepositoryForTests()
  })

  it("lists saved current and alternative metadata sets from the canonical variant group", () => {
    ensureVideoPackageForProject(project, { channelId: "channel-options", sourceToolId: "video-publisher" })
    const current = savePublisherMetadataToProject(project, "channel-options", {
      title: "Current", description: "Current description", tags: "current",
    }, { mode: "current" })
    savePublisherMetadataToProject(project, "channel-options", {
      title: "Alternative", description: "Alternative description", tags: "alternative",
    }, { mode: "option" })

    const options = listPublisherMetadataPackageOptions(project.contentBuildId)
    expect(options).toHaveLength(2)
    expect(options.find(option => option.assetId === current.packageOptionAssetId)?.selected).toBe(true)
    expect(options.some(option => option.payload.title === "Alternative")).toBe(true)
  })

  it("restores intentionally blank fields without retaining the previous option's asset selections", () => {
    ensureVideoPackageForProject(project, { channelId: "channel-options", sourceToolId: "video-publisher" })
    const current = savePublisherMetadataToProject(project, "channel-options", {
      title: "Current title",
      description: "Current description",
      tags: "current",
    }, { mode: "current" })
    const currentBuild = getContentBuild(project.contentBuildId)!
    const currentTitleAssetId = currentBuild.selections.title

    const blank = savePublisherMetadataToProject(project, "channel-options", {
      title: "",
      description: "",
      tags: "",
    }, { mode: "option" })
    const blankOption = listPublisherMetadataPackageOptions(project.contentBuildId)
      .find(option => option.assetId === blank.packageOptionAssetId)!
    expect(blankOption.payload.title).toBe("")
    expect(blankOption.payload.description).toBe("")
    expect(blankOption.payload.tags).toBe("")
    expect(blankOption.payload.titleAssetId).toBeTruthy()
    expect(blankOption.payload.titleAssetId).not.toBe(currentTitleAssetId)

    selectPublisherMetadataPackageOption(project.contentBuildId, blank.packageOptionAssetId)
    const restoredBuild = getContentBuild(project.contentBuildId)!
    expect(restoredBuild.selections["metadata-package"]).toBe(blank.packageOptionAssetId)
    expect(restoredBuild.selections.title).toBe(blankOption.payload.titleAssetId)
    expect(restoredBuild.selections.description).toBe(blankOption.payload.descriptionAssetId)
    expect(restoredBuild.selections.tags).toBe(blankOption.payload.tagsAssetId)
    expect(blank.packageOptionAssetId).not.toBe(current.packageOptionAssetId)
  })

  it("selects an alternative without creating a new Project or ContentBuild", () => {
    ensureVideoPackageForProject(project, { channelId: "channel-options", sourceToolId: "video-publisher" })
    const current = savePublisherMetadataToProject(project, "channel-options", {
      title: "Current", description: "Current description", tags: "current",
    }, { mode: "current" })
    const alternative = savePublisherMetadataToProject(project, "channel-options", {
      title: "Alternative", description: "Alternative description", tags: "alternative",
    }, { mode: "option" })

    expect(getContentBuild(project.contentBuildId)?.selections["metadata-package"]).toBe(current.packageOptionAssetId)
    selectPublisherMetadataPackageOption(project.contentBuildId, alternative.packageOptionAssetId)
    const build = getContentBuild(project.contentBuildId)!
    expect(build.selections["metadata-package"]).toBe(alternative.packageOptionAssetId)
    expect(build.variantGroups.find(group => group.slot === "metadata-package")?.members).toHaveLength(2)
    const selectedOption = listPublisherMetadataPackageOptions(project.contentBuildId).find(option => option.assetId === alternative.packageOptionAssetId)!
    expect(build.selections.title).toBe(selectedOption.payload.titleAssetId)
    expect(build.selections.description).toBe(selectedOption.payload.descriptionAssetId)
    expect(build.selections.tags).toBe(selectedOption.payload.tagsAssetId)
    const packageBeforeRepeat = findVideoPackageByProject(project.id, project.contentBuildId)!
    const provenanceCountBeforeRepeat = packageBeforeRepeat.provenance.length
    selectPublisherMetadataPackageOption(project.contentBuildId, alternative.packageOptionAssetId)
    const afterRepeat = getContentBuild(project.contentBuildId)!
    const packageAfterRepeat = findVideoPackageByProject(project.id, project.contentBuildId)!
    expect(afterRepeat.variantGroups.find(group => group.slot === "metadata-package")?.members).toHaveLength(2)
    expect(afterRepeat.id).toBe(build.id)
    expect(packageAfterRepeat.provenance).toHaveLength(provenanceCountBeforeRepeat)
  })
})
