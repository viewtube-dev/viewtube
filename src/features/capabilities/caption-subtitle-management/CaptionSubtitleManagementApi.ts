/**
 * Roadmap item 12: Caption and Subtitle Management
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: caption APIs, permission boundaries, timing/editor utilities, active UI callers).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface CaptionSubtitleManagementRequest {
  videoId?: string;
  tracks?: CaptionTrack[];
}

export interface CaptionSubtitleManagementData {
  videoId: string;
  tracks: CaptionTrack[];
  canWrite: boolean
}

/** TODO(shape): confirm the canonical shape of `CaptionTrack` on the target branch; replace or import it. */
export type CaptionTrack = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchCaptionSubtitleManagement(request: CaptionSubtitleManagementRequest, signal?: AbortSignal): Promise<CaptionSubtitleManagementData> {
  void request
  return apiFetch<CaptionSubtitleManagementData>(`scaffold://caption-subtitle-management`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveCaptionSubtitleManagement(_data: CaptionSubtitleManagementData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 12")
}
