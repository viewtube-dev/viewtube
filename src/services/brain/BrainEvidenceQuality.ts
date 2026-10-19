import {
 INTELLIGENCE_SECTION_DATASETS,
 type CanonicalIntelligenceDatasetManifest,
 type CanonicalIntelligenceDatasetStatus,
 type CanonicalIntelligenceEvidenceBundle,
} from "../analytics-canon"
import type { EvidenceEpistemicState, EvidenceRecord } from "./EvidenceRecord"

/** Dataset readiness is a subset of the canonical evidence epistemic states. */
export type BrainEvidenceEpistemicState = Extract<EvidenceEpistemicState, "OBSERVED" | "STALE" | "MISSING">

export type BrainEvidenceConfidence = "high" | "medium" | "low" | "insufficient"
export type BrainEvidenceScopeMatch = "exact" | "mismatch" | "unscoped" | "not_requested"

export interface BrainEvidenceDatasetQuality {
 datasetId: string
 status: CanonicalIntelligenceDatasetStatus
 epistemicState: BrainEvidenceEpistemicState
 sourceOwner: "analytics-canon"
 sourceSnapshotId: string
 channelId: string | null
 evidenceRefs: string[]
 missingMetrics: string[]
 sources: CanonicalIntelligenceDatasetManifest["sources"]
 rowCount: number
 updatedAt: string | null
}

export interface BrainEvidenceQualityReport {
 version: "vt-brain-evidence-quality-v1"
 generatedAt: string
 sourceSnapshotId: string
 channelId: string | null
 selectedWindow: CanonicalIntelligenceEvidenceBundle["selectedWindow"]
 requestedSectionIds: string[]
 evaluatedDatasetIds: string[]
 scopeMatch: BrainEvidenceScopeMatch
 confidence: BrainEvidenceConfidence
 coverageRatio: number
 evidenceReferenceCount: number
 datasets: BrainEvidenceDatasetQuality[]
 freshness: {
  staleDatasetIds: string[]
  newestDatasetAt: string | null
 }
 missingness: {
  unavailableDatasetIds: string[]
  failedDatasetIds: string[]
  partialDatasetIds: string[]
  omittedDatasetIds: string[]
 }
 limitations: string[]
}

const epistemicStateFor = (
 status: CanonicalIntelligenceDatasetStatus,
): BrainEvidenceEpistemicState => {
 if (status === "stale") return "STALE"
 if (status === "failed" || status === "unavailable") return "MISSING"
 return "OBSERVED"
}

const usabilityWeight = (status: CanonicalIntelligenceDatasetStatus): number => {
 if (status === "available") return 1
 if (status === "partial") return 0.6
 if (status === "stale") return 0.35
 return 0
}

const resolveScopeMatch = (
 actualChannelId: string | null,
 expectedChannelId?: string | null,
): BrainEvidenceScopeMatch => {
 if (expectedChannelId === undefined) return "not_requested"
 if (!actualChannelId || !expectedChannelId) return "unscoped"
 return actualChannelId === expectedChannelId ? "exact" : "mismatch"
}

const confidenceFor = (input: {
 coverageRatio: number
 scopeMatch: BrainEvidenceScopeMatch
 staleCount: number
 failedCount: number
}): BrainEvidenceConfidence => {
 if (input.scopeMatch === "mismatch" || input.scopeMatch === "unscoped") return "insufficient"
 if (input.coverageRatio <= 0) return "insufficient"
 if (
  input.coverageRatio >= 0.8
  && input.staleCount === 0
  && input.failedCount === 0
 ) return "high"
 if (input.coverageRatio >= 0.5 && input.failedCount <= 1) return "medium"
 return "low"
}

/**
 * Brain-side quality projection over analytics-canon evidence.
 *
 * This module owns no analytics storage. It preserves canonical provenance and
 * missingness while deriving bounded confidence/coverage metadata for reasoning
 * and prompt assembly.
 */
