import React from "react"
import { Link } from "react-router-dom"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"

type BrainProfileCoverageSource = Pick<AIBrainContextSnapshot, "evidencePack" | "inferredProfile" | "vtSync" | "brain" | "conversations" | "tools">

export type BrainProfileCoverageItem = {
 id: string
 label: string
 complete: boolean
 actionLabel?: string
 actionPrompt?: string
 actionRoute?: string
}

export const buildBrainProfileCoverageItems = (snapshot: BrainProfileCoverageSource): BrainProfileCoverageItem[] => {
 const answers = snapshot.conversations.answeredQuestions.join(" ").toLowerCase()
 const videoCount = snapshot.inferredProfile.videoCount || snapshot.vtSync.videos
 const analyticsCapability = snapshot.tools.find((tool) => /analytics|performance|statistics/.test(`${tool.toolId} ${tool.title}`.toLowerCase()))

 return [
  {
   id: "channel-description",
   label: snapshot.evidencePack.channelDescription ? "Channel description" : "Channel description missing",
   complete: Boolean(snapshot.evidencePack.channelDescription?.trim()),
   actionLabel: "Add description",
   actionPrompt: "Help me confirm or write my channel description using only the channel evidence you can see. Ask me to correct assumptions before treating it as confirmed.",
  },
  {
   id: "video-evidence",
   label: videoCount > 0 ? `${videoCount.toLocaleString()} videos analyzed` : "No videos analyzed",
   complete: videoCount > 0,
   actionLabel: "Sync channel",
   actionRoute: "/vt-sync-local",
  },
  {
   id: "creator-goals",
   label: snapshot.brain.goals > 0 || /\b(goal|goals|priority|priorities|success metric|target|objective)\b/.test(answers)
    ? "Goals confirmed"
    : "Goals unconfirmed",
   complete: snapshot.brain.goals > 0 || /\b(goal|goals|priority|priorities|success metric|target|objective)\b/.test(answers),
   actionLabel: "Confirm goals",
   actionPrompt: "Help me confirm my primary channel goals and success measures. Reuse anything I have already answered and ask only what is still unknown.",
  },
  {
   id: "style-preference",
   label: /\b(style|tone|editing|pacing|visual|aesthetic|format|reference video|examples)\b/.test(answers)
    ? "Style preference confirmed"
    : "Style preference unconfirmed",
   complete: /\b(style|tone|editing|pacing|visual|aesthetic|format|reference video|examples)\b/.test(answers),
   actionLabel: "Add style examples",
   actionPrompt: "Help me confirm my channel's style preferences. Ask for concrete video examples and capture preferences for tone, pacing, editing, and visuals without guessing.",
  },
  ...(analyticsCapability ? [{
   id: "analytics-capability",
   label: analyticsCapability.status === "ready" ? "Analytics capability available" : "Analytics capability unavailable",
   complete: analyticsCapability.status === "ready",
   actionLabel: "Check analytics setup",
   actionPrompt: "Help me check which analytics capabilities and evidence are available for this channel before making performance claims.",
  }] : []),
 ]
}

export const BrainProfileCoverageChecklist: React.FC<{
 snapshot: BrainProfileCoverageSource
 onPrompt: (prompt: string) => void
}> = ({ snapshot, onPrompt }) => {
 const items = buildBrainProfileCoverageItems(snapshot)
 return (
  <section aria-labelledby="brain-profile-coverage-title" className="mt-3 overflow-hidden rounded-[8px] border-[2px] border-black bg-white">
   <h3 id="brain-profile-coverage-title" className="border-b-[2px] border-black bg-[#36E0F6] px-2.5 py-2 text-[9px] font-black uppercase tracking-[0.12em]">
    Profile coverage
   </h3>
   <ul className="grid gap-1.5 p-2">
    {items.map((item) => (
     <li key={item.id} className="flex min-w-0 flex-wrap items-center gap-2">
      <span aria-hidden="true" className={`inline-grid h-4 w-4 shrink-0 place-items-center rounded-full border border-black text-[10px] font-black ${item.complete ? "bg-[#3FEE56]" : "bg-[#FFDA47]"}`}>
       {item.complete ? "✓" : "!"}
      </span>
      <span className="min-w-0 flex-1 text-[10px] font-black uppercase leading-4">{item.label}</span>
      {!item.complete && item.actionLabel ? item.actionRoute ? (
       <Link to={item.actionRoute} className="inline-flex min-h-9 items-center rounded-[5px] border-[2px] border-black bg-white px-2 text-[9px] font-black uppercase hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black">
        {item.actionLabel}
       </Link>
      ) : (
       <button type="button" onClick={() => item.actionPrompt && onPrompt(item.actionPrompt)} className="min-h-9 rounded-[5px] border-[2px] border-black bg-white px-2 text-[9px] font-black uppercase hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black">
        {item.actionLabel}
       </button>
      ) : null}
     </li>
    ))}
   </ul>
  </section>
 )
}

export default BrainProfileCoverageChecklist
