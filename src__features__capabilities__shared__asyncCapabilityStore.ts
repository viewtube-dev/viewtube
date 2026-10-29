import { useCallback, useSyncExternalStore } from "react"

/**
 * Shared honest-state store used by every capability scaffold (roadmap "Priority 25").
 *
 * Guardrails honored (see docs/product/VIEWTUBE_HIDDEN_CAPABILITIES_RESOURCE_AND_ROADMAP.md):
 *  - never invent success: status is only "ready" after a real fetch resolves
 *  - stale/missing data is surfaced as `stale: true` / `missing`, never disguised as live data
 *  - errors keep the last known data visible alongside the error message
 */
export type AsyncCapabilityStatus = "idle" | "loading" | "ready" | "error"

export interface AsyncCapabilitySnapshot<T> {
  status: AsyncCapabilityStatus
  data: T | null
  error: string | null
  stale: boolean
  missing: boolean
  lastUpdatedAt: string | null
}

export interface AsyncCapabilityStore<T> {
  subscribe(listener: () => void): () => void
  getSnapshot(): AsyncCapabilitySnapshot<T>
  load(): Promise<void>
  reset(): void
  markStale(): void
}

const IDLE = { status: "idle", data: null, error: null, stale: false, missing: false, lastUpdatedAt: null } as const

export function createAsyncCapabilityStore<T>(
  loader: (options: { signal: AbortSignal }) => Promise<T>,
): AsyncCapabilityStore<T> {
  let snapshot: AsyncCapabilitySnapshot<T> = { ...IDLE }
  const listeners = new Set<() => void>()
  let controller: AbortController | null = null

  const emit = () => listeners.forEach((l) => l())
  const set = (patch: Partial<AsyncCapabilitySnapshot<T>>) => {
    snapshot = { ...snapshot, ...patch }
    emit()
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot() {
      return snapshot
    },
    async load() {
      controller?.abort()
      controller = new AbortController()
      set({ status: "loading", error: null })
      try {
        const data = await loader({ signal: controller.signal })
        set({ status: "ready", data, error: null, stale: false, lastUpdatedAt: new Date().toISOString() })
      } catch (err) {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : String(err)
        // Keep prior data visible; never fabricate a successful state.
        set({ status: "error", error: message })
      }
    },
    reset() {
      controller?.abort()
      snapshot = { ...IDLE }
      emit()
    },
    markStale() {
      if (snapshot.status === "ready") set({ stale: true })
    },
  }
}

export function useAsyncCapability<T>(store: AsyncCapabilityStore<T>): {
  snapshot: AsyncCapabilitySnapshot<T>
  load: () => void
  reset: () => void
} {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const load = useCallback(() => void store.load(), [store])
  const reset = useCallback(() => store.reset(), [store])
  return { snapshot, load, reset }
}
