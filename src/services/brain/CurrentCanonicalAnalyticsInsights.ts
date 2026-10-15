import { getCurrentCanonicalIntelligenceDatasetRows } from "../analytics-canon"
import {
 buildTrendInsights,
 type DeterministicAnalyticsInsight,
} from "./DeterministicAnalyticsInsights"

export interface CurrentCanonicalAnalyticsInsights {
 findings: DeterministicAnalyticsInsight[]
 limitations: string[]
 sourceSnapshotId: string | null
}

/**
 * Builds a small deterministic trend set from full canonical daily rows.
 * Never uses report samples, invents absent dates, or crosses snapshot/channel scope.
 */
export const buildCurrentCanonicalAnalyticsInsights = (input: {
 channelId: string | null
 expectedSnapshotId?: string | null
 minimumObservations?: number
}): CurrentCanonicalAnalyticsInsights => {
 const dataset = getCurrentCanonicalIntelligenceDatasetRows("daily")
 if (!dataset) {
  return { findings: [], limitations: ["Canonical daily dataset is unavailable."], sourceSnapshotId: null }
 }
 if (!input.channelId || dataset.channelId !== input.channelId) {
  return { findings: [], limitations: ["Canonical daily dataset channel does not exactly match the requested channel."], sourceSnapshotId: dataset.snapshotId }
 }
 if (input.expectedSnapshotId && dataset.snapshotId !== input.expectedSnapshotId) {
  return { findings: [], limitations: ["Canonical daily dataset snapshot does not match the active evidence snapshot."], sourceSnapshotId: dataset.snapshotId }
 }

 const metricKeys = ["views", "engagedViews", "watchTime", "likes", "comments", "subscribersGained"]
 const findings: DeterministicAnalyticsInsight[] = []
 const limitations: string[] = []
 for (const metricKey of metricKeys) {
  if (!dataset.rows.some((row) => Object.prototype.hasOwnProperty.call(row, metricKey))) continue
  const result = buildTrendInsights({
   dataset,
   metricKey,
   dateKey: "date",
   minimumObservations: input.minimumObservations ?? 5,
  })
  findings.push(...result.insights)
  limitations.push(...result.limitations.map((reason) => `${metricKey}: ${reason}`))
 }
 return {
  findings: findings.sort((left, right) => left.id.localeCompare(right.id)),
  limitations: [...new Set(limitations)],
  sourceSnapshotId: dataset.snapshotId,
 }
}
