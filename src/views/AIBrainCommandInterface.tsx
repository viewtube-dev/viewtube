import React, { useEffect, useMemo, useRef, useState } from "react"
import "./AIBrainStudioWorkspace.css"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { CHANNEL_CONTEXT_QUESTIONS } from "../context/channelContextQuestions"
import type { ChannelContextProfile } from "../context/ChannelContextProfile"
import {
 ArrowRight,
 BookOpen,
 Lock,
 Unlock,
 Trash2,
 XCircle,
 Brain,
 Check,
 ChevronLeft,
 HelpCircle,
 LayoutGrid,
 MessageSquare,
 PanelRight,
 Send,
 ThumbsDown,
 ThumbsUp,
 X,
 Zap,
} from "lucide-react"
import { Toolbox } from "../components/Toolbox"
import { BrainComposerDock } from "../components/brain/BrainComposerDock"
import { BrainHubUtilityRow } from "../components/brain/brain-hub-redesign/BrainHubUtilityRow"
import { BrainPromptLibrary, promptCardSummary } from "../components/brain/BrainPromptLibrary"
import { useVisualViewportHeight } from "../components/brain/useVisualViewportHeight"
import { StudioButton, StudioSplitLeftButton, StudioSplitTwoLineButton, StudioSplitLeftBadge, StudioInterModule, StudioTextArea, StudioTextInput, StudioSquareIconButton, StudioSquareIconButtonGroup } from "../studio-ui"
import "../components/brain/brain-hub-redesign/brain-hub-shell.css"
import { useBrain } from "../context/useBrain"
import { TOOLBOX_PALETTE } from "../styles/toolboxPalette"
import { hasGeminiKey } from "../services/gemini"
import {
 dismissAiBrainIntake,
 loadAiBrainContext,
 saveAiBrainContext,
 saveChannelContextProfile,
 shouldShowAiBrainIntake,
 type AiBrainContext,
} from "../services/aiBrainContext"
import { getLatestBrainOnboardingSnapshot, type BrainOnboardingSnapshot } from "../services/brain"
import {
 buildAIBrainContextSnapshot,
 buildAIBrainSystemPrompt,
 queueAIBrainReviewedAction,
 buildBrainLearningQuestions,
 buildCreatorBrainPromptCards,
 buildCreatorBrainLocalFallback,
 formatCreatorBrainResponse,
 type AIBrainChatHandoff,
 type AIBrainContextSnapshot,
} from "../services/aiBrainCommandInterface"
import {
 answerAIBrainQuestionModule,
 reconcileBrainLearningQuestions,
 buildCreatorGrowthContext,
 formatCreatorGrowthModules,
 listAIBrainConversationTurns,
 resumeAIBrainThread,
 saveAIBrainConversationTurn,
 completeAIBrainTurn,
 sanitizeCreatorFacingBrainCopy,
 aiBrainThreadHasTurnsHint,
 recordAIBrainTurnInteraction,
} from "../services/aiBrainConversationStore"
import {
 buildBrainQuickActions,
 buildInitialCreatorInsights,
 dedupeInsightsAgainstActions,
} from "../services/aiBrainInitialInsights"
import {
 captureAIBrainLearningEvent,
 listAIBrainLearningEntries,
 scoreAIBrainAnswerUsefulness,
 dismissAIBrainLearning,
} from "../services/aiBrainSelfImprovement"
import { runBrainTask } from "../services/brain/runtime/BrainRuntime"
import { recordCreatorCommunicationEvidence } from "../services/brain/BrainCommunicationIngestion"
import { readBrainUserControls } from "../services/brain/BrainUserControls"
import { buildBrainConversationHistory } from "../services/brain/BrainConversationController"
import { BrainAnswerModuleGrid } from "../components/brain/BrainAnswerModules"
import { BrainPageTabs, type BrainPageTabId } from "../components/brain/BrainPageTabs"
import { BrainMyBrainPanel, BrainReviewPanel, BrainControlsPanel } from "../components/brain/BrainHubPanels"
import { BrainAnswerFirst, BrainChatShell, BrainComposerBar, BrainStatusStrip } from "../components/brain/brainChatCompositionsIndex"
import { BrainChatActionButtonGroup, BrainChatMessageShell, BrainResponseSectionHeader, BrainResponseLayout, BrainComposerAccessoryRow, BrainChatStatusBadge, BrainComposerShell, ChatConversationViewport } from "../components/brain/BrainChatPrimitives"
import { BrainCapabilityBrowser } from "../components/brain/BrainCapabilityBrowser"
import { BrainProfileCoverageChecklist } from "../components/brain/BrainProfileCoverageChecklist"
import { BrainContextRail } from "../components/brain/BrainContextRail"
import { BrainClaimEvidence } from "../components/brain/BrainClaimEvidence"
import { confidenceForEvidence } from "../components/brain/BrainConfidenceChip"
import { BrainTurnEvidenceRibbon } from "../components/brain/BrainTurnEvidenceRibbon"
import { BrainWorkspaceNavigation } from "../components/brain/BrainWorkspaceNavigation"
import { BrainQuestionPrompt } from "../components/brain/BrainQuestionPrompt"
import { BrainRuntimePanel } from "../components/brain/BrainRuntimePanel"
import { BrainWorkflowRunPanel } from "../components/brain/BrainWorkflowRunPanel"
import { buildWorkflowRecommendationFromBrainResponse } from "../services/brain/brainWorkflowRecommendations"
import { resolveBrainDataReadinessPresentation } from "./brainDataReadiness"
import { shouldFollowBrainConversation } from "./brainConversationScroll"
import { resolveActiveBrainProject } from "./brainProjectContext"
import { resolveBrainReviewHandoffContext } from "./brainReviewHandoffContext"
export { shouldFollowBrainConversation }
import { selectBrainAnswerModules } from "./brainAnswerModuleSelection"
import { BrainJournalDialog } from "../components/brain/BrainJournalDialog"
import { BrainContextCorrectionDialog, type BrainContextCorrectionItem } from "../components/brain/BrainContextCorrectionDialog"
import { readBrainRuntimeSnapshot } from "../services/brain/BrainRuntimeSnapshot"
import { buildScopedCreatorAnswerEvidenceRecords, mergeCreatorAnswerEvidenceIntoPack } from "../services/brain/CreatorAnswerEvidence"
import { buildBrainContextDisplayItems } from "../services/brain/BrainContextPresentation"
import type { EvidenceRecord } from "../services/brain/EvidenceRecord"
import { getPromptEvidenceIntegrityStatus, readPromptEvidenceRecords, readCreatorAnswerEvidenceRecords, type PromptEvidenceIntegrityStatus } from "../services/brain/PromptEvidenceIntegrity"
import {
 BRAIN_SURFACE_SELECTION_EVENT,
 clearBrainSurfaceSelection,
 readBrainSurfaceSelection,
 setBrainSurfaceSelectionLocked,
 type BrainSurfaceSelection,
} from "../services/brain/BrainSurfaceSelection"
import type {
 AIBrainAnswerModule,
 AIBrainEvidencePack,
 AIBrainConversationTurn,
 AIBrainFeedbackSignal,
 AIBrainLearningEntry,
 AIBrainQuestionAnswer,
 BrainGenerationPath,
 BrainQuickAction,
 CreatorBrainLearningQuestion,
 CreatorBrainPromptCard,
 CreatorBrainResponse,
 CreatorInitialInsight,
} from "../types"

export { filterCreatorBrainPromptCards } from "../components/brain/BrainPromptLibrary"
export { BrainPromptLibrary, promptCardSummary }

const FEEDBACK_OPTIONS = [
 ["helpful", ThumbsUp, "Helpful", "#3FEE56"],
 ["not_useful", ThumbsDown, "Not useful", "#FA618A"],
 ["inaccurate", HelpCircle, "Inaccurate", "#FFDA47"],
 ["save_insight", BookOpen, "Save insight", "#36E0F6"],
 ["ask_follow_up", MessageSquare, "Ask follow-up", "#FF7AC8"],
] as const satisfies ReadonlyArray<readonly [AIBrainFeedbackSignal["rating"], React.ComponentType<{ size?: number }>, string, string]>

export type AIBrainTurnReadiness = {
 dataStatus: AIBrainEvidencePack["dataStatus"]
 capturedAt: string | null
 availableMetrics: string[]
 missingInputs: string[]
 sourceStatuses: AIBrainContextSnapshot["sourceStatuses"]
 diagnostics: Pick<AIBrainContextSnapshot["vtSync"]["diagnostics"], "status" | "coverage" | "warnings">
 warnings: string[]
}

export type ChatMessage = {
 id: string
 role: "user" | "model"
 text: string
 response?: CreatorBrainResponse
 handoff?: AIBrainChatHandoff | null
 originalUserText?: string
 evidencePack?: AIBrainEvidencePack
 evidenceRecords?: EvidenceRecord[]
 evidenceIntegrityStatus?: PromptEvidenceIntegrityStatus
 readiness?: AIBrainTurnReadiness
 contextUsed?: BrainCreatorContextSnapshot
 learningReceipt?: {
  entryId: string
  summary: string
  detail: string
  category: string
  status: string
  scope: string
  createdAt: string
 }
 turnStatus?: AIBrainConversationTurn["status"]
 contextMayBeStale?: boolean
 retryContextContinuity?: "original_input_restored" | "fresh_evidence_retry" | "legacy_context_reconstructed"
}


export type BrainCreatorContextSnapshot = {
 version: string | null
 channelId: string | null
 project: {
  projectId: string
  contentBuildId: string | null
  title: string | null
  topic: string | null
  format: string | null
  evidenceIds: string[]
  source: string | null
 } | null
 selection: {
  route: string
  sourceId: string
  label: string
  projectId: string | null
  videoId: string | null
  commentId: string | null
  dateRange: string | null
  evidenceIds: string[]
  updatedAt: string
  locked: boolean
 } | null
 profileLoadedAt: string | null
 styleProfileAvailable: boolean
 styleProfile: {
  id: string
  scope: string
  assetType: string | null
  source: string
  descriptor: {
   voice: string
   pacing: string
   vocabulary: { prefer: string[]; avoid: string[] }
   structure: string
   openingPattern: string
   closingPattern: string
   productionQuality: string
  }
  exemplars: Array<{ id: string; sourceRef: string | null; text: string }>
 } | null
 knowledgeItems: Array<{
  id: string
  statement: string
  knowledgeClass: string
  lifecycleState: string
  confirmationState: string | null
  source: "brain_memory_claim" | "channel_knowledge_model" | "learning_candidate"
  sourceId: string
  evidenceRefs: string[]
  status: "confirmed" | "inferred"
 }>
 conflictIds: string[]
 evidenceRefs: string[]
 projectSource: string | null
}

