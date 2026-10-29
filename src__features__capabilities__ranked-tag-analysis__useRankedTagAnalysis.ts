/**
 * Roadmap item 10: Ranked Tag Generation and Analysis — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchRankedTagAnalysis } from "./RankedTagAnalysisApi"
import type { RankedTagAnalysisData, RankedTagAnalysisRequest } from "./RankedTagAnalysisApi"

export function useRankedTagAnalysis(request: RankedTagAnalysisRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<RankedTagAnalysisData>(({ signal }) => fetchRankedTagAnalysis(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<RankedTagAnalysisData>(store)
  return { snapshot, load, reset }
}