export interface BrainEvidenceRecordQualityReport {
 version: "vt-brain-evidence-record-quality-v1"
 generatedAt: string
 expectedChannelId: string | null
 /** Deterministic parity fingerprint for the exact ordered records rendered into the prompt. */
 evidenceFingerprint: string
 evidenceRecordIds: string[]
 totalRecords: number
 numericRecords: number
 observedRecords: number
 staleRecords: number
 missingRecords: number
 scopeMatch: BrainEvidenceScopeMatch
 confidence: BrainEvidenceConfidence
 limitations: string[]
}

/**
 * Produces a deterministic diagnostic fingerprint of the exact ordered records.
 * This is for prompt/grader parity detection, not cryptographic integrity.
 */
const fingerprintEvidenceRecords = (records: EvidenceRecord[]): string => {
 const serialized = JSON.stringify(records)
 let first = 0x811c9dc5
 let second = 0x9e3779b9
 for (let index = 0; index < serialized.length; index += 1) {
  const code = serialized.charCodeAt(index)
  first = Math.imul(first ^ code, 0x01000193) >>> 0
  second = Math.imul(second ^ code, 0x85ebca6b) >>> 0
 }
 return `evidence-v1:${first.toString(16).padStart(8, "0")}${second.toString(16).padStart(8, "0")}`
}

/**
 * Grades the exact EvidenceRecord projection selected for prompt rendering.
 * Dataset-level readiness remains in buildBrainEvidenceQuality(bundle); this
 * record-level grade is deliberately scoped to the records the model can read.
 */
export const buildBrainEvidenceRecordQuality = (
 records: EvidenceRecord[],
 options: { expectedChannelId?: string | null } = {},
): BrainEvidenceRecordQualityReport => {
 const expectedChannelId = String(options.expectedChannelId || "").trim() || null
 const hasRecords = records.length > 0
 const mismatched = Boolean(expectedChannelId && records.some((record) => record.channelId && record.channelId !== expectedChannelId))
 const unscoped = Boolean(!expectedChannelId || records.some((record) => !record.channelId))
 const scopeMatch: BrainEvidenceScopeMatch = !hasRecords
  ? "not_requested"
  : mismatched ? "mismatch" : unscoped ? "unscoped" : "exact"
 const observedRecords = records.filter((record) =>
  record.epistemicState !== "MISSING"
  && record.availability !== "unavailable"
  && record.value !== null
  && record.value !== undefined,
 ).length
 const staleRecords = records.filter((record) => record.freshness === "stale" || record.epistemicState === "STALE").length
 const missingRecords = records.filter((record) =>
  record.epistemicState === "MISSING"
  || record.availability === "unavailable"
  || record.value === null
  || record.value === undefined,
 ).length
 const numericRecords = records.filter((record) => typeof record.value === "number" && Number.isFinite(record.value)).length
 const limitations: string[] = []
 if (scopeMatch === "mismatch") limitations.push("Prompt evidence contains records from a different channel; channel-specific claims are blocked.")
 if (scopeMatch === "unscoped") limitations.push("Some prompt evidence records lack a verified channel scope.")
 if (!hasRecords) limitations.push("No EvidenceRecord items were selected for the prompt.")
 if (staleRecords) limitations.push("Some prompt evidence records are stale and must be treated as historical.")
 if (missingRecords) limitations.push("Some prompt evidence records are missing or unavailable; missing is not zero.")
 const confidence: BrainEvidenceConfidence = scopeMatch === "mismatch" || scopeMatch === "unscoped" || !hasRecords || observedRecords === 0
  ? "insufficient"
  : staleRecords || missingRecords || observedRecords < records.length
   ? "low"
   : records.some((record) => record.confidence !== undefined && record.confidence !== null && record.confidence < 0.6)
    ? "medium"
    : "high"
 return {
  version: "vt-brain-evidence-record-quality-v1",
  generatedAt: new Date().toISOString(),
  expectedChannelId,
  evidenceFingerprint: fingerprintEvidenceRecords(records),
  evidenceRecordIds: records.map((record) => record.id),
  totalRecords: records.length,
  numericRecords,
  observedRecords,
  staleRecords,
  missingRecords,
  scopeMatch,
  confidence,
  limitations,
 }
}

