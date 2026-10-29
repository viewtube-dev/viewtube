/**
 * Roadmap item 24: Advanced Studio Control Modes
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: src/studio-ui/primitives, src/studio-ui/index.ts, src/studio-ui/tokens.ts).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface AdvancedStudioControlsRequest {
  modes?: StudioControlMode[];
  activeModeId?: string | null;
}

export interface AdvancedStudioControlsData {
  modes: StudioControlMode[];
  activeModeId: string | null
}

/** TODO(shape): confirm the canonical shape of `StudioControlMode` on the target branch; replace or import it. */
export type StudioControlMode = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchAdvancedStudioControls(request: AdvancedStudioControlsRequest, signal?: AbortSignal): Promise<AdvancedStudioControlsData> {
  void request
  return apiFetch<AdvancedStudioControlsData>(`scaffold://advanced-studio-controls`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveAdvancedStudioControls(_data: AdvancedStudioControlsData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 24")
}
