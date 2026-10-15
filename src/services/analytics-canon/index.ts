// Public barrel — the single import path every consumer uses. If it's
// not re-exported here, it's not part of the canonical analytics API.
//
// Consumers:
//   import { useCanonicalRows, useCanonicalMetricSummary } from "services/analytics-canon"
//
// This file is intentionally the ONLY entry point. When we retire the
// legacy analytics namespace, only files that import from here will
// still compile — everything else surfaces as an obvious build error
// and gets migrated.

export * from "./contracts"
export {
 projectVtSyncVideoToCanonicalRow,
 filterCanonicalRowsByWindow,
 filterRowsByUploadRecency,
 getCanonicalRowsFromVtSync,
 summarizeCanonicalRows,
 getMetricSummaryFromVtSync,
 getWindowTotalsFromVtSync,
} from "./vtSyncAdapter"
export {
 useCanonicalRows,
 useCanonicalMetricSummary,
 useCanonicalWindowTotals,
 useCanonicalChannelIdentity,
 useCanonicalIntelligenceCatalog,
} from "./useAnalytics"
export {
 CANONICAL_INTELLIGENCE_DATASET_COUNT,
 CANONICAL_INTELLIGENCE_EVIDENCE_VERSION,
 INTELLIGENCE_SECTION_DATASETS,
 getCanonicalIntelligenceDatasetCatalog,
 getCanonicalIntelligenceDatasetRows,
 buildCanonicalIntelligenceEvidence,
} from "./intelligenceEvidence"

export {
 getCurrentCanonicalIntelligenceEvidence,
 getCurrentCanonicalIntelligenceDatasetRows,
} from "./currentEvidence"

export * from "./metricComparability"

/** Shared reporting-window vocabulary and exact inclusive date-range semantics. */
export {
 ANALYTICS_WINDOWS,
 COMPARABLE_WINDOWS,
 WINDOW_DAYS,
 WINDOW_LABELS,
 WINDOW_SHORT_LABELS,
 isAnalyticsWindow,
 latestCompleteAnalyticsDate,
 resolveWindowRange,
 windowDayCount,
} from "../analytics/windows"
export type {
 AnalyticsPeriod,
 ComparableAnalyticsWindow,
 ResolvedWindowRange,
} from "../analytics/windows"
export { getCurrentCanonicalRows, getCurrentCanonicalMetricSummary } from "./currentRows"
