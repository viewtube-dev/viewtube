/**
 * Roadmap item 19: Public Channel Resolution Without Login — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchPublicChannelResolution } from "./PublicChannelResolutionApi"
import type { PublicChannelResolutionData, PublicChannelResolutionRequest } from "./PublicChannelResolutionApi"

export function usePublicChannelResolution(request: PublicChannelResolutionRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<PublicChannelResolutionData>(({ signal }) => fetchPublicChannelResolution(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<PublicChannelResolutionData>(store)
  return { snapshot, load, reset }
}
