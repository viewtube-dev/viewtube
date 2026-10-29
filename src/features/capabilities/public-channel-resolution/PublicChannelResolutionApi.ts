/**
 * Roadmap item 19: Public Channel Resolution Without Login
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: src/services/publicHandleMode.ts, Settings.tsx, SettingsAccountPanel.tsx).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface PublicChannelResolutionRequest {
  input?: string;
  mode?: 'public_handle';
}

export interface PublicChannelResolutionData {
  input: string;
  mode: 'public_handle';
  dataQuality: 'live' | 'fixture' | 'degraded' | null;
  snapshot: PublicChannelSnapshot | null;
  unavailable: string[]
}

/** TODO(shape): confirm the canonical shape of `PublicChannelSnapshot` on the target branch; replace or import it. */
export type PublicChannelSnapshot = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchPublicChannelResolution(request: PublicChannelResolutionRequest, signal?: AbortSignal): Promise<PublicChannelResolutionData> {
  void request
  return apiFetch<PublicChannelResolutionData>(`scaffold://public-channel-resolution`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function savePublicChannelResolution(_data: PublicChannelResolutionData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 19")
}
