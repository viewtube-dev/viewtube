export type VaultReviewAsset = {
  id: string
  name: string
  kind: string
  tags: string[]
  source?: string | null
  projectName?: string | null
  metadata?: Record<string, unknown>
}
export type VaultMetadataDifference = { field: string; left: unknown; right: unknown }
export type VaultGovernanceFinding = { code: string; severity: "warning" | "action"; message: string }
export type VaultMetadataSuggestion = {
  assetId: string
  tags: string[]
  metadata: Record<string, unknown>
  accepted: false
  createdAt: number
}
export type VaultMetadataSuggestionResult = {
  asset: VaultReviewAsset
  accepted: boolean
  reason?: string
}

const stable = (value: unknown): string => {
  if (value === undefined) return "undefined"
  if (value === null || typeof value !== "object") return String(value)
  if (Array.isArray(value)) return "[" + value.map(stable).join(",") + "]"
  const record = value as Record<string, unknown>
  return "{" + Object.keys(record).sort().map((key) => JSON.stringify(key) + ":" + stable(record[key])).join(",") + "}"
}

export const compareVaultAssets = (left: VaultReviewAsset, right: VaultReviewAsset): VaultMetadataDifference[] => {
  const differences: VaultMetadataDifference[] = []
  const compare = (field: string, a: unknown, b: unknown) => {
    if (stable(a) !== stable(b)) differences.push({ field, left: a ?? null, right: b ?? null })
  }
  compare("name", left.name, right.name)
  compare("kind", left.kind, right.kind)
  compare("source", left.source || null, right.source || null)
  compare("project", left.projectName || null, right.projectName || null)
  compare("tags", [...(left.tags || [])].sort(), [...(right.tags || [])].sort())
  const keys = [...new Set([...Object.keys(left.metadata || {}), ...Object.keys(right.metadata || {})])].sort()
  for (const key of keys) compare(`metadata.${key}`, left.metadata?.[key], right.metadata?.[key])
  return differences
}

export const evaluateVaultRights = (
  asset: Pick<VaultReviewAsset, "metadata">,
  now: Date = new Date(),
): VaultGovernanceFinding[] => {
  const metadata = asset.metadata || {}
  const findings: VaultGovernanceFinding[] = []
  const license = typeof metadata.license === "string" ? metadata.license.trim() : ""
  const source = typeof (metadata.rightsSource ?? metadata.sourceAttribution) === "string"
    ? String(metadata.rightsSource ?? metadata.sourceAttribution).trim()
    : ""
  if (!license || !source) findings.push({ code: "rights-missing", severity: "action", message: "Record a license/usage basis and source attribution before external reuse." })
  if (typeof metadata.rightsExpiry === "string" && metadata.rightsExpiry.trim()) {
    const expiry = Date.parse(metadata.rightsExpiry)
    if (Number.isFinite(expiry) && expiry < now.getTime()) findings.push({ code: "rights-expired", severity: "action", message: "The recorded rights expiry is in the past; review usage before reuse." })
  }
  if (typeof metadata.rightsRestrictions === "string" && metadata.rightsRestrictions.trim()) {
    findings.push({ code: "rights-restrictions", severity: "warning", message: "Recorded usage restrictions must be reviewed before handoff." })
  }
  return findings
}

export const proposeVaultMetadataSuggestions = (
  asset: VaultReviewAsset,
  suggestion: { tags?: string[]; metadata?: Record<string, unknown> },
): VaultMetadataSuggestion => ({
  assetId: asset.id,
  tags: [...new Set((suggestion.tags || []).filter((tag) => typeof tag === "string" && tag.trim()).map((tag) => tag.trim()))],
  metadata: { ...(suggestion.metadata || {}) },
  accepted: false,
  createdAt: Date.now(),
})

export const acceptVaultMetadataSuggestions = (
  asset: VaultReviewAsset,
  proposal: VaultMetadataSuggestion,
): VaultMetadataSuggestionResult => {
  if (asset.id !== proposal.assetId) return { asset, accepted: false, reason: "Suggestion belongs to a different asset." }
  const metadata = asset.metadata || {}
  if (metadata.protected === true || (String(metadata.lifecycle || "").toUpperCase() === "GOLDEN" && metadata.protected !== false)) {
    return { asset, accepted: false, reason: "Protected assets cannot receive suggested metadata until explicitly unlocked." }
  }
  const protectedKeys = ["protected", "lifecycle", "contentHash", "sourceAssetId", "derivativeOfAssetId", "parentAssetIds", "createdFromAssetId"]
  if (Object.keys(proposal.metadata).some((key) => protectedKeys.includes(key))) {
    return { asset, accepted: false, reason: "Suggestions cannot rewrite protected lifecycle or provenance fields." }
  }
  return {
    accepted: true,
    asset: {
      ...asset,
      tags: [...new Set([...(asset.tags || []), ...proposal.tags])],
      metadata: { ...metadata, ...proposal.metadata },
    },
  }
}
