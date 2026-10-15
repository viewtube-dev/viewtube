import type { EvidenceRecord } from "./EvidenceRecord"

export type BrainEpistemicState =
 | "KNOWN"
 | "OBSERVED"
 | "CALCULATED"
 | "USER_PROVIDED"
 | "INFERRED"
 | "HYPOTHESIS"
 | "ESTIMATE"
 | "STALE"
 | "MISSING"
 | "CONFLICTING"

export type BrainEvidenceScopeState = "exact" | "mismatch" | "unscoped" | "not_requested"

export interface BrainEvidenceClaim {
 id: string
 sourceOwner: string
 sourceId: string
 sourceSnapshotId: string | null
 channelId: string | null
 projectId: string | null
 contentBuildId: string | null
 videoId: string | null
 entityType: string | null
 entityId: string | null
 claim: string
 metric: string | null
 value: number | string | boolean | null
 unit: string | null
 timeframe: { kind: string; start: string | null; end: string | null } | null
 freshness: "fresh" | "stale" | "unknown"
 epistemicState: BrainEpistemicState
 confidence: number | null
 provenance: { evidenceIds: string[]; sourceRoute: string | null; sourceVersion: string | null }
 limitations: string[]
}

export interface BrainEvidenceHealth {
 version: "vt-brain-evidence-health-v1"
 scope: BrainEvidenceScopeState
 coverageRatio: number
 totalClaims: number
 usableClaims: number
 missingIds: string[]
 staleIds: string[]
 conflictingClaimKeys: string[]
 scopeMismatchIds: string[]
 confidence: "high" | "medium" | "low" | "insufficient"
 limitations: string[]
}

const clampConfidence = (value: number | null | undefined): number | null =>
 typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : null

const epistemicStateFor = (record: EvidenceRecord): BrainEpistemicState => {
 if (record.epistemicState === "missing") return "MISSING"
 if (record.epistemicState === "stale" || record.freshness === "stale") return "STALE"
 if (record.epistemicState === "creator_confirmed") return "USER_PROVIDED"
 if (record.epistemicState === "derived") return "CALCULATED"
 return "OBSERVED"
}

/** Additive, read-only projection. It does not become an evidence store or mutate source records. */
export const projectEvidenceRecordToBrainClaim = (record: EvidenceRecord): BrainEvidenceClaim => {
 const epistemicState = epistemicStateFor(record)
 return {
  id: record.id,
  sourceOwner: record.owner,
  sourceId: record.sourceRef,
  sourceSnapshotId: record.sourceSnapshotId || null,
  channelId: record.channelId || null,
  projectId: record.projectId || null,
  contentBuildId: record.contentBuildId || null,
  videoId: record.videoId || null,
  entityType: record.entityType || null,
  entityId: record.entityId || null,
  claim: record.metric || record.entityType || record.entityId || record.sourceRef,
  metric: record.metric || null,
  // Missing is represented as null; it is never coerced to zero.
  value: epistemicState === "MISSING" ? null : record.value ?? null,
  unit: record.unit || null,
  timeframe: record.window ? {
   kind: record.window.kind,
   start: record.window.start || null,
   end: record.window.end || null,
  } : null,
  freshness: record.freshness,
  epistemicState,
  confidence: clampConfidence(record.confidence),
  provenance: {
   evidenceIds: [...new Set(record.provenance.evidenceIds)],
   sourceRoute: record.provenance.sourceRoute || null,
   sourceVersion: record.provenance.sourceVersion || null,
  },
  limitations: [...new Set([...(record.limitations || []), ...(record.missingness || []).map((item) => `Missing: ${item}`)])],
 }
}

export const projectEvidenceRecordsToBrainClaims = (records: EvidenceRecord[]): BrainEvidenceClaim[] =>
 records.map(projectEvidenceRecordToBrainClaim)

