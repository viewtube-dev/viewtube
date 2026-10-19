import React, { useMemo, useState } from "react"
import { ArrowRight, Search, ShieldCheck, Sparkles } from "lucide-react"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import { BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS, BRAIN_CAPABILITY_REGISTRY } from "../../services/brain/BrainCapabilityRegistry"
import type { BrainCapabilityDefinition } from "../../types"
import type { BrainUserControls } from "../../services/brain/BrainUserControls"

export type BrainCapabilityAvailability = {
 status: "ready" | "needs-channel-data" | "blocked"
 label: string
 reason: string
}

const ANALYTICS_CAPABILITIES = new Set([
 "signal-anomaly-intelligence", "statistics-intelligence", "algorithm-intelligence",
 "analytics-diagnosis", "top-performer-mining",
])
const PERSONALIZED_CAPABILITIES = new Set(["channel-profile", "journal-memory", "goal-coach"])

export const getBrainCapabilityAvailability = (
 capability: BrainCapabilityDefinition,
 controls: BrainUserControls,
 snapshot: Pick<AIBrainContextSnapshot, "inferredProfile">,
): BrainCapabilityAvailability => {
 if (!controls.enabled) return { status: "blocked", label: "Brain is off", reason: "Enable Brain in its controls before launching a task." }
 if (ANALYTICS_CAPABILITIES.has(capability.id) && !controls.allowAnalytics) {
  return { status: "blocked", label: "Analytics access off", reason: "Enable analytics access in Brain controls to use this capability." }
 }
 if (PERSONALIZED_CAPABILITIES.has(capability.id) && !controls.personalization) {
  return { status: "blocked", label: "Personalization off", reason: "Enable personalization in Brain controls to use this capability." }
 }
 if (capability.requiresChannelData && snapshot.inferredProfile.videoCount === 0) {
  return { status: "needs-channel-data", label: "Needs channel data", reason: "Connect or sync a channel so Brain can check the evidence needed for this task." }
 }
 return { status: "ready", label: "Available to request", reason: "Brain will still check request fit, permissions, and available evidence when you send the prompt." }
}

export const filterBrainCapabilities = (
 capabilities: BrainCapabilityDefinition[],
 query: string,
): BrainCapabilityDefinition[] => {
 const normalized = query.trim().toLowerCase()
 if (!normalized) return capabilities
 return capabilities.filter((capability) =>
  [capability.label, capability.description, capability.id, ...capability.intents].some((value) =>
   value.toLowerCase().includes(normalized),
  ),
 )
}

export const capabilityPromptFor = (capability: BrainCapabilityDefinition): string =>
 `Help me with ${capability.label.toLowerCase()}. ${capability.description} Explain what the available evidence supports, call out missing inputs or uncertainty, and give me the most useful next step. Do not claim this capability ran unless the response confirms it.`

