/**
 * Roadmap item 2: Evidence-Connected AI Brain — state owner.
 * Thin hook over the shared honest-state store; `ask` carries the latest
 * question via a ref so repeated asks never read a stale closure.
 */
import { useCallback, useMemo, useRef } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import {
  runEvidenceConnectedBrain,
  type EvidenceConnectedBrainTurn,
} from "./EvidenceConnectedBrainApi"

export function useEvidenceConnectedBrain() {
  const questionRef = useRef("")
  const channelIdRef = useRef<string | null>(null)
  const store = useMemo(
    () =>
      createAsyncCapabilityStore<EvidenceConnectedBrainTurn>(({ signal }) =>
        runEvidenceConnectedBrain(
          { question: questionRef.current, channelId: channelIdRef.current },
          signal,
        ),
      ),
    [],
  )
  const { snapshot } = useAsyncCapability<EvidenceConnectedBrainTurn>(store)
  const ask = useCallback(
    (question: string, channelId: string | null = null) => {
      questionRef.current = question
      channelIdRef.current = channelId
      void store.load()
    },
    [store],
  )
  const reset = useCallback(() => store.reset(), [store])
  return { snapshot, ask, reset }
}
