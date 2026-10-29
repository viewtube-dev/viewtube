/**
 * Roadmap item 22: Subscriber / API Dispatch Functions — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchSubscriberApiDispatch } from "./SubscriberApiDispatchApi"
import type { SubscriberApiDispatchData, SubscriberApiDispatchRequest } from "./SubscriberApiDispatchApi"

export function useSubscriberApiDispatch(request: SubscriberApiDispatchRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<SubscriberApiDispatchData>(({ signal }) => fetchSubscriberApiDispatch(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<SubscriberApiDispatchData>(store)
  return { snapshot, load, reset }
}
