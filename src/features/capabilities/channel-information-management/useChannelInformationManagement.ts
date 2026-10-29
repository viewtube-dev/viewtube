/**
 * Roadmap item 18: Manage Channel Information — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchChannelInformationManagement } from "./ChannelInformationManagementApi"
import type { ChannelInformationManagementData, ChannelInformationManagementRequest } from "./ChannelInformationManagementApi"

export function useChannelInformationManagement(request: ChannelInformationManagementRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<ChannelInformationManagementData>(({ signal }) => fetchChannelInformationManagement(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<ChannelInformationManagementData>(store)
  return { snapshot, load, reset }
}
