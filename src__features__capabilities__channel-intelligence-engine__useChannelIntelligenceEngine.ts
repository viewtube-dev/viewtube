/**
 * Roadmap item 1: Channel Intelligence Engine — state owner.
 * Thin hook over the shared honest-state store; `run` drives (re)loads with the
 * latest request via a ref so repeated calls never go stale.
 */
import { useCallback, useMemo, useRef } from "react"
import {
  createAsyncCapabilityStore,
  useAsyncCapability,
} from "../shared/asyncCapabilityStore"
import {
  fetchChannelIntelligenceEngine,
  type ChannelIntelligenceEngineData,
  type ChannelIntelligenceEngineRequest,
} from "./ChannelIntelligenceEngineApi"

export function useChannelIntelligenceEngine() {
  const inputRef = useRef<ChannelIntelligenceEngineRequest>({})
  const store = useMemo(
    () =>
      createAsyncCapabilityStore<ChannelIntelligenceEngineData>(({ signal }) =>
        fetchChannelIntelligenceEngine(inputRef.current, signal),
      ),
    [],
  )
  const { snapshot } = useAsyncCapability<ChannelIntelligenceEngineData>(store)
  const run = useCallback(
    (request: ChannelIntelligenceEngineRequest = {}) => {
      inputRef.current = request
      void store.load()
    },
    [store],
  )
  const reset = useCallback(() => store.reset(), [store])
  return { snapshot, run, reset }
}
