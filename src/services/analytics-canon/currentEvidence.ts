import { getVtSyncSnapshot } from "../../features/vt-sync-local"
import type {
 CanonicalIntelligenceEvidenceBundle,
 CanonicalIntelligenceDatasetRows,
 IntelligenceEvidenceRequest,
} from "./contracts"
import { getCanonicalIntelligenceDatasetRows } from "./intelligenceEvidence"
import { buildCanonicalIntelligenceEvidence } from "./intelligenceEvidence"

/**
 * Imperative analytics-canon entry point for non-React consumers such as
 * BrainRuntime. Consumers receive canonical evidence without reaching into
 * VT-SYNC internals directly.
 */
export const getCurrentCanonicalIntelligenceEvidence = (
 request: IntelligenceEvidenceRequest = {},
): CanonicalIntelligenceEvidenceBundle => {
 const snapshot = getVtSyncSnapshot()
 return buildCanonicalIntelligenceEvidence(snapshot, {
  ...request,
  window: request.window || snapshot.selectedTimeWindow || "28d",
 })
}


/**
 * Returns full canonical rows for deterministic calculations from the current VT-SYNC
 * snapshot. Unlike the report bundle, this does not truncate rows to a display sample.
 * Callers must still validate dataset status, channel, metric semantics and row completeness.
 */
export const getCurrentCanonicalIntelligenceDatasetRows = (
 datasetId: string,
): CanonicalIntelligenceDatasetRows | null => {
 const snapshot = getVtSyncSnapshot()
 return getCanonicalIntelligenceDatasetRows(snapshot, datasetId)
}
