import {
  getContentBuild,
  selectContentBuildVariant,
  setContentBuildSelection,
} from "./asset-engine/ContentBuildRepository"
import { listAssets } from "./assetEngine"
import { findVideoPackageByProject, saveVideoPackage } from "./video-package/VideoPackageRepository"
import type { PackageArtifactRef } from "./video-package/contracts"

export type PublisherMetadataPackageOption = {
  assetId: string
  versionId: string | null
  label: string
  selected: boolean
  status: string
  createdAt: string
  payload: {
    title?: string
    description?: string
    tags?: string
    category?: string
    visibility?: string
    audience?: boolean
    timestamps?: string
    location?: string
    community?: boolean
    aiUse?: boolean
    playlistIds?: string
    titleAssetId?: string | null
    thumbnailAssetId?: string | null
    descriptionAssetId?: string | null
    tagsAssetId?: string | null
    finalVideoAssetId?: string | null
    thumbnailPreviewUrl?: string | null
    createdAt?: string
  }
}

const OPTION_SLOT = "metadata-package"
const OPTION_GROUP_LABEL = "Publisher Metadata Sets"

export const listPublisherMetadataPackageOptions = (
  contentBuildId: string,
): PublisherMetadataPackageOption[] => {
  const build = getContentBuild(contentBuildId)
  if (!build) return []
  const group = (build.variantGroups || []).find(candidate =>
    candidate.slot === OPTION_SLOT && candidate.label === OPTION_GROUP_LABEL,
  )
  if (!group) return []

  const assets = new Map(listAssets().map(asset => [asset.id, asset]))
  return group.members.map(member => {
    const asset = assets.get(member.assetId)
    const payload = asset?.metadata?.payload
    return {
      assetId: member.assetId,
      versionId: member.versionId || null,
      label: member.label || "Metadata option",
      selected: group.selectedAssetId === member.assetId || build.selections[OPTION_SLOT] === member.assetId,
      status: member.status,
      createdAt: member.createdAt,
      payload: payload && typeof payload === "object" ? {
        ...(payload as PublisherMetadataPackageOption["payload"]),
        thumbnailPreviewUrl: (assets.get((payload as PublisherMetadataPackageOption["payload"]).thumbnailAssetId || "")?.previewUrl
          || assets.get((payload as PublisherMetadataPackageOption["payload"]).thumbnailAssetId || "")?.url
          || null),
      } : {},
    }
  })
}

