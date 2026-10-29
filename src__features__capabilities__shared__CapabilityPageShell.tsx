import React from "react"
import { FlagGate } from "./FlagGate"
import { isCapabilityFlagEnabled } from "../../../flags/featureFlags"
import type { CapabilityDefinition } from "../../capabilities/registry"

export interface CapabilityPageShellProps {
  capability: CapabilityDefinition
  children: React.ReactNode
}

/**
 * Shared page chrome for every roadmap-25 capability page:
 * flag gate + audit-gate banner + honest data-quality note.
 * Uses plain layout tokens so pages work before any Studio primitive wiring;
 * swap sections for Studio primitives (`src/studio-ui`) when polishing.
 */
export function CapabilityPageShell({ capability, children }: CapabilityPageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide opacity-60">
          Roadmap Priority 25 · item {capability.number} · classification: {capability.classification}
        </p>
        <h1 className="text-xl font-semibold">{capability.title}</h1>
        <p className="text-sm opacity-80">{capability.userValue}</p>
      </header>

      {capability.auditGate ? (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <strong className="font-medium">Audit gate.</strong> {capability.auditGate}
        </div>
      ) : null}

      <div className="rounded-md border p-3 text-xs opacity-70">
        Code footholds on target branch: {capability.footholds}. Data flows through the capability
        adapter boundary or the capability endpoint — see <code>{capability.slug}Api.ts</code>.
      </div>

      <FlagGate enabled={isCapabilityFlagEnabled(capability.id)} label={capability.flag}>
        {children}
      </FlagGate>
    </div>
  )
}
