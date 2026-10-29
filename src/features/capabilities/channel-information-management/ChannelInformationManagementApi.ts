/**
 * Roadmap item 18: Manage Channel Information
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: Settings.tsx, SettingsAccountPanel.tsx, CreatorContextResolver.ts).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface ChannelInformationManagementRequest {
  identity?: ChannelIdentity;
  profile?: ChannelProfile;
}

export interface ChannelInformationManagementData {
  identity: ChannelIdentity;
  profile: ChannelProfile;
  sources: ChannelSource[]
}

/** TODO(shape): confirm the canonical shape of `ChannelIdentity` on the target branch; replace or import it. */
export type ChannelIdentity = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `ChannelProfile` on the target branch; replace or import it. */
export type ChannelProfile = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `ChannelSource` on the target branch; replace or import it. */
export type ChannelSource = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchChannelInformationManagement(request: ChannelInformationManagementRequest, signal?: AbortSignal): Promise<ChannelInformationManagementData> {
  void request
  return apiFetch<ChannelInformationManagementData>(`scaffold://channel-information-management`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveChannelInformationManagement(_data: ChannelInformationManagementData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 18")
}
