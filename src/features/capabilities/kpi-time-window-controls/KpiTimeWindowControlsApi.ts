/**
 * Roadmap item 13: KPI and Time-Window Controls
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: analytics-canon services, query filters, date range controls, metric definitions).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface KpiTimeWindowControlsRequest {
  kpi?: string;
  periods?: PeriodSelection[];
}

export interface KpiTimeWindowControlsData {
  kpi: string;
  periods: PeriodSelection[];
  series: KpiSeries[];
  diagnostics: DataDiagnostics
}

/** TODO(shape): confirm the canonical shape of `PeriodSelection` on the target branch; replace or import it. */
export type PeriodSelection = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `KpiSeries` on the target branch; replace or import it. */
export type KpiSeries = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `DataDiagnostics` on the target branch; replace or import it. */
export type DataDiagnostics = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchKpiTimeWindowControls(request: KpiTimeWindowControlsRequest, signal?: AbortSignal): Promise<KpiTimeWindowControlsData> {
  void request
  return apiFetch<KpiTimeWindowControlsData>(`scaffold://kpi-time-window-controls`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveKpiTimeWindowControls(_data: KpiTimeWindowControlsData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 13")
}
