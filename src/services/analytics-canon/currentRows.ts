import type { AnalyticsWindow, CanonicalVideoRow, MetricSummary } from "./contracts"
import { getCanonicalRowsFromVtSync, summarizeCanonicalRows } from "./vtSyncAdapter"
import { getVtSyncSnapshot } from "../../features/vt-sync-local/adapters/snapshot"

/**
 * Imperative canonical row access for non-React consumers (exports, jobs, and
 * service-layer joins). The same adapter and exact-window rules as the hooks
 * are used; callers never read the legacy analytics cache directly.
 */
export const getCurrentCanonicalRows = (window: AnalyticsWindow): CanonicalVideoRow[] =>
 getCanonicalRowsFromVtSync(getVtSyncSnapshot(), window)

export const getCurrentCanonicalMetricSummary = (window: AnalyticsWindow): MetricSummary =>
 summarizeCanonicalRows(getCurrentCanonicalRows(window))
