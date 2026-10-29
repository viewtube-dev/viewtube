/**
 * Roadmap item 25: Unified Feature Discovery and Action Registry
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: route registry, BrainCapabilityRegistry, toolbox/subtoolbox registry, help/user-guide index).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface FeatureDiscoveryRegistryRequest {
  entries?: DiscoveryEntry[];
  query?: string;
}

export interface FeatureDiscoveryRegistryData {
  entries: DiscoveryEntry[];
  query: string
}

/** TODO(shape): confirm the canonical shape of `DiscoveryEntry` on the target branch; replace or import it. */
export type DiscoveryEntry = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchFeatureDiscoveryRegistry(request: FeatureDiscoveryRegistryRequest, signal?: AbortSignal): Promise<FeatureDiscoveryRegistryData> {
  void request
  return apiFetch<FeatureDiscoveryRegistryData>(`scaffold://feature-discovery-registry`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveFeatureDiscoveryRegistry(_data: FeatureDiscoveryRegistryData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 25")
}