export const assessBrainEvidenceScope = (
 claim: Pick<BrainEvidenceClaim, "channelId" | "projectId" | "videoId">,
 expected: { channelId?: string | null; projectId?: string | null; videoId?: string | null } = {},
): BrainEvidenceScopeState => {
 const requested = [expected.channelId, expected.projectId, expected.videoId].some((value) => value !== undefined)
 if (!requested) return "not_requested"
 const dimensions: Array<[string | null, string | null]> = [
  [claim.channelId, expected.channelId === undefined ? null : expected.channelId || null],
  [claim.projectId, expected.projectId === undefined ? null : expected.projectId || null],
  [claim.videoId, expected.videoId === undefined ? null : expected.videoId || null],
 ]
 const relevant = dimensions.filter(([, target]) => target !== null)
 if (!relevant.length || relevant.some(([actual]) => actual === null)) return "unscoped"
 return relevant.every(([actual, target]) => actual === target) ? "exact" : "mismatch"
}

const claimKey = (claim: BrainEvidenceClaim): string =>
 [claim.channelId || "*", claim.projectId || "*", claim.videoId || "*", claim.entityType || claim.sourceId, claim.entityId || "*", claim.metric || claim.claim, claim.timeframe?.kind || "*", claim.timeframe?.start || "*", claim.timeframe?.end || "*"].join("::")

export const summarizeBrainEvidenceHealth = (
 claims: BrainEvidenceClaim[],
 expectedScope: { channelId?: string | null; projectId?: string | null; videoId?: string | null } = {},
): BrainEvidenceHealth => {
 const requested = [expectedScope.channelId, expectedScope.projectId, expectedScope.videoId].some((value) => value !== undefined)
 const scoped = claims.map((claim) => ({ claim, scope: assessBrainEvidenceScope(claim, expectedScope) }))
 const scopeMismatchIds = scoped.filter((entry) => entry.scope === "mismatch" || entry.scope === "unscoped").map((entry) => entry.claim.id)
 const missingIds = claims.filter((claim) => claim.epistemicState === "MISSING" || claim.value === null).map((claim) => claim.id)
 const staleIds = claims.filter((claim) => claim.epistemicState === "STALE" || claim.freshness === "stale").map((claim) => claim.id)
 const groups = new Map<string, Set<string>>()
 for (const claim of claims) {
  if (claim.value === null || claim.epistemicState === "MISSING") continue
  const key = claimKey(claim)
  const values = groups.get(key) || new Set<string>()
  values.add(JSON.stringify(claim.value))
  groups.set(key, values)
 }
 const conflictingClaimKeys = [...groups.entries()].filter(([, values]) => values.size > 1).map(([key]) => key)
 const usableClaims = scoped.filter(({ claim, scope }) =>
  (!requested || scope === "exact" || scope === "not_requested")
  && claim.epistemicState !== "MISSING"
  && claim.epistemicState !== "CONFLICTING"
  && claim.epistemicState !== "STALE"
  && claim.value !== null,
 ).length
 const coverageRatio = claims.length ? usableClaims / claims.length : 0
 const scope = !requested ? "not_requested" : !claims.length ? "unscoped" : scoped.some((entry) => entry.scope === "mismatch") ? "mismatch" : scoped.some((entry) => entry.scope === "unscoped") ? "unscoped" : "exact"
 const limitations: string[] = []
 if (!claims.length) limitations.push("No evidence claims were supplied.")
 if (missingIds.length) limitations.push("Missing evidence remains unknown; it is not numeric zero.")
 if (staleIds.length) limitations.push("Stale evidence must not be represented as current.")
 if (scopeMismatchIds.length) limitations.push("Evidence with unverified or mismatched scope is excluded from usable claims.")
 if (conflictingClaimKeys.length) limitations.push("Conflicting values exist for one or more same-scope claim keys.")
 const confidence = !claims.length || (requested && scopeMismatchIds.length > 0)
  ? "insufficient"
  : coverageRatio >= 0.8 && !staleIds.length && !conflictingClaimKeys.length
   ? "high"
   : coverageRatio >= 0.5 && !conflictingClaimKeys.length
    ? "medium"
    : coverageRatio > 0 ? "low" : "insufficient"
 return {
  version: "vt-brain-evidence-health-v1",
  scope,
  coverageRatio,
  totalClaims: claims.length,
  usableClaims,
  missingIds,
  staleIds,
  conflictingClaimKeys,
  scopeMismatchIds,
  confidence,
  limitations,
 }
}
