import React, { useEffect, useMemo, useRef, useState } from "react"
import "./AIBrainStudioWorkspace.css"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import {
 ArrowRight,
 BookOpen,
 Minus,
 Plus,
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
import { BrainPromptLibrary, promptCardSummary } from "../components/brain/BrainPromptLibrary"
export { filterCreatorBrainPromptCards } from "../components/brain/BrainPromptLibrary"
export { BrainPromptLibrary, promptCardSummary }
import { useVisualViewportHeight } from "../components/brain/useVisualViewportHeight"
import { StudioButton, StudioSplitLeftButton, StudioSplitTwoLineButton, StudioSplitLeftBadge, StudioSquareIconButton, StudioSquareIconButtonGroup, StudioInterModule, StudioTextArea } from "../studio-ui"
import { useBrain } from "../context/useBrain"
import { TOOLBOX_PALETTE } from "../styles/toolboxPalette"
import { hasGeminiKey } from "../services/gemini"
import {
 AI_BRAIN_INTAKE_QUESTIONS,
 dismissAiBrainIntake,
 loadAiBrainContext,
 saveAiBrainContext,
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
export { shouldFollowBrainConversation }
import { selectBrainAnswerModules } from "./brainAnswerModuleSelection"
import { BrainJournalDialog } from "../components/brain/BrainJournalDialog"
import { BrainContextCorrectionDialog, type BrainContextCorrectionItem } from "../components/brain/BrainContextCorrectionDialog"
import { readBrainRuntimeSnapshot } from "../services/brain/BrainRuntimeSnapshot"
import { buildBrainContextDisplayItems } from "../services/brain/BrainContextPresentation"
import { isEvidenceRecord, type EvidenceRecord } from "../services/brain/EvidenceRecord"
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
}

/**
 * Read only the exact typed evidence array recorded as rendered to the model.
 * If IDs or record contracts disagree, omit the detailed provenance rather than
 * displaying a different evidence set as though it were the prompt input.
 */
export type PromptEvidenceIntegrityStatus = "verified" | "unavailable" | "mismatch"

/**
 * Distinguish legacy turns with no manifest from a present-but-invalid prompt
 * evidence manifest. Only the latter is an integrity failure.
 */
export const getPromptEvidenceIntegrityStatus = (
 metadata: Record<string, unknown> | undefined,
): PromptEvidenceIntegrityStatus => {
 if (!metadata || !Object.prototype.hasOwnProperty.call(metadata, "promptEvidenceRecordIds")) return "unavailable"
 if (!Array.isArray(metadata.promptEvidenceRecordIds) || !Array.isArray(metadata.evidenceRecords)) return "mismatch"
 const rawRecords: unknown[] = metadata.evidenceRecords
 const rawIds: unknown[] = metadata.promptEvidenceRecordIds
 if (!rawRecords.every(isEvidenceRecord) || !rawIds.every((id) => typeof id === "string")) return "mismatch"
 const records = rawRecords as EvidenceRecord[]
 const ids = rawIds as string[]
 return records.length === ids.length && records.every((record, index) => record.id === ids[index])
  ? "verified"
  : "mismatch"
}

export const readPromptEvidenceRecords = (
 metadata: Record<string, unknown> | undefined,
): EvidenceRecord[] | undefined => {
 if (getPromptEvidenceIntegrityStatus(metadata) !== "verified") return undefined
 return metadata!.evidenceRecords as EvidenceRecord[]
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
 const { height: mobileViewportHeight, keyboardOpen } = useVisualViewportHeight(true)
 const [journalInput, setJournalInput] = useState("")
 const [busy, setBusy] = useState(false)
 const [messages, setMessages] = useState<ChatMessage[]>([])
 // Gate the opening launchpad so it doesn't flash before a restored conversation
 // loads on refresh. When a channel has no saved turns (first-time users, and the
 // static-render tests), start hydrated so the launchpad shows immediately.
 const [hydrated, setHydrated] = useState(
  () => !aiBrainThreadHasTurnsHint(authState.channelHandle || authState.channelId || null),
 )
 const [learningEntries, setLearningEntries] = useState<AIBrainLearningEntry[]>([])
 const [recentTurns, setRecentTurns] = useState<AIBrainConversationTurn[]>([])
 const [questionAnswers, setQuestionAnswers] = useState<AIBrainQuestionAnswer[]>([])
 const [onboardingSnapshot, setOnboardingSnapshot] = useState<BrainOnboardingSnapshot | null>(null)
 const [intakeOpen, setIntakeOpen] = useState(false)
 const [intakeContext, setIntakeContext] = useState<AiBrainContext>(() => loadAiBrainContext())
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
 const channelId = authState.channelHandle || authState.channelId || null
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
   setIntakeContext(loadAiBrainContext())
   setIntakeOpen(true)
   return
  }
  if (shouldShowAiBrainIntake(authState.isAuthenticated)) {
   setIntakeContext(loadAiBrainContext())
   setIntakeOpen(true)
  }
 }, [authState.isAuthenticated, location.search])

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
     evidenceRecords: readPromptEvidenceRecords(turn.metadata),
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

 const handleSend = async (override?: string) => {
  const userText = override ?? input
  if (!userText.trim() || busy || requestInFlightRef.current) return
  if (shouldShowAiBrainIntake(authState.isAuthenticated)) {
   setIntakeContext(loadAiBrainContext())
   setIntakeOpen(true)
   return
  }
  requestInFlightRef.current = true
  shouldFollowConversationRef.current = true
  setInput("")
  if (composerRef.current) composerRef.current.style.height = "52px"
  setBusy(true)
  const userMessage: ChatMessage = { id: makeMessageId(), role: "user", text: userText }
  // Append to the ongoing thread; the post-send refresh rebuilds it authoritatively.
  setMessages((current) => [...current, userMessage])
  let turnSnapshot: AIBrainContextSnapshot = snapshot
  let turnGrowthContext = creatorGrowthContext
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
   const systemPrompt = buildAIBrainSystemPrompt({
    brain,
    authState,
    channelConnection,
    brainMemory: getBrainMemory(),
    brainOnboardingSnapshot: onboardingSnapshot,
    recentConversationTurns: recentTurns,
    requestText: userText,
    creatorGrowthContext: turnGrowthContext,
   })
   const historyPayload = buildBrainConversationHistory(recentTurns)
   const activeProject = projectContextCleared
    ? null
    : brain.projects.find((project) => project.id === brain.activeProjectId)
     || brain.projects.find((project) => project.status === "active")
     || null
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
    snapshot: turnSnapshot,
    systemPrompt,
    growthContext: turnGrowthContext,
    recentTurns,
    history: historyPayload,
    allowModel: canUseGemini,
   })
   setMessages((current) => [
    ...current,
    { id: result.turn.id, role: "model", text: result.turn.assistantText, response: result.response, handoff: null, originalUserText: result.turn.rawUserMessage ?? userText, evidencePack: turnSnapshot.evidencePack, evidenceRecords: readPromptEvidenceRecords(result.turn.metadata), evidenceIntegrityStatus: getPromptEvidenceIntegrityStatus(result.turn.metadata), readiness: readinessForSnapshot(turnSnapshot), contextUsed: result.turn.metadata?.creatorContextSnapshot as BrainCreatorContextSnapshot | undefined },
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
   setMessages((current) => [
    ...current,
    { id: makeMessageId(), role: "model", text: fallbackText, response, evidencePack: turnSnapshot.evidencePack, readiness: readinessForSnapshot(turnSnapshot) },
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
    const turnSnapshot = !useFreshEvidence && message.evidencePack
     ? { ...freshSnapshot, evidencePack: message.evidencePack }
     : freshSnapshot
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
     evidencePackOverride: !useFreshEvidence ? message.evidencePack : undefined,
     creatorGrowthContext: turnGrowthContext,
    })
    const historyPayload = buildBrainConversationHistory(recentTurns.filter((turn) => turn.id !== message.id))
    const activeProject = brain.projects.find((project) => project.id === brain.activeProjectId)
     || brain.projects.find((project) => project.status === "active")
     || null

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
    })
    setMessages((current) => current.map((item) => item.id === result.turn.id
     ? {
       ...item,
       text: result.turn.assistantText,
       response: result.response,
       turnStatus: result.turn.status,
       originalUserText: result.turn.rawUserMessage ?? userText,
       evidencePack: turnSnapshot.evidencePack,
       evidenceRecords: readPromptEvidenceRecords(result.turn.metadata),
       evidenceIntegrityStatus: getPromptEvidenceIntegrityStatus(result.turn.metadata),
       readiness: readinessForSnapshot(turnSnapshot),
       contextUsed: result.turn.metadata?.creatorContextSnapshot as BrainCreatorContextSnapshot | undefined,
       contextMayBeStale: false,
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
  const selectedContentId = message.evidencePack?.evidenceIds.find((id) => id.startsWith("video:"))
   || brain.projects.find((project) => project.id === brain.activeProjectId)?.contentBuildId
   || null
  const activeProject = brain.projects.find((project) => project.id === brain.activeProjectId)
   || brain.projects.find((project) => project.status === "active")
   || null
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

 const handleSaveIntake = () => {
  const saved = saveAiBrainContext({ ...intakeContext, source: "wizard" })
  setIntakeContext(saved)
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
   evidence: ["Creator profile intake"],
  })
   .then((entry) =>
    entry
     ? saveAIBrainConversationTurn({
        channelId,
        userText: "Creator profile intake completed",
        assistantText: "Creator profile saved for future ViewTube Copilot coaching.",
        learningEntryIds: [entry.id],
        metadata: { source: "creator_intake" },
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
  dismissAiBrainIntake()
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
      onChange={setIntakeContext}
      onSave={handleSaveIntake}
      onDefer={handleDeferIntake}
     />
    ) : (
     <>
     <section data-vt-brain-workspace-part="surface" className="vt-brain-studio-workspace__surface relative flex h-full min-h-0 flex-col overflow-hidden max-xl:h-full xl:h-full xl:overflow-hidden">
       <BrainPageTabs activeTab={pageTab} onChange={setPageTab} />
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
        <BrainContextRail channelId={channelId} snapshot={snapshot} growthContext={creatorGrowthContext} insights={railInsights} questions={learningQuestions} responseQuestions={latestResponseQuestions} quickActions={quickActions} onAskInsight={handleAskInsight} onAcceptQuickAction={handleAcceptQuickAction} onAnswerQuestion={handleAnswerQuestion} onEditPrompt={(prompt) => { setInput(prompt); requestAnimationFrame(() => composerRef.current?.focus({ preventScroll: true } as FocusOptions)) }} />
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
          onPrompt={(prompt) => { setPromptRailOpen(false); void handleSend(prompt) }}
          onEdit={(prompt) => { setPromptRailOpen(false); setInput(prompt); requestAnimationFrame(() => composerRef.current?.focus({ preventScroll: true } as FocusOptions)) }}
         /> : <BrainCapabilityBrowser
          snapshot={snapshot}
          controls={brainControls}
          busy={busy}
          headingId="brain-capability-browser-drawer-title"
          onPrompt={(prompt) => { setPromptRailOpen(false); void handleSend(prompt) }}
          onEdit={(prompt) => { setPromptRailOpen(false); setInput(prompt); requestAnimationFrame(() => composerRef.current?.focus({ preventScroll: true } as FocusOptions)) }}
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
         <BrainContextRail channelId={authState.channelId || null} snapshot={snapshot} growthContext={creatorGrowthContext} insights={railInsights} questions={learningQuestions} responseQuestions={latestResponseQuestions} quickActions={quickActions} onAskInsight={handleAskInsight} onAcceptQuickAction={handleAcceptQuickAction} onAnswerQuestion={handleAnswerQuestion} onEditPrompt={(prompt) => { setContextRailOpen(false); setInput(prompt); composerRef.current?.focus() }} />
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
