/**
 * Roadmap item 8: Metadata Generation and Refinement
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: metadata services, existing video update path).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface MetadataRefinementRequest {
  alternatives?: MetadataAlternative[];
  draft?: MetadataDraft | null;
}

export interface MetadataRefinementData {
  alternatives: MetadataAlternative[];
  draft: MetadataDraft | null;
  saved: MetadataDraft | null
}

/** TODO(shape): confirm the canonical shape of `MetadataAlternative` on the target branch; replace or import it. */
export type MetadataAlternative = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `MetadataDraft` on the target branch; replace or import it. */
export type MetadataDraft = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchMetadataRefinement(request: MetadataRefinementRequest, signal?: AbortSignal): Promise<MetadataRefinementData> {
  void request
  return apiFetch<MetadataRefinementData>(`scaffold://metadata-refinement`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveMetadataRefinement(_data: MetadataRefinementData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 8")
}
