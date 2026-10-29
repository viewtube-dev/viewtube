/**
 * Roadmap item 15: Cross-Video Performance Comparison
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: analytics-canon, video cohort/selection paths).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface CrossVideoComparisonRequest {
  cohort?: VideoCohort;
  filters?: ComparisonFilters;
}

export interface CrossVideoComparisonData {
  cohort: VideoCohort;
  filters: ComparisonFilters;
  metrics: ComparisonMetric[]
}

/** TODO(shape): confirm the canonical shape of `VideoCohort` on the target branch; replace or import it. */
export type VideoCohort = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `ComparisonFilters` on the target branch; replace or import it. */
export type ComparisonFilters = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `ComparisonMetric` on the target branch; replace or import it. */
export type ComparisonMetric = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchCrossVideoComparison(request: CrossVideoComparisonRequest, signal?: AbortSignal): Promise<CrossVideoComparisonData> {
  void request
  return apiFetch<CrossVideoComparisonData>(`scaffold://cross-video-comparison`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveCrossVideoComparison(_data: CrossVideoComparisonData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 15")
}
