import React from "react"
import { ArrowRight } from "lucide-react"
import type {
 BrainQuickAction,
 CreatorBrainLearningQuestion,
 CreatorGrowthContext,
 CreatorInitialInsight,
} from "../../types"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import { sanitizeCreatorFacingBrainCopy } from "../../services/aiBrainConversationStore"
import { BrainQuestionPrompt } from "./BrainQuestionPrompt"
import { BrainQuickActionCard } from "./BrainAnswerModules"
import { BrainEvaluationInboxPanel } from "./BrainEvaluationInboxPanel"
import { BrainScopeSummary } from "./BrainScopeSummary"
import { BrainPromptPolicyPanel } from "./BrainPromptPolicyPanel"
import { BrainOutcomeLearningCard } from "./BrainOutcomeLearningCard"

const Panel: React.FC<{ title: string; tone: string; children: React.ReactNode }> = ({
 title,
 tone,
 children,
}) => (
 <section className="overflow-hidden rounded-[10px] border-[2px] border-black bg-white">
  <h3
   className="border-b-[2px] border-black px-3 py-1.5 text-[10px] font-[1000] uppercase leading-4 tracking-[0.1em]"
   style={{ backgroundColor: tone }}
  >
   {title}
  </h3>
  <div className="grid gap-2 p-2.5">{children}</div>
 </section>
)

/**
 * The ambient context rail.
 *
 * Never selected and never tabbed: it reflects whatever the Brain currently knows,
 * from the same snapshot the conversation uses. It deliberately holds no narrative
 * prose, because the conversation already owns that; duplicating the channel read in
 * both places is what previously made this surface feel repetitive and endless.
 */
