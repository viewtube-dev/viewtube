/**
 * Roadmap item 6: Shorts / Vertical Video Modes — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchShortsVerticalModes } from "./ShortsVerticalModesApi"
import type { ShortsVerticalModesData, ShortsVerticalModesRequest } from "./ShortsVerticalModesApi"

export function useShortsVerticalModes(request: ShortsVerticalModesRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<ShortsVerticalModesData>(({ signal }) => fetchShortsVerticalModes(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<ShortsVerticalModesData>(store)
  return { snapshot, load, reset }
}
