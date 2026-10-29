import React from "react"
import type { AsyncCapabilitySnapshot } from "./asyncCapabilityStore"

export interface AsyncStateViewProps {
  snapshot: AsyncCapabilitySnapshot<unknown>
  /** Shown when status === "ready" and data exists. */
  renderData: (data: unknown) => React.ReactNode
  emptyHint?: string
}

/**
 * Truthful async-state renderer: idle / loading / ready / error(+stale).
 * Never renders fabricated data — unwired sources fail with explicit errors.
 */
export function AsyncStateView({ snapshot, renderData, emptyHint }: AsyncStateViewProps) {
  if (snapshot.status === "idle") {
    return <p className="text-sm opacity-70">Idle. Run the action below to fetch from the (stub) API.</p>
  }
  if (snapshot.status === "loading") {
    return <p className="text-sm opacity-70" role="status">Loading…</p>
  }
  if (snapshot.status === "error") {
    return (
      <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">
        <p className="font-medium">Request failed — showing the real error, no invented data.</p>
        <p className="opacity-80">{snapshot.error}</p>
        {snapshot.data != null ? <p className="mt-1 text-xs opacity-70">Last known data is kept below.</p> : null}
      </div>
    )
  }
  if (snapshot.data == null) {
    return <p className="text-sm opacity-70">{emptyHint ?? "No data yet."}</p>
  }
  return (
    <div className="flex flex-col gap-2">
      {snapshot.stale ? (
        <p className="text-xs text-amber-500">Stale results — inputs changed, re-run to refresh.</p>
      ) : null}
      {snapshot.lastUpdatedAt ? (
        <p className="text-xs opacity-60">Updated {snapshot.lastUpdatedAt}</p>
      ) : null}
      {renderData(snapshot.data)}
    </div>
  )
}
