import React, { useMemo, useState } from "react"
import { ShieldCheck, Sparkles } from "lucide-react"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import { BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS, BRAIN_CAPABILITY_REGISTRY } from "../../services/brain/BrainCapabilityRegistry"
import type { BrainCapabilityDefinition } from "../../types"
import type { BrainUserControls } from "../../services/brain/BrainUserControls"
import { StudioTextInput, StudioSplitLeftButton, StudioButton, StudioTopSplitModule } from "../../studio-ui"
import { BrainChatStatusBadge } from "./BrainChatPrimitives"

export type BrainCapabilityAvailability = {
 status: "ready" | "needs-channel-data" | "needs-project-context" | "blocked"
 label: string
 reason: string
}

const ANALYTICS_CAPABILITIES = new Set([
 "signal-anomaly-intelligence", "statistics-intelligence", "algorithm-intelligence",
 "analytics-diagnosis", "top-performer-mining",
])
const PERSONALIZED_CAPABILITIES = new Set(["channel-profile", "journal-memory", "goal-coach"])
const PROJECT_CAPABILITIES = new Set(["daily-oracle", "content-generation"])

export const getBrainCapabilityAvailability = (
 capability: BrainCapabilityDefinition,
 controls: BrainUserControls,
 snapshot: Pick<AIBrainContextSnapshot, "inferredProfile" | "brain">,
): BrainCapabilityAvailability => {
 if (!controls.enabled) return { status: "blocked", label: "Brain is off", reason: "Enable Brain in its controls before launching a task." }
 if (ANALYTICS_CAPABILITIES.has(capability.id) && !controls.allowAnalytics) {
  return { status: "blocked", label: "Analytics access off", reason: "Enable analytics access in Brain controls to use this capability." }
 }
 if (PERSONALIZED_CAPABILITIES.has(capability.id) && !controls.personalization) {
  return { status: "blocked", label: "Personalization off", reason: "Enable personalization in Brain controls to use this capability." }
 }
 if (PROJECT_CAPABILITIES.has(capability.id) && !controls.allowProjects) {
  return { status: "blocked", label: "Project access off", reason: "Enable project access in Brain controls to use this capability." }
 }
 if (PROJECT_CAPABILITIES.has(capability.id) && snapshot.brain.activeProjects === 0) {
  return { status: "needs-project-context", label: "Needs project context", reason: "Select or create a project so Brain can use the project-specific context this capability expects." }
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
  <section aria-labelledby={headingId} aria-busy={busy || undefined} className="flex min-h-0 min-w-0 flex-col overflow-hidden">
   <StudioTopSplitModule as="header" sizeVariant="compact" className="shrink-0 px-3 py-2">
    <h2 id={headingId} className="text-[12px] font-[1000] uppercase leading-4 tracking-[0.08em]">Capability Browser</h2>
    <p className="mt-1 text-xs font-bold leading-4">Find a Brain capability and prepare a guided request. Launching a prompt does not bypass evidence checks or permissions.</p>
   </StudioTopSplitModule>
   <div className="min-w-0 p-2">
    <StudioTextInput type="search" sizeVariant="compact" value={query} onChange={(event) => { setQuery(event.target.value); setSelectedId(null) }} placeholder="Search capabilities, topics, or intent…" className="w-full min-w-0" aria-label="Search Brain capabilities" aria-controls={`${headingId}-results`} />
   </div>
   <p className="px-3 pb-1 text-xs font-bold" role="status" aria-live="polite">
    {capabilities.length} of {BRAIN_CAPABILITY_REGISTRY.length} capabilities
   </p>
   <ul id={`${headingId}-results`} className="grid min-h-0 min-w-0 gap-1.5 overflow-y-auto p-2" aria-label="Available Brain capabilities">
    {capabilities.map((capability) => {
     const availability = getBrainCapabilityAvailability(capability, controls, snapshot)
     const isSelected = selectedId === capability.id
     return (
      <li key={capability.id}>
       <div className="grid min-w-0 gap-1">
        <StudioSplitLeftButton sizeVariant="compact" icon={<Sparkles aria-hidden="true" />} disabled={busy} selected={isSelected} aria-pressed={isSelected} onClick={() => setSelectedId(isSelected ? null : capability.id)} className="w-full min-w-0" title={capability.label}>{capability.label}</StudioSplitLeftButton>
        <p className="px-1 text-xs font-bold leading-4">{capability.description}</p>
        <div className="px-1"><BrainChatStatusBadge status={availability.status === "ready" ? "ready" : availability.status === "blocked" ? "error" : "warning"} label={availability.label} /></div>
       </div>
      </li>
     )
    })}
    {!capabilities.length ? <li className="p-4 text-xs font-bold">No capabilities match “{query}”. Try a topic such as analytics, SEO, audience, or publishing.</li> : null}
   </ul>
   {selected ? (
    <div className="shrink-0 min-w-0 p-3">
     <h3 className="text-[11px] font-[1000] uppercase">{selected.label}</h3>
     <p className="mt-1 text-[10px] font-bold leading-4 text-black/70">{getBrainCapabilityAvailability(selected, controls, snapshot).reason}</p>
     <p className="mt-1 text-xs font-bold leading-4">Evidence sections: {(BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[selected.id] || []).join(", ") || "requirements not listed"}</p>
     <div className="mt-2 flex flex-wrap gap-2">
      <StudioSplitLeftButton sizeVariant="compact" icon={<ShieldCheck aria-hidden="true" />} onClick={() => { onPrompt(capabilityPromptFor(selected)); setSelectedId(null) }} disabled={busy || getBrainCapabilityAvailability(selected, controls, snapshot).status === "blocked"}>Ask Brain</StudioSplitLeftButton>
      {onEdit ? <StudioButton sizeVariant="compact" tone="neutral" onClick={() => { onEdit(capabilityPromptFor(selected)); setSelectedId(null) }}>Edit prompt first</StudioButton> : null}
     </div>
    </div>
   ) : <p className="shrink-0 px-3 py-2 text-xs font-bold">Choose a capability to see its prerequisites and launch a request.</p>}
  </section>
 )
}

export default BrainCapabilityBrowser
