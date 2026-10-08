import {
  getContentBuild,
  selectContentBuildVariant,
  setContentBuildSelection,
} from "./asset-engine/ContentBuildRepository"
import { listAssets } from "./assetEngine"

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
      payload: payload && typeof payload === "object" ? payload as PublisherMetadataPackageOption["payload"] : {},
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
  return selected
}
