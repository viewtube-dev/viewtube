import React from "react"

export interface FlagGateProps {
  enabled: boolean
  label: string
  children: React.ReactNode
}

/**
 * Renders children only when the capability flag is enabled.
 * While disabled, shows the flag name so rollout can be flipped in one place.
 */
export function FlagGate({ enabled, label, children }: FlagGateProps) {
  if (!enabled) {
    return (
      <div className="rounded-md border border-dashed p-4 text-sm opacity-70">
        Feature flag <code>{label}</code> is off. Enable it in{" "}
        <code>src/flags/featureFlags.ts</code> (or <code>localStorage</code> override) to reveal this
        scaffold.
      </div>
    )
  }
  return <>{children}</>
}
