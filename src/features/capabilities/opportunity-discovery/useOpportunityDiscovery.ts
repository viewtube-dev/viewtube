/**
 * Roadmap item 17: Content Opportunity Discovery — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchOpportunityDiscovery } from "./OpportunityDiscoveryApi"
import type { OpportunityDiscoveryData, OpportunityDiscoveryRequest } from "./OpportunityDiscoveryApi"

export function useOpportunityDiscovery(request: OpportunityDiscoveryRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<OpportunityDiscoveryData>(({ signal }) => fetchOpportunityDiscovery(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<OpportunityDiscoveryData>(store)
  return { snapshot, load, reset }
}
