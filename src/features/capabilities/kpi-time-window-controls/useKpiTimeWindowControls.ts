/**
 * Roadmap item 13: KPI and Time-Window Controls — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchKpiTimeWindowControls } from "./KpiTimeWindowControlsApi"
import type { KpiTimeWindowControlsData, KpiTimeWindowControlsRequest } from "./KpiTimeWindowControlsApi"

export function useKpiTimeWindowControls(request: KpiTimeWindowControlsRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<KpiTimeWindowControlsData>(({ signal }) => fetchKpiTimeWindowControls(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<KpiTimeWindowControlsData>(store)
  return { snapshot, load, reset }
}
