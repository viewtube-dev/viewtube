/**
 * Roadmap item 3: Channel Context Intake — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchChannelContextIntake } from "./ChannelContextIntakeApi"
import type { ChannelContextIntakeData, ChannelContextIntakeRequest } from "./ChannelContextIntakeApi"

export function useChannelContextIntake(request: ChannelContextIntakeRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<ChannelContextIntakeData>(({ signal }) => fetchChannelContextIntake(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<ChannelContextIntakeData>(store)
  return { snapshot, load, reset }
}