export const selectPublisherMetadataPackageOption = (
  contentBuildId: string,
  assetId: string,
  input: { sourceToolId?: string; final?: boolean } = {},
) => {
  const build = getContentBuild(contentBuildId)
  if (!build) throw new Error("Unknown ContentBuild: " + contentBuildId)
  const group = (build.variantGroups || []).find(candidate =>
    candidate.slot === OPTION_SLOT && candidate.label === OPTION_GROUP_LABEL,
  )
  if (!group) throw new Error("No Publisher Metadata Sets exist for this ContentBuild.")
  const member = group.members.find(candidate => candidate.assetId === assetId)
  if (!member) throw new Error("Metadata option is not part of this Project.")

  const selected = selectContentBuildVariant({
    contentBuildId,
    groupId: group.id,
    assetId,
    sourceToolId: input.sourceToolId || "video-publisher",
    actorType: "creator",
    final: Boolean(input.final),
  })
  setContentBuildSelection(contentBuildId, OPTION_SLOT, assetId, {
    toolId: input.sourceToolId || "video-publisher",
    actorType: "creator",
    final: Boolean(input.final),
  })

  // Restore the selected set into canonical ContentBuild field selections and the
  // existing Project Video Package; selecting an option must not create a parallel package.
  const assets = new Map(listAssets().map(asset => [asset.id, asset]))
  const optionAsset = assets.get(assetId)
  const payload = (optionAsset?.metadata?.payload || {}) as PublisherMetadataPackageOption["payload"]
  const selectedBuild = getContentBuild(contentBuildId)!
  const projectId = selectedBuild.legacyProjectId
  const videoPackage = projectId ? findVideoPackageByProject(projectId, contentBuildId) : null
  const toolId = input.sourceToolId || "video-publisher"

  const selectPayloadAsset = (slot: string, payloadAssetId?: string | null) => {
    if (payloadAssetId && assets.has(payloadAssetId)) {
      setContentBuildSelection(contentBuildId, slot, payloadAssetId, {
        toolId, actorType: "creator", final: Boolean(input.final),
      })
    }
  }
  selectPayloadAsset("title", payload.titleAssetId)
  selectPayloadAsset("description", payload.descriptionAssetId)
  selectPayloadAsset("tags", payload.tagsAssetId)
  selectPayloadAsset("thumbnail", payload.thumbnailAssetId)
  selectPayloadAsset("final-render", payload.finalVideoAssetId)

  if (videoPackage) {
    const artifactFor = (id: string | null | undefined, kind: PackageArtifactRef["kind"]): PackageArtifactRef | null => {
      if (!id) return null
      const asset = assets.get(id)
      if (!asset) return null
      return {
        id: `publisher:${kind}:${asset.id}`,
        kind,
        version: 1,
        label: asset.name,
        sourceToolId: toolId,
        vaultAssetId: asset.id,
        createdAt: typeof asset.createdAt === "number" ? new Date(asset.createdAt).toISOString() : asset.createdAt || new Date().toISOString(),
        metadata: {
          url: asset.url || null,
          previewUrl: asset.previewUrl || asset.url || null,
          mimeType: asset.mimeType || null,
        },
      }
    }
    const titleArtifact = artifactFor(payload.titleAssetId, "title")
    const descriptionArtifact = artifactFor(payload.descriptionAssetId, "description")
    const tagsArtifact = artifactFor(payload.tagsAssetId, "tags")
    const thumbnailArtifact = artifactFor(payload.thumbnailAssetId, "thumbnail")
    const hasArtifact = (items: PackageArtifactRef[], artifact: PackageArtifactRef | null) =>
      artifact ? items.some(item => item.id === artifact.id) : false
    saveVideoPackage({
      ...videoPackage,
      version: videoPackage.version + 1,
      identity: {
        ...videoPackage.identity,
        workingTitle: payload.title || videoPackage.identity.workingTitle,
        updatedAt: new Date().toISOString(),
      },
      packaging: {
        ...videoPackage.packaging,
        titleVariants: titleArtifact && !hasArtifact(videoPackage.packaging.titleVariants, titleArtifact)
          ? [...videoPackage.packaging.titleVariants, titleArtifact] : videoPackage.packaging.titleVariants,
        selectedTitleId: titleArtifact?.id || videoPackage.packaging.selectedTitleId || null,
        thumbnailVariants: thumbnailArtifact && !hasArtifact(videoPackage.packaging.thumbnailVariants, thumbnailArtifact)
          ? [...videoPackage.packaging.thumbnailVariants, thumbnailArtifact] : videoPackage.packaging.thumbnailVariants,
        selectedThumbnailId: thumbnailArtifact?.id || videoPackage.packaging.selectedThumbnailId || null,
        description: descriptionArtifact || videoPackage.packaging.description,
        tags: tagsArtifact || videoPackage.packaging.tags,
      },
      contentBuildRevision: getContentBuild(contentBuildId)?.revision || videoPackage.contentBuildRevision,
      provenance: videoPackage.provenance.some(entry => entry.id === `${videoPackage.id}:metadata-option-selected:${assetId}`)
        ? videoPackage.provenance
        : [...videoPackage.provenance, {
            id: `${videoPackage.id}:metadata-option-selected:${assetId}`,
            action: "metadata_option_selected",
            sourceToolId: toolId,
            artifactIds: [assetId, ...[payload.titleAssetId, payload.descriptionAssetId, payload.tagsAssetId, payload.thumbnailAssetId].filter((value): value is string => Boolean(value))],
            evidenceIds: [],
            createdAt: new Date().toISOString(),
          }],
    })
  }
  return selected
}
