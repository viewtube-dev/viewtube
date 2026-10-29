/**
 * Roadmap item 11: Transcript and Language Tools — state owner (React hook over an honest store).
 * Extend this instead of adding a second store; reuse canonical persistence
 * owners where they already exist on the target branch.
 */
import { useMemo } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import { fetchTranscriptLanguageTools } from "./TranscriptLanguageToolsApi"
import type { TranscriptLanguageToolsData, TranscriptLanguageToolsRequest } from "./TranscriptLanguageToolsApi"

export function useTranscriptLanguageTools(request: TranscriptLanguageToolsRequest = {}) {
  const store = useMemo(
    () => createAsyncCapabilityStore<TranscriptLanguageToolsData>(({ signal }) => fetchTranscriptLanguageTools(request, signal)),
    // request is expected to be a stable primitive/parsed object per render site
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { snapshot, load, reset } = useAsyncCapability<TranscriptLanguageToolsData>(store)
  return { snapshot, load, reset }
}