export const BrainCapabilityBrowser: React.FC<{
 snapshot: AIBrainContextSnapshot
 controls: BrainUserControls
 busy?: boolean
 headingId?: string
 onPrompt: (prompt: string) => void
 onEdit?: (prompt: string) => void
}> = ({ snapshot, controls, busy = false, headingId = "brain-capability-browser-title", onPrompt, onEdit }) => {
 const [query, setQuery] = useState("")
 const [selectedId, setSelectedId] = useState<string | null>(null)
 const capabilities = useMemo(() => filterBrainCapabilities(BRAIN_CAPABILITY_REGISTRY, query), [query])
 const selected = capabilities.find((capability) => capability.id === selectedId) || null

 return (
  <section aria-labelledby={headingId} aria-busy={busy || undefined} className="flex min-h-0 flex-col overflow-hidden rounded-[10px] border-[2px] border-black bg-white">
   <div className="shrink-0 border-b-[2px] border-black bg-[#36E0F6] px-3 py-2">
    <h2 id={headingId} className="text-[12px] font-[1000] uppercase leading-4 tracking-[0.08em]">Capability Browser</h2>
    <p className="mt-1 text-[10px] font-bold leading-4 text-black/70">Find a Brain capability and prepare a guided request. Launching a prompt does not bypass evidence checks or permissions.</p>
   </div>
   <label className="m-2 flex min-h-11 items-center gap-2 rounded-[7px] border-[2px] border-black bg-white px-2 focus-within:ring-[3px] focus-within:ring-black">
    <Search size={15} aria-hidden="true" />
    <span className="sr-only">Search Brain capabilities</span>
    <input
     type="search"
     value={query}
     onChange={(event) => { setQuery(event.target.value); setSelectedId(null) }}
     placeholder="Search capabilities, topics, or intent…"
     className="min-w-0 flex-1 bg-transparent py-2 text-xs font-bold text-black outline-none"
     aria-label="Search Brain capabilities"
     aria-controls={`${headingId}-results`}
    />
   </label>
   <p className="px-3 pb-1 text-[10px] font-bold text-black/60" role="status" aria-live="polite">
    {capabilities.length} of {BRAIN_CAPABILITY_REGISTRY.length} capabilities
   </p>
   <ul id={`${headingId}-results`} className="grid min-h-0 gap-1.5 overflow-y-auto p-2" aria-label="Available Brain capabilities">
    {capabilities.map((capability) => {
     const availability = getBrainCapabilityAvailability(capability, controls, snapshot)
     const isSelected = selectedId === capability.id
     return (
      <li key={capability.id}>
       <button
        type="button"
        disabled={busy}
        aria-pressed={isSelected}
        onClick={() => setSelectedId(isSelected ? null : capability.id)}
        className={`flex min-h-11 w-full items-start gap-2 rounded-[7px] border-[2px] border-black p-2 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-black disabled:opacity-50 ${isSelected ? "bg-[#FFDA47]" : "bg-white hover:bg-[#36E0F6]/20"}`}
       >
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[5px] border border-black bg-white" aria-hidden="true"><Sparkles size={14} /></span>
        <span className="min-w-0 flex-1">
         <span className="block text-[10px] font-[1000] uppercase leading-4">{capability.label}</span>
         <span className="mt-0.5 block text-[10px] font-bold leading-4 text-black/65">{capability.description}</span>
         <span className={`mt-1 inline-flex rounded-[4px] border border-black px-1.5 py-0.5 text-[9px] font-black uppercase ${availability.status === "ready" ? "bg-[#C0F240]" : availability.status === "blocked" ? "bg-[#FA618A]" : "bg-[#FFDA47]"}`}>{availability.label}</span>
        </span>
        <ArrowRight size={14} className="mt-1 shrink-0" aria-hidden="true" />
       </button>
      </li>
     )
    })}
    {!capabilities.length ? <li className="rounded-[7px] border-[2px] border-dashed border-black/40 p-4 text-xs font-bold text-black/60">No capabilities match “{query}”. Try a topic such as analytics, SEO, audience, or publishing.</li> : null}
   </ul>
   {selected ? (
    <div className="shrink-0 border-t-[2px] border-black bg-[#f8f8f4] p-3">
     <h3 className="text-[11px] font-[1000] uppercase">{selected.label}</h3>
     <p className="mt-1 text-[10px] font-bold leading-4 text-black/70">{getBrainCapabilityAvailability(selected, controls, snapshot).reason}</p>
     <p className="mt-1 text-[9px] font-bold leading-4 text-black/50">Evidence sections: {(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[selected.id] || []).join(", ") || "requirements not listed"}</p>
     <div className="mt-2 flex flex-wrap gap-2">
      <button
       type="button"
       onClick={() => { onPrompt(capabilityPromptFor(selected)); setSelectedId(null) }}
       disabled={busy || getBrainCapabilityAvailability(selected, controls, snapshot).status === "blocked"}
       className="inline-flex min-h-11 items-center gap-2 rounded-[7px] border-[2px] border-black bg-[#3FEE56] px-3 py-2 text-[10px] font-black uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50"
      ><ShieldCheck size={14} aria-hidden="true" /> Ask Brain</button>
      {onEdit ? <button type="button" onClick={() => { onEdit(capabilityPromptFor(selected)); setSelectedId(null) }} className="min-h-11 rounded-[7px] border-[2px] border-black bg-white px-3 py-2 text-[10px] font-black uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-black">Edit prompt first</button> : null}
     </div>
    </div>
   ) : <p className="shrink-0 border-t-[2px] border-black bg-[#f8f8f4] px-3 py-2 text-[10px] font-bold text-black/55">Choose a capability to see its prerequisites and launch a request.</p>}
  </section>
}

export default BrainCapabilityBrowser
