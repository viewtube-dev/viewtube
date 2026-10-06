import type { Project } from "../../types"
import type { ViewTubeVideoPackage, PackageArtifactRef } from "../../services/video-package/contracts"

export type ProjectManifestationPackageLike = Pick<
  ViewTubeVideoPackage,
  "id" | "projectId" | "contentBuildId" | "identity" | "packaging"
> & Partial<Pick<ViewTubeVideoPackage, "creative" | "production">>

export type ProjectManifestationAssetSlot = {
  slot: string
  label: string
  assetId: string | null
  artifact?: PackageArtifactRef | null
  availableCount: number
}

export type ProjectManifestation = {
  projectId: string
  projectName: string
  contentBuildId: string | null
  videoPackageId: string | null
  revision: number | null
  title: string
  description: string
  tags: string[]
  thumbnailUrl: string | null
  status: string
  format: string | null
  updatedAt: string | number | null
  slots: ProjectManifestationAssetSlot[]
}

const text = (value: unknown) => typeof value === "string" ? value.trim() : ""

const artifactPreviewUrl = (artifact?: PackageArtifactRef | null): string | null => {
  const metadata = artifact?.metadata
  if (!metadata || typeof metadata !== "object") return null
  for (const key of ["imageUrl", "thumbnailUrl", "previewUrl", "url"]) {
    const value = metadata[key]
    if (typeof value === "string" && value.trim()) return value
  }
  return null
}

const selectedArtifact = (
  variants: PackageArtifactRef[] | undefined,
  selectedId: string | null | undefined,
): PackageArtifactRef | null => {
  if (!variants?.length) return null
  return variants.find(item => item.id === selectedId)
    || (variants.length === 1 ? variants[0] : null)
}

export const getManifestThumbnailUrl = (manifest: ProjectManifestation): string | null =>
  manifest.thumbnailUrl || null

export const getManifestPackageForProject = (
  packages: ProjectManifestationPackageLike[],
  projectId: string,
  contentBuildId?: string | null,
): ProjectManifestationPackageLike | null =>
  packages.find(candidate =>
    candidate.projectId === projectId
    && (!contentBuildId || candidate.contentBuildId === contentBuildId)
  ) || null

export const buildProjectManifest = (
  project: Project,
  videoPackage?: ProjectManifestationPackageLike | null,
): ProjectManifestation => {
  const selectedThumbnail = selectedArtifact(
    videoPackage?.packaging.thumbnailVariants,
    videoPackage?.packaging.selectedThumbnailId,
  )
  const packageDescription = videoPackage?.packaging.description?.metadata?.text
  const packageTags = videoPackage?.packaging.tags?.metadata?.tags

  const title = text(project.videoTitle)
    || text(videoPackage?.identity.workingTitle)
    || project.name
  const description = text(project.description)
    || (typeof packageDescription === "string" ? packageDescription.trim() : "")
  const tags = Array.isArray(packageTags)
    ? packageTags.map(value => String(value).trim()).filter(Boolean)
    : text(project.tags).split(",").map(value => value.trim()).filter(Boolean)

  return {
    projectId: project.id,
    projectName: project.name,
    contentBuildId: project.contentBuildId || videoPackage?.contentBuildId || null,
    videoPackageId: videoPackage?.id || null,
    revision: null,
    title,
    description,
    tags,
    thumbnailUrl: artifactPreviewUrl(selectedThumbnail) || project.thumbnailUrl || null,
    status: project.status,
    format: videoPackage?.identity.format || (typeof project.plan?.format === "string" ? project.plan.format : null),
    updatedAt: project.updatedAt || videoPackage?.identity.updatedAt || null,
    slots: [
      {
        slot: "title",
        label: "TITLE",
        assetId: videoPackage?.packaging.titleVariants.find(item => item.id === videoPackage.packaging.selectedTitleId)?.vaultAssetId || null,
        artifact: videoPackage?.packaging.titleVariants.find(item => item.id === videoPackage.packaging.selectedTitleId) || null,
        availableCount: videoPackage?.packaging.titleVariants.length || 0,
      },
      {
        slot: "thumbnail",
        label: "THUMBNAIL",
        assetId: selectedThumbnail?.vaultAssetId || null,
        artifact: selectedThumbnail,
        availableCount: videoPackage?.packaging.thumbnailVariants.length || 0,
      },
      {
        slot: "description",
        label: "DESCRIPTION",
        assetId: videoPackage?.packaging.description?.vaultAssetId || null,
        artifact: videoPackage?.packaging.description || null,
        availableCount: videoPackage?.packaging.description ? 1 : 0,
      },
      {
        slot: "tags",
        label: "TAGS",
        assetId: videoPackage?.packaging.tags?.vaultAssetId || null,
        artifact: videoPackage?.packaging.tags || null,
        availableCount: videoPackage?.packaging.tags ? 1 : 0,
      },
      {
        slot: "script",
        label: "SCRIPT",
        assetId: videoPackage?.creative.script?.vaultAssetId || null,
        artifact: videoPackage?.creative.script || null,
        availableCount: videoPackage?.creative.script ? 1 : 0,
      },
      {
        slot: "storyboard",
        label: "STORYBOARD",
        assetId: videoPackage?.creative.storyboard?.vaultAssetId || null,
        artifact: videoPackage?.creative.storyboard || null,
        availableCount: videoPackage?.creative.storyboard ? 1 : 0,
      },
      {
        slot: "final-render",
        label: "FINAL VIDEO",
        assetId: videoPackage?.production.renderIds.at(-1) || null,
        artifact: null,
        availableCount: videoPackage?.production.renderIds.length || 0,
      },
    ],
  }
}
