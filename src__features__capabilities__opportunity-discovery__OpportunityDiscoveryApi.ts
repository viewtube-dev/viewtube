/**
 * Roadmap item 17: Content Opportunity Discovery
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: channel intelligence orchestrators, evidence cohorts, prompt/capability registry, output cards).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface OpportunityDiscoveryRequest {
  findings?: OpportunityFinding[];
  hypotheses?: OpportunityFinding[];
}

export interface OpportunityDiscoveryData {
  findings: OpportunityFinding[];
  hypotheses: OpportunityFinding[]
}

/** TODO(shape): confirm the canonical shape of `OpportunityFinding` on the target branch; replace or import it. */
export type OpportunityFinding = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchOpportunityDiscovery(request: OpportunityDiscoveryRequest, signal?: AbortSignal): Promise<OpportunityDiscoveryData> {
  void request
  return apiFetch<OpportunityDiscoveryData>(`scaffold://opportunity-discovery`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveOpportunityDiscovery(_data: OpportunityDiscoveryData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 17")
}
