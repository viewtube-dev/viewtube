/**
 * Roadmap item 23: Hidden Tools, Widgets, and Pages — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchHiddenToolsPages } from "./HiddenToolsPagesApi"
import type { HiddenToolsPagesData, HiddenToolsPagesRequest } from "./HiddenToolsPagesApi"

export function useHiddenToolsPages(request: HiddenToolsPagesRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<HiddenToolsPagesData>(({ signal }) => fetchHiddenToolsPages(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<HiddenToolsPagesData>(store)
  return { snapshot, load, reset }
}
