/**
 * Roadmap item 12: Caption and Subtitle Management — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchCaptionSubtitleManagement } from "./CaptionSubtitleManagementApi"
import type { CaptionSubtitleManagementData, CaptionSubtitleManagementRequest } from "./CaptionSubtitleManagementApi"

export function useCaptionSubtitleManagement(request: CaptionSubtitleManagementRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<CaptionSubtitleManagementData>(({ signal }) => fetchCaptionSubtitleManagement(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<CaptionSubtitleManagementData>(store)
  return { snapshot, load, reset }
}
