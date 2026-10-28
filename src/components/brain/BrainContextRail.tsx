import React from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowRight, Check } from "lucide-react"
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
import { BrainStatusIndicatorShowcase } from "./BrainStatusIndicatorShowcase"
import { StudioSplitLeftBadge, StudioSplitLeftButton, StudioSquareIconButton, StudioTwoLineButton } from "../../studio-ui"
import { CHANNEL_CONTEXT_QUESTIONS } from "../../context/channelContextQuestions"
import { loadAiBrainContext } from "../../services/aiBrainContext"
import { scoreContext } from "../../context/ChannelContextScoring"

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({
 title,
 children,
}) => (
 <section className="overflow-hidden rounded-[10px] border-[2px] border-black bg-white">
  <h3
   className="border-b-[2px] border-black px-3 py-1.5 text-[10px] font-[1000] uppercase leading-4 tracking-[0.1em]"
   style={{ backgroundColor: "var(--pair-a, #36e0f6)" }}
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
 channelHandle?: string | null
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
 channelHandle = null,
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
 const channelContext = loadAiBrainContext(channelId, snapshot.channel.label, [channelHandle]).channelContext
 const contextScore = scoreContext(channelContext)
 const recommendedContextQuestions = CHANNEL_CONTEXT_QUESTIONS
  .filter((question) => question.required && contextScore.missingFields.includes(question.contextField))
  .slice(0, 3)
 const profileChecks = [
  { label: "Channel focus", complete: channelFocusIsSaved, detail: snapshot.inferredProfile.niche || snapshot.brain.targetNiche || snapshot.brain.coreConcept },
  { label: "Videos analyzed", complete: snapshot.inferredProfile.videoCount > 0, detail: snapshot.inferredProfile.videoCount.toLocaleString() + " videos" },
  { label: "Goals", complete: goalIsSaved, detail: goalIsSaved ? goal : "Not confirmed" },
  { label: "Style preferences", complete: styleNotesAreSaved, detail: styleNotesAreSaved ? "Saved style notes available" : "Examples not saved" },
 ]

 return (
  <aside
   data-vt-brain-component="BrainContextRail"
   className={`grid content-start gap-2 ${compactGrid ? "grid-cols-2" : "grid-cols-1"}`}
   aria-label="What the Brain currently knows"
  >
   <div className="col-span-full"><BrainScopeSummary channelId={channelId} /></div>
   <div className="col-span-full"><BrainPromptPolicyPanel channelId={channelId} snapshot={snapshot} onEditPrompt={onEditPrompt} /></div>
   <Panel title="Profile coverage">
    <ul className="grid gap-1.5">
     {profileChecks.map((item) => (
      <li key={item.label} className="flex min-w-0 items-start gap-2 text-[10px] leading-4">
       <StudioSplitLeftBadge sizeVariant="micro" aria-label={item.complete ? "Complete" : "Needs attention"} icon={item.complete ? <Check aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}>
        {item.complete ? "Complete" : "Needs attention"}
       </StudioSplitLeftBadge>
       <span className="min-w-0 flex-1">
        <span className="block font-black uppercase">{item.label}</span>
        <span className="block break-words text-black/60">{item.detail || "Not confirmed yet"}</span>
       </span>
       {!item.complete && onEditPrompt ? (
        <StudioSquareIconButton
         sizeVariant="compact"
         icon={<ArrowRight aria-hidden="true" />}
         label={item.label === "Goals" ? "Confirm goal" : item.label === "Style preferences" ? "Add style examples" : item.label === "Channel focus" ? "Review channel focus" : "Inspect video analysis"}
         title={item.label === "Goals" ? "Confirm goal" : item.label === "Style preferences" ? "Add style examples" : item.label === "Channel focus" ? "Review channel focus" : "Inspect video analysis"}
         onClick={() => onEditPrompt(item.label === "Goals"
          ? "Help me confirm and save my main YouTube goal. Ask one question at a time."
          : item.label === "Style preferences"
           ? "Help me document my content style preferences. Ask for examples and do not assume preferences I have not confirmed."
           : item.label === "Channel focus"
            ? "Help me confirm my channel focus and niche using my existing evidence, then ask me to confirm or correct it."
            : "Help me review which videos have been analyzed and what evidence is still missing.")
         }
         className="shrink-0"
        />
       ) : null}
      </li>
     ))}
    </ul>
   </Panel>

   <Panel title="Teach the Brain your channel">
    <p className="text-[11px] font-bold leading-4 text-black/70">
     Answer a few short questions to make recommendations more specific. Your answers stay creator-provided context, not verified channel evidence.
    </p>
    <div className="flex flex-wrap items-center justify-between gap-2 border-y border-black/15 py-2" aria-live="polite">
     <span className="text-[10px] font-black uppercase">{contextScore.completionScore}% complete · {contextScore.requiredCount - contextScore.missingFields.length}/{contextScore.requiredCount} required</span>
     <Link to="/settings?panel=ai" className="inline-flex min-h-9 items-center gap-1 rounded-[5px] border-2 border-black bg-[#36E0F6] px-2 text-[10px] font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
      {contextScore.missingFields.length ? "Complete profile" : "Edit answers"} <ArrowRight size={12} aria-hidden="true" />
     </Link>
    </div>
    {recommendedContextQuestions.length ? (
     <ul className="grid gap-1.5">
      {recommendedContextQuestions.map((question, index) => (
       <li key={question.id} className="flex min-w-0 items-start gap-2 rounded-[5px] border border-black/20 p-2">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-black bg-[#FFDA47] text-[10px] font-black">{index + 1}</span>
        <span className="min-w-0 flex-1 text-[11px] font-bold leading-4">{question.title}</span>
        <Link to="/settings?panel=ai" aria-label={`Answer: ${question.title}`} className="inline-flex min-h-9 shrink-0 items-center rounded-[4px] border border-black px-2 text-[9px] font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">Answer</Link>
       </li>
      ))}
     </ul>
    ) : (
     <p className="text-[11px] font-bold leading-4">Required answers are complete. Add optional detail whenever you want more tailored help.</p>
    )}
   </Panel>

   <Panel title="Your channel">
    {clusters.length ? (
     <ul className="flex flex-wrap gap-1">
      {clusters.map((cluster) => (
       <li key={cluster}><StudioSplitLeftBadge sizeVariant="micro">{cluster}</StudioSplitLeftBadge></li>
      ))}
     </ul>
    ) : (
     <p className="text-[11px] font-bold leading-4 text-black/60">
      No channel evidence yet. Ask me anything and I'll work from what you tell me.
     </p>
    )}
    <p className="border-t-[2px] border-black/10 pt-2 text-[11px] font-bold leading-4 text-black/70">
     <span data-vt-brain-part="creator-goal-label" className="font-black uppercase tracking-[0.08em] text-black/45">Goal · </span>
     {goal || "Not set. Tell me what matters most this month."}
    </p>
   </Panel>

   <BrainEvaluationInboxPanel
    channelId={channelId}
    maximumItems={compactGrid ? 3 : 5}
    compact={compactGrid}
   />
   <div className="col-span-full"><BrainOutcomeLearningCard channelId={channelId} maximumItems={compactGrid ? 2 : 4} /></div>
   <div className="col-span-full"><Panel title="Status indicator primitives"><BrainStatusIndicatorShowcase /></Panel></div>

   {quickActions.length ? (
    <Panel title="Do this next">
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
    <Panel title="Worth a look">
     {insights.slice(0, 1).map((insight) => (
      <StudioTwoLineButton
       key={insight.id}
       sizeVariant="compact"
       icon={<ArrowRight aria-hidden="true" />}
       firstLine={insight.title}
       secondLine={sanitizeCreatorFacingBrainCopy(insight.modules[0]?.body || insight.reason)}
       onClick={() => onAskInsight(insight)}
       className="w-full min-w-0 text-left"
      />
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