export const buildBrainEvidenceQuality = (
 bundle: CanonicalIntelligenceEvidenceBundle,
 options: { expectedChannelId?: string | null } = {},
): BrainEvidenceQualityReport => {
 const requestedSectionIds = [...bundle.requestedSectionIds]
 const relevantDatasetIds = new Set(
  requestedSectionIds.flatMap((sectionId) => [...(INTELLIGENCE_SECTION_DATASETS[sectionId] || [])]),
 )
 // Fitness is calculated over the datasets selected for this task, not every
 // unrelated dataset in the canonical catalog.
 const relevantManifests = requestedSectionIds.length && relevantDatasetIds.size
  ? bundle.datasets.filter((dataset) => relevantDatasetIds.has(dataset.id))
  : bundle.datasets
 const datasets: BrainEvidenceDatasetQuality[] = relevantManifests.map((dataset) => ({
  datasetId: dataset.id,
  status: dataset.status,
  epistemicState: epistemicStateFor(dataset.status),
  sourceOwner: "analytics-canon",
  sourceSnapshotId: bundle.snapshotId,
  channelId: bundle.channelId,
  evidenceRefs: [...dataset.evidenceRefs],
  missingMetrics: [...dataset.missingMetrics],
  sources: [...dataset.sources],
  rowCount: dataset.rowCount,
  updatedAt: dataset.updatedAt || null,
 }))

 const denominator = datasets.length || bundle.coverage.total
 const usableWeight = datasets.reduce((sum, dataset) => sum + usabilityWeight(dataset.status), 0)
 const coverageRatio = denominator > 0 ? usableWeight / denominator : 0
 const scopeMatch = resolveScopeMatch(bundle.channelId, options.expectedChannelId)
 const staleDatasetIds = datasets.filter((dataset) => dataset.status === "stale").map((dataset) => dataset.datasetId)
 const failedDatasetIds = datasets.filter((dataset) => dataset.status === "failed").map((dataset) => dataset.datasetId)
 const unavailableDatasetIds = datasets.filter((dataset) => dataset.status === "unavailable").map((dataset) => dataset.datasetId)
 const partialDatasetIds = datasets.filter((dataset) => dataset.status === "partial").map((dataset) => dataset.datasetId)
 const updated = datasets
  .map((dataset) => dataset.updatedAt)
  .filter((value): value is string => Boolean(value))
  .sort()
 const limitations: string[] = []

 if (scopeMatch === "mismatch") {
  limitations.push("Canonical evidence belongs to a different channel than the active Brain task.")
 }
 if (scopeMatch === "unscoped") {
  limitations.push("Canonical evidence could not be matched to a concrete active channel.")
 }
 if (staleDatasetIds.length) limitations.push("Some canonical evidence is stale.")
 if (partialDatasetIds.length) limitations.push("Some canonical evidence is partial.")
 if (failedDatasetIds.length) limitations.push("Some canonical evidence sources failed.")
 if (unavailableDatasetIds.length) limitations.push("Some canonical evidence is unavailable.")
 if (bundle.omittedDatasetIds.length) limitations.push("Some evidence detail was omitted by context limits.")

 return {
  version: "vt-brain-evidence-quality-v1",
  generatedAt: new Date().toISOString(),
  sourceSnapshotId: bundle.snapshotId,
  channelId: bundle.channelId,
  selectedWindow: bundle.selectedWindow,
  requestedSectionIds,
  evaluatedDatasetIds: datasets.map((dataset) => dataset.datasetId),
  scopeMatch,
  confidence: confidenceFor({
   coverageRatio,
   scopeMatch,
   staleCount: staleDatasetIds.length,
   failedCount: failedDatasetIds.length,
  }),
  coverageRatio,
  evidenceReferenceCount: datasets.reduce((sum, dataset) => sum + dataset.evidenceRefs.length, 0),
  datasets,
  freshness: {
   staleDatasetIds,
   newestDatasetAt: updated.at(-1) || null,
  },
  missingness: {
   unavailableDatasetIds,
   failedDatasetIds,
   partialDatasetIds,
   omittedDatasetIds: [...bundle.omittedDatasetIds],
  },
  limitations,
 }
}
