import type { Project } from "../../types"
import {
  addContentBuildVariant,
  createContentBuildAssetVersion,
  createContentBuildVariantGroup,
  getContentBuild,
  selectContentBuildVariant,
  setContentBuildSelection,
} from "../asset-engine/ContentBuildRepository"
import { createVersionedAsset } from "../assetEngine"
import { ensureVideoPackageForProject } from "../video-package/ProjectVideoPackageBridge"
import { findVideoPackageByProject, saveVideoPackage } from "../video-package/VideoPackageRepository"
import type { PackageArtifactRef } from "../video-package/contracts"

export type PublisherMetadataSaveMode = "current" | "option"

export type PublisherMetadataState = {
  title: string
  description: string
  tags: string
  category?: string
  visibility?: string
  audience?: boolean
  timestamps?: string
  location?: string
  community?: boolean
  aiUse?: boolean
  playlistIds?: string
  thumbnailAssetId?: string | null
  finalVideoAssetId?: string | null
}

export type PublisherMetadataSaveResult = {
  project: Project
  contentBuildId: string
  videoPackageId: string
  revision: number
  mode: PublisherMetadataSaveMode
  packageOptionAssetId: string
}

const nowIso = () => new Date().toISOString()

const artifactFor = (
  asset: { id: string; name: string; url?: string | null; previewUrl?: string | null; mimeType?: string | null },
  kind: PackageArtifactRef["kind"],
  sourceToolId: string,
  now: string,
): PackageArtifactRef => ({
  id: `publisher:${kind}:${asset.id}`,
  kind,
  version: 1,
  label: asset.name,
  sourceToolId,
  vaultAssetId: asset.id,
  createdAt: now,
  metadata: {
    url: asset.url || null,
    previewUrl: asset.previewUrl || asset.url || null,
    mimeType: asset.mimeType || null,
  },
})

const createMetadataAsset = (
  project: Project,
  contentBuildId: string,
  sourceToolId: string,
  slot: string,
  label: string,
  payload: unknown,
  parentAssetId?: string | null,
) => createVersionedAsset({
  sourceToolId,
  sourceKind: "studio-tool",
  payloadKind: "metadata",
  name: label,
  summary: typeof payload === "string" ? payload : JSON.stringify(payload),
  kind: "document",
  payload,
  tags: ["metadata", "publishing", "content-build", "publisher"],
  slot,
  label,
  parentAssetId: parentAssetId || null,
  context: {
    contentBuildId,
    projectId: project.id,
    projectName: project.name,
    stage: "metadata",
    parentAssetIds: parentAssetId ? [parentAssetId] : [],
  },
})