export const BrainContextRail: React.FC<{
 channelId?: string | null
 snapshot: AIBrainContextSnapshot
 growthContext: CreatorGrowthContext
 insights: CreatorInitialInsight[]
 questions: CreatorBrainLearningQuestion[]
 responseQuestions?: CreatorBrainLearningQuestion[]
 quickActions: BrainQuickAction[]
 onAskInsight: (insight: CreatorInitialInsight) => void
 onAcceptQuickAction: (action: BrainQuickAction) => void
 onAnswerQuestion: (question: CreatorBrainLearningQuestion, answer: string) => void
 onEditPrompt?: (prompt: string) => void
 compactGrid?: boolean
}> = ({
 channelId = null,
 snapshot,
 growthContext,
 insights,
 questions,
 responseQuestions = [],
 quickActions,
 onAskInsight,
 onAcceptQuickAction,
 onAnswerQuestion,
 onEditPrompt,
 compactGrid = false,
}) => {
 const goal = sanitizeCreatorFacingBrainCopy(growthContext.currentGoal)
 const clusters = snapshot.inferredProfile.topicClusters.slice(0, 5)
 const availableQuestions = [...responseQuestions, ...questions].filter(
  (question, index, all) => all.findIndex((candidate) => candidate.id === question.id) === index,
 )
 const goalQuestion = availableQuestions.find((question) => question.category === "creator_goal")
 const topQuestion = availableQuestions.find((question) => question.category !== "creator_goal")
 const laneOptions = snapshot.inferredProfile.topicClusters.slice(0, 4)
 const goalIsSaved = Boolean(goal && !/not set|tell me what matters/i.test(goal))
 const channelFocusIsSaved = Boolean(snapshot.brain.coreConcept.trim() || snapshot.brain.targetNiche.trim() || snapshot.inferredProfile.niche)
 const styleNotesAreSaved = Boolean(snapshot.brain.contentDNA.trim())
 const profileChecks = [
  { label: "Channel focus", complete: channelFocusIsSaved, detail: snapshot.inferredProfile.niche || snapshot.brain.targetNiche || snapshot.brain.coreConcept },
  { label: "Videos analyzed", complete: snapshot.inferredProfile.videoCount > 0, detail: snapshot.inferredProfile.videoCount.toLocaleString() + " videos" },
  { label: "Goals", complete: goalIsSaved, detail: goalIsSaved ? goal : "Not confirmed" },
  { label: "Style preferences", complete: styleNotesAreSaved, detail: styleNotesAreSaved ? "Saved style notes available" : "Examples not saved" },
 ]

 return (
  <aside
   className={`grid content-start gap-2 ${compactGrid ? "grid-cols-2" : "grid-cols-1"}`}
   aria-label="What the Brain currently knows"
  >
   <div className="col-span-full"><BrainScopeSummary channelId={channelId} /></div>
   <div className="col-span-full"><BrainPromptPolicyPanel channelId={channelId} snapshot={snapshot} onEditPrompt={onEditPrompt} /></div>
   <Panel title="Profile coverage" tone="#36E0F6">
    <ul className="grid gap-1.5">
     {profileChecks.map((item) => (
      <li key={item.label} className="flex min-w-0 items-start gap-2 text-[10px] leading-4">
       <span aria-label={item.complete ? "Complete" : "Needs attention"} className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border border-black font-black ${item.complete ? "bg-[#3FEE56]" : "bg-[#FFDA47]"}`}>
        {item.complete ? "✓" : "!"}
       </span>
       <span className="min-w-0 flex-1">
        <span className="block font-black uppercase">{item.label}</span>
        <span className="block break-words text-black/60">{item.detail || "Not confirmed yet"}</span>
       </span>
       {!item.complete && onEditPrompt ? (
        <button
         type="button"
         onClick={() => onEditPrompt(item.label === "Goals"
          ? "Help me confirm and save my main YouTube goal. Ask one question at a time."
          : item.label === "Style preferences"
           ? "Help me document my content style preferences. Ask for examples and do not assume preferences I have not confirmed."
           : item.label === "Channel focus"
            ? "Help me confirm my channel focus and niche using my existing evidence, then ask me to confirm or correct it."
            : "Help me review which videos have been analyzed and what evidence is still missing.")
         }
         className="min-h-9 shrink-0 rounded-[5px] border border-black bg-white px-2 text-[9px] font-black uppercase underline underline-offset-2 hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black"
        >
         {item.label === "Goals" ? "Confirm" : item.label === "Style preferences" ? "Add examples" : item.label === "Channel focus" ? "Review" : "Inspect"}
        </button>
       ) : null}
      </li>
     ))}
    </ul>
   </Panel>

   <Panel title="Your channel" tone="#3FEE56">
    {clusters.length ? (
     <ul className="flex flex-wrap gap-1">
      {clusters.map((cluster) => (
       <li
        key={cluster}
        className="rounded-[7px] border-[2px] border-black bg-[#36E0F6] px-1.5 py-0.5 text-[9px] font-black uppercase"
       >
        {cluster}
       </li>
      ))}
     </ul>
    ) : (
     <p className="text-[11px] font-bold leading-4 text-black/60">
      No channel evidence yet. Ask me anything and I'll work from what you tell me.
     </p>
    )}
    <p className="border-t-[2px] border-black/10 pt-2 text-[11px] font-bold leading-4 text-black/70">
     <span className="font-black uppercase tracking-[0.08em] text-black/45">Goal · </span>
     {goal || "Not set. Tell me what matters most this month."}
    </p>
   </Panel>

   <BrainEvaluationInboxPanel
    channelId={channelId}
    maximumItems={compactGrid ? 3 : 5}
    compact={compactGrid}
   />
   <div className="col-span-full"><BrainOutcomeLearningCard channelId={channelId} maximumItems={compactGrid ? 2 : 4} /></div>

   {quickActions.length ? (
    <Panel title="Do this next" tone="#C0F240">
     {quickActions.slice(0, 1).map((action) => (
      <BrainQuickActionCard
       key={action.id}
       action={action}
       onAccept={onAcceptQuickAction}
       compact
      />
     ))}
    </Panel>
   ) : null}

   {!topQuestion && insights.length ? (
    <Panel title="Worth a look" tone="#FF7AC8">
     {insights.slice(0, 1).map((insight) => (
      <button
       key={insight.id}
       type="button"
       onClick={() => onAskInsight(insight)}
       className="group flex items-start justify-between gap-2 rounded-[8px] border-[2px] border-black bg-white px-2.5 py-2 text-left transition hover:bg-[#FFDA47]"
      >
       <span className="min-w-0">
        <span className="block text-[10px] font-[1000] uppercase leading-4">{insight.title}</span>
        <span className="mt-0.5 line-clamp-2 block text-[11px] font-bold leading-4 text-black/60">
         {sanitizeCreatorFacingBrainCopy(insight.modules[0]?.body || insight.reason)}
        </span>
       </span>
       <ArrowRight size={13} className="mt-0.5 shrink-0 transition group-hover:translate-x-0.5" />
      </button>
     ))}
    </Panel>
   ) : null}

   {topQuestion ? (
    <div>
     <BrainQuestionPrompt
      question={topQuestion}
      dynamicOptions={topQuestion.category === "channel_fact" ? laneOptions : []}
      onAnswer={onAnswerQuestion}
      compact
     />
    </div>
   ) : null}

   {goalQuestion ? (
    <div>
     <BrainQuestionPrompt
      question={goalQuestion}
      onAnswer={onAnswerQuestion}
      compact
     />
    </div>
   ) : null}
  </aside>
 )
}

export default BrainContextRail