const BrainContextUsedDrawer: React.FC<{
 contextUsed?: BrainCreatorContextSnapshot
 turnId?: string
 onCorrectItem?: (item: BrainCreatorContextSnapshot["knowledgeItems"][number]) => void
}> = ({ contextUsed, turnId, onCorrectItem }) => {
 if (!contextUsed) return null
 const items = buildBrainContextDisplayItems({
  channelId: contextUsed.channelId,
  project: contextUsed.project,
  selection: contextUsed.selection,
 })
 return (
  <details data-vt-brain-component="BrainContextUsedDrawer" data-vt-brain-turn-id={turnId} className="w-full rounded-[7px] border-[2px] border-black bg-white">
   <summary data-vt-brain-part="context-used-trigger" className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1 px-2 text-[9px] font-black uppercase hover:bg-[#36E0F6] focus-visible:ring-2 focus-visible:ring-black">
    <PanelRight size={12} aria-hidden="true" /> Context used
    <span className="rounded-[4px] border border-black bg-[#FFDA47] px-1">{items.length + contextUsed.knowledgeItems.length}</span>
   </summary>
   <div className="grid gap-2 border-t-[2px] border-black p-2">
    <ul className="grid gap-1">
     {items.map((item) => (
      <li data-vt-brain-part="context-used-item" key={item.id} className="grid gap-1 rounded-[5px] border border-black/20 bg-[#f8f8f4] px-2 py-1">
       <span className="text-[9px] font-black uppercase">{item.label} · {item.provenance}</span>
       <span className="break-words text-[10px] font-bold">{item.value}</span>
      </li>
     ))}
    </ul>
    {contextUsed.styleProfile ? (
     <section>
      <h4 data-vt-brain-part="context-style-profile-heading" className="text-[9px] font-black uppercase tracking-[0.12em] text-black/55">Style profile used</h4>
      <div className="mt-1 rounded-[5px] border border-black/20 bg-[#f8f8f4] p-2">
       <p className="text-[9px] font-black uppercase">{contextUsed.styleProfile.scope} · {contextUsed.styleProfile.source} · {contextUsed.styleProfile.id}</p>
       {([
        ["Voice", contextUsed.styleProfile.descriptor.voice],
        ["Pacing", contextUsed.styleProfile.descriptor.pacing],
        ["Structure", contextUsed.styleProfile.descriptor.structure],
        ["Opening", contextUsed.styleProfile.descriptor.openingPattern],
        ["Closing", contextUsed.styleProfile.descriptor.closingPattern],
        ["Production bar", contextUsed.styleProfile.descriptor.productionQuality],
       ] as Array<[string, string]>).filter(([, value]) => value).map(([label, value]) => (
        <p key={label} className="mt-1 text-[10px] font-bold leading-4"><span className="font-black uppercase">{label} · </span>{sanitizeCreatorFacingBrainCopy(value)}</p>
       ))}
       {contextUsed.styleProfile.descriptor.vocabulary.prefer.length ? <p className="mt-1 text-[10px] font-bold">Prefer: {contextUsed.styleProfile.descriptor.vocabulary.prefer.join(", ")}</p> : null}
       {contextUsed.styleProfile.descriptor.vocabulary.avoid.length ? <p className="mt-1 text-[10px] font-bold">Avoid: {contextUsed.styleProfile.descriptor.vocabulary.avoid.join(", ")}</p> : null}
       {contextUsed.styleProfile.exemplars.map((exemplar) => (
        <div key={exemplar.id} className="mt-1 border-t border-black/10 pt-1">
         <p className="text-[9px] font-black uppercase">Example · {exemplar.sourceRef || exemplar.id}</p>
         <p className="text-[10px] font-bold leading-4">{sanitizeCreatorFacingBrainCopy(exemplar.text)}</p>
         <code className="break-all text-[8px] text-black/50">{exemplar.id}</code>
        </div>
       ))}
      </div>
     </section>
    ) : null}
    {contextUsed.knowledgeItems.length ? (
     <section>
      <h4 data-vt-brain-part="context-knowledge-heading" className="text-[9px] font-black uppercase tracking-[0.12em] text-black/55">Knowledge items used</h4>
      <ul className="mt-1 grid gap-1">
       {contextUsed.knowledgeItems.map((item) => (
        <li data-vt-brain-part="context-knowledge-item" key={item.id} className="rounded-[5px] border border-black/20 px-2 py-1">
         <div className="text-[9px] font-black uppercase">{item.status} · {item.knowledgeClass.replace(/_/g, " ")}</div>
         <p className="text-[10px] font-bold leading-4">{sanitizeCreatorFacingBrainCopy(item.statement)}</p>
         <code className="block break-all text-[8px] text-black/55">{item.id}</code>
         {item.evidenceRefs.length ? <p className="break-all text-[8px] text-black/55">Evidence: {item.evidenceRefs.join(", ")}</p> : null}
         {onCorrectItem ? <StudioButton sizeVariant="compact" tone="neutral" type="button" onClick={() => onCorrectItem(item)} className="mt-1">Propose correction</StudioButton> : null}
        </li>
       ))}
      </ul>
     </section>
    ) : null}
    {contextUsed.conflictIds.length ? <p className="text-[10px] font-bold">Conflicting context records: {contextUsed.conflictIds.join(", ")}</p> : null}
    {contextUsed.evidenceRefs.length ? <p className="break-words text-[9px] font-bold text-black/60">Context evidence IDs: {contextUsed.evidenceRefs.join(", ")}</p> : null}
    <p data-vt-brain-part="context-provenance-summary" className="text-[9px] font-bold text-black/45">Resolver {contextUsed.version || "unavailable"} · Profile loaded {contextUsed.profileLoadedAt || "time unavailable"} · Style profile {contextUsed.styleProfileAvailable ? "available" : "not included"}</p>
   </div>
  </details>
 )
}

const BrainContextStrip: React.FC<{
 channelLabel: string
 projectLabel: string
 contentBuildId: string | null
 selection: BrainSurfaceSelection | null
 onClearSelection: () => void
 onToggleLock: () => void
 onClearProject: () => void
}> = ({ channelLabel, projectLabel, contentBuildId, selection, onClearSelection, onToggleLock, onClearProject }) => (
 <section data-vt-brain-component="BrainContextStrip" aria-label="Active creator context" className="sticky top-0 z-10 grid gap-1 rounded-[7px] border-[2px] border-black bg-white p-2">
  <div data-vt-brain-part="active-context-badges" className="grid min-w-0 grid-cols-1 gap-1 min-[480px]:grid-cols-3 sm:grid-cols-4">
   <StudioSplitLeftBadge data-vt-brain-context="channel" sizeVariant="micro" icon={<MessageSquare aria-hidden="true" />} title={`Channel · ${channelLabel}`} aria-label={`Channel · ${channelLabel}`} className="min-w-0 max-w-full"><span className="block min-w-0 whitespace-nowrap overflow-hidden text-clip">Channel · {channelLabel}</span></StudioSplitLeftBadge>
   <StudioSplitLeftBadge data-vt-brain-context="project" sizeVariant="micro" icon={<LayoutGrid aria-hidden="true" />} title={`Project · ${projectLabel}`} aria-label={`Project · ${projectLabel}`} className="min-w-0 max-w-full"><span className="block min-w-0 whitespace-nowrap overflow-hidden text-clip">Project · {projectLabel}</span></StudioSplitLeftBadge>
   <StudioSplitLeftBadge data-vt-brain-context="content-build" sizeVariant="micro" icon={<BookOpen aria-hidden="true" />} title={`Build · ${contentBuildId || "none"}`} aria-label={`Build · ${contentBuildId || "none"}`} className="min-w-0 max-w-full"><span className="block min-w-0 whitespace-nowrap overflow-hidden text-clip">Build · {contentBuildId ? contentBuildId.slice(0, 10) : "none"}</span></StudioSplitLeftBadge>
   <StudioSplitLeftBadge data-vt-brain-context="selection" sizeVariant="micro" icon={<Lock aria-hidden="true" />} title={`Selected · ${selection?.label || "none"}`} aria-label={`Selected · ${selection?.label || "none"}`} className="min-w-0 max-w-full"><span className="block min-w-0 whitespace-nowrap overflow-hidden text-clip">Selected · {selection?.label || "None"}</span></StudioSplitLeftBadge>
  </div>
  <div data-vt-brain-part="context-actions" className="grid grid-cols-3 gap-1">
   <StudioSplitLeftButton sizeVariant="compact" icon={selection?.locked ? <Unlock aria-hidden="true" /> : <Lock aria-hidden="true" />} disabled={!selection} aria-pressed={Boolean(selection?.locked)} aria-label={selection?.locked ? "Unlock selection" : "Lock selection"} title={selection?.locked ? "Unlock selection" : "Lock selection"} onClick={onToggleLock} className="w-full min-w-0 whitespace-nowrap overflow-hidden text-clip">{selection?.locked ? "Unlock" : "Lock"}</StudioSplitLeftButton>
   <StudioSplitLeftButton sizeVariant="compact" icon={<XCircle aria-hidden="true" />} aria-label="Clear selection" title="Clear selection" disabled={!selection} onClick={onClearSelection} className="w-full min-w-0 whitespace-nowrap overflow-hidden text-clip">Clear</StudioSplitLeftButton>
   <StudioSplitLeftButton sizeVariant="compact" icon={<Trash2 aria-hidden="true" />} aria-label="Clear project" title="Clear project" disabled={projectLabel === "none"} onClick={onClearProject} className="w-full min-w-0 whitespace-nowrap overflow-hidden text-clip">Project</StudioSplitLeftButton>
  </div>
 </section>
)

const shellCard = "rounded-[16px] border-[4px] border-black bg-white shadow-[6px_6px_0_0_#000]"
const innerCard = "rounded-[10px] border-[2px] border-black bg-white"
const assistantCardFrame = "w-full max-w-none shrink-0 border-y-[2px] border-black bg-white"
const kpiButton =
 "inline-flex items-center gap-2 rounded-[8px] border-[2px] border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition hover:bg-[#3FEE56]"

export const shouldSendBrainComposerKey = ({ key, isComposing, shiftKey = false }: { key: string; isComposing: boolean; shiftKey?: boolean }) =>
 key === "Enter" && !isComposing && !shiftKey

const GENERATION_BADGES: Record<BrainGenerationPath, { label: string; description: string; status: "ready" | "partial" | "warning" }> = {
 model: { label: "Full Brain", description: "This response was prepared with the full Brain.", status: "ready" },
 repaired_model: { label: "Refined Answer", description: "This response was prepared with an additional quality pass.", status: "partial" },
 basic_guidance: { label: "Basic Guidance", description: "Full Brain generation was unavailable, so this is limited guidance based on the evidence available—not a complete analysis.", status: "warning" },
}

export const BrainGenerationBadge: React.FC<{ path: BrainGenerationPath }> = ({ path }) => {
 const badge = GENERATION_BADGES[path]
 return (
  <span
   data-vt-brain-component="BrainGenerationBadge"
   title={badge.description}
   className="max-w-full min-w-0"
   aria-label={`${badge.label} response status`}
  >
   <BrainChatStatusBadge status={badge.status} label={badge.label} />
  </span>
 )
}

const makeMessageId = () =>
 typeof crypto !== "undefined" && "randomUUID" in crypto
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2)}`

/** Opening prompts seeded from `?ask=` when a legacy route redirects into the hub. */
const ASK_SEED_PROMPTS: Record<string, string> = {
 "algorithm-diagnosis":
  "Give me an algorithm diagnosis: walk through why my views are moving the way they are across impressions, click-through, and watch time, and tell me the one thing to test next.",
}

/**
 * The Brain's own opening read. Never an empty box and never a stock greeting: it
 * is composed from whatever real evidence exists, and names what is missing when
 * there is nothing to stand on.
 */
const OpeningBriefing: React.FC<{
 snapshot: AIBrainContextSnapshot
 onPrompt: (prompt: string) => void
}> = ({ snapshot, onPrompt }) => {
 const topVideo = snapshot.inferredProfile.topEvidenceVideos[0]
 const clusters = snapshot.inferredProfile.topicClusters.slice(0, 3).filter(Boolean)
 const hasEvidence = Boolean(topVideo || clusters.length || snapshot.vtSync.videos)

 const read = hasEvidence
  ? [
     clusters.length
      ? `Right now your channel reads strongest around ${clusters.join(", ")}.`
      : `I can see ${snapshot.vtSync.videos.toLocaleString()} of your videos.`,
     topVideo?.title
      ? `"${topVideo.title}" is the clearest performance signal I have to work from.`
      : "I don't have enough per-video performance yet to name a single winner.",
    ].join(" ")
  : "I don't have your channel evidence yet. Connect or sync your channel, or just tell me what you make and who it's for, and I'll start building a real read instead of generic advice."

 return (
  // Top-aligned and scrollable: the briefing is a launchpad, not a block floating in
  // the middle of an empty canvas.
  <div className="brain-chat-scrollbar min-h-0 h-full flex-1 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] p-4" aria-label="Brain conversation" tabIndex={0}>
   <section className="mx-auto grid max-w-[70ch] gap-4">
    <div>
     <div className="flex flex-wrap items-center gap-2">
      <h2 className="text-xl font-[1000] uppercase leading-tight sm:text-2xl">
       {hasEvidence ? "Here's what I'm seeing" : "Let's get me enough to be useful"}
      </h2>
     </div>
     <p className="mt-2 text-sm font-bold leading-6 text-black/75">{sanitizeCreatorFacingBrainCopy(read)}</p>
     <BrainProfileCoverageChecklist snapshot={snapshot} onPrompt={onPrompt} />
     <BrainClaimEvidence evidencePack={snapshot.evidencePack} confidence={confidenceForEvidence({ hasProfile: snapshot.inferredProfile.status !== "missing", videoCount: snapshot.inferredProfile.videoCount, dataStatus: snapshot.evidencePack.dataStatus })} className="mt-3" />
    </div>

   </section>
  </div>
 )
}

export const BrainFeedbackControls: React.FC<{
 message: ChatMessage
 onFeedback: (message: ChatMessage, rating: AIBrainFeedbackSignal["rating"]) => Promise<void>
}> = ({ message, onFeedback }) => {
 const [selected, setSelected] = useState<AIBrainFeedbackSignal["rating"] | null>(null)
 const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
 const feedbackInFlightRef = useRef(false)

 const submitFeedback = async (rating: AIBrainFeedbackSignal["rating"]) => {
  if (feedbackInFlightRef.current) return
  feedbackInFlightRef.current = true
  setSelected(rating)
  setStatus("saving")
  try {
   await onFeedback(message, rating)
   setStatus("saved")
  } catch (error) {
   console.warn("[AIBrain] Feedback was not saved:", error)
   setStatus("error")
  } finally {
   feedbackInFlightRef.current = false
  }
 }

 return (
  <div data-vt-brain-component="BrainAnswerFeedback" className="flex min-w-0 flex-wrap items-center gap-1">
   <StudioSquareIconButtonGroup sizeVariant="compact" aria-label="Rate this response">
    {FEEDBACK_OPTIONS.map(([rating, Icon, label, color]) => {
     const isSelected = selected === rating
     return (
      <StudioSquareIconButton
       key={rating}
       sizeVariant="compact"
       iconSizeVariant="large"
       variant={isSelected ? "v2" : "v1"}
       icon={<Icon aria-hidden="true" />}
       label={label}
       title={label}
       aria-label={label}
       aria-pressed={isSelected}
       disabled={status === "saving"}
       onClick={() => void submitFeedback(rating)}
       style={{ backgroundColor: isSelected ? color : undefined }}
       className="cursor-pointer disabled:cursor-wait"
      />
     )
    })}
   </StudioSquareIconButtonGroup>
   <span className="ml-1 text-[10px] font-black uppercase tracking-[0.06em]" aria-live="polite" role="status">
    {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Try again" : "Rate answer"}
   </span>
  </div>
 )
}

const BrainLearningReceiptCard: React.FC<{
 message: ChatMessage
 onCorrect: (message: ChatMessage) => void
 onReject: (message: ChatMessage) => void
}> = ({ message, onCorrect, onReject }) => {
 const receipt = message.learningReceipt
 if (!receipt) return null
 const dismissed = receipt.status === "dismissed"
 const scopeLabel = receipt.scope === "durable_knowledge"
  ? "Saved as a lasting preference"
  : "Saved temporarily — not a permanent rule yet"
 return (
  <details data-vt-brain-part="learning-receipt-content" aria-label="Learning saved" className="grid gap-0 bg-[#FFF8D6] open:gap-2">
   <summary className="flex min-h-10 cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
    <span data-vt-brain-part="learning-receipt-heading" className="text-[10px] font-black uppercase tracking-[0.12em]">Learning saved</span>
    <StudioSplitLeftBadge sizeVariant="micro" icon={<BookOpen aria-hidden="true" />} role="status">{dismissed ? "Rejected" : "Review"}</StudioSplitLeftBadge>
   </summary>
   <div className="grid gap-2 border-t border-black/15 px-3 pb-3">
    <p data-vt-brain-part="learning-receipt-summary" className="text-sm font-black leading-5">{sanitizeCreatorFacingBrainCopy(receipt.summary)}</p>
    {receipt.detail ? <p className="text-xs font-bold leading-5 text-black/70">{sanitizeCreatorFacingBrainCopy(receipt.detail)}</p> : null}
    <p data-vt-brain-part="learning-receipt-scope" className="text-[11px] font-bold text-black/70">{scopeLabel}</p>
    {!dismissed ? (
     <div className="flex flex-wrap gap-1">
      <StudioButton sizeVariant="compact" tone="neutral" type="button" onClick={() => onCorrect(message)}>Correct</StudioButton>
      <StudioButton sizeVariant="compact" type="button" onClick={() => onReject(message)}>Reject</StudioButton>
     </div>
    ) : <p role="status" className="text-xs font-bold">Rejected — this will not become a permanent preference.</p>}
   </div>
  </details>
 )
}

const CreatorResponseCard: React.FC<{
 message: ChatMessage
 answeredQuestionIds: Set<string>
 onFeedback: (message: ChatMessage, rating: AIBrainFeedbackSignal["rating"]) => Promise<void>
 onAnswerQuestion: (question: CreatorBrainLearningQuestion, answer: string) => void
 onReviewHandoff: (message: ChatMessage, target: "thumbnail" | "metadata" | "projects") => void
 onRetry: (message: ChatMessage, useFreshEvidence: boolean) => void
 onCorrectReceipt: (message: ChatMessage) => void
 onRejectReceipt: (message: ChatMessage) => void
 onCorrectContextItem: (item: BrainCreatorContextSnapshot["knowledgeItems"][number]) => void
}> = ({ message, answeredQuestionIds, onFeedback, onAnswerQuestion, onReviewHandoff, onRetry, onCorrectReceipt, onRejectReceipt, onCorrectContextItem }) => {
 const response = message.response
 const workflowRecommendation = useMemo(
  () => response ? buildWorkflowRecommendationFromBrainResponse(response, message.id) : null,
  [response, message.id],
 )
 const turnEvidencePack = message.evidencePack
 const handoffContext = `${message.originalUserText || ""} ${response?.headline || ""} ${response?.keyInsight || ""}`.toLowerCase()
 const handoffOptions = [
  { key: "thumbnail" as const, label: "Open in Thumbnail Studio", matches: /thumbnail|visual|cover image|thumbnail image|visual hook/ },
  { key: "metadata" as const, label: "Prepare metadata draft", matches: /title|seo|description|tags|keyword|metadata|search opportunity/ },
  { key: "projects" as const, label: "Review in Projects", matches: /project|publish|package|content build|workflow|content plan/ },
 ].filter((option) => option.matches.test(handoffContext))
 if (!response && message.learningReceipt) {
  return (
   <StudioInterModule
    data-vt-brain-component="BrainLearningReceiptEntry"
    title="LEARNING SAVED"
    startIcon={<BookOpen aria-hidden="true" />}
    sizeVariant="compact"
    className="shrink-0"
    style={{ background: TOOLBOX_PALETTE[3], "--vt-studio-control-accent": TOOLBOX_PALETTE[3], "--vt-studio-control-secondary": TOOLBOX_PALETTE[2] } as React.CSSProperties}
   >
    <BrainLearningReceiptCard message={message} onCorrect={onCorrectReceipt} onReject={onRejectReceipt} />
   </StudioInterModule>
  )
 }
 if (!response) {
  const canRetry = message.turnStatus === "interrupted" && Boolean(message.originalUserText)
  return (
   <StudioInterModule
    data-vt-brain-component="BrainInterruptedResponseEntry"
    title="VIEWTUBE COPILOT"
    startIcon={<Brain aria-hidden="true" />}
    sizeVariant="compact"
    defaultOpen
    className="shrink-0"
    style={{ background: TOOLBOX_PALETTE[7], "--vt-studio-control-accent": TOOLBOX_PALETTE[7], "--vt-studio-control-secondary": TOOLBOX_PALETTE[11] } as React.CSSProperties}
   >
    <article data-vt-brain-component="BrainInterruptedResponseCard" className="min-w-0 p-3">
     <p data-vt-brain-part="interrupted-response-copy" className="whitespace-pre-wrap text-sm font-bold leading-6">{message.text ? sanitizeCreatorFacingBrainCopy(message.text) : canRetry ? "This response was interrupted before it finished." : "Preparing response…"}</p>
     {canRetry ? (
      <div className="mt-3 grid gap-2">
       {message.contextMayBeStale ? (
        <p role="status" className="text-xs font-bold leading-5 text-black/70">The channel data has changed since this attempt. Choose whether to keep the original evidence or refresh it for the retry.</p>
       ) : null}
       <div className="flex flex-wrap gap-2">
        <StudioSplitLeftButton data-vt-brain-part="retry-response-action" sizeVariant="compact" icon={<ArrowRight aria-hidden="true" />} onClick={() => onRetry(message, false)}>
         {message.contextMayBeStale ? "Retry with saved evidence" : "Retry this response"}
        </StudioSplitLeftButton>
        {message.contextMayBeStale ? (
         <StudioSplitLeftButton data-vt-brain-part="retry-refresh-evidence-action" sizeVariant="compact" icon={<ArrowRight aria-hidden="true" />} onClick={() => onRetry(message, true)}>Refresh evidence & retry</StudioSplitLeftButton>
        ) : null}
       </div>
      </div>
     ) : null}
    </article>
   </StudioInterModule>
  )
 }
 const rawModules: AIBrainAnswerModule[] = response.modules?.length
  ? response.modules
  : (response.sections || []).map((section) => ({
     id: section.id,
     title: section.title,
     body: section.body,
     tone: section.tone,
     source: "growth" as const,
    }))
 // Remove exact duplicate prose only; prefix similarity can hide useful detail.
 const normalizedModules = rawModules.map((module) => ({
  ...module,
  body: sanitizeCreatorFacingBrainCopy(module.body || ""),
 }))
 const filteredModules = selectBrainAnswerModules(
  normalizedModules,
  sanitizeCreatorFacingBrainCopy(response.keyInsight),
 )
 // Keep the answer compact while retaining every remaining module behind disclosure.
 const modules = filteredModules.slice(0, 3)
 const additionalModules = filteredModules.slice(3)
 const openQuestions = response.questions.filter(
  (question) => question.category !== "creator_goal" && !answeredQuestionIds.has(question.id),
 )

 return (
  <StudioInterModule
   data-vt-brain-component="BrainAssistantChatEntry"
   title="ANSWER"
   startIcon={<Brain aria-hidden="true" />}
   sizeVariant="compact"
   defaultOpen
   className="shrink-0"
   style={{ background: "#ffffff", "--vt-studio-control-accent": "#ffffff", "--vt-studio-control-secondary": TOOLBOX_PALETTE[5] } as React.CSSProperties}
  >
  <BrainResponseLayout
   title={sanitizeCreatorFacingBrainCopy(response.headline)}
   className="w-full max-w-none shrink-0 border-0 bg-white"
   header={
    <div className="shrink-0 border-b-[2px] border-black px-3 py-2" style={{ backgroundColor: TOOLBOX_PALETTE[5] }}>
     <div className="flex flex-wrap items-start justify-between gap-1">
      <div className="min-w-0">
       <div data-vt-brain-part="response-attribution" className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">ViewTube Copilot</div>
       {message.retryContextContinuity ? (
        <div data-vt-brain-part="retry-provenance" role="status" className="mt-1 text-[9px] font-black uppercase tracking-[0.08em]">
         {message.retryContextContinuity === "original_input_restored"
          ? "Retry · original saved input restored"
          : message.retryContextContinuity === "fresh_evidence_retry"
           ? "Retry · fresh evidence snapshot"
           : "Retry · legacy context reconstructed"}
        </div>
       ) : null}
      </div>
      {response.generationPath ? <BrainGenerationBadge path={response.generationPath} /> : null}
     </div>
     <BrainResponseSectionHeader
      title={sanitizeCreatorFacingBrainCopy(response.headline)}
      className="text-lg font-[1000] uppercase leading-none sm:text-xl"
     />
    </div>
   }
   actionsClassName="min-h-9 bg-[#f8f8f4]"
   actions={
    <>
     <BrainFeedbackControls message={message} onFeedback={onFeedback} />
     <BrainChatActionButtonGroup
      label="Review handoff actions"
      className="min-w-0"
      actions={handoffOptions.map((option) => ({
       id: option.key,
       label: option.label,
       title: `Queue a review-only handoff to ${option.label}`,
       onSelect: () => onReviewHandoff(message, option.key),
      }))}
     />
     <BrainContextUsedDrawer contextUsed={message.contextUsed} turnId={message.id} onCorrectItem={onCorrectContextItem} />
     {message.handoff ? (
      <Link
       to={message.handoff.route}
       title={`Open ${message.handoff.targetTitle}`}
       className="ml-auto inline-flex items-center gap-1 rounded-[6px] border-[2px] border-black bg-[#FFDA47] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em]"
      >
       Review only · Open
       <ArrowRight size={13} />
      </Link>
     ) : null}
    </>
   }
   footer={message.learningReceipt ? <BrainLearningReceiptCard message={message} onCorrect={onCorrectReceipt} onReject={onRejectReceipt} /> : null}
  >
   <BrainAnswerFirst
    keyInsight={sanitizeCreatorFacingBrainCopy(response.keyInsight)}
    className="border-0 p-0"
    alerts={message.readiness && message.evidencePack && ["analytics", "revenue", "audience", "strategy"].includes(message.evidencePack.intent) ? <BrainReadinessNotice readiness={message.readiness} /> : null}
    details={(
     <>
      {additionalModules.length ? <div data-vt-brain-part="additional-answer-modules" className="grid min-w-0 gap-2 border-t border-black/20 pt-2">
       <div className="text-[11px] font-black uppercase">More answer details</div>
       <BrainAnswerModuleGrid modules={additionalModules} compact />
      </div> : null}
      {workflowRecommendation ? <div data-vt-brain-part="action-plan-tracker-disclosure" className="border-t border-black/20 pt-2">
       <div className="mb-2 text-[11px] font-black uppercase">Track next actions</div>
       <BrainWorkflowRunPanel recommendation={workflowRecommendation} />
      </div> : null}
      {message.readiness && message.evidencePack && ["analytics", "revenue", "audience", "strategy"].includes(message.evidencePack.intent) ? <BrainDataReadiness readiness={message.readiness} /> : null}
      {turnEvidencePack ? <BrainTurnEvidenceRibbon turnId={message.id} evidencePack={turnEvidencePack} citedEvidenceIds={response.evidenceIds} evidenceRecords={message.evidenceRecords} claimEvidence={response.claimEvidence} evidenceIntegrityStatus={message.evidenceIntegrityStatus || "unavailable"} compact /> : null}
     </>
    )}
    actions={openQuestions[0] ? <BrainQuestionPrompt question={openQuestions[0]} onAnswer={onAnswerQuestion} compact /> : null}
   >
    <BrainAnswerModuleGrid modules={modules} compact />
   </BrainAnswerFirst>
  </BrainResponseLayout>
  </StudioInterModule>
 )
}

const readinessForSnapshot = (snapshot: AIBrainContextSnapshot): AIBrainTurnReadiness => ({
 dataStatus: snapshot.evidencePack.dataStatus,
 capturedAt: snapshot.vtSync.capturedAt || snapshot.evidencePack.capturedAt,
 availableMetrics: snapshot.evidencePack.availableMetrics,
 missingInputs: snapshot.evidencePack.missingInputs,
 sourceStatuses: snapshot.sourceStatuses,
 diagnostics: {
  status: snapshot.vtSync.diagnostics.status,
  coverage: snapshot.vtSync.diagnostics.coverage,
  warnings: snapshot.vtSync.diagnostics.warnings,
 },
 warnings: snapshot.vtSync.warnings,
})

const BrainReadinessNotice: React.FC<{ readiness: AIBrainTurnReadiness }> = ({ readiness }) => {
 const presentation = resolveBrainDataReadinessPresentation({
  dataStatus: readiness.dataStatus,
  staleDatasets: readiness.diagnostics.coverage.staleDatasets,
  missingDatasets: readiness.diagnostics.coverage.missingDatasets,
 })
 if (presentation.tone === "ready") return null
 return (
  <p data-vt-brain-part="readiness-notice" className="flex min-w-0 flex-wrap items-center gap-1 text-xs font-bold leading-4">
   <BrainChatStatusBadge status={presentation.tone === "unavailable" ? "unavailable" : "warning"} label={presentation.label} />
   <span>Some details may be incomplete until channel data is synced.</span>
  </p>
 )
}

const BrainDataReadiness: React.FC<{ readiness: AIBrainTurnReadiness }> = ({ readiness }) => {
 const [expanded, setExpanded] = React.useState(false)
 const staleCount = readiness.diagnostics.coverage.staleDatasets
 const missingCount = readiness.diagnostics.coverage.missingDatasets
 const revenueUnavailable = !readiness.availableMetrics.includes("revenue")
 const presentation = resolveBrainDataReadinessPresentation({
  dataStatus: readiness.dataStatus,
  staleDatasets: staleCount,
  missingDatasets: missingCount,
 })
 const summary = [
  presentation.label,
  revenueUnavailable ? "Revenue unavailable" : "",
  staleCount > 0 ? `${staleCount} stale datasets` : "",
  missingCount > 0 ? `${missingCount} missing datasets` : "",
 ].filter(Boolean).join(" · ")
 const incompleteSources = readiness.sourceStatuses.filter((source) => source.status !== "ready")
 const creatorSummary = readiness.dataStatus === "missing"
  ? "Connect a channel to unlock performance advice"
  : missingCount > 0
   ? `${missingCount} data items unavailable`
   : staleCount > 0
    ? `${staleCount} data items may be out of date`
    : "Channel data is ready"

 return (
  <details data-vt-brain-component="BrainEvidenceReadiness" aria-label="Channel data details" onToggle={(event) => setExpanded(event.currentTarget.open)} className="min-w-0 overflow-hidden border-2 border-black bg-[#f8f8f4]">
   <summary data-vt-brain-part="evidence-readiness-trigger" className="flex min-h-9 min-w-0 cursor-pointer list-none flex-wrap items-center justify-between gap-1 px-2 py-1 text-xs font-black leading-4 hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black">
    <span className="shrink-0 uppercase">Channel data</span>
    <span data-vt-brain-part="readiness-creator-summary" className="min-w-0 flex-1 break-words text-[11px] font-bold normal-case text-black/75">{creatorSummary}</span>
    <span className="shrink-0 text-[10px] font-bold normal-case text-black/65">View details</span>
   </summary>
   {expanded ? (
   <div data-vt-brain-part="evidence-diagnostics" className="grid gap-2 border-t-2 border-black p-2">
    <div className="flex min-w-0 flex-wrap items-center gap-1 text-xs font-bold">
     <BrainChatStatusBadge status={presentation.tone === "ready" ? "ready" : presentation.tone === "unavailable" ? "unavailable" : "warning"} label={presentation.label} />
     <span data-vt-brain-part="evidence-readiness-summary">{summary}</span>
    </div>
    <div data-vt-brain-part="available-metrics">
     <h4 className="text-[9px] font-black uppercase tracking-[0.12em] text-black/55">Metrics available for this answer</h4>
     <p className="mt-1 text-xs font-bold leading-5">{readiness.availableMetrics.length ? readiness.availableMetrics.join(", ") : "No video performance metrics are available for this request."}</p>
    </div>
    {readiness.missingInputs.length ? (
     <div>
      <h4 data-vt-brain-part="missing-inputs-heading" className="text-[9px] font-black uppercase tracking-[0.12em] text-black/55">Missing inputs</h4>
      <ul className="mt-1 grid gap-1">
       {readiness.missingInputs.map((item) => <li data-vt-brain-part="missing-input-item" key={item} className="text-xs font-bold leading-5">{item}</li>)}
      </ul>
     </div>
    ) : null}
    {incompleteSources.length ? (
     <div>
      <h4 data-vt-brain-part="dataset-status-heading" className="text-[9px] font-black uppercase tracking-[0.12em] text-black/55">Dataset status</h4>
      <ul className="mt-1 grid gap-1">
       {incompleteSources.map((source) => (
        <li data-vt-brain-part="dataset-status-item" key={source.id} className="rounded-[5px] border border-black/20 bg-white px-2 py-1">
         <span className="font-black">{source.label}</span>
         <span className="block text-[10px] leading-4 text-black/65">{source.status}: {source.detail}</span>
        </li>
       ))}
      </ul>
     </div>
    ) : null}
    {readiness.diagnostics.warnings.length || readiness.warnings.length ? (
     <div>
      <h4 data-vt-brain-part="sync-notes-heading" className="text-[9px] font-black uppercase tracking-[0.12em] text-black/55">Sync notes</h4>
      <ul className="mt-1 grid gap-1">
       {[...new Set([...readiness.diagnostics.warnings, ...readiness.warnings])].slice(0, 5).map((warning) => (
        <li data-vt-brain-part="sync-note-item" key={warning} className="text-xs font-bold leading-5">{warning}</li>
       ))}
      </ul>
     </div>
    ) : null}
    {readiness.capturedAt ? <p data-vt-brain-part="evidence-snapshot-timestamp" className="text-[9px] font-bold text-black/45">Evidence snapshot: {readiness.capturedAt}</p> : null}
    <p data-vt-brain-part="evidence-provenance-note" className="text-[9px] font-bold leading-4 text-black/55">This status is based on the synced data and diagnostic records attached to this turn. Missing metrics are not estimated.</p>
   </div>
   ) : null}
  </details>
 )
}

export const UserMessage: React.FC<{ text: string }> = ({ text }) => (
 <StudioInterModule
  data-vt-brain-component="BrainUserChatEntry"
  title="YOU"
  startIcon={<MessageSquare aria-hidden="true" />}
  sizeVariant="compact"
  collapsible={false}
  className="shrink-0"
  style={{ background: "#ffffff", "--vt-studio-control-accent": "#ffffff", "--vt-studio-control-secondary": TOOLBOX_PALETTE[7] } as React.CSSProperties}
 >
  <BrainChatMessageShell role="user" label="Your message" className="min-w-0 bg-[#36E0F6]">
   <p className="whitespace-pre-wrap px-3 py-2 text-sm font-bold leading-6 [overflow-wrap:anywhere]">
    {sanitizeCreatorFacingBrainCopy(text)}
   </p>
  </BrainChatMessageShell>
 </StudioInterModule>
)

const CREATOR_PROFILE_ARRAY_FIELDS = new Set([
 "subNiches", "competitors", "priorityRanking", "offers", "segments", "types",
 "bestFormats", "priorityThemes", "blockedThemes", "influences", "sources", "capabilities",
])
const CREATOR_PROFILE_LONG_FIELDS = new Set([
 "identity.description", "goals.successDefinition", "audience.idealViewer", "audience.problem",
 "audience.transformation", "brand.voice", "content.recurringSeriesDescription",
 "content.biggestWeakness", "content.mostSuccessfulVideo", "intelligence.signupReason",
])
const readCreatorProfileField = (profile: ChannelContextProfile, path: string): unknown =>
 path.split(".").reduce<unknown>((current, key) =>
  current && typeof current === "object" ? (current as Record<string, unknown>)[key] : undefined, profile)

const CreatorIntakeWizard: React.FC<{
 context: AiBrainContext
 onChange: (context: AiBrainContext) => void
 saveStatus?: string
 onSave: () => void
 onDefer: () => void
}> = ({ context, onChange, saveStatus, onSave, onDefer }) => {
 const [questionIndex, setQuestionIndex] = useState(() => {
  const firstUnanswered = CHANNEL_CONTEXT_QUESTIONS.findIndex((item) => {
   const answer = readCreatorProfileField(context.channelContext, item.contextField)
   if (Array.isArray(answer)) return answer.length === 0
   if (item.contextField === "brand.creativity") return typeof answer !== "number" || answer < 1 || answer > 10
   return answer === undefined || answer === null || String(answer).trim().length === 0
  })
  return firstUnanswered < 0 ? 0 : firstUnanswered
 })
 const question = CHANNEL_CONTEXT_QUESTIONS[questionIndex]
 const lastQuestion = questionIndex === CHANNEL_CONTEXT_QUESTIONS.length - 1
 const rawValue = readCreatorProfileField(context.channelContext, question.contextField)
 const value = Array.isArray(rawValue) ? rawValue.join(", ") : rawValue === null || rawValue === undefined ? "" : String(rawValue)
 const update = (raw: string) => {
  const [section, field] = question.contextField.split(".")
  let parsed: unknown = raw
  if (CREATOR_PROFILE_ARRAY_FIELDS.has(field)) {
   parsed = raw.split(",").map((item) => item.trim()).filter(Boolean)
  } else if (question.contextField === "brand.creativity") {
   if (!raw.trim()) parsed = undefined
   else {
    const number = Number(raw)
    parsed = Number.isFinite(number) ? Math.max(1, Math.min(10, number)) : undefined
   }
  }
  const currentSection = context.channelContext[section as keyof ChannelContextProfile] as Record<string, unknown>
  const channelContext = {
   ...context.channelContext,
   [section]: { ...currentSection, [field]: parsed },
  } as ChannelContextProfile
  onChange({ ...context, channelContext })
 }
 return (
  <section data-vt-brain-component="BrainProfileSetup" className={`${shellCard} flex h-full min-h-0 flex-col overflow-hidden`}>
   <div data-vt-brain-part="profile-setup-heading" className="border-b-[4px] border-black bg-[#3FEE56] px-5 py-4">
    <div className="flex items-center justify-between gap-3">
     <div>
      <div data-vt-brain-part="profile-setup-eyebrow" className="text-[10px] font-black uppercase tracking-[0.18em] text-black/55">Unified Creator Profile · {question.category.replace(/_/g, " ")}</div>
      <h2 data-vt-brain-part="profile-setup-title" className="mt-1 text-2xl font-[1000] uppercase leading-none sm:text-3xl">Teach the Brain your channel</h2>
     </div>
     <span className="rounded-[8px] border-[2px] border-black bg-white px-3 py-1 text-xs font-black">
      {questionIndex + 1} / {CHANNEL_CONTEXT_QUESTIONS.length}
     </span>
    </div>
    <p className="mt-2 text-xs font-bold leading-4">One shared profile powers Creator Brain context, runtime personalization, and evidence-linked answers.</p>
   </div>
   <div className="grid min-h-0 flex-1 place-items-center overflow-y-auto p-4 sm:p-6">
    <label key={question.id} className={`${innerCard} block w-full max-w-4xl overflow-hidden`}>
     <span className="block border-b-[2px] border-black px-4 py-3" style={{ backgroundColor: TOOLBOX_PALETTE[(questionIndex + 2) % TOOLBOX_PALETTE.length] }}>
      <span data-vt-brain-part="profile-question-label" className="block text-[9px] font-black uppercase tracking-[0.16em] text-black/55">{question.title}</span>
      <span data-vt-brain-part="profile-question-prompt" className="mt-1 block text-lg font-[1000] leading-6">{question.description || question.title}</span>
     </span>
     {question.contextField === "brand.creativity" ? (
      <StudioTextInput
       data-vt-brain-part="profile-question-answer"
       sizeVariant="standard"
       type="number"
       min={1}
       max={10}
       value={value}
       onChange={(event) => update(event.currentTarget.value)}
       placeholder="1–10"
       className="w-full"
      />
     ) : CREATOR_PROFILE_LONG_FIELDS.has(question.contextField) || CREATOR_PROFILE_ARRAY_FIELDS.has(fieldFromContextPath(question.contextField)) ? (
      <StudioTextArea
       data-vt-brain-part="profile-question-answer"
       sizeVariant="standard"
       rows={5}
       value={value}
       onChange={(event) => update(event.currentTarget.value)}
       placeholder="Add your answer. Separate multiple items with commas."
       style={{ height: "clamp(150px, 28vh, 250px)" }}
       className="w-full resize-none"
      />
     ) : (
      <StudioTextInput
       data-vt-brain-part="profile-question-answer"
       sizeVariant="standard"
       value={value}
       onChange={(event) => update(event.currentTarget.value)}
       placeholder="Add your answer"
       className="w-full"
      />
     )}
    </label>
   </div>
   <div className="grid shrink-0 gap-3 border-t-[4px] border-black bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center">
    <p className="text-xs font-bold leading-4 text-black/65" role="status" aria-live="polite">{saveStatus || "Answers save to the shared local Creator Brain profile as you type; they are creator-provided, not independently verified analytics."}</p>
    <div className="grid grid-cols-2 gap-2 sm:flex">
     <StudioButton sizeVariant="compact" tone="neutral" type="button" onClick={onDefer}>SKIP FOR NOW</StudioButton>
     <StudioSplitLeftButton sizeVariant="compact" icon={<ChevronLeft aria-hidden="true" />} type="button" onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))} disabled={questionIndex === 0}>PREVIOUS</StudioSplitLeftButton>
     <StudioSplitLeftButton sizeVariant="standard" icon={<ArrowRight aria-hidden="true" />} type="button" onClick={() => lastQuestion ? onSave() : setQuestionIndex((index) => Math.min(CHANNEL_CONTEXT_QUESTIONS.length - 1, index + 1))}>{lastQuestion ? "SAVE UNIFIED PROFILE" : "NEXT QUESTION"}</StudioSplitLeftButton>
    </div>
   </div>
  </section>
 )
}

const fieldFromContextPath = (path: string): string => path.split(".")[1] || path

const AIBrainCommandInterface: React.FC = () => {
 const location = useLocation()
 const navigate = useNavigate()
 const [searchParams, setSearchParams] = useSearchParams()
 const requestedPageTab = searchParams.get("tab")
 const pageTab: BrainPageTabId = requestedPageTab === "my-brain" || requestedPageTab === "review" || requestedPageTab === "controls" ? requestedPageTab : "chat"
 const setPageTab = (tab: BrainPageTabId) => {
  const next = new URLSearchParams(searchParams)
  if (tab === "chat") next.delete("tab")
  else next.set("tab", tab)
  setSearchParams(next, { replace: true })
 }
 const brainContext = useBrain()
 const {
  brain,
  authState,
  channelConnection,
  updateBrain,
  getBrainMemory,
  addJournalEntry,
  emitSignal,
 } = brainContext
 const [input, setInput] = useState("")
 const [activePromptTitle, setActivePromptTitle] = useState<string | null>(null)
 const [draftPromptOrigin, setDraftPromptOrigin] = useState<{ promptId: string; promptVersion: string; action: "edited" } | null>(null)
 useEffect(() => {
  const requestedDraft = searchParams.get("draft")
  if (!requestedDraft) return
  setInput(requestedDraft)
  const next = new URLSearchParams(searchParams)
  next.delete("draft")
  next.delete("tab")
  setSearchParams(next, { replace: true })
 }, [searchParams, setSearchParams])
 const { height: mobileViewportHeight, keyboardOpen } = useVisualViewportHeight(true)
 const [journalInput, setJournalInput] = useState("")
 const [busy, setBusy] = useState(false)
 const [messages, setMessages] = useState<ChatMessage[]>([])
 // Gate the opening launchpad so it doesn't flash before a restored conversation
 // loads on refresh. When a channel has no saved turns (first-time users, and the
 // static-render tests), start hydrated so the launchpad shows immediately.
 const [hydrated, setHydrated] = useState(
  () => !aiBrainThreadHasTurnsHint(authState.channelId || authState.channelHandle || null),
 )
 const [learningEntries, setLearningEntries] = useState<AIBrainLearningEntry[]>([])
 const [recentTurns, setRecentTurns] = useState<AIBrainConversationTurn[]>([])
 const [questionAnswers, setQuestionAnswers] = useState<AIBrainQuestionAnswer[]>([])
 const [onboardingSnapshot, setOnboardingSnapshot] = useState<BrainOnboardingSnapshot | null>(null)
 const [intakeOpen, setIntakeOpen] = useState(false)
 const [intakeContext, setIntakeContext] = useState<AiBrainContext>(() => loadAiBrainContext(authState.channelId || authState.channelHandle || null, authState.channelName || null, [authState.channelHandle]))
 const [intakeSaveStatus, setIntakeSaveStatus] = useState("Answers save locally as you type.")
 const [promptRailOpen, setPromptRailOpen] = useState(false)
 const [launcherMode, setLauncherMode] = useState<"prompts" | "capabilities">("prompts")

 const [contextRailOpen, setContextRailOpen] = useState(false)
 const [surfaceSelection, setSurfaceSelection] = useState<BrainSurfaceSelection | null>(() => readBrainSurfaceSelection())
 const [projectContextCleared, setProjectContextCleared] = useState(false)
 const [journalOpen, setJournalOpen] = useState(false)
 const [contextCorrectionItem, setContextCorrectionItem] = useState<BrainContextCorrectionItem | null>(null)
 const composerRef = useRef<HTMLTextAreaElement | null>(null)
 const promptLauncherRef = useRef<HTMLButtonElement | null>(null)
 const contextLauncherRef = useRef<HTMLButtonElement | null>(null)
 const promptCloseRef = useRef<HTMLButtonElement | null>(null)
 const contextCloseRef = useRef<HTMLButtonElement | null>(null)
 const conversationViewportRef = useRef<HTMLDivElement | null>(null)
 const requestInFlightRef = useRef(false)

 
 const shouldFollowConversationRef = useRef(true)
 const askSeededRef = useRef(false)
 const canUseGemini = hasGeminiKey()
 const promptCards = useMemo(() => buildCreatorBrainPromptCards(), [])
 const channelId = authState.channelId || authState.channelHandle || null
 const [brainControls, setBrainControls] = useState(() => readBrainUserControls(channelId))
 const runtimeSnapshot = useMemo(
  () => readBrainRuntimeSnapshot({
   channelId,
   activeProjectId: brain.activeProjectId,
   projects: brain.projects,
  }),
  [channelId, brain.activeProjectId, brain.projects, recentTurns, learningEntries],
 )

 const snapshot = useMemo(
  () =>
   buildAIBrainContextSnapshot({
    brain,
    authState,
    channelConnection,
    brainMemory: getBrainMemory(),
    brainOnboardingSnapshot: onboardingSnapshot,
    recentConversationTurns: recentTurns,
   }),
  [brain, authState, channelConnection, onboardingSnapshot, recentTurns],
 )
 useEffect(() => {
  setIntakeContext(loadAiBrainContext(channelId, snapshot.channel.label, [authState.channelHandle]))
  setIntakeSaveStatus("Loaded this channel's locally saved profile.")
 }, [channelId, snapshot.channel.label, authState.channelHandle])

 const creatorGrowthContext = useMemo(
  () => buildCreatorGrowthContext(snapshot, recentTurns, learningEntries),
  [snapshot, recentTurns, learningEntries],
 )
 const initialInsights = useMemo(() => buildInitialCreatorInsights(snapshot, "", 3), [snapshot])
 const answeredQuestionIds = useMemo(
  () => new Set(questionAnswers.map((answer) => answer.questionId)),
  [questionAnswers],
 )
 const learningQuestions = useMemo(
  () => reconcileBrainLearningQuestions(
   buildBrainLearningQuestions(snapshot),
   questionAnswers,
  ).filter((question) => !answeredQuestionIds.has(question.id)),
  [snapshot, answeredQuestionIds, questionAnswers],
 )
 const latestResponseQuestions = useMemo(
  () => [...messages]
   .reverse()
   .find((message) => message.role === "model" && message.response)
   ?.response?.questions.filter(
    (question) => question.category === "creator_goal" && !answeredQuestionIds.has(question.id),
   ) || [],
  [messages, answeredQuestionIds],
 )
 const quickActions = useMemo(
  () => buildBrainQuickActions(snapshot, creatorGrowthContext, 2),
  [snapshot, creatorGrowthContext],
 )
 // An insight and a quick action are often the same advice about the same video.
 // Whichever is more actionable wins, and the other is dropped.
 const railInsights = useMemo(
  () => dedupeInsightsAgainstActions(initialInsights, quickActions),
  [initialInsights, quickActions],
 )

 useEffect(() => {
  if (brain.activeProjectId) setProjectContextCleared(false)
 }, [brain.activeProjectId])

 useEffect(() => {
  const syncSelection = (event?: Event) => {
   const detail = event instanceof CustomEvent ? event.detail as BrainSurfaceSelection | null : null
   setSurfaceSelection(detail || readBrainSurfaceSelection())
  }
  syncSelection()
  window.addEventListener(BRAIN_SURFACE_SELECTION_EVENT, syncSelection as EventListener)
  return () => window.removeEventListener(BRAIN_SURFACE_SELECTION_EVENT, syncSelection as EventListener)
 }, [])

 useEffect(() => {
  setBrainControls(readBrainUserControls(channelId))
  const onControlsChanged = (event: Event) => {
   const detail = (event as CustomEvent<ReturnType<typeof readBrainUserControls>>).detail
   setBrainControls(detail || readBrainUserControls(channelId))
  }
  window.addEventListener("vt_brain_user_controls_changed", onControlsChanged as EventListener)
  return () => window.removeEventListener("vt_brain_user_controls_changed", onControlsChanged as EventListener)
 }, [channelId])

 useEffect(() => {
  const query = new URLSearchParams(location.search)
  if (query.get("intake") === "1") {
   setIntakeContext(loadAiBrainContext(channelId, snapshot.channel.label, [authState.channelHandle]))
   setIntakeOpen(true)
   return
  }
  if (shouldShowAiBrainIntake(authState.isAuthenticated, channelId)) {
   setIntakeContext(loadAiBrainContext(channelId, snapshot.channel.label, [authState.channelHandle]))
   setIntakeOpen(true)
  }
 }, [authState.isAuthenticated, location.search, channelId, snapshot.channel.label])

 const refreshLearning = async () => {
  try {
   const entries = await listAIBrainLearningEntries({ channelId, limit: 12 })
   setLearningEntries(entries)
  } catch (error) {
   console.warn("[AIBrain] Learning ledger unavailable:", error)
  }
 }

 const refreshConversationTurns = async () => {
  try {
   const resumed = await resumeAIBrainThread(channelId)
   const turns = resumed.turns.slice().reverse()
   setRecentTurns(turns)
   setQuestionAnswers(turns.flatMap((turn) => turn.questionAnswers || []))
  } catch (error) {
   console.warn("[AIBrain] Conversation thread unavailable:", error)
  } finally {
   setHydrated(true)
  }
 }

 useEffect(() => {
  void refreshLearning()
  void refreshConversationTurns()
 }, [channelId])

 const visibleTurns = useMemo(
  () => recentTurns.filter((turn) => (turn.response || turn.status === "interrupted" || Boolean(turn.metadata?.learningReceiptSnapshot)) && !["feedback", "journal", "quick_action", "creator_intake"].includes(String(turn.metadata?.source || ""))),
  [recentTurns],
 )

 // The conversation is one continuous, scrollable thread: rebuild every exchange
 // oldest-first so new answers append to the bottom like a normal chat. Skip while a
 // send is in flight so the optimistic user bubble isn't clobbered mid-request.
 useEffect(() => {
  if (busy) return
  const chronological = [...visibleTurns].reverse()
  setMessages(
   chronological.flatMap((turn) => [
    { id: `${turn.id}-user`, role: "user" as const, text: turn.rawUserMessage ?? turn.userText },
    {
     id: turn.id,
     role: "model" as const,
     text: turn.assistantText,
     response: turn.response,
     handoff: null,
     originalUserText: turn.rawUserMessage ?? turn.userText,
     turnStatus: turn.status,
     retryContextContinuity: typeof turn.metadata?.retryContextContinuity === "string" ? turn.metadata.retryContextContinuity as ChatMessage["retryContextContinuity"] : undefined,
     contextMayBeStale: Boolean(
      turn.metadata?.dataReadinessSnapshot &&
      typeof turn.metadata.dataReadinessSnapshot === "object" &&
      (turn.metadata.dataReadinessSnapshot as AIBrainTurnReadiness).capturedAt &&
      snapshot.vtSync.capturedAt &&
      (turn.metadata.dataReadinessSnapshot as AIBrainTurnReadiness).capturedAt !== snapshot.vtSync.capturedAt
     ),
     evidencePack: turn.metadata?.evidencePackSnapshot && typeof turn.metadata.evidencePackSnapshot === "object"
      ? turn.metadata.evidencePackSnapshot as AIBrainEvidencePack
      : undefined,
     evidenceRecords: [...(readPromptEvidenceRecords(turn.metadata) || []), ...(readCreatorAnswerEvidenceRecords(turn.metadata) || [])],
     evidenceIntegrityStatus: getPromptEvidenceIntegrityStatus(turn.metadata),
     readiness: turn.metadata?.dataReadinessSnapshot && typeof turn.metadata.dataReadinessSnapshot === "object"
      ? turn.metadata.dataReadinessSnapshot as AIBrainTurnReadiness
      : undefined,
     learningReceipt: turn.metadata?.learningReceiptSnapshot && typeof turn.metadata.learningReceiptSnapshot === "object"
      ? turn.metadata.learningReceiptSnapshot as NonNullable<ChatMessage["learningReceipt"]>
      : undefined,
     contextUsed: turn.metadata?.creatorContextSnapshot && typeof turn.metadata.creatorContextSnapshot === "object"
      ? turn.metadata.creatorContextSnapshot as BrainCreatorContextSnapshot
      : undefined,
    },
   ]),
  )
 }, [busy, visibleTurns])

 // Keep the newest exchange in view only while the reader is following the conversation.
 // Scroll only the bounded transcript viewport, not page or toolbox ancestors.
 useEffect(() => {
  if (!shouldFollowConversationRef.current) return
  const viewport = conversationViewportRef.current
  if (!viewport) return
  viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" })
 }, [messages.length, busy])

 useEffect(() => {
  if (!promptRailOpen && !contextRailOpen) return
  const closeButton = promptRailOpen ? promptCloseRef.current : contextCloseRef.current
  const launcher = promptRailOpen ? promptLauncherRef.current : contextLauncherRef.current
  closeButton?.focus()
  const handleDrawerKeyboard = (event: KeyboardEvent) => {
   if (event.key === "Escape") {
    event.preventDefault()
    setPromptRailOpen(false)
    setContextRailOpen(false)
    return
   }
   if (event.key !== "Tab") return
   const dialog = closeButton?.closest<HTMLElement>('[role="dialog"]')
   const focusable = Array.from(
    dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') || [],
   )
   if (!focusable.length) return
   const first = focusable[0]
   const last = focusable[focusable.length - 1]
   if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
   } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
   }
  }
  document.addEventListener("keydown", handleDrawerKeyboard)
  return () => {
   document.removeEventListener("keydown", handleDrawerKeyboard)
   launcher?.focus()
  }
 }, [promptRailOpen, contextRailOpen])

 useEffect(() => {
  let active = true
  const loadOnboardingSnapshot = async () => {
   try {
    const id = authState.channelId || authState.channelHandle || null
    const latest = await getLatestBrainOnboardingSnapshot(id)
    if (active) setOnboardingSnapshot(latest)
   } catch (error) {
    console.warn("[AIBrain] Inferred channel profile unavailable:", error)
   }
  }
  void loadOnboardingSnapshot()
  const onCompleted = (event: Event) => {
   const detail = (event as CustomEvent<BrainOnboardingSnapshot>).detail
   if (active && detail) setOnboardingSnapshot(detail)
  }
  window.addEventListener("vt_brain_onboarding_bootstrap_completed", onCompleted as EventListener)
  return () => {
   active = false
   window.removeEventListener("vt_brain_onboarding_bootstrap_completed", onCompleted as EventListener)
  }
 }, [authState.channelId, authState.channelHandle])

 const captureLearning = async (inputData: Parameters<typeof captureAIBrainLearningEvent>[0]) => {
  try {
   const entry = await captureAIBrainLearningEvent(inputData)
   await refreshLearning()
   return entry
  } catch (error) {
   console.warn("[AIBrain] Learning capture skipped:", error)
   return null
  }
 }

 const handleCorrectContextItem = (item: BrainCreatorContextSnapshot["knowledgeItems"][number]) => {
  setContextCorrectionItem({ ...item, source: item.source as BrainContextCorrectionItem["source"] })
 }

 const handleClearSurfaceSelection = () => {
  clearBrainSurfaceSelection()
  setSurfaceSelection(null)
 }

 const handleToggleSurfaceSelectionLock = () => {
  const updated = setBrainSurfaceSelectionLocked(!surfaceSelection?.locked)
  setSurfaceSelection(updated)
 }

 const handleClearActiveProject = () => {
  setProjectContextCleared(true)
  updateBrain({ activeProjectId: null })
 }

 const handleSend = async (
  override?: string,
  selectedPromptOrigin?: { promptId: string; promptVersion: string; action: "sent" | "edited" },
) => {
  const userText = override ?? input
  const promptOrigin = selectedPromptOrigin || (override === undefined ? draftPromptOrigin || undefined : undefined)
  if (!userText.trim() || busy || requestInFlightRef.current) return
  if (shouldShowAiBrainIntake(authState.isAuthenticated, channelId)) {
   setIntakeContext(loadAiBrainContext(channelId, snapshot.channel.label, [authState.channelHandle]))
   setIntakeOpen(true)
   return
  }
  requestInFlightRef.current = true
  shouldFollowConversationRef.current = true
  setInput("")
  setActivePromptTitle(null)
  setDraftPromptOrigin(null)
  if (composerRef.current) composerRef.current.style.height = "52px"
  setBusy(true)
  const userMessage: ChatMessage = { id: makeMessageId(), role: "user", text: userText }
  // Append to the ongoing thread; the post-send refresh rebuilds it authoritatively.
  setMessages((current) => [...current, userMessage])
  let turnSnapshot: AIBrainContextSnapshot = snapshot
  let turnGrowthContext = creatorGrowthContext
  let systemPrompt: string | null = null
  let historyPayload: any[] | null = null
  try {
   turnSnapshot = buildAIBrainContextSnapshot({
    brain,
    authState,
    channelConnection,
    brainMemory: getBrainMemory(),
    brainOnboardingSnapshot: onboardingSnapshot,
    recentConversationTurns: recentTurns,
    requestText: userText,
   })
   turnGrowthContext = buildCreatorGrowthContext(turnSnapshot, recentTurns, learningEntries)
   const creatorContext = loadAiBrainContext(channelId, turnSnapshot.channel.label, [authState.channelHandle])
   const creatorAnswerEvidence = buildScopedCreatorAnswerEvidenceRecords(creatorContext, channelId, turnSnapshot.channel.label)
   turnSnapshot = { ...turnSnapshot, evidencePack: mergeCreatorAnswerEvidenceIntoPack(turnSnapshot.evidencePack, creatorAnswerEvidence) }
   systemPrompt = buildAIBrainSystemPrompt({
    brain,
    authState,
    channelConnection,
    brainMemory: getBrainMemory(),
    brainOnboardingSnapshot: onboardingSnapshot,
    recentConversationTurns: recentTurns,
    requestText: userText,
    creatorGrowthContext: turnGrowthContext,
    channelContext: loadAiBrainContext(channelId, snapshot.channel.label, [authState.channelHandle]).channelContext,
   })
   historyPayload = buildBrainConversationHistory(recentTurns)
   const activeProject = resolveActiveBrainProject(brain.projects, brain.activeProjectId, projectContextCleared)
   if (channelId) {
    const communicationControls = readBrainUserControls(channelId)
    if (communicationControls.enabled && communicationControls.personalization && communicationControls.learnFromInteractions && communicationControls.captureCreatorCommunications) {
     try {
      recordCreatorCommunicationEvidence({
       channelId,
       communicationId: userMessage.id,
       text: userText,
       projectId: activeProject?.id || null,
      })
     } catch (error) {
      if (!(error instanceof Error && error.message.includes("does not match a supported classification"))) {
       console.warn("[AIBrain] Communication evidence capture skipped:", error)
      }
     }
    }
   }
   const result = await runBrainTask({
    surface: "ai-brain",
    channelId,
    projectId: activeProject?.id || null,
    project: activeProject,
    projects: brain.projects,
    visibleContext: activeProject ? {
     contentBuildId: activeProject.contentBuildId || null,
     title: activeProject.videoTitle || activeProject.name || null,
     topic: activeProject.videoTitle || activeProject.name || null,
     format: null,
     plannedPublishAt: activeProject.publishDate || null,
    } : null,
    userText,
    ...(promptOrigin ? { promptOrigin } : {}),
    snapshot: turnSnapshot,
    systemPrompt,
    growthContext: turnGrowthContext,
    recentTurns,
    history: historyPayload,
    allowModel: canUseGemini,
   })
   setMessages((current) => [
    ...current,
    { id: result.turn.id, role: "model", text: result.turn.assistantText, response: result.response, handoff: null, originalUserText: result.turn.rawUserMessage ?? userText, evidencePack: turnSnapshot.evidencePack, evidenceRecords: [...(readPromptEvidenceRecords(result.turn.metadata) || []), ...(readCreatorAnswerEvidenceRecords(result.turn.metadata) || [])], evidenceIntegrityStatus: getPromptEvidenceIntegrityStatus(result.turn.metadata), readiness: readinessForSnapshot(turnSnapshot), contextUsed: result.turn.metadata?.creatorContextSnapshot as BrainCreatorContextSnapshot | undefined },
   ])
   await refreshConversationTurns()
  } catch (error) {
   const message = error instanceof Error ? error.message : String(error)
   console.warn("[AIBrain] Copilot answer failed:", message)
   const fallbackText = buildCreatorBrainLocalFallback(userText, turnSnapshot)
   const fallbackResponse = formatCreatorBrainResponse(fallbackText, turnSnapshot, { requestText: userText })
   const response = {
    ...fallbackResponse,
    modules: formatCreatorGrowthModules(fallbackResponse, turnGrowthContext, userText),
    generationPath: "basic_guidance" as const,
    fallbackReason: "provider_error" as const,
   }
   let fallbackTurn: AIBrainConversationTurn | null = null
   try {
    fallbackTurn = await saveAIBrainConversationTurn({
     channelId,
     userText,
     assistantText: fallbackText,
     response,
     answerModules: response.modules,
     metadata: {
      source: "local_fallback",
      ...(promptOrigin ? { promptOrigin } : {}),
      evidencePackSnapshot: turnSnapshot.evidencePack,
      dataReadinessSnapshot: readinessForSnapshot(turnSnapshot),
      ...(systemPrompt ? { generationInputSnapshot: {
       snapshot: turnSnapshot,
       systemPrompt,
       growthContext: turnGrowthContext,
       recentTurns,
       ...(historyPayload ? { history: historyPayload } : {}),
      } } : {}),
      interactionLog: [{
       id: makeMessageId(),
       type: "creator_input",
       direction: "inbound",
       at: new Date().toISOString(),
       text: userText,
      }],
     },
    })
   } catch (persistenceError) {
    console.warn("[AIBrain] Local fallback could not be persisted:", persistenceError)
   }
   setMessages((current) => [
    ...current,
    {
     id: fallbackTurn?.id || makeMessageId(),
     role: "model",
     text: fallbackText,
     response,
     evidencePack: turnSnapshot.evidencePack,
     readiness: readinessForSnapshot(turnSnapshot),
     turnStatus: fallbackTurn?.status,
    },
   ])
  } finally {
   requestInFlightRef.current = false
   setBusy(false)
  }
 }

 const handleRetryInterruptedTurn = (message: ChatMessage, useFreshEvidence: boolean) => {
  const userText = message.originalUserText || ""
  if (!userText.trim() || busy || requestInFlightRef.current || message.turnStatus !== "interrupted") return

  requestInFlightRef.current = true
  setBusy(true)
  setMessages((current) => current.map((item) => item.id === message.id
   ? { ...item, text: "Retrying the original request…", turnStatus: "pending", response: undefined }
   : item,
  ))

  void (async () => {
   try {
    const freshSnapshot = buildAIBrainContextSnapshot({
     brain,
     authState,
     channelConnection,
     brainMemory: getBrainMemory(),
     brainOnboardingSnapshot: onboardingSnapshot,
     recentConversationTurns: recentTurns.filter((turn) => turn.id !== message.id),
     requestText: userText,
    })
    const baseTurnSnapshot = !useFreshEvidence && message.evidencePack
     ? { ...freshSnapshot, evidencePack: message.evidencePack }
     : freshSnapshot
    const creatorContext = loadAiBrainContext(channelId, snapshot.channel.label, [authState.channelHandle])
    const creatorAnswerEvidence = buildScopedCreatorAnswerEvidenceRecords(creatorContext, channelId, snapshot.channel.label)
    const turnSnapshot = { ...baseTurnSnapshot, evidencePack: mergeCreatorAnswerEvidenceIntoPack(baseTurnSnapshot.evidencePack, creatorAnswerEvidence) }
    const turnGrowthContext = buildCreatorGrowthContext(
     turnSnapshot,
     recentTurns.filter((turn) => turn.id !== message.id),
     learningEntries,
    )
    const systemPrompt = buildAIBrainSystemPrompt({
     brain,
     authState,
     channelConnection,
     brainMemory: getBrainMemory(),
     brainOnboardingSnapshot: onboardingSnapshot,
     recentConversationTurns: recentTurns.filter((turn) => turn.id !== message.id),
     requestText: userText,
     evidencePackOverride: !useFreshEvidence ? turnSnapshot.evidencePack : undefined,
     creatorGrowthContext: turnGrowthContext,
     channelContext: loadAiBrainContext(channelId, snapshot.channel.label, [authState.channelHandle]).channelContext,
    })
    const historyPayload = buildBrainConversationHistory(recentTurns.filter((turn) => turn.id !== message.id))
    const activeProject = resolveActiveBrainProject(brain.projects, brain.activeProjectId, projectContextCleared)

    const result = await runBrainTask({
     surface: "ai-brain",
     channelId,
     retryTurnId: message.id,
     projectId: activeProject?.id || null,
     project: activeProject,
     projects: brain.projects,
     visibleContext: activeProject ? {
      contentBuildId: activeProject.contentBuildId || null,
      title: activeProject.videoTitle || activeProject.name || null,
      topic: activeProject.videoTitle || activeProject.name || null,
      format: null,
      plannedPublishAt: activeProject.publishDate || null,
     } : null,
     userText,
     snapshot: turnSnapshot,
     systemPrompt,
     growthContext: turnGrowthContext,
     recentTurns: recentTurns.filter((turn) => turn.id !== message.id),
     history: historyPayload,
     allowModel: canUseGemini,
     retryGenerationOnly: true,
     retryEvidenceMode: useFreshEvidence ? "fresh" : "saved",
    })
    setMessages((current) => current.map((item) => item.id === result.turn.id
     ? {
       ...item,
       text: result.turn.assistantText,
       response: result.response,
       turnStatus: result.turn.status,
       originalUserText: result.turn.rawUserMessage ?? userText,
       evidencePack: turnSnapshot.evidencePack,
       evidenceRecords: [...(readPromptEvidenceRecords(result.turn.metadata) || []), ...(readCreatorAnswerEvidenceRecords(result.turn.metadata) || [])],
       evidenceIntegrityStatus: getPromptEvidenceIntegrityStatus(result.turn.metadata),
       readiness: readinessForSnapshot(turnSnapshot),
       contextUsed: result.turn.metadata?.creatorContextSnapshot as BrainCreatorContextSnapshot | undefined,
       contextMayBeStale: result.turn.metadata?.retryContextContinuity === "legacy_context_reconstructed",
       retryContextContinuity: typeof result.turn.metadata?.retryContextContinuity === "string" ? result.turn.metadata.retryContextContinuity as ChatMessage["retryContextContinuity"] : undefined,
      }
     : item,
    ))
    await refreshConversationTurns()
   } catch (error) {
    console.warn("[AIBrain] Interrupted response retry failed:", error)
    await refreshConversationTurns()
   } finally {
    requestInFlightRef.current = false
    setBusy(false)
   }
  })()
 }


 // Legacy routes fold into the one conversation by seeding an opening question the
 // Brain then routes internally, rather than selecting a mode. `/algorithm-architect`
 // redirects here with `?ask=algorithm-diagnosis`.
 useEffect(() => {
  if (askSeededRef.current) return
  const ask = new URLSearchParams(location.search).get("ask")
  if (!ask) return
  askSeededRef.current = true
  const seed = ASK_SEED_PROMPTS[ask]
  if (seed && messages.length === 0) void handleSend(seed)
  navigate("/ai-brain", { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [location.search])

 const handleReviewHandoff = async (message: ChatMessage, target: "thumbnail" | "metadata" | "projects") => {
  const targetRequests = {
   thumbnail: "Open in Thumbnail Studio for review",
   metadata: "Prepare a metadata draft for review",
   projects: "Review this content in Projects",
  }
  const { project: activeProject, selectedContentId } = resolveBrainReviewHandoffContext(
   brain.projects,
   brain.activeProjectId,
   projectContextCleared,
   message.evidencePack?.evidenceIds || [],
  )
  try {
   const handoff = await queueAIBrainReviewedAction({
    request: `${targetRequests[target]}: ${message.originalUserText || message.response?.headline || "the current answer"}. Carry the selected content and evidence references forward. Review only; do not publish or perform external mutations.`,
    response: message.response?.keyInsight || message.text,
    channelId,
    originatingTurnId: message.id,
    evidenceIds: message.evidencePack?.evidenceIds || [],
    contentBuildId: activeProject?.contentBuildId || null,
    selectedContentId,
   })
   try {
    await recordAIBrainTurnInteraction(message.id, {
     type: "review_handoff_queued",
     direction: "outbound",
     detail: {
      target,
      handoffId: handoff.recordId,
      evidenceIds: message.response?.evidenceIds || message.evidencePack?.evidenceIds || [],
      reviewOnly: true,
     },
    })
   } catch (persistenceError) {
    console.warn("[AIBrain] Review handoff was queued but its local interaction receipt could not be saved:", persistenceError)
   }
   setMessages((current) => current.map((item) => item.id === message.id ? { ...item, handoff } : item))
  } catch (error) {
   console.warn("[AIBrain] Review-only handoff could not be queued:", error)
  }
 }

 const handleFeedback = async (message: ChatMessage, rating: AIBrainFeedbackSignal["rating"]) => {
  const learningEntry = await captureLearning({
   channelId,
   source: "feedback",
   summary: `Creator marked Copilot answer as ${rating.replace(/_/g, " ")}`,
   detail: message.response?.keyInsight || message.text,
   confidence: rating === "helpful" || rating === "save_insight" ? "high" : "medium",
   evidence: [message.response?.headline || "Copilot response"].filter(Boolean),
   metadata: {
    messageId: message.id,
    rating,
    usefulnessScore: scoreAIBrainAnswerUsefulness({ response: message.response || message.text, feedback: rating }),
   },
  })
  const feedbackAt = new Date().toISOString()
  const receipt = learningEntry ? {
   entryId: learningEntry.id,
   summary: learningEntry.summary,
   detail: learningEntry.detail,
   category: learningEntry.category,
   status: learningEntry.status,
   scope: learningEntry.status === "promoted" ? "durable_knowledge" : "learning_ledger_not_durable",
   createdAt: learningEntry.createdAt,
  } : undefined
  await saveAIBrainConversationTurn({
   channelId,
   userText: `Feedback: ${rating.replace(/_/g, " ")}`,
   assistantText: message.response?.keyInsight || message.text,
   response: message.response,
   answerModules: message.response?.modules || [],
   feedback: { messageId: message.id, rating, createdAt: feedbackAt },
   learningEntryIds: learningEntry ? [learningEntry.id] : [],
   metadata: { source: "feedback" },
  })
  if (receipt) {
   setMessages((current) => current.map((item) => item.id === message.id ? { ...item, learningReceipt: receipt } : item))
   try {
    await completeAIBrainTurn({
     turnId: message.id,
     status: "complete",
     assistantText: message.text,
     response: message.response,
     answerModules: message.response?.modules || [],
     feedback: { messageId: message.id, rating, createdAt: feedbackAt },
     learningEntryIds: learningEntry ? [learningEntry.id] : [],
     metadata: { learningReceiptSnapshot: receipt },
    })
   } catch {
    // Local fallback responses may not have a persisted canonical turn ID.
   }
  }
  try {
   await recordAIBrainTurnInteraction(message.id, {
    type: "creator_feedback",
    direction: "inbound",
    detail: {
     rating,
     feedbackAt,
     responseId: message.response?.id || null,
     evidenceIds: message.response?.evidenceIds || [],
    },
   })
  } catch (persistenceError) {
   console.warn("[AIBrain] Feedback was saved but its local interaction receipt could not be appended:", persistenceError)
  }
  await refreshConversationTurns()
  if (rating === "ask_follow_up") {
   setInput(`Follow up on ${message.response?.headline || "this answer"}: `)
   composerRef.current?.focus()
  }
 }

 const handleCorrectReceipt = (message: ChatMessage) => {
  const receipt = message.learningReceipt
  if (!receipt) return
  setInput(`Correct the saved Brain learning item ${receipt.entryId}. Current record: "${receipt.summary}" — "${receipt.detail}". Ask me what needs correcting; do not change the record until I provide the correction.`)
  composerRef.current?.focus()
 }

 const handleRejectReceipt = (message: ChatMessage) => {
  const receipt = message.learningReceipt
  if (!receipt || receipt.status === "dismissed") return
  void (async () => {
   try {
    const dismissed = await dismissAIBrainLearning(receipt.entryId)
    if (!dismissed) return
    const updatedReceipt = { ...receipt, status: dismissed.status, scope: "learning_ledger_not_durable" }
    setLearningEntries((current) => current.map((entry) => entry.id === dismissed.id ? dismissed : entry))
    setMessages((current) => current.map((item) => item.id === message.id ? { ...item, learningReceipt: updatedReceipt } : item))
    await completeAIBrainTurn({
     turnId: message.id,
     status: "complete",
     assistantText: message.text,
     response: message.response,
     answerModules: message.response?.modules || [],
     metadata: { learningReceiptSnapshot: updatedReceipt },
    })
    await refreshConversationTurns()
   } catch (error) {
    console.warn("[AIBrain] Learning receipt rejection was not saved:", error)
   }
  })()
 }

 const handleAnswerQuestion = (question: CreatorBrainLearningQuestion, answer: string) => {
  const trimmed = answer.trim()
  if (!trimmed) return
  void (async () => {
   try {
    const saved = await answerAIBrainQuestionModule({ channelId, question, answer: trimmed })
    setQuestionAnswers((current) => [saved, ...current.filter((item) => item.id !== saved.id)])
    await refreshLearning()
    await refreshConversationTurns()
   } catch (error) {
    console.warn("[AIBrain] Question answer was not saved:", error)
   }
  })()
 }

 const handleAskInsight = (insight: CreatorInitialInsight) => {
  void handleSend(`Use the ${insight.title} read and give me a specific plan for my channel.`)
 }

 const handleAcceptQuickAction = (action: BrainQuickAction) => {
  void (async () => {
   const learningEntry = await captureLearning({
    channelId,
    source: "daily_oracle",
    summary: `Creator accepted a Brain quick action: ${action.title}`,
    detail: action.body,
    category: "tool_workflow",
    confidence: "medium",
    evidence: ["Brain quick action"],
   })
   await saveAIBrainConversationTurn({
    channelId,
    userText: "Accepted a suggested next move",
    assistantText: `${action.title} — ${action.body}`,
    learningEntryIds: learningEntry ? [learningEntry.id] : [],
    metadata: { source: "quick_action", quickActionId: action.id },
   })
   await refreshConversationTurns()
   void handleSend(`Walk me through this step by step: ${action.title}. ${action.body}`)
  })()
 }

 const handleJournalSave = () => {
  const content = journalInput.trim()
  if (!content) return
  addJournalEntry(content, "content")
  setJournalInput("")
  void emitSignal("AI_BRAIN_HUB", "JOURNAL_ENTRY_CAPTURED", { content })
  void (async () => {
   const learningEntry = await captureLearning({
    channelId,
    source: "journal",
    summary: "Creator saved a note to Brain memory",
    detail: content,
    category: "channel_fact",
    confidence: "medium",
    evidence: ["Creator note"],
   })
   await saveAIBrainConversationTurn({
    channelId,
    userText: "Saved a note to memory",
    assistantText: content,
    learningEntryIds: learningEntry ? [learningEntry.id] : [],
    metadata: { source: "journal" },
   })
   await refreshConversationTurns()
  })()
 }

 const handleIntakeContextChange = (next: AiBrainContext) => {
  setIntakeContext(next)
  try {
   const saved = saveChannelContextProfile(next.channelContext, channelId)
   setIntakeContext(saved)
   setIntakeSaveStatus("Saved locally in this browser.")
  } catch {
   setIntakeSaveStatus("Local save failed. Check browser storage availability.")
  }
 }

 const handleSaveIntake = () => {
  const saved = saveAiBrainContext({ ...intakeContext, source: "wizard" }, channelId)
  setIntakeContext(saved)
  setIntakeSaveStatus("Unified creator profile saved locally.")
  const intakeEvidenceRecords = buildScopedCreatorAnswerEvidenceRecords(saved, channelId, snapshot.channel.label)
  updateBrain({
   creatorPreferences: {
    what_next_goal: saved.mainYoutubeGoal || saved.successDefinition || saved.whatNext,
    primary_channel_goal: saved.primaryGoal,
    audience_niche: saved.mainTopicFocus || saved.audienceNiche,
    channel_description: saved.channelDescription,
    audience_description: saved.audienceDescription,
    success_definition: saved.successDefinition,
    recurring_series: [saved.recurringSeriesName, saved.recurringSeriesDescription].filter(Boolean).join(": "),
    biggest_youtube_weakness: saved.biggestWeakness,
    most_successful_video: saved.mostSuccessfulVideo,
    viewtube_signup_reason: saved.signupReason,
   },
  })
  void captureLearning({
   channelId,
   source: "journal",
   summary: "Creator completed the ViewTube Brain profile intake",
   detail: [
    saved.channelDescription,
    saved.mainTopicFocus,
    saved.audienceDescription,
    saved.successDefinition,
    saved.mainYoutubeGoal,
   ]
    .filter(Boolean)
    .join(" "),
   category: "channel_fact",
   confidence: "high",
   evidence: ["Creator profile intake", ...intakeEvidenceRecords.map((record) => record.id)],
  })
   .then((entry) =>
    entry
     ? saveAIBrainConversationTurn({
        channelId,
        userText: "Creator profile intake completed",
        assistantText: "Creator profile saved for future ViewTube Copilot coaching.",
        learningEntryIds: [entry.id],
        metadata: { source: "creator_intake", creatorAnswerEvidenceRecordIds: intakeEvidenceRecords.map((record) => record.id) },
       })
     : null,
   )
   .then(() => {
    void refreshLearning()
    void refreshConversationTurns()
   })
  setIntakeOpen(false)
  navigate("/ai-brain", { replace: true })
 }

 const handleDeferIntake = () => {
  dismissAiBrainIntake(channelId)
  setIntakeOpen(false)
  navigate("/ai-brain", { replace: true })
 }

 return (
  <main data-vt-brain-workspace="studio" data-vt-brain-visual-viewport-height={mobileViewportHeight ?? undefined} data-keyboard-open={keyboardOpen ? "true" : "false"} style={mobileViewportHeight ? { height: `${mobileViewportHeight}px`, maxHeight: `${mobileViewportHeight}px` } : undefined} className="vt-brain-module-shell vt-brain-studio-workspace h-full min-h-0 overflow-hidden overscroll-none bg-[#f3f4f6] text-black max-xl:h-[100dvh] xl:overflow-hidden">
   <Toolbox
    title="AI Brain"
    subtitle="Your creator workspace for strategy, evidence, and the next best action."
    icon={<Brain />}
    paletteIndex={5}
    collapsible={false}
    indicator="none"
    embedded
    fillAvailable
    outerClassName="h-full min-h-0 max-xl:!h-full xl:h-full"
    contentClassName="vt-brain-studio-workspace__toolbox-content flex min-h-0 flex-col overflow-hidden bg-[#f3f4f6] max-xl:overflow-hidden xl:overflow-hidden"
   >
    {intakeOpen ? (
     <CreatorIntakeWizard
      context={intakeContext}
      onChange={handleIntakeContextChange}
      saveStatus={intakeSaveStatus}
      onSave={handleSaveIntake}
      onDefer={handleDeferIntake}
     />
    ) : (
     <>
     <section data-vt-brain-workspace-part="surface" className="vt-brain-studio-workspace__surface relative flex h-full min-h-0 flex-col overflow-hidden max-xl:h-full xl:h-full xl:overflow-hidden">
       <BrainPageTabs activeTab={pageTab} onChange={setPageTab} />
       <BrainHubUtilityRow
        size="compact"
        showPrompts={false}
        contextLauncherRef={contextLauncherRef}
        onOpenPrompts={() => { setContextRailOpen(false); setLauncherMode("prompts"); setPromptRailOpen(true) }}
        onOpenContext={() => { setPromptRailOpen(false); setContextRailOpen(true) }}
        onOpenTools={() => { setContextRailOpen(false); setLauncherMode("capabilities"); setPromptRailOpen(true) }}
       />
      <div data-vt-brain-workspace-part="runtime-context" className="vt-brain-studio-workspace__runtime shrink-0 bg-[#f3f4f6]">
       <BrainRuntimePanel snapshot={runtimeSnapshot} embedded />
      </div>
      <div data-vt-brain-workspace-part="grid" className="vt-brain-studio-workspace__grid grid min-h-0 flex-1 gap-3 overflow-hidden bg-[#f3f4f6] max-xl:grid-rows-[minmax(0,1fr)] max-xl:px-0 max-xl:pb-0 max-xl:pt-1 xl:px-3 xl:pb-3 xl:pt-3 xl:grid-cols-[64px_minmax(0,1.45fr)_minmax(320px,1fr)] 2xl:grid-cols-[180px_minmax(0,1.45fr)_minmax(320px,1fr)]">
       <div data-vt-brain-workspace-part="navigation" className="vt-brain-studio-workspace__navigation hidden min-h-0 overflow-y-auto xl:block"><BrainWorkspaceNavigation /></div>
      <div data-vt-brain-workspace-part="conversation" className={`vt-brain-studio-workspace__conversation ${innerCard} flex h-full min-h-0 min-w-0 flex-col overflow-hidden max-xl:rounded-none max-xl:border-x-0 max-xl:border-b-0`}>
        {pageTab === "chat" ? (
         <div id="brain-page-panel-chat" role="tabpanel" aria-labelledby="brain-page-tab-chat" className="flex min-h-0 flex-1 flex-col">
 <BrainChatShell
         className="flex-1 vt-brain-chat-column"
         header={<BrainStatusStrip items={[
           { id: "channel", label: "Channel", value: authState.channelName || authState.channelHandle || channelId || "Not connected", tone: channelId ? "ok" : "warn" },
           { id: "project", label: "Project", value: projectContextCleared ? "None" : brain.projects.find((project) => project.id === brain.activeProjectId)?.name || brain.projects.find((project) => project.status === "active")?.name || "None" },
           { id: "mode", label: "Mode", value: busy ? "Working" : "Ready", tone: busy ? "ok" : "neutral" },
          ]} details={<BrainContextStrip
           channelLabel={authState.channelName || authState.channelHandle || channelId || "not connected"}
           projectLabel={projectContextCleared ? "none" : brain.projects.find((project) => project.id === brain.activeProjectId)?.name || brain.projects.find((project) => project.status === "active")?.name || "none"}
           contentBuildId={projectContextCleared ? null : brain.projects.find((project) => project.id === brain.activeProjectId)?.contentBuildId || brain.projects.find((project) => project.status === "active")?.contentBuildId || (typeof surfaceSelection?.context?.contentBuildId === "string" ? surfaceSelection.context.contentBuildId : null)}
           selection={surfaceSelection}
           onClearSelection={handleClearSurfaceSelection}
           onToggleLock={handleToggleSurfaceSelectionLock}
           onClearProject={handleClearActiveProject}
          />} />}
         composer={<div className="vt-brain-studio-workspace__composer vt-brain-chat-column__dock"><BrainComposerDock
           value={input}
           onChange={setInput}
           onSend={() => { void handleSend() }}
           busy={busy}
           status={busy ? "loading" : undefined}
           activePromptTitle={activePromptTitle}
           onClearActivePrompt={() => { setActivePromptTitle(null); setDraftPromptOrigin(null) }}
           onOpenPrompts={() => { setContextRailOpen(false); setLauncherMode("prompts"); setPromptRailOpen(true) }}
           onOpenCapabilities={() => { setContextRailOpen(false); setLauncherMode("capabilities"); setPromptRailOpen(true) }}
           onOpenContext={() => { setPromptRailOpen(false); setContextRailOpen(true) }}
           onOpenJournal={() => setJournalOpen(true)}
           promptLauncherRef={promptLauncherRef}
           contextLauncherRef={contextLauncherRef}
           composerRef={composerRef}
          /></div>}
        >
          {!hydrated && messages.length === 0 ? (
           <div className="min-h-0 flex-1" aria-hidden="true" />
          ) : messages.length === 0 ? (
           <OpeningBriefing snapshot={snapshot} onPrompt={(prompt) => { void handleSend(prompt) }} />
          ) : (
           <ChatConversationViewport viewportRef={conversationViewportRef} onScroll={(event) => { const viewport = event.currentTarget; shouldFollowConversationRef.current = shouldFollowBrainConversation(viewport.scrollHeight, viewport.scrollTop, viewport.clientHeight) }}>
            {messages.map((message) => message.role === "user" ? (
             <UserMessage key={message.id} text={message.text} />
            ) : (
             <CreatorResponseCard
              key={message.id}
              message={message}
              answeredQuestionIds={answeredQuestionIds}
              onFeedback={handleFeedback}
              onAnswerQuestion={handleAnswerQuestion}
              onReviewHandoff={handleReviewHandoff}
              onRetry={handleRetryInterruptedTurn}
              onCorrectReceipt={handleCorrectReceipt}
              onRejectReceipt={handleRejectReceipt}
              onCorrectContextItem={handleCorrectContextItem}
             />
            ))}
           </ChatConversationViewport>
          )}
         </BrainChatShell>
         </div>
        ) : pageTab === "my-brain" ? (
         <BrainMyBrainPanel items={[]} profileIncomplete />
        ) : pageTab === "review" ? (
         <BrainReviewPanel channelId={channelId} />
        ) : (
         <BrainControlsPanel />
        )}
       </div>
       <aside data-vt-brain-workspace-part="right-context" aria-label="Creator context and recommended actions" className="vt-brain-studio-workspace__context-rail hidden min-h-0 overflow-y-auto xl:block">
        <BrainContextRail channelId={channelId} channelHandle={authState.channelHandle} snapshot={snapshot} growthContext={creatorGrowthContext} insights={railInsights} questions={learningQuestions} responseQuestions={latestResponseQuestions} quickActions={quickActions} onAskInsight={handleAskInsight} onAcceptQuickAction={handleAcceptQuickAction} onAnswerQuestion={handleAnswerQuestion} onEditPrompt={(prompt) => { setInput(prompt); setActivePromptTitle("Suggested action"); setDraftPromptOrigin(null); requestAnimationFrame(() => composerRef.current?.focus({ preventScroll: true } as FocusOptions)) }} />
       </aside>
      </div>

      {promptRailOpen ? (
       <div
        data-vt-brain-part="launchpad-backdrop"
        className="vt-brain-studio-workspace__drawer-backdrop"
        onClick={(event) => { if (event.target === event.currentTarget) setPromptRailOpen(false) }}
       >
        <div
         data-vt-brain-component="BrainLauncherDrawer"
         data-vt-brain-part="launchpad-panel"
         role="dialog"
         aria-modal="true"
         aria-labelledby="brain-prompt-library-dialog-title"
         className="vt-brain-studio-workspace__drawer-panel grid min-h-0 grid-rows-[auto_1fr] bg-white p-3"
        >
        <div data-vt-brain-part="mobile-launcher-heading" className="mb-2 grid gap-2 border-b-[2px] border-black pb-2">
         <div className="flex items-center justify-between gap-2">
          <h2 data-vt-brain-part="launcher-drawer-heading" id="brain-prompt-library-dialog-title" className="text-lg font-[1000] uppercase">Brain Launchpad</h2>
          <StudioSplitLeftButton ref={promptCloseRef} sizeVariant="compact" icon={<X aria-hidden="true" />} onClick={() => setPromptRailOpen(false)}>Close</StudioSplitLeftButton>
         </div>
         <div data-vt-brain-component="BrainLauncherModeSwitch" className="brain-launcher-mode-switch grid grid-cols-2 gap-1">
          <StudioSplitTwoLineButton sizeVariant="compact" icon={<LayoutGrid aria-hidden="true" />} firstLine="PROMPT" secondLine="LIBRARY" aria-label="Prompt Library" title="Prompt Library" aria-pressed={launcherMode === "prompts"} onClick={() => setLauncherMode("prompts")} className="min-w-0 w-full" style={{ backgroundColor: launcherMode === "prompts" ? "#FF7AC8" : "#ffffff" }} />
          <StudioSplitTwoLineButton sizeVariant="compact" icon={<Zap aria-hidden="true" />} firstLine="CAPABILITIES" secondLine="BROWSER" aria-label="Capabilities" title="Capabilities" aria-pressed={launcherMode === "capabilities"} onClick={() => setLauncherMode("capabilities")} className="min-w-0 w-full" style={{ backgroundColor: launcherMode === "capabilities" ? "#36E0F6" : "#ffffff" }} />
         </div>
        </div>
        <div className="vt-scrollless min-h-0 overflow-y-auto overscroll-contain" aria-label="Brain launchpad content" tabIndex={0}>
         {launcherMode === "prompts" ? <BrainPromptLibrary
          cards={promptCards}
          summarize={promptCardSummary}
          busy={busy}
          headingId="brain-prompt-library-drawer-title"
          onPrompt={(prompt, card) => { setPromptRailOpen(false); void handleSend(prompt, card ? { promptId: card.id, promptVersion: "1", action: "sent" } : undefined) }}
          onEdit={(prompt, card) => { setPromptRailOpen(false); setInput(prompt); setActivePromptTitle(card?.label || "Custom prompt"); setDraftPromptOrigin(card ? { promptId: card.id, promptVersion: "1", action: "edited" } : null); requestAnimationFrame(() => composerRef.current?.focus({ preventScroll: true } as FocusOptions)) }}
         /> : <BrainCapabilityBrowser
          snapshot={snapshot}
          controls={brainControls}
          busy={busy}
          headingId="brain-capability-browser-drawer-title"
          onPrompt={(prompt) => { setPromptRailOpen(false); void handleSend(prompt) }}
          onEdit={(prompt) => { setPromptRailOpen(false); setInput(prompt); setActivePromptTitle("Capability draft"); setDraftPromptOrigin(null); requestAnimationFrame(() => composerRef.current?.focus({ preventScroll: true } as FocusOptions)) }}
         />}
        </div>
        </div>
       </div>
      ) : null}

      {contextRailOpen ? (
       <div
        data-vt-brain-part="context-drawer-backdrop"
        className="vt-brain-studio-workspace__drawer-backdrop"
        onClick={(event) => { if (event.target === event.currentTarget) setContextRailOpen(false) }}
       >
        <div
         data-vt-brain-component="BrainContextDrawer"
         data-vt-brain-part="context-drawer-panel"
         role="dialog"
         aria-modal="true"
         aria-labelledby="brain-context-dialog-title"
         className="vt-brain-studio-workspace__drawer-panel grid min-h-0 grid-rows-[auto_1fr] bg-white p-3"
        >
        <div className="mb-2 flex items-center justify-between border-b-[2px] border-black pb-2">
         <h2 data-vt-brain-part="context-drawer-heading" id="brain-context-dialog-title" className="text-lg font-[1000] uppercase">Your Channel Context</h2>
         <StudioButton data-vt-brain-part="mobile-context-close" ref={contextCloseRef} sizeVariant="compact" tone="neutral" type="button" onClick={() => setContextRailOpen(false)}><X size={14} aria-hidden="true" /> Close</StudioButton>
        </div>
        <div className="vt-scrollless min-h-0 overflow-y-auto overscroll-contain" aria-label="Channel context" tabIndex={0}>
         <BrainContextRail channelId={channelId} channelHandle={authState.channelHandle} snapshot={snapshot} growthContext={creatorGrowthContext} insights={railInsights} questions={learningQuestions} responseQuestions={latestResponseQuestions} quickActions={quickActions} onAskInsight={handleAskInsight} onAcceptQuickAction={handleAcceptQuickAction} onAnswerQuestion={handleAnswerQuestion} onEditPrompt={(prompt) => { setContextRailOpen(false); setInput(prompt); composerRef.current?.focus() }} />
        </div>
        </div>
       </div>
      ) : null}

      {contextCorrectionItem ? (
       <BrainContextCorrectionDialog
        channelId={channelId}
        item={contextCorrectionItem}
        onClose={() => setContextCorrectionItem(null)}
        onApplied={() => {
         setInput(`Verify that the governed correction for context item ${contextCorrectionItem.sourceId} is reflected in the next answer. If the refreshed context does not contain it, show the unresolved conflict instead of assuming it was applied.`)
         window.setTimeout(() => composerRef.current?.focus(), 0)
        }}
       />
      ) : null}
      {journalOpen ? (
       <BrainJournalDialog
        value={journalInput}
        onChange={setJournalInput}
        onClose={() => setJournalOpen(false)}
        onSave={() => { handleJournalSave(); setJournalOpen(false) }}
       />
      ) : null}
     </section>
     </>
    )}
   </Toolbox>
  </main>
 )
}

export default AIBrainCommandInterface
