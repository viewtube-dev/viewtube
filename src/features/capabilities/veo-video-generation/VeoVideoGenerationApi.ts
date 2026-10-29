/**
 * Roadmap item 7: Veo Video Generation Integration
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: provider adapters, generation service, capability registry, UI call sites).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface VeoVideoGenerationRequest {
  jobId?: string;
  status?: 'queued' | 'running' | 'succeeded' | 'failed';
}

export interface VeoVideoGenerationData {
  jobId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  settings: GenerationSettings;
  resultAssetId: string | null;
  error: string | null
}

/** TODO(shape): confirm the canonical shape of `GenerationSettings` on the target branch; replace or import it. */
export type GenerationSettings = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchVeoVideoGeneration(request: VeoVideoGenerationRequest, signal?: AbortSignal): Promise<VeoVideoGenerationData> {
  void request
  return apiFetch<VeoVideoGenerationData>(`scaffold://veo-video-generation`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveVeoVideoGeneration(_data: VeoVideoGenerationData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 7")
}
