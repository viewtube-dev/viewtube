/**
 * Roadmap item 4: AI Prompt Library and Chat Handoff — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchPromptLibraryHandoff } from "./PromptLibraryHandoffApi"
import type { PromptLibraryHandoffData, PromptLibraryHandoffRequest } from "./PromptLibraryHandoffApi"

export function usePromptLibraryHandoff(request: PromptLibraryHandoffRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<PromptLibraryHandoffData>(({ signal }) => fetchPromptLibraryHandoff(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<PromptLibraryHandoffData>(store)
  return { snapshot, load, reset }
}
