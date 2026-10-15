import type { VaultAsset, VaultAssetKind } from "../types"

export type VaultInspectableAsset = Pick<VaultAsset,
  "id" | "name" | "kind" | "mimeType" | "url" | "previewUrl" | "metadata" | "tags" | "projectId" | "createdAt" | "updatedAt"
>

export type VaultInspectionFinding = {
  code: string
  severity: "info" | "warning" | "action"
  message: string
}

export type VaultAssetInspection = {
  identity: { id: string; name: string; kind: VaultAssetKind; createdAt: number; updatedAt: number }
  technical: { mimeType: string | null; byteSize: number | null; dimensions: string | null; aspectRatio: number | null; durationSeconds: number | null }
  rights: { license: string | null; source: string | null; expiry: string | null; restrictions: string | null }
  lineage: { parentAssetIds: string[]; childAssetIds: string[]; generationId: string | null; projectId: string | null }
  tags: string[]
  findings: VaultInspectionFinding[]
}

const nonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value.trim() : null

const numberOrNull = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null

const idsFrom = (value: unknown): string[] =>
  Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim()).map((item) => item.trim()))] : []

export const inspectVaultAsset = (asset: VaultInspectableAsset): VaultAssetInspection => {
  const metadata = asset.metadata || {}
  const width = numberOrNull(metadata.width)
  const height = numberOrNull(metadata.height)
  const duration = numberOrNull(metadata.durationSeconds ?? metadata.durationSec ?? metadata.duration)
  const byteSize = numberOrNull(metadata.byteSize)
  const parentAssetIds = idsFrom(metadata.parentAssetIds)
  for (const candidate of [metadata.derivativeOfAssetId, metadata.sourceAssetId, metadata.createdFromAssetId]) {
    if (typeof candidate === "string" && candidate.trim() && !parentAssetIds.includes(candidate.trim())) parentAssetIds.push(candidate.trim())
  }
  const findings: VaultInspectionFinding[] = []
  if (!asset.mimeType && !nonEmptyString(metadata.mimeType)) findings.push({ code: "missing-mime", severity: "warning", message: "MIME type is not recorded; verify the file type." })
  if (asset.kind === "image" && (!width || !height)) findings.push({ code: "missing-image-dimensions", severity: "warning", message: "Image dimensions are not recorded." })
  if (asset.kind === "video" && duration == null) findings.push({ code: "missing-video-duration", severity: "info", message: "Video duration has not been extracted." })
  if (!nonEmptyString(metadata.license) || !nonEmptyString(metadata.rightsSource ?? metadata.sourceAttribution)) {
    findings.push({ code: "missing-rights", severity: "action", message: "Add both license/usage terms and source attribution before external reuse." })
  }
  if (!asset.url && !asset.previewUrl && !nonEmptyString(metadata.binaryStoreId) && !nonEmptyString(metadata.serverBinaryId)) {
    findings.push({ code: "missing-preview-source", severity: "warning", message: "No preview URL or stored media reference is recorded." })
  }
  if (metadata.protected === true || (String(metadata.lifecycle || "").toUpperCase() === "GOLDEN" && metadata.protected !== false)) {
    findings.push({ code: "protected-asset", severity: "info", message: "This asset is protected; destructive actions require explicit unlock." })
  }
  return {
    identity: { id: asset.id, name: asset.name, kind: asset.kind, createdAt: asset.createdAt, updatedAt: asset.updatedAt },
    technical: {
      mimeType: asset.mimeType || nonEmptyString(metadata.mimeType),
      byteSize,
      dimensions: width && height ? `${width} × ${height}` : null,
      aspectRatio: typeof metadata.aspectRatio === "number" && Number.isFinite(metadata.aspectRatio)
        ? metadata.aspectRatio
        : width && height ? width / height : null,
      durationSeconds: duration,
    },
    rights: {
      license: nonEmptyString(metadata.license),
      source: nonEmptyString(metadata.rightsSource ?? metadata.sourceAttribution),
      expiry: nonEmptyString(metadata.rightsExpiry),
      restrictions: nonEmptyString(metadata.rightsRestrictions),
    },
    lineage: {
      parentAssetIds,
      childAssetIds: idsFrom(metadata.childAssetIds),
      generationId: nonEmptyString(metadata.generationId) || null,
      projectId: asset.projectId || null,
    },
    tags: [...new Set((asset.tags || []).filter((tag) => typeof tag === "string" && tag.trim()).map((tag) => tag.trim()))],
    findings,
  }
}
