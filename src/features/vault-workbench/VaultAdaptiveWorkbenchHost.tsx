import React, { useState } from "react"
import { getVaultCapabilitiesForMode, VAULT_WORKBENCH_MODES, type VaultMediaCapability, type VaultWorkbenchMode } from "./capabilities"

export interface VaultAdaptiveWorkbenchHostProps {
  capabilities: VaultMediaCapability[]
  selectionCount?: number
  initialMode?: VaultWorkbenchMode
}

/** Shared adaptive host; availability is a UI hint, not an authorization boundary. */
export const VaultAdaptiveWorkbenchHost: React.FC<VaultAdaptiveWorkbenchHostProps> = ({
  capabilities, selectionCount = 0, initialMode = "inspect",
}) => {
  const [mode, setMode] = useState<VaultWorkbenchMode>(initialMode)
  const modeCapabilities = getVaultCapabilitiesForMode(capabilities, mode)
  const availableModes = new Set(capabilities.map((item) => item.mode))
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-md border-2 border-current p-2"
      aria-label="Adaptive Vault Workbench" data-vault-adaptive-workbench data-mode={mode}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-black uppercase">Adaptive Workbench</div>
          <div className="text-[10px] font-bold opacity-60">{selectionCount ? `${selectionCount} selected` : "No selection"}</div>
        </div>
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Workbench modes">
          {VAULT_WORKBENCH_MODES.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={mode === item.id}
              aria-controls="vault-workbench-capability-panel"
              disabled={item.id !== "browse" && !availableModes.has(item.id)}
              onClick={() => setMode(item.id)}
              className="border-2 border-current px-2 py-1 text-[10px] font-black uppercase disabled:cursor-not-allowed disabled:opacity-40">
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div id="vault-workbench-capability-panel" role="tabpanel" className="flex flex-wrap gap-2">
        {modeCapabilities.length ? modeCapabilities.map((capability) => (
          <span key={capability.id} title={capability.reason || capability.label}
            aria-label={capability.available ? capability.label + " available" : capability.label + " unavailable: " + capability.reason}
            className="rounded border-2 border-current px-2 py-1 text-[10px] font-black uppercase"
            data-capability={capability.id} data-available={capability.available ? "true" : "false"}>
            {capability.label}{capability.available ? "" : " · unavailable"}
          </span>
        )) : <span className="text-xs font-bold opacity-60">No capabilities are registered for this mode and selection.</span>}
      </div>
    </section>
  )
}
export default VaultAdaptiveWorkbenchHost
