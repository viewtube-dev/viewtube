/**
 * Roadmap item 14: CSV / Document Analytics
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: existing import parsers, file analysis paths, evidence normalization).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface CsvDocumentAnalyticsRequest {
  importId?: string;
  schema?: ImportSchema;
}

export interface CsvDocumentAnalyticsData {
  importId: string;
  schema: ImportSchema;
  rowsAnalyzed: number;
  provenance: string
}

/** TODO(shape): confirm the canonical shape of `ImportSchema` on the target branch; replace or import it. */
export type ImportSchema = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchCsvDocumentAnalytics(request: CsvDocumentAnalyticsRequest, signal?: AbortSignal): Promise<CsvDocumentAnalyticsData> {
  void request
  return apiFetch<CsvDocumentAnalyticsData>(`scaffold://csv-document-analytics`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveCsvDocumentAnalytics(_data: CsvDocumentAnalyticsData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 14")
}
