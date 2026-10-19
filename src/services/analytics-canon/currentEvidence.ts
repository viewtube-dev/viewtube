import { getVtSyncSnapshot } from "../../features/vt-sync-local"
import type {
 CanonicalIntelligenceDatasetRows,
 CanonicalIntelligenceEvidenceBundle,
 IntelligenceEvidenceRequest,
} from "./contracts"
import {
 buildCanonicalIntelligenceEvidence,
 getCanonicalIntelligenceDatasetRows as readCanonicalIntelligenceDatasetRows,
} from "./intelligenceEvidence"

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
 * Read one complete canonical dataset from the current VT-SYNC snapshot.
 * The snapshot/channel envelope is returned with the dataset so consumers
 * can verify exact-snapshot and channel identity before joining evidence.
 */
export const getCurrentCanonicalIntelligenceDatasetRows = (
 datasetId: string,
): {
 snapshotId: string
 channelId: string | null
 dataset: CanonicalIntelligenceDatasetRows | null
} => {
 const snapshot = getVtSyncSnapshot()
 return {
  snapshotId: snapshot.snapshotId,
  channelId: snapshot.channelId || null,
  dataset: readCanonicalIntelligenceDatasetRows(snapshot, datasetId),
 }
}
