import React, { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
import { StudioButton, StudioSplitLeftButton, StudioSquareIconButton, StudioTextArea } from "../studio-ui"
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
import { BrainCapabilityBrowser } from "../components/brain/BrainCapabilityBrowser"
import { BrainProfileCoverageChecklist } from "../components/brain/BrainProfileCoverageChecklist"
import { BrainContextRail } from "../components/brain/BrainContextRail"
import { BrainClaimEvidence } from "../components/brain/BrainClaimEvidence"
import { confidenceForEvidence } from "../components/brain/BrainConfidenceChip"
import { BrainTurnEvidenceRibbon } from "../components/brain/BrainTurnEvidenceRibbon"
import { BrainWorkspaceNavigation } from "../components/brain/BrainWorkspaceNavigation"
import { BrainQuestionPrompt } from "../components/brain/BrainQuestionPrompt"
import { BrainRuntimePanel } from "../components/brain/BrainRuntimePanel"
import { readBrainRuntimeSnapshot } from "../services/brain/BrainRuntimeSnapshot"
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
  source: string
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
 onCorrectItem?: (id: string, statement: string) => void
}> = ({ contextUsed, turnId, onCorrectItem }) => {
 if (!contextUsed) return null
 const selection = contextUsed.selection
 const project = contextUsed.project
 const items = [
  { id: "channel", label: "Channel", value: contextUsed.channelId || "No channel ID", status: "confirmed" },
  { id: "project", label: "Project", value: project ? `${project.title || project.projectId} · ${project.projectId}` : "No project in this answer's context", status: project?.source === "canonical_project" || project?.source === "canonical_project_content_build" ? "confirmed" : "inferred" },
  { id: "content-build", label: "ContentBuild", value: project?.contentBuildId || "No linked ContentBuild", status: project?.contentBuildId ? "confirmed" : "temporary" },
  { id: "selection", label: "Selected video / asset", value: selection ? `${selection.label} · ${selection.sourceId}` : "No selected video or asset was supplied", status: selection ? "temporary" : "inferred" },
 ]
 return (
  <details data-vt-brain-component="BrainContextUsedDrawer" data-vt-brain-turn-id={turnId} className="w-full rounded-[7px] border-[2px] border-black bg-white">
   <summary data-vt-brain-part="context-used-trigger" className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 px-2 text-[9px] font-black uppercase hover:bg-[#36E0F6] focus-visible:ring-2 focus-visible:ring-black">
    <PanelRight size={12} aria-hidden="true" /> Context used
    <span className="rounded-[4px] border border-black bg-[#FFDA47] px-1">{items.length + contextUsed.knowledgeItems.length}</span>
   </summary>
   <div className="grid gap-2 border-t-[2px] border-black p-2">
    <ul className="grid gap-1">
     {items.map((item) => (
      <li data-vt-brain-part="context-used-item" key={item.id} className="grid gap-0.5 rounded-[5px] border border-black/20 bg-[#f8f8f4] px-2 py-1">
       <span className="text-[9px] font-black uppercase">{item.label} · {item.status}</span>
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
         {onCorrectItem ? <StudioButton data-vt-brain-part="correct-context-action" type="button" sizeVariant="compact" tone="neutral" onClick={() => onCorrectItem(item.id, item.statement)} className="mt-1 min-w-0">Correct context</StudioButton> : null}
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
  <div data-vt-brain-part="active-context-badges" className="flex flex-wrap items-center gap-1">
   <span data-vt-brain-context="channel" className="rounded-[4px] border border-black bg-[#36E0F6] px-1.5 py-1 text-[9px] font-black uppercase">Channel · {channelLabel}</span>
   <span data-vt-brain-context="project" className="rounded-[4px] border border-black bg-[#3FEE56] px-1.5 py-1 text-[9px] font-black uppercase">Project · {projectLabel}</span>
   <span data-vt-brain-context="content-build" className="rounded-[4px] border border-black bg-[#FFDA47] px-1.5 py-1 text-[9px] font-black uppercase">ContentBuild · {contentBuildId || "none"}</span>
   <span data-vt-brain-context="selection" className="min-w-0 rounded-[4px] border border-black bg-[#f8f8f4] px-1.5 py-1 text-[9px] font-black uppercase">Selected · {selection?.label || "none"}</span>
  </div>
  <div className="grid grid-cols-3 gap-1">
   <StudioSplitLeftButton sizeVariant="standard" icon={selection?.locked ? <Unlock aria-hidden="true" /> : <Lock aria-hidden="true" />} disabled={!selection} aria-pressed={Boolean(selection?.locked)} onClick={onToggleLock} className="min-w-0" style={{ backgroundColor: "#ffffff" }}>{selection?.locked ? "Unlock selection" : "Lock selection"}</StudioSplitLeftButton>
   <StudioSplitLeftButton sizeVariant="standard" icon={<XCircle aria-hidden="true" />} disabled={!selection} onClick={onClearSelection} className="min-w-0" style={{ backgroundColor: "#ffffff" }}>Clear selection</StudioSplitLeftButton>
   <StudioSplitLeftButton sizeVariant="standard" icon={<Trash2 aria-hidden="true" />} disabled={projectLabel === "none"} onClick={onClearProject} className="min-w-0" style={{ backgroundColor: "#ffffff" }}>Clear project</StudioSplitLeftButton>
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

const PROMPT_CARD_SUMMARIES: Record<string, string> = {
 "analyze-channel-niche": "Find your niche and fuzzy edges.",
 "niche-growth-ideas": "Choose adjacent topics that still fit.",
 "analyze-formats": "Compare views, retention, and revenue.",
 "seo-script-drafter": "Draft a concept, hook, description, and tags.",
 "format-strategy": "Plan five repeatable uploads.",
 "clarify-channel-goals": "Confirm goals, audience, and direction.",
 "revenue-levers": "Find practical 30-day revenue moves.",
 "audience-language": "Identify audience interests and wording.",
 "why-views-changed": "Diagnose momentum and choose three moves.",
 "best-video-autopsy": "Explain and replicate your best video.",
 "title-thumbnail-test": "Create the next title and thumbnail test.",
 "daily-oracle": "Get today’s priority, quick win, and action.",
 "pinned-comments": "Engagement pinned comments for your top 10 videos.",
 "ten-video-ideas": "10 new titles and topics from your best long-form.",
 "shorts-funnel-plan": "Turn Shorts viewers into subscribers and long-form watch time.",
 "shorts-from-longform": "Find the best Short moments in your long-form videos.",
 "metric-correlations": "See what drives success across your metrics.",
 "uploader-assets": "Optimized title, description, and tags for your next video.",
 "thumbnail-brief": "A fresh, on-brand thumbnail concept for your next video.",
}

export const promptCardSummary = (card: CreatorBrainPromptCard): string =>
 PROMPT_CARD_SUMMARIES[card.id] || card.prompt

export const filterCreatorBrainPromptCards = (
 cards: CreatorBrainPromptCard[],
 query: string,
 category = "all",
): CreatorBrainPromptCard[] => {
 const normalized = query.trim().toLowerCase()
 return cards.filter((card) => {
  if (category !== "all" && card.category !== category) return false
  if (!normalized) return true
  return [card.label, card.prompt, promptCardSummary(card), card.category, card.id]
   .some((value) => value.toLowerCase().includes(normalized))
 })
}

const GENERATION_BADGES: Record<BrainGenerationPath, { label: string; color: string; description: string }> = {
 model: { label: "Full Brain", color: "#00FF00", description: "This response was prepared with the full Brain." },
 repaired_model: { label: "Refined Answer", color: "#36E0F6", description: "This response was prepared with an additional quality pass." },
 basic_guidance: { label: "Basic Guidance", color: "#FFDA47", description: "This response was prepared from available channel evidence while full generation was unavailable." },
}

export const BrainGenerationBadge: React.FC<{ path: BrainGenerationPath }> = ({ path }) => {
 const badge = GENERATION_BADGES[path]
 return (
  <span
   data-vt-brain-component="BrainGenerationBadge"
   role="status"
   tabIndex={0}
   aria-label={`${badge.label} response status`}
   title={badge.description}
   className="max-w-full whitespace-normal break-words rounded-[6px] border-[2px] border-black px-2 py-0.5 text-center text-[8px] font-black uppercase leading-3 tracking-[0.1em] outline-none focus-visible:ring-[3px] focus-visible:ring-black"
   style={{ backgroundColor: badge.color }}
  >
   {badge.label}
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
  <div className="brain-chat-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-4" aria-label="Brain conversation" tabIndex={0}>
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

/** Persistent task discovery. Kept outside the empty-chat branch so prior turns
 * never hide a Brain capability from returning creators. */
export const BrainPromptLibrary: React.FC<{
 cards: CreatorBrainPromptCard[]
 busy?: boolean
 headingId?: string
 onPrompt: (prompt: string) => void
 onEdit?: (prompt: string) => void
}> = ({ cards, busy = false, headingId = "brain-prompt-library-title", onPrompt, onEdit }) => {
 const [selectedId, setSelectedId] = useState<string | null>(null)
 const [query, setQuery] = useState("")
 const [category, setCategory] = useState("all")
 const filteredCards = useMemo(() => filterCreatorBrainPromptCards(cards, query, category), [cards, query, category])
 const selected = filteredCards.find((card) => card.id === selectedId) || null

 return (
  <section
   data-vt-brain-component="BrainPromptLibrary"
   aria-label="Prompt library"
   aria-labelledby={headingId}
   aria-busy={busy || undefined}
   className="overflow-hidden rounded-[10px] border-[2px] border-black bg-white"
  >
   <div data-vt-brain-part="prompt-library-heading" className="border-b-[2px] border-black bg-[#FF7AC8] px-3 py-2">
    <h2 id={headingId} className="text-[12px] font-[1000] uppercase leading-4 tracking-[0.08em]">
     Prompt Library
    </h2>
    <p className="mt-0.5 text-[10px] font-bold leading-4 text-black/65">
     Search by task or topic, preview the prompt, then send it or edit it first.
    </p>
   </div>

   <div className="grid gap-2 border-b-[2px] border-black bg-[#fff7fc] p-2 sm:grid-cols-[minmax(0,1fr)_minmax(120px,0.5fr)]">
    <label className="flex min-h-11 items-center gap-2 rounded-[7px] border-[2px] border-black bg-white px-2 focus-within:ring-[3px] focus-within:ring-black">
     <span className="sr-only">Search prompts</span>
     <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSelectedId(null) }} placeholder="Search prompts…" aria-label="Search prompts" className="min-w-0 flex-1 bg-transparent py-2 text-xs font-bold outline-none" />
    </label>
    <label className="flex min-h-11 items-center gap-2 rounded-[7px] border-[2px] border-black bg-white px-2 focus-within:ring-[3px] focus-within:ring-black">
     <span className="sr-only">Filter prompts by category</span>
     <select aria-label="Filter prompts by category" value={category} onChange={(event) => { setCategory(event.target.value); setSelectedId(null) }} className="min-w-0 flex-1 bg-transparent py-2 text-xs font-bold outline-none">
      <option value="all">All categories</option>
      {Array.from(new Set(cards.map((card) => card.category))).sort().map((item) => <option key={item} value={item}>{item.replace(/_/g, " ")}</option>)}
     </select>
    </label>
   </div>
   <p className="px-3 pt-2 text-[10px] font-bold text-black/60" role="status" aria-live="polite">{filteredCards.length} of {cards.length} prompts</p>
   <ul className="grid grid-cols-1 gap-1.5 p-2 sm:grid-cols-2 xl:grid-cols-3">
    {filteredCards.map((card) => {
     const isSelected = card.id === selectedId
     return (
      <li key={card.id}>
       <button
        type="button"
        disabled={busy}
        aria-pressed={isSelected}
        title={card.prompt}
        onClick={() => setSelectedId(isSelected ? null : card.id)}
        className={`group flex h-full min-h-11 w-full flex-col items-stretch overflow-hidden rounded-[8px] border-[2px] border-black bg-white text-left outline-none focus-visible:ring-[3px] focus-visible:ring-black disabled:cursor-wait disabled:opacity-50 ${isSelected ? "bg-[#FFDA47]" : "hover:bg-[#36E0F6]/20"}`}
       >
        <span
         className="flex shrink-0 items-center justify-between gap-1 border-b-[2px] border-black px-2 py-2 text-xs font-[1000] uppercase leading-4"
         style={{ backgroundColor: card.color }}
        >
         <span className="truncate">{card.label}</span>
         {isSelected ? <Check size={12} className="shrink-0" aria-hidden="true" /> : null}
        </span>
        <span className="flex min-h-0 flex-1 items-center px-2 py-1.5">
         <span className="line-clamp-2 block overflow-hidden text-xs font-bold leading-4 text-black/70">
          {promptCardSummary(card)}
         </span>
        </span>
       </button>
      </li>
     )
    })}
   </ul>
   {!filteredCards.length ? <p className="px-3 pb-3 text-xs font-bold text-black/60">No prompts match these filters. Try another search or choose All categories.</p> : null}

   <div className="border-t-[2px] border-black bg-[#f8f8f4] p-2">
    {selected ? (
     <div className="overflow-hidden rounded-[8px] border-[2px] border-black bg-white shadow-[3px_3px_0_0_#000]">
      <div
       className="flex items-center justify-between gap-2 border-b-[2px] border-black px-2.5 py-1"
       style={{ backgroundColor: selected.color }}
      >
       <span className="truncate text-xs font-[1000] uppercase tracking-[0.08em]">
        Preview · {selected.label}
       </span>
       <button
        type="button"
        aria-label="Close preview"
        onClick={() => setSelectedId(null)}
        className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-[5px] border-[2px] border-black bg-white/80 outline-none focus-visible:ring-[3px] focus-visible:ring-black hover:bg-white"
       >
        <X size={11} />
       </button>
      </div>
      <div className="grid gap-2 p-2.5">
       <p className="text-sm font-bold leading-5 text-black/80">{selected.prompt}</p>
       <div className="flex flex-wrap gap-1.5">
        <button
         type="button"
         disabled={busy}
         onClick={() => {
          onPrompt(selected.prompt)
          setSelectedId(null)
         }}
         className="inline-flex min-h-11 items-center gap-1.5 rounded-[7px] border-[2px] border-black bg-[#3FEE56] px-3 py-2 text-[10px] font-black uppercase tracking-[0.06em] outline-none focus-visible:ring-[3px] focus-visible:ring-black disabled:cursor-wait disabled:opacity-50"
        >
         <Send size={12} /> Send to chat
        </button>
        {onEdit ? (
         <button
          type="button"
          onClick={() => {
           onEdit(selected.prompt)
           setSelectedId(null)
          }}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-[7px] border-[2px] border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.06em] outline-none focus-visible:ring-[3px] focus-visible:ring-black hover:bg-[#FFDA47]"
         >
          Edit first <ArrowRight size={11} />
         </button>
        ) : null}
       </div>
      </div>
     </div>
    ) : (
     <p className="px-1 py-0.5 text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-black/45">
      Tap a prompt above to preview it before sending.
     </p>
    )}
   </div>
  </section>
 )
}

const FEEDBACK_OPTIONS = [
 ["helpful", ThumbsUp, "Helpful", "#3FEE56"],
 ["not_useful", ThumbsDown, "Not useful", "#FA618A"],
 ["inaccurate", HelpCircle, "Inaccurate", "#FFDA47"],
 ["save_insight", BookOpen, "Save insight", "#36E0F6"],
 ["ask_follow_up", MessageSquare, "Ask follow-up", "#FF7AC8"],
] as const satisfies ReadonlyArray<readonly [AIBrainFeedbackSignal["rating"], React.ComponentType<{ size?: number }>, string, string]>

export const BrainFeedbackControls: React.FC<{
 message: ChatMessage
 onFeedback: (message: ChatMessage, rating: AIBrainFeedbackSignal["rating"]) => Promise<void>
}> = ({ message, onFeedback }) => {
 const [selected, setSelected] = useState<AIBrainFeedbackSignal["rating"] | null>(null)
 const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

 const submitFeedback = async (rating: AIBrainFeedbackSignal["rating"]) => {
  if (status === "saving") return
  setSelected(rating)
  setStatus("saving")
  try {
   await onFeedback(message, rating)
   setStatus("saved")
  } catch (error) {
   console.warn("[AIBrain] Feedback was not saved:", error)
   setStatus("error")
  }
 }

 return (
  <div data-vt-brain-component="BrainAnswerFeedback" className="flex min-w-0 flex-wrap items-center gap-1.5" aria-label="Rate this response">
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
      aria-pressed={isSelected}
      disabled={status === "saving"}
      onClick={() => void submitFeedback(rating)}
      style={{ backgroundColor: isSelected ? color : "#ffffff" }}
      className="cursor-pointer disabled:cursor-wait disabled:opacity-60"
     />
    )
   })}
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
 return (
  <section data-vt-brain-part="learning-receipt-content" aria-label="Learning receipt" className="grid gap-2 border-t-[2px] border-black bg-[#FFF8D6] p-3">
   <div className="flex flex-wrap items-center justify-between gap-2">
    <h4 data-vt-brain-part="learning-receipt-heading" className="text-[10px] font-black uppercase tracking-[0.12em]">Learning receipt</h4>
    <span role="status" className="rounded-[5px] border-[1.5px] border-black bg-white px-2 py-0.5 text-[9px] font-black uppercase">{receipt.status}</span>
   </div>
   <p data-vt-brain-part="learning-receipt-summary" className="text-sm font-black leading-5">{sanitizeCreatorFacingBrainCopy(receipt.summary)}</p>
   {receipt.detail ? <p className="text-xs font-bold leading-5 text-black/70">{sanitizeCreatorFacingBrainCopy(receipt.detail)}</p> : null}
   <dl data-vt-brain-part="learning-receipt-metadata" className="grid gap-1 text-[10px] leading-4">
    <div><dt className="inline font-black uppercase">Scope · </dt><dd className="inline">{receipt.scope === "durable_knowledge" ? "Confirmed durable knowledge" : "Learning ledger; not promoted to durable knowledge"}</dd></div>
    <div><dt className="inline font-black uppercase">Category · </dt><dd className="inline">{receipt.category.replace(/_/g, " ")}</dd></div>
    <div><dt className="inline font-black uppercase">Receipt ID · </dt><dd className="break-all font-mono">{receipt.entryId}</dd></div>
   </dl>
   {!dismissed ? (
    <div className="flex flex-wrap gap-2">
     <button type="button" onClick={() => onCorrect(message)} className="min-h-11 rounded-[6px] border-[2px] border-black bg-white px-3 py-2 text-[10px] font-black uppercase hover:bg-[#36E0F6] focus-visible:ring-2 focus-visible:ring-black">Correct</button>
     <button type="button" onClick={() => onReject(message)} className="min-h-11 rounded-[6px] border-[2px] border-black bg-[#FF7497] px-3 py-2 text-[10px] font-black uppercase hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black">Reject</button>
    </div>
   ) : <p role="status" className="text-xs font-bold">This learning entry was rejected and will not be promoted.</p>}
  </section>
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
 onCorrectContextItem: (id: string, statement: string) => void
}> = ({ message, answeredQuestionIds, onFeedback, onAnswerQuestion, onReviewHandoff, onRetry, onCorrectReceipt, onRejectReceipt, onCorrectContextItem }) => {
 const response = message.response
 const turnEvidencePack = message.evidencePack
 const handoffContext = `${message.originalUserText || ""} ${response?.headline || ""} ${response?.keyInsight || ""}`.toLowerCase()
 const handoffOptions = [
  { key: "thumbnail" as const, label: "Open in Thumbnail Studio", matches: /thumbnail|visual|cover image|thumbnail image|visual hook/ },
  { key: "metadata" as const, label: "Prepare metadata draft", matches: /title|seo|description|tags|keyword|metadata|search opportunity/ },
  { key: "projects" as const, label: "Review in Projects", matches: /project|publish|package|content build|workflow|content plan/ },
 ].filter((option) => option.matches.test(handoffContext))
 if (!response && message.learningReceipt) {
  return <article data-vt-brain-component="BrainLearningReceiptCard" className={assistantCardFrame}><BrainLearningReceiptCard message={message} onCorrect={onCorrectReceipt} onReject={onRejectReceipt} /></article>
 }
 if (!response) {
  const canRetry = message.turnStatus === "interrupted" && Boolean(message.originalUserText)
  return (
   <article data-vt-brain-component="BrainInterruptedResponseCard" className={`${assistantCardFrame} p-4`}>
    <div data-vt-brain-part="interrupted-response-attribution" className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-black/45">ViewTube Copilot</div>
    <p className="whitespace-pre-wrap text-sm font-bold leading-6">{message.text ? sanitizeCreatorFacingBrainCopy(message.text) : canRetry ? "This response was interrupted before it finished." : "Preparing response…"}</p>
    {canRetry ? (
     <div className="mt-3 grid gap-2">
      {message.contextMayBeStale ? (
       <p role="status" className="text-xs font-bold leading-5 text-black/70">The channel data has changed since this attempt. Choose whether to keep the original evidence or refresh it for the retry.</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
       <button type="button" onClick={() => onRetry(message, false)} className="min-h-11 rounded-[6px] border-[2px] border-black bg-[#3FEE56] px-3 py-2 text-[10px] font-black uppercase focus-visible:ring-2 focus-visible:ring-black">
        {message.contextMayBeStale ? "Retry with saved evidence" : "Retry this response"}
       </button>
       {message.contextMayBeStale ? (
        <button type="button" onClick={() => onRetry(message, true)} className="min-h-11 rounded-[6px] border-[2px] border-black bg-[#FFDA47] px-3 py-2 text-[10px] font-black uppercase focus-visible:ring-2 focus-visible:ring-black">
         Refresh evidence & retry
        </button>
       ) : null}
      </div>
     </div>
    ) : null}
   </article>
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
 // Drop prose modules that just restate the key insight (the common duplication),
 // and cap the count so every answer isn't the same tall stack.
 const keyNorm = sanitizeCreatorFacingBrainCopy(response.keyInsight).trim().toLowerCase()
 const modules = rawModules
  .filter((module) => {
   if (module.data?.metrics?.length || module.data?.items?.length) return true
   const body = sanitizeCreatorFacingBrainCopy(module.body || "").trim().toLowerCase()
   if (!body || !keyNorm) return Boolean(body)
   return !(body === keyNorm || body.startsWith(keyNorm.slice(0, 60)) || keyNorm.startsWith(body.slice(0, 60)))
  })
  .slice(0, 3)
 const openQuestions = response.questions.filter(
  (question) => question.category !== "creator_goal" && !answeredQuestionIds.has(question.id),
 )

 return (
  <article data-vt-brain-component="BrainResponseCard" className={`${assistantCardFrame} flex flex-col overflow-hidden`}>
   <div className="shrink-0 border-b-[2px] border-black px-3 py-2" style={{ backgroundColor: TOOLBOX_PALETTE[5] }}>
    <div className="flex flex-wrap items-start justify-between gap-1.5">
     <div data-vt-brain-part="response-attribution" className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">ViewTube Copilot</div>
     {response.generationPath ? <BrainGenerationBadge path={response.generationPath} /> : null}
    </div>
    <h3 data-vt-brain-part="response-headline" className="text-lg font-[1000] uppercase leading-none sm:text-xl">
     {sanitizeCreatorFacingBrainCopy(response.headline)}
    </h3>
   </div>
   <div className="flex flex-col gap-2.5 p-3">
    {message.readiness && message.evidencePack && ["analytics", "revenue", "audience", "strategy"].includes(message.evidencePack.intent) ? (
     <BrainDataReadiness readiness={message.readiness} />
    ) : null}
    <p data-vt-brain-part="response-key-insight" className="text-sm font-black leading-5">{sanitizeCreatorFacingBrainCopy(response.keyInsight)}</p>
    <BrainAnswerModuleGrid modules={modules} compact />
    {turnEvidencePack ? <BrainTurnEvidenceRibbon turnId={message.id} evidencePack={turnEvidencePack} citedEvidenceIds={response.evidenceIds} compact /> : null}
    {openQuestions[0] ? (
     <BrainQuestionPrompt question={openQuestions[0]} onAnswer={onAnswerQuestion} compact />
    ) : null}
   </div>
   <div className="flex min-h-9 shrink-0 flex-wrap items-center gap-1 border-t-[2px] border-black bg-[#f8f8f4] px-3 py-1">
     <BrainFeedbackControls message={message} onFeedback={onFeedback} />
     {handoffOptions.map((option) => (
      <button
       key={option.key}
       type="button"
       onClick={() => onReviewHandoff(message, option.key)}
       title={`Queue a review-only handoff to ${option.label}`}
       className="min-h-9 rounded-[6px] border-[2px] border-black bg-white px-2 text-[9px] font-black uppercase hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black"
      >
       {option.label}
      </button>
     ))}
     <BrainContextUsedDrawer contextUsed={message.contextUsed} turnId={message.id} onCorrectItem={onCorrectContextItem} />
     {message.handoff ? (
      <Link
       to={message.handoff.route}
       title={`Open ${message.handoff.targetTitle}`}
       className="ml-auto inline-flex items-center gap-1.5 rounded-[6px] border-[2px] border-black bg-[#FFDA47] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em]"
      >
       Review only · Open
       <ArrowRight size={13} />
      </Link>
     ) : null}
   </div>
   {message.learningReceipt ? <BrainLearningReceiptCard message={message} onCorrect={onCorrectReceipt} onReject={onRejectReceipt} /> : null}
  </article>
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

const BrainDataReadiness: React.FC<{ readiness: AIBrainTurnReadiness }> = ({ readiness }) => {
 const staleCount = readiness.diagnostics.coverage.staleDatasets
 const missingCount = readiness.diagnostics.coverage.missingDatasets
 const revenueUnavailable = !readiness.availableMetrics.includes("revenue")
 const statusLabel = readiness.dataStatus === "ready"
  ? "Channel data synced"
  : readiness.dataStatus === "partial"
   ? "Partial channel data"
   : "Channel data unavailable"
 const summary = [
  statusLabel,
  revenueUnavailable ? "Revenue unavailable" : "",
  staleCount > 0 ? `${staleCount} stale datasets` : "",
  missingCount > 0 ? `${missingCount} missing datasets` : "",
 ].filter(Boolean).join(" · ")
 const incompleteSources = readiness.sourceStatuses.filter((source) => source.status !== "ready")

 return (
  <details data-vt-brain-component="BrainEvidenceReadiness" className="overflow-hidden rounded-[7px] border-[2px] border-black bg-[#f8f8f4]">
   <summary data-vt-brain-part="evidence-readiness-trigger" className="flex min-h-11 cursor-pointer list-none flex-wrap items-center gap-1.5 px-2.5 py-2 text-[9px] font-black uppercase leading-4 hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black">
    <span data-vt-brain-part="evidence-readiness-status" className={`rounded-[4px] border-[1.5px] border-black px-1.5 py-0.5 ${readiness.dataStatus === "ready" ? "bg-[#3FEE56]" : readiness.dataStatus === "partial" ? "bg-[#FFDA47]" : "bg-[#FF7497]"}`}>Data readiness</span>
    <span data-vt-brain-part="evidence-readiness-summary">{summary}</span>
   </summary>
   <div data-vt-brain-part="evidence-diagnostics" className="grid gap-2 border-t-[2px] border-black p-2.5">
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
  </details>
 )
}

export const UserMessage: React.FC<{ text: string }> = ({ text }) => (
 <article data-vt-brain-component="UserMessage" className="grid min-h-[68px] w-full shrink-0 grid-cols-[84px_minmax(0,1fr)] overflow-hidden border-y-[2px] border-black bg-[#36E0F6]">
  <div className="flex items-center border-r-[2px] border-black bg-[#24C8E2] px-3 text-[14px] font-[1000] uppercase tracking-[0.06em]">
   You:
  </div>
  <p className="flex min-w-0 items-center whitespace-pre-wrap px-4 py-3 text-sm font-bold leading-6">
   {sanitizeCreatorFacingBrainCopy(text)}
  </p>
 </article>
)

const CreatorIntakeWizard: React.FC<{
 context: AiBrainContext
 onChange: (context: AiBrainContext) => void
 onSave: () => void
 onDefer: () => void
}> = ({ context, onChange, onSave, onDefer }) => {
 const [questionIndex, setQuestionIndex] = useState(0)
 const update = (key: keyof AiBrainContext, value: string) => onChange({ ...context, [key]: value })
 const question = AI_BRAIN_INTAKE_QUESTIONS[questionIndex]
 const lastQuestion = questionIndex === AI_BRAIN_INTAKE_QUESTIONS.length - 1
 return (
  <section className={`${shellCard} flex h-full min-h-0 flex-col overflow-hidden`}>
   <div className="border-b-[4px] border-black bg-[#3FEE56] px-5 py-4">
    <div className="flex items-center justify-between gap-3">
     <div>
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-black/55">Creator Profile Setup</div>
      <h2 className="mt-1 text-2xl font-[1000] uppercase leading-none sm:text-3xl">Help ViewTube Understand Your Channel</h2>
     </div>
     <span className="rounded-[8px] border-[2px] border-black bg-white px-3 py-1 text-xs font-black">
      {questionIndex + 1} / {AI_BRAIN_INTAKE_QUESTIONS.length}
     </span>
    </div>
   </div>
   <div className="grid min-h-0 flex-1 place-items-center p-4 sm:p-6">
    <label key={question.id} className={`${innerCard} block w-full max-w-4xl overflow-hidden`}>
     <span className="block border-b-[2px] border-black px-4 py-3" style={{ backgroundColor: TOOLBOX_PALETTE[(questionIndex + 2) % TOOLBOX_PALETTE.length] }}>
      <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-black/55">{question.label}</span>
      <span className="mt-1 block text-lg font-[1000] leading-6">{question.prompt}</span>
     </span>
     <textarea
      value={String(context[question.id] || "")}
      onChange={(event) => update(question.id, event.target.value)}
      placeholder={question.placeholder}
      className="h-[clamp(150px,28vh,250px)] w-full resize-none border-0 bg-white p-4 text-base font-bold leading-7 outline-none focus:bg-[#FFDA47]/20"
     />
    </label>
   </div>
   <div className="border-t-[4px] border-black bg-[#f8f8f4] p-4">
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
     <p className="text-sm font-bold leading-6 text-black/70">
      Answer what you know now. You can skip and continue later.
     </p>
     <button type="button" onClick={onDefer} className={`${kpiButton} justify-center`}>
      Skip for now
     </button>
     <button
      type="button"
      onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))}
      disabled={questionIndex === 0}
      className={`${kpiButton} justify-center disabled:opacity-40`}
     >
      <ChevronLeft size={14} /> Previous
     </button>
     <button
      type="button"
      onClick={() => lastQuestion ? onSave() : setQuestionIndex((index) => Math.min(AI_BRAIN_INTAKE_QUESTIONS.length - 1, index + 1))}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] border-[2px] border-black bg-[#3FEE56] px-4 py-3 text-[11px] font-black uppercase tracking-[0.1em] shadow-[3px_3px_0_0_#000]"
     >
      {lastQuestion ? "Save Creator Profile" : "Next Question"}
      <ArrowRight size={15} />
     </button>
    </div>
   </div>
  </section>
 )
}

const AIBrainCommandInterface: React.FC = () => {
 const location = useLocation()
 const navigate = useNavigate()
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
 const composerRef = useRef<HTMLTextAreaElement | null>(null)
 const promptLauncherRef = useRef<HTMLButtonElement | null>(null)
 const contextLauncherRef = useRef<HTMLButtonElement | null>(null)
 const promptCloseRef = useRef<HTMLButtonElement | null>(null)
 const contextCloseRef = useRef<HTMLButtonElement | null>(null)
 const bottomRef = useRef<HTMLDivElement | null>(null)
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
    { id: `${turn.id}-user`, role: "user" as const, text: turn.userText },
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

 // Keep the newest exchange in view as the thread grows.
 useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
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

 const handleCorrectContextItem = (id: string, statement: string) => {
  setInput(`Correct this AI Brain context item ${id}. Current statement: "${statement}". Ask me to confirm the correction, then route the updated preference/fact through the existing learning governance path. Do not silently replace the existing record.`)
  composerRef.current?.focus()
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
  if (!userText.trim() || busy) return
  if (shouldShowAiBrainIntake(authState.isAuthenticated)) {
   setIntakeContext(loadAiBrainContext())
   setIntakeOpen(true)
   return
  }
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
    { id: result.turn.id, role: "model", text: result.turn.assistantText, response: result.response, handoff: null, originalUserText: result.turn.rawUserMessage ?? userText, evidencePack: turnSnapshot.evidencePack, readiness: readinessForSnapshot(turnSnapshot), contextUsed: result.turn.metadata?.creatorContextSnapshot as BrainCreatorContextSnapshot | undefined },
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
   setBusy(false)
  }
 }

 const handleRetryInterruptedTurn = (message: ChatMessage, useFreshEvidence: boolean) => {
  const userText = message.originalUserText || ""
  if (!userText.trim() || busy || message.turnStatus !== "interrupted") return

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
  <main className="h-full min-h-0 overflow-y-auto overscroll-contain bg-[#f3f4f6] text-black xl:overflow-hidden">
   <Toolbox
    title="ViewTube Brain Hub"
    subtitle="One assistant for channel strategy, analytics, goals, content planning, SEO, and publishing."
    icon={<Brain />}
    paletteIndex={5}
    collapsible={false}
    indicator="none"
    embedded
    outerClassName="min-h-full max-xl:!h-auto xl:h-full"
    contentClassName="min-h-0 overflow-visible bg-[#f3f4f6] max-xl:!h-auto xl:overflow-hidden"
   >
    {intakeOpen ? (
     <CreatorIntakeWizard
      context={intakeContext}
      onChange={setIntakeContext}
      onSave={handleSaveIntake}
      onDefer={handleDeferIntake}
     />
    ) : (
     <section className="relative flex min-h-0 flex-col max-xl:h-auto max-xl:overflow-visible xl:h-full xl:overflow-hidden">
      <div className="shrink-0 bg-[#f3f4f6]">
       <BrainRuntimePanel snapshot={runtimeSnapshot} embedded />
      </div>
      <div className="grid min-h-0 gap-3 bg-[#f3f4f6] max-xl:min-h-[70dvh] max-xl:px-0 max-xl:pb-0 max-xl:pt-1 xl:flex-1 xl:px-3 xl:pb-3 xl:pt-3 xl:grid-cols-[64px_minmax(0,1.45fr)_minmax(320px,1fr)] 2xl:grid-cols-[180px_minmax(0,1.45fr)_minmax(320px,1fr)]">
       <div className="hidden min-h-0 overflow-y-auto xl:block"><BrainWorkspaceNavigation /></div>
      <div className={`${innerCard} flex min-h-0 flex-col overflow-hidden max-xl:min-h-[70dvh] max-xl:overflow-visible max-xl:rounded-none max-xl:border-x-0 max-xl:border-b-0`}>
        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] bg-white max-xl:min-h-[420px]">
         <BrainContextStrip
          channelLabel={authState.channelName || authState.channelHandle || channelId || "not connected"}
          projectLabel={projectContextCleared ? "none" : brain.projects.find((project) => project.id === brain.activeProjectId)?.name || brain.projects.find((project) => project.status === "active")?.name || "none"}
          contentBuildId={projectContextCleared ? null : brain.projects.find((project) => project.id === brain.activeProjectId)?.contentBuildId || brain.projects.find((project) => project.status === "active")?.contentBuildId || (typeof surfaceSelection?.context?.contentBuildId === "string" ? surfaceSelection.context.contentBuildId : null)}
          selection={surfaceSelection}
          onClearSelection={handleClearSurfaceSelection}
          onToggleLock={handleToggleSurfaceSelectionLock}
          onClearProject={handleClearActiveProject}
         />
         {!hydrated && messages.length === 0 ? (
          <div className="min-h-0 flex-1" aria-hidden="true" />
         ) : messages.length === 0 ? (
          <OpeningBriefing snapshot={snapshot} onPrompt={(prompt) => { void handleSend(prompt) }} />
         ) : (
          <div className="brain-chat-scrollbar flex min-h-0 w-full flex-1 flex-col gap-2 overscroll-contain max-xl:overflow-visible xl:overflow-y-auto" aria-label="Brain conversation" aria-live="polite" role="log" tabIndex={0}>
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
           <div ref={bottomRef} aria-hidden="true" />
          </div>
         )}
        </div>

        <footer data-vt-brain-component="BrainComposer" className="shrink-0 border-t-[2px] border-black bg-[#f8f8f4] p-2">
         <div className="mx-auto w-full max-w-[880px]">
          <div className="mb-1.5 grid grid-cols-2 gap-1 xl:hidden">
           <StudioSplitLeftButton ref={promptLauncherRef} sizeVariant="standard" icon={<LayoutGrid aria-hidden="true" />} onClick={() => setPromptRailOpen(true)} aria-label="Open prompt library" className="min-w-0 xl:hidden" style={{ backgroundColor: "#FF7AC8" }}>Prompt Library</StudioSplitLeftButton>
           <StudioSplitLeftButton ref={contextLauncherRef} sizeVariant="standard" icon={<PanelRight aria-hidden="true" />} onClick={() => setContextRailOpen(true)} aria-label="Open channel context" className="min-w-0 xl:hidden" style={{ backgroundColor: "#3FEE56" }}>Channel Context</StudioSplitLeftButton>
          </div>
          <div data-vt-brain-part="composer-controls" className="flex min-w-0 items-stretch gap-1">
           <StudioSquareIconButton sizeVariant="standard" iconSizeVariant="large" icon={<BookOpen aria-hidden="true" />} label="Open AI Journal" title="Open AI Journal" onClick={() => setJournalOpen(true)} className="shrink-0" style={{ backgroundColor: "#36E0F6" }} />
           <label data-vt-brain-part="composer-label" className="sr-only" htmlFor="brain-composer">Ask ViewTube Copilot</label>
           <span data-vt-brain-part="composer-help" id="brain-composer-help" className="sr-only">Press Enter to send; use Shift+Enter for a new line. Search prompts or browse capabilities for guided requests.</span>
           <span data-vt-brain-part="composer-status" className="sr-only" role="status" aria-live="polite">{busy ? "Brain is preparing a response." : ""}</span>
           <StudioTextArea
            ref={composerRef}
            id="brain-composer"
            sizeVariant="standard"
            rows={1}
            value={input}
            onChange={(event) => {
             event.currentTarget.style.height = "auto"
             event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 144)}px`
             setInput(event.target.value)
            }}
            onKeyDown={(event) => {
             if (!shouldSendBrainComposerKey({ key: event.key, isComposing: event.nativeEvent.isComposing, shiftKey: event.shiftKey })) return
             event.preventDefault()
             void handleSend()
            }}
            placeholder="Ask about your next video, audience, analytics, goals, thumbnails, SEO, publishing, or revenue..."
            className="max-h-36 min-h-[92px] min-w-0 flex-1 resize-y"
            aria-label="Ask ViewTube Brain"
            aria-describedby="brain-composer-help"
           />
           <button data-vt-brain-component="BrainComposerSendAction" type="button" onClick={() => void handleSend()} disabled={busy || !input.trim()} aria-label={busy ? "Sending message" : "Send message"} className="inline-flex min-h-[52px] w-[74px] shrink-0 items-center justify-center gap-1 rounded-[9px] border-[2px] border-black bg-[#3FEE56] text-xs font-black uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-black disabled:opacity-50">
            {busy ? <Zap className="animate-pulse" size={16} /> : <Send size={16} />} Send
           </button>
          </div>
         </div>
        </footer>
       </div>

       <div className="hidden min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden xl:grid">
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden" aria-label="Brain launchpad">
         <div data-vt-brain-component="BrainLauncherModeSwitch" className="grid grid-cols-2 gap-1 border-[2px] border-black bg-[#f8f8f4] p-1">
          <StudioSplitLeftButton sizeVariant="standard" icon={<LayoutGrid aria-hidden="true" />} aria-pressed={launcherMode === "prompts"} onClick={() => setLauncherMode("prompts")} className="min-w-0" style={{ backgroundColor: launcherMode === "prompts" ? "#FF7AC8" : "#ffffff" }}>Prompt Library</StudioSplitLeftButton>
          <StudioSplitLeftButton sizeVariant="standard" icon={<Zap aria-hidden="true" />} aria-pressed={launcherMode === "capabilities"} onClick={() => setLauncherMode("capabilities")} className="min-w-0" style={{ backgroundColor: launcherMode === "capabilities" ? "#36E0F6" : "#ffffff" }}>Capabilities</StudioSplitLeftButton>
         </div>
         <div className="min-h-0 overflow-y-auto pt-2">
          {launcherMode === "prompts" ? <BrainPromptLibrary
           cards={promptCards}
           busy={busy}
           onPrompt={(prompt) => void handleSend(prompt)}
           onEdit={(prompt) => { setInput(prompt); composerRef.current?.focus() }}
          /> : <BrainCapabilityBrowser
           snapshot={snapshot}
           controls={brainControls}
           busy={busy}
           onPrompt={(prompt) => void handleSend(prompt)}
           onEdit={(prompt) => { setInput(prompt); composerRef.current?.focus() }}
          />}
         </div>
        </div>
        <div className="min-h-0 overflow-hidden" aria-label="Channel context">
         <BrainContextRail
          channelId={authState.channelId || null}
          snapshot={snapshot}
          growthContext={creatorGrowthContext}
          insights={railInsights}
          questions={learningQuestions}
          responseQuestions={latestResponseQuestions}
          quickActions={quickActions}
          onAskInsight={handleAskInsight}
          onAcceptQuickAction={handleAcceptQuickAction}
          onAnswerQuestion={handleAnswerQuestion}
          onEditPrompt={(prompt) => { setInput(prompt); composerRef.current?.focus() }}
          compactGrid
         />
        </div>
       </div>
      </div>

      {promptRailOpen ? (
       <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="brain-prompt-library-dialog-title"
        className="absolute inset-0 z-40 grid min-h-0 grid-rows-[auto_1fr] bg-white p-3 xl:hidden"
       >
        <div data-vt-brain-part="mobile-launcher-heading" className="mb-2 grid gap-2 border-b-[2px] border-black pb-2">
         <div className="flex items-center justify-between gap-2">
          <h2 data-vt-brain-part="mobile-launcher-title" id="brain-prompt-library-dialog-title" className="text-lg font-[1000] uppercase">Brain Launchpad</h2>
          <button ref={promptCloseRef} type="button" className={kpiButton} onClick={() => setPromptRailOpen(false)}>
           <X size={14} aria-hidden="true" /> Close
          </button>
         </div>
         <div className="grid grid-cols-2 gap-1">
          <button type="button" aria-pressed={launcherMode === "prompts"} onClick={() => setLauncherMode("prompts")} className={`min-h-11 rounded-[6px] border-[2px] border-black px-2 text-[10px] font-black uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-black ${launcherMode === "prompts" ? "bg-[#FF7AC8]" : "bg-white"}`}>Prompt Library</button>
          <button type="button" aria-pressed={launcherMode === "capabilities"} onClick={() => setLauncherMode("capabilities")} className={`min-h-11 rounded-[6px] border-[2px] border-black px-2 text-[10px] font-black uppercase outline-none focus-visible:ring-[3px] focus-visible:ring-black ${launcherMode === "capabilities" ? "bg-[#36E0F6]" : "bg-white"}`}>Capabilities</button>
         </div>
        </div>
        <div className="vt-scrollless min-h-0 overflow-y-auto overscroll-contain" aria-label="Brain launchpad content" tabIndex={0}>
         {launcherMode === "prompts" ? <BrainPromptLibrary
          cards={promptCards}
          busy={busy}
          headingId="brain-prompt-library-drawer-title"
          onPrompt={(prompt) => { setPromptRailOpen(false); void handleSend(prompt) }}
          onEdit={(prompt) => { setPromptRailOpen(false); setInput(prompt); composerRef.current?.focus() }}
         /> : <BrainCapabilityBrowser
          snapshot={snapshot}
          controls={brainControls}
          busy={busy}
          headingId="brain-capability-browser-drawer-title"
          onPrompt={(prompt) => { setPromptRailOpen(false); void handleSend(prompt) }}
          onEdit={(prompt) => { setPromptRailOpen(false); setInput(prompt); composerRef.current?.focus() }}
         />}
        </div>
       </div>
      ) : null}

      {contextRailOpen ? (
       <div role="dialog" aria-modal="true" aria-labelledby="brain-context-dialog-title" className="absolute inset-0 z-40 grid min-h-0 grid-rows-[auto_1fr] bg-white p-3 xl:hidden">
        <div className="mb-2 flex items-center justify-between border-b-[2px] border-black pb-2">
         <h2 data-vt-brain-part="mobile-context-title" id="brain-context-dialog-title" className="text-lg font-[1000] uppercase">Your Channel Context</h2>
         <button ref={contextCloseRef} type="button" className={kpiButton} onClick={() => setContextRailOpen(false)}><X size={14} aria-hidden="true" /> Close</button>
        </div>
        <div className="vt-scrollless min-h-0 overflow-y-auto overscroll-contain" aria-label="Channel context" tabIndex={0}>
         <BrainContextRail channelId={authState.channelId || null} snapshot={snapshot} growthContext={creatorGrowthContext} insights={railInsights} questions={learningQuestions} responseQuestions={latestResponseQuestions} quickActions={quickActions} onAskInsight={handleAskInsight} onAcceptQuickAction={handleAcceptQuickAction} onAnswerQuestion={handleAnswerQuestion} onEditPrompt={(prompt) => { setContextRailOpen(false); setInput(prompt); composerRef.current?.focus() }} />
        </div>
       </div>
      ) : null}

      {journalOpen ? (
       <div className="absolute inset-0 z-50 grid place-items-center bg-black/40 p-4">
        <section className={`${shellCard} w-full max-w-2xl overflow-hidden`}>
         <div data-vt-brain-part="journal-dialog-heading" className="border-b-[2px] border-black bg-[#36E0F6] px-4 py-3"><h2 className="text-xl font-[1000] uppercase">Save To AI Journal</h2></div>
         <div className="grid gap-3 p-4">
          <StudioTextArea data-vt-brain-part="journal-entry-input" value={journalInput} onChange={(event) => setJournalInput(event.target.value)} sizeVariant="standard" rows={4} placeholder="A goal, content style note, audience insight, constraint, or decision you want the Brain to remember." className="min-h-[92px] resize-none" />
          <div data-vt-brain-part="journal-dialog-actions" className="flex justify-end gap-1">
           <button type="button" className={kpiButton} onClick={() => setJournalOpen(false)}>Cancel</button>
           <button type="button" className={`${kpiButton} bg-[#3FEE56]`} disabled={!journalInput.trim()} onClick={() => { handleJournalSave(); setJournalOpen(false) }}>Remember this</button>
          </div>
         </div>
        </section>
       </div>
      ) : null}
     </section>
    )}
   </Toolbox>
  </main>
 )
}

export default AIBrainCommandInterface
