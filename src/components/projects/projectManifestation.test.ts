import { describe, expect, it } from "vitest"
import {
  buildProjectManifest,
  getManifestThumbnailUrl,
  getManifestPackageForProject,
  type ProjectManifestationPackageLike,
} from "./projectManifestation"

const project = {
  id: "project-1",
  contentBuildId: "build-1",
  name: "Launch Video",
  videoTitle: "The Launch",
  description: "A launch description",
  tags: "launch, product",
  thumbnailUrl: "https://example.com/project.jpg",
  status: "active",
}

const pkg: ProjectManifestationPackageLike = {
  id: "package-1",
  projectId: "project-1",
  contentBuildId: "build-1",
  identity: {
    workingTitle: "Package Launch",
    format: "long",
    status: "packaging",
    createdAt: "2026-10-06T00:00:00.000Z",
    updatedAt: "2026-10-06T01:00:00.000Z",
  },
  packaging: {
    titleVariants: [],
    thumbnailVariants: [{
      id: "thumb-1",
      kind: "thumbnail",
      version: 2,
      label: "Final thumbnail",
      sourceToolId: "thumbnail-studio",
      vaultAssetId: "asset-thumb-1",
      createdAt: "2026-10-06T00:00:00.000Z",
      metadata: { imageUrl: "https://example.com/package.jpg" },
    }],
    selectedThumbnailId: "thumb-1",
    description: {
      id: "desc-1",
      kind: "description",
      version: 1,
      label: "Description",
      sourceToolId: "metadata-master",
      createdAt: "2026-10-06T00:00:00.000Z",
    },
    tags: {
      id: "tags-1",
      kind: "tags",
      version: 1,
      label: "Tags",
      sourceToolId: "metadata-master",
      createdAt: "2026-10-06T00:00:00.000Z",
    },
  },
}

describe("Project Manifestation", () => {
  it("keeps project and publishing package identity together", () => {
    const manifest = buildProjectManifest(project, pkg)
    expect(manifest.projectId).toBe("project-1")
    expect(manifest.contentBuildId).toBe("build-1")
    expect(manifest.videoPackageId).toBe("package-1")
    expect(manifest.title).toBe("The Launch")
    expect(manifest.description).toBe("A launch description")
    expect(manifest.tags).toEqual(["launch", "product"])
  })

  it("prefers the selected package thumbnail over the project fallback", () => {
    const manifest = buildProjectManifest(project, pkg)
    expect(getManifestThumbnailUrl(manifest)).toBe("https://example.com/package.jpg")
  })

  it("finds a package only inside the same project/content-build scope", () => {
    expect(getManifestPackageForProject([pkg], "project-1", "build-1")).toBe(pkg)
    expect(getManifestPackageForProject([pkg], "project-1", "other-build")).toBeNull()
  })
})
