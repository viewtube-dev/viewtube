import React, { useEffect, useState } from "react"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import {
 readBrainUserControls,
 writeBrainUserControls,
 type BrainUserControls,
} from "../../services/brain/BrainUserControls"

const POLICY_ROWS: Array<{ key: keyof BrainUserControls; label: string; detail: string }> = [
 { key: "enabled", label: "Brain enabled", detail: "Master gate for Brain actions." },
 { key: "personalization", label: "Personalization", detail: "Allow creator-specific context in Brain tasks." },
 { key: "learnFromInteractions", label: "Learn from interactions", detail: "Allow eligible interaction signals into governed learning intake." },
 { key: "allowAnalytics", label: "Analytics access", detail: "Permission to request analytics capabilities; data readiness is checked separately." },
 { key: "allowProjects", label: "Project access", detail: "Permission to use project context; an active project may still be missing." },
 { key: "allowComments", label: "Comments access", detail: "Permission gate only; it does not mean comments were loaded." },
 { key: "allowVault", label: "Vault access", detail: "Permission gate only; it does not mean an asset was read." },
 { key: "allowPublisher", label: "Publisher access", detail: "Permission gate only; publishing still follows its own approval flow." },
 { key: "externalActionsRequireApproval", label: "Require approval for external actions", detail: "Keep external side effects behind the existing approval boundary." },
 { key: "captureCreatorCommunications", label: "Capture creator communications", detail: "Off by default; requires personalization and learning to be enabled too." },
 { key: "contributeDeidentifiedResearch", label: "Contribute de-identified research", detail: "Off by default; sharing remains separately gated." },
]

export const BrainPromptPolicyPanel: React.FC<{
 channelId?: string | null
 snapshot: AIBrainContextSnapshot
 onEditPrompt?: (prompt: string) => void
}> = ({ channelId = null, snapshot, onEditPrompt }) => {
 const [controls, setControls] = useState<BrainUserControls>(() => readBrainUserControls(channelId))
 const [status, setStatus] = useState("")
 useEffect(() => {
  const refresh = () => setControls(readBrainUserControls(channelId))
  window.addEventListener("vt_brain_user_controls_changed", refresh)
  return () => window.removeEventListener("vt_brain_user_controls_changed", refresh)
 }, [channelId])



 const update = (key: keyof BrainUserControls, value: boolean) => {
  const next = writeBrainUserControls({ ...controls, [key]: value }, channelId)
  setControls(next)
  setStatus("Saved to this browser's Brain control settings.")
 }

 const dataReadiness = [
  { label: "Channel data", ready: snapshot.inferredProfile.videoCount > 0, detail: snapshot.inferredProfile.videoCount > 0 ? `${snapshot.inferredProfile.videoCount} videos in the current profile snapshot` : "No analyzed videos in the current profile snapshot" },
  { label: "Project context", ready: snapshot.brain.activeProjects > 0, detail: snapshot.brain.activeProjects > 0 ? `${snapshot.brain.activeProjects} active projects` : "No active project in the current snapshot" },
 ]

 return (
  <section className="overflow-hidden border-[2px] border-black bg-white" aria-label="Prompt registry and Brain policy">
   <header className="border-b-[2px] border-black bg-[#B9A0FF] px-3 py-2">
    <h3 className="text-[10px] font-[1000] uppercase leading-4 tracking-[0.08em]">Prompt Studio &amp; Access</h3>
    <p className="text-[9px] font-bold leading-3 text-black/70">Registry inventory and saved permission gates, not a second prompt resolver.</p>
   </header>
   <div className="grid gap-2 p-2">
    <div>
     <h4 className="mb-1 text-[9px] font-[1000] uppercase">Canonical prompt authority</h4>
     <p className="mb-1 text-[9px] font-bold leading-4 text-black/60">Prompt architecture is owned by docs/specifications/PROMPTS.md and docs/specifications/prompt-registry.json. The UI does not import documentation into runtime code or infer which prompt/version was active for a turn.</p>
     {onEditPrompt ? <button type="button" onClick={() => onEditPrompt("Inspect the existing prompt resolver and runtime trace for my next task. Explain the active prompt family/version, inherited defaults, any creator overrides, context recipe, output schema, and validation status only where the canonical runtime exposes them. If active-turn provenance is unavailable, say so explicitly; do not infer it from documentation.")} className="mt-2 min-h-9 w-full border-[2px] border-black bg-white px-2 text-[9px] font-[1000] uppercase hover:bg-[#36E0F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Inspect active prompt for next task</button> : null}
    </div>
    <div className="border-t-[2px] border-black pt-2">
     <h4 className="mb-1 text-[9px] font-[1000] uppercase">Saved permission gates</h4>
     <ul className="grid gap-1.5">
      {POLICY_ROWS.map((row) => (
       <li key={row.key} className="flex items-start gap-2">
        <input id={`brain-policy-${String(row.key)}-${channelId || "global"}`} type="checkbox" checked={Boolean(controls[row.key])} onChange={(event) => update(row.key, event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-black" />
        <label htmlFor={`brain-policy-${String(row.key)}-${channelId || "global"}`} className="min-w-0 text-[9px] leading-3">
         <span className="block font-[1000] uppercase">{row.label}</span>
         <span className="block text-black/60">{row.detail}</span>
        </label>
       </li>
      ))}
     </ul>
     <p role="status" aria-live="polite" className="mt-1 text-[9px] font-bold text-black/60">{status || "These settings are stored in this browser; they are not proof that data is ready or a capability executed."}</p>
    </div>
    <div className="border-t-[2px] border-black pt-2">
     <h4 className="mb-1 text-[9px] font-[1000] uppercase">Current data readiness</h4>
     <ul className="grid gap-1">
      {dataReadiness.map((item) => <li key={item.label} className="flex items-start gap-2 text-[9px]"><span aria-hidden="true" className={`mt-0.5 size-2 shrink-0 border border-black ${item.ready ? "bg-[#3FEE56]" : "bg-[#FFDA47]"}`} /><span><strong>{item.label}: {item.ready ? "present in snapshot" : "not present"}</strong><span className="block text-black/60">{item.detail}</span></span></li>)}
     </ul>
    </div>
   </div>
  </section>
 )
}

export default BrainPromptPolicyPanel
