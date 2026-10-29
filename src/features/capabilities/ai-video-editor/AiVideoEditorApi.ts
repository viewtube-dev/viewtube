/**
 * Roadmap item 5: AI Video Editor
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: existing video/editor services, route registry, active callers).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface AiVideoEditorRequest {
  operations?: EditorOperation[];
  jobId?: string | null;
}

export interface AiVideoEditorData {
  operations: EditorOperation[];
  jobId: string | null;
  jobStatus: 'idle' | 'running' | 'succeeded' | 'failed' | null
}

/** TODO(shape): confirm the canonical shape of `EditorOperation` on the target branch; replace or import it. */
export type EditorOperation = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchAiVideoEditor(request: AiVideoEditorRequest, signal?: AbortSignal): Promise<AiVideoEditorData> {
  void request
  return apiFetch<AiVideoEditorData>(`scaffold://ai-video-editor`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveAiVideoEditor(_data: AiVideoEditorData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 5")
}
