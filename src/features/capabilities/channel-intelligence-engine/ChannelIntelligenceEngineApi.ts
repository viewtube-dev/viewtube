/**
 * Roadmap item 1: Channel Intelligence Engine — data layer.
 *
 * Resolution order (see shared/capabilityAdapter.ts):
 *   1. HTTP capability endpoint (if configured via setCapabilityEndpoint).
 *   2. Registered canonical adapter (e.g. buildBrainContextPack + analytics-canon
 *      snapshot loaders fed into shared/brainContracts.ts shapes).
 *   3. Neither → CapabilityEndpointError. No simulated data, ever.
 */
import { apiFetch, capabilityEndpoint } from "../../../api/client"
import {
  CapabilityEndpointError,
  loadChannelIntelligence,
  type ChannelIntelligenceSourceData,
} from "../shared/capabilityAdapter"

export interface ChannelIntelligenceEngineRequest {
  channelId?: string | null
}

/** Source snapshot + evidence quality report as supplied by the canonical Brain pipeline. */
export type ChannelIntelligenceEngineData = ChannelIntelligenceSourceData

export { CapabilityEndpointError }

export async function fetchChannelIntelligenceEngine(
  request: ChannelIntelligenceEngineRequest,
  signal?: AbortSignal,
): Promise<ChannelIntelligenceEngineData> {
  const endpoint = capabilityEndpoint()
  if (endpoint) {
    const params = new URLSearchParams()
    if (request.channelId) params.set("channelId", request.channelId)
    const query = params.toString()
    return apiFetch<ChannelIntelligenceEngineData>(
      `${endpoint}/channel-intelligence-engine${query ? `?${query}` : ""}`,
      { signal },
    )
  }
  try {
    return await loadChannelIntelligence({
      channelId: request.channelId ?? null,
      signal: signal ?? new AbortController().signal,
    })
  } catch (error) {
    if (error instanceof CapabilityEndpointError) {
      throw new CapabilityEndpointError(
        "channel-intelligence-engine",
        "VIEWTUBE_SCAFFOLD: channel intelligence source not wired — register the canonical Brain snapshot adapter (setCapabilityAdapter) or set the capability endpoint (setCapabilityEndpoint). No simulated data is shown by design.",
      )
    }
    throw error
  }
}
