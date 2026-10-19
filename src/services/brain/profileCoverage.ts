import type { AIBrainContextSnapshot } from "../aiBrainCommandInterface"

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
 const goalsConfirmed = snapshot.brain.goals > 0 || /\b(goal|goals|priority|priorities|success metric|target|objective)\b/.test(answers)
 const styleConfirmed = /\b(style|tone|editing|pacing|visual|aesthetic|format|reference video|examples)\b/.test(answers)

 return [
  {
   id: "channel-description",
   label: snapshot.evidencePack.channelDescription?.trim() ? "Channel description" : "Channel description missing",
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
   label: goalsConfirmed ? "Goals confirmed" : "Goals unconfirmed",
   complete: goalsConfirmed,
   actionLabel: "Confirm goals",
   actionPrompt: "Help me confirm my primary channel goals and success measures. Reuse anything I have already answered and ask only what is still unknown.",
  },
  {
   id: "style-preference",
   label: styleConfirmed ? "Style preference confirmed" : "Style preference unconfirmed",
   complete: styleConfirmed,
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
