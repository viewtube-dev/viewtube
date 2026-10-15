import { getVtSyncSnapshot } from "../../features/vt-sync-local"
import type {
 CanonicalIntelligenceEvidenceBundle,
 IntelligenceEvidenceRequest,
} from "./contracts"
import { buildCanonicalIntelligenceEvidence, getCanonicalIntelligenceDatasetRows as requireCanonicalDatasetRows } from "./intelligenceEvidence"

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

/** Return complete rows for one canonical dataset through the same VT-SYNC boundary. */
export const getCurrentCanonicalIntelligenceDatasetRows = (datasetId: string) => {
 const snapshot = getVtSyncSnapshot()
 return {
  snapshotId: snapshot.snapshotId,
  channelId: snapshot.channelId || null,
  selectedWindow: snapshot.selectedTimeWindow || "28d",
  dataset: (requireCanonicalDatasetRows(snapshot, datasetId)),
 }
}
