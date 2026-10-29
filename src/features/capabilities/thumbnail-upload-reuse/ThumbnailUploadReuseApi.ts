/**
 * Roadmap item 9: Thumbnail Upload and Reuse
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: thumbnail/media asset services, upload callers).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface ThumbnailUploadReuseRequest {
  assetId?: string;
  url?: string;
}

export interface ThumbnailUploadReuseData {
  assetId: string;
  url: string;
  sourceTaskId: string | null
}



/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchThumbnailUploadReuse(request: ThumbnailUploadReuseRequest, signal?: AbortSignal): Promise<ThumbnailUploadReuseData> {
  void request
  return apiFetch<ThumbnailUploadReuseData>(`scaffold://thumbnail-upload-reuse`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveThumbnailUploadReuse(_data: ThumbnailUploadReuseData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 9")
}