export const savePublisherMetadataToProject = (
  project: Project,
  channelId: string,
  state: PublisherMetadataState,
  input: {
    mode?: PublisherMetadataSaveMode
    sourceToolId?: string
    thumbnailAsset?: { id: string; name: string; url?: string | null; previewUrl?: string | null; mimeType?: string | null } | null
    finalVideoAsset?: { id: string; name: string; url?: string | null; previewUrl?: string | null; mimeType?: string | null } | null
    now?: string
  } = {},
): PublisherMetadataSaveResult => {
  if (!project.contentBuildId) {
    throw new Error("Publisher cannot save metadata until the Project has a canonical ContentBuild.")
  }
  if (!channelId.trim()) {
    throw new Error("Publisher cannot save metadata without a connected channel.")
  }

  const sourceToolId = input.sourceToolId || "video-publisher"
  const mode = input.mode || "current"
  const now = input.now || nowIso()
  const contentBuild = getContentBuild(project.contentBuildId)
  if (!contentBuild) {
    throw new Error(`Publisher cannot save metadata: unknown ContentBuild ${project.contentBuildId}.`)
  }

  let videoPackage = ensureVideoPackageForProject(project, { channelId, sourceToolId })
  if (!videoPackage) throw new Error("Publisher could not resolve the Project Video Package.")

  const previous = {
    title: contentBuild.selections.title,
    description: contentBuild.selections.description,
    tags: contentBuild.selections.tags,
  }

  const titleAsset = state.title.trim()
    ? createMetadataAsset(project, contentBuild.id, sourceToolId, "title", "Publisher title", state.title, previous.title)
    : null
  const descriptionAsset = state.description.trim()
    ? createMetadataAsset(project, contentBuild.id, sourceToolId, "description", "Publisher description", { description: state.description }, previous.description)
    : null
  const tagsAsset = state.tags.trim()
    ? createMetadataAsset(project, contentBuild.id, sourceToolId, "tags", "Publisher tags", { tags: state.tags }, previous.tags)
    : null

  if (titleAsset) setContentBuildSelection(contentBuild.id, "title", titleAsset.asset.id, { toolId: sourceToolId, actorType: "creator", final: false })
  if (descriptionAsset) setContentBuildSelection(contentBuild.id, "description", descriptionAsset.asset.id, { toolId: sourceToolId, actorType: "creator", final: false })
  if (tagsAsset) setContentBuildSelection(contentBuild.id, "tags", tagsAsset.asset.id, { toolId: sourceToolId, actorType: "creator", final: false })

  if (input.thumbnailAsset) {
    setContentBuildSelection(contentBuild.id, "thumbnail", input.thumbnailAsset.id, { toolId: sourceToolId, actorType: "creator", final: false })
  }
  if (input.finalVideoAsset) {
    setContentBuildSelection(contentBuild.id, "final-render", input.finalVideoAsset.id, { toolId: sourceToolId, actorType: "creator", final: false })
  }

  const refreshed = getContentBuild(contentBuild.id)!
  const optionPayload = {
    title: state.title,
    description: state.description,
    tags: state.tags,
    category: state.category || "",
    visibility: state.visibility || "",
    audience: Boolean(state.audience),
    timestamps: state.timestamps || "",
    location: state.location || "",
    community: Boolean(state.community),
    aiUse: state.aiUse !== false,
    playlistIds: state.playlistIds || "",
    titleAssetId: refreshed.selections.title || null,
    thumbnailAssetId: refreshed.selections.thumbnail || null,
    descriptionAssetId: refreshed.selections.description || null,
    tagsAssetId: refreshed.selections.tags || null,
    finalVideoAssetId: refreshed.selections["final-render"] || null,
    createdAt: now,
  }

  const optionAsset = createMetadataAsset(
    project,
    contentBuild.id,
    sourceToolId,
    "metadata-package",
    mode === "option" ? "Publisher metadata option" : "Publisher saved metadata",
    optionPayload,
  )

  const optionGroup = createContentBuildVariantGroup({
    contentBuildId: contentBuild.id,
    slot: "metadata-package",
    label: "Publisher Metadata Sets",
    sourceToolId,
    metadata: { projectId: project.id, videoPackageId: videoPackage.id },
  })

  addContentBuildVariant({
    contentBuildId: contentBuild.id,
    groupId: optionGroup.id,
    assetId: optionAsset.asset.id,
    versionId: optionAsset.version?.id || null,
    label: mode === "option" ? `Option ${optionGroup.members.length + 1}` : "Current package",
    sourceToolId,
    metadata: { mode, createdAt: now },
  })

  if (mode === "current") {
    selectContentBuildVariant({
      contentBuildId: contentBuild.id,
      groupId: optionGroup.id,
      assetId: optionAsset.asset.id,
      sourceToolId,
      actorType: "creator",
      final: false,
    })
    setContentBuildSelection(contentBuild.id, "metadata-package", optionAsset.asset.id, {
      toolId: sourceToolId,
      actorType: "creator",
      final: false,
    })
  }

  const current = getContentBuild(contentBuild.id)!
  const titleArtifact = titleAsset ? artifactFor(titleAsset.asset, "title", sourceToolId, now) : null
  const descriptionArtifact = descriptionAsset ? artifactFor(descriptionAsset.asset, "description", sourceToolId, now) : null
  const tagsArtifact = tagsAsset ? artifactFor(tagsAsset.asset, "tags", sourceToolId, now) : null

  videoPackage = {
    ...videoPackage,
    version: videoPackage.version + 1,
    contentBuildRevision: current.revision,
    identity: {
      ...videoPackage.identity,
      workingTitle: state.title || videoPackage.identity.workingTitle,
      updatedAt: now,
    },
    packaging: {
      ...videoPackage.packaging,
      titleVariants: titleArtifact
        ? [...videoPackage.packaging.titleVariants, titleArtifact]
        : videoPackage.packaging.titleVariants,
      selectedTitleId: mode === "current" && titleArtifact ? titleArtifact.id : videoPackage.packaging.selectedTitleId || null,
      thumbnailVariants: input.thumbnailAsset
        ? [...videoPackage.packaging.thumbnailVariants, artifactFor(input.thumbnailAsset, "thumbnail", sourceToolId, now)]
        : videoPackage.packaging.thumbnailVariants,
      selectedThumbnailId: mode === "current" && input.thumbnailAsset
        ? artifactFor(input.thumbnailAsset, "thumbnail", sourceToolId, now).id
        : videoPackage.packaging.selectedThumbnailId || null,
      description: descriptionArtifact || videoPackage.packaging.description,
      tags: tagsArtifact || videoPackage.packaging.tags,
    },
    production: {
      ...videoPackage.production,
      renderIds: input.finalVideoAsset && !videoPackage.production.renderIds.includes(input.finalVideoAsset.id)
        ? [...videoPackage.production.renderIds, input.finalVideoAsset.id]
        : videoPackage.production.renderIds,
    },
    provenance: [
      ...videoPackage.provenance,
      {
        id: `${videoPackage.id}:publisher-metadata:${optionAsset.asset.id}`,
        action: mode === "option" ? "metadata_option_saved" : "metadata_saved",
        sourceToolId,
        artifactIds: [
          optionAsset.asset.id,
          ...(titleAsset ? [titleAsset.asset.id] : []),
          ...(descriptionAsset ? [descriptionAsset.asset.id] : []),
          ...(tagsAsset ? [tagsAsset.asset.id] : []),
          ...(input.thumbnailAsset ? [input.thumbnailAsset.id] : []),
          ...(input.finalVideoAsset ? [input.finalVideoAsset.id] : []),
        ],
        evidenceIds: [],
        createdAt: now,
      },
    ],
  }

  const persisted = saveVideoPackage(videoPackage)

  return {
    project,
    contentBuildId: current.id,
    videoPackageId: persisted.id,
    revision: persisted.contentBuildRevision || current.revision,
    mode,
    packageOptionAssetId: optionAsset.asset.id,
  }
}
