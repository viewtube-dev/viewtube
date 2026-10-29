/**
 * Roadmap item 6: Shorts / Vertical Video Modes
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: generation mode enums, video package/content-build handlers, production consumers).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface ShortsVerticalModesRequest {
  modes?: ShortsMode[];
  selectedModeId?: string | null;
}

export interface ShortsVerticalModesData {
  modes: ShortsMode[];
  selectedModeId: string | null
}

/** TODO(shape): confirm the canonical shape of `ShortsMode` on the target branch; replace or import it. */
export type ShortsMode = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchShortsVerticalModes(request: ShortsVerticalModesRequest, signal?: AbortSignal): Promise<ShortsVerticalModesData> {
  void request
  return apiFetch<ShortsVerticalModesData>(`scaffold://shorts-vertical-modes`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveShortsVerticalModes(_data: ShortsVerticalModesData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 6")
}
