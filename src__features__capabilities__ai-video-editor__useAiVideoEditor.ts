/**
 * Roadmap item 5: AI Video Editor — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchAiVideoEditor } from "./AiVideoEditorApi"
import type { AiVideoEditorData, AiVideoEditorRequest } from "./AiVideoEditorApi"

export function useAiVideoEditor(request: AiVideoEditorRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<AiVideoEditorData>(({ signal }) => fetchAiVideoEditor(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<AiVideoEditorData>(store)
  return { snapshot, load, reset }
}
