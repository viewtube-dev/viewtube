/**
 * Roadmap item 24: Advanced Studio Control Modes — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchAdvancedStudioControls } from "./AdvancedStudioControlsApi"
import type { AdvancedStudioControlsData, AdvancedStudioControlsRequest } from "./AdvancedStudioControlsApi"

export function useAdvancedStudioControls(request: AdvancedStudioControlsRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<AdvancedStudioControlsData>(({ signal }) => fetchAdvancedStudioControls(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<AdvancedStudioControlsData>(store)
  return { snapshot, load, reset }
}
