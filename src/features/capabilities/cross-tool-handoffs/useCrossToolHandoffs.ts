/**
 * Roadmap item 21: Cross-Tool Workflow Handoffs — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchCrossToolHandoffs } from "./CrossToolHandoffsApi"
import type { CrossToolHandoffsData, CrossToolHandoffsRequest } from "./CrossToolHandoffsApi"

export function useCrossToolHandoffs(request: CrossToolHandoffsRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<CrossToolHandoffsData>(({ signal }) => fetchCrossToolHandoffs(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<CrossToolHandoffsData>(store)
  return { snapshot, load, reset }
}
