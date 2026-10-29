/**
 * Roadmap item 10: Ranked Tag Generation and Analysis
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: tag/SEO services, state ownership).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface RankedTagAnalysisRequest {
  videoId?: string;
  suggestions?: TagSuggestion[];
}

export interface RankedTagAnalysisData {
  videoId: string;
  suggestions: TagSuggestion[];
  persistedTags: string[]
}

/** TODO(shape): confirm the canonical shape of `TagSuggestion` on the target branch; replace or import it. */
export type TagSuggestion = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchRankedTagAnalysis(request: RankedTagAnalysisRequest, signal?: AbortSignal): Promise<RankedTagAnalysisData> {
  void request
  return apiFetch<RankedTagAnalysisData>(`scaffold://ranked-tag-analysis`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveRankedTagAnalysis(_data: RankedTagAnalysisData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 10")
}
