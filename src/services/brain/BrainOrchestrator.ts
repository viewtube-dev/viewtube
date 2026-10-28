import type {
 AIBrainAnswerModule,
 AIBrainConversationTurn,
 BrainAnswerEvaluation,
 BrainFallbackReason,
 BrainGenerationPath,
 BrainOrchestratorResult,
 BrainRepairOutcome,
 BrainResponseCitation,
 CreatorBrainLearningQuestion,
 CreatorBrainResponse,
 CreatorGrowthContext,
 NicheKnowledgeProfile,
 Project,
} from "../../types"
import {
 buildCreatorBrainLocalFallback,
 formatCreatorBrainResponse,
 type AIBrainContextSnapshot,
} from "../aiBrainCommandInterface"
import {
 beginAIBrainTurn,
 retryAIBrainTurn,
 completeAIBrainTurn,
 recordAIBrainTurnInteraction,
 formatCreatorGrowthModules,
 sanitizeCreatorFacingBrainCopy,
} from "../aiBrainConversationStore"
import { captureAIBrainLearningEvent } from "../aiBrainSelfImprovement"
import {
 getActiveModel,
 groundCurrentNicheResearch,
 type StructuredBrainModelOutput,
} from "../gemini"
import { defaultBrainModelGateway, type BrainModelGateway } from "./runtime/BrainModelGateway"
import { buildBrainContextPack } from "./BrainContextBroker"
import { brainKnowledgeStatusFromConfirmation } from "./BrainContextPresentation"
import { beginBrainTrace } from "./BrainTrace"
import {
 inferBrainIntent,
 selectBrainCapabilities,
 shouldUseCurrentGrounding,
} from "./BrainCapabilityRegistry"
import { resolveBrainTaskProfile } from "./BrainTaskProfileRegistry"
import { BRAIN_CONTEXT_RESOLVER_VERSION } from "./BrainContextResolution"
import type { CanonicalIntelligenceEvidenceBundle } from "../analytics-canon"
import { resolveEvidenceIntelligence, type EvidenceIntelligenceEnvelope } from "./EvidenceIntelligenceResolver"
import { buildBrainEvidenceRecordQuality } from "./BrainEvidenceQuality"
import { fingerprintBrainEvidenceRecords } from "./BrainEvidenceQuality"
import { getEvidenceRecordsActuallyRendered, selectEvidenceRecordsForPrompt, type EvidenceRecord } from "./EvidenceRecord"
import { collectKnownNumbers, parseNumericToken } from "./numericClaims"
import { readAlgorithmIntelligenceForBrain } from "./AlgorithmIntelligenceAccess"
import { readBrainEngineControls } from "./BrainEngineControls"
import { resolveCreatorContext } from "./CreatorContextResolver"
import { loadAiBrainContext } from "../aiBrainContext"
import { buildCreatorAnswerEvidenceRecords, isCreatorAnswerProfileEligible } from "./CreatorAnswerEvidence"
import { readBrainSurfaceSelection } from "./BrainSurfaceSelection"
import { resolveBrainRetryInput, resolveBrainModelInputSnapshot, type BrainGenerationInputSnapshot, type BrainModelInputSnapshot, type BrainRetryContextContinuity } from "./BrainRetryContinuity"
import {
 cacheCurrentNicheResearch,
 readCachedCurrentNicheResearch,
 resolveNicheKnowledge,
} from "./NicheKnowledge"

const makeId = (prefix: string): string => {
 const random = typeof crypto !== "undefined" && "randomUUID" in crypto
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2)}`
 return `${prefix}_${random}`
}

const words = (value: string): Set<string> => new Set(
 value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((word) => word.length > 3),
)

const similarity = (left: string, right: string): number => {
 const a = words(left)
 const b = words(right)
 if (!a.size || !b.size) return 0
 const intersection = Array.from(a).filter((word) => b.has(word)).length
 return intersection / new Set([...a, ...b]).size
}

const responseText = (response: CreatorBrainResponse): string => [
 response.headline,
 response.keyInsight,
 response.body,
 ...(response.modules || []).flatMap((module) => [
  module.title,
  module.body,
  // Scan the model's claimed figures (metrics/trend points) so invented numbers are
  // caught. Ranked-item details are derived from the evidence pack and already
  // reformatted (e.g. "480K"), so scanning them would false-positive on grounded data.
  ...(module.data?.metrics || []).flatMap((metric) => [metric.displayValue || "", metric.value != null ? String(metric.value) : ""]),
  ...(module.data?.points || []).map((point) => (point.value != null ? String(point.value) : "")),
 ]),
 ...response.actions,
].join(" ")

const unsupportedNumbers = (
 response: CreatorBrainResponse,
 snapshot: AIBrainContextSnapshot,
): string[] => {
 const known = JSON.stringify({
  channel: snapshot.channel,
  profile: snapshot.inferredProfile,
  evidence: snapshot.evidencePack,
 }).replace(/,/g, "")
 const matches = responseText(response).match(/\b\d[\d,]*(?:\.\d+)?%?(?![\w])/g) || []
 return Array.from(new Set(matches.filter((value) => {
  const normalized = value.replace(/,/g, "")
  if (["1", "2", "3", "4", "5", "7", "30", "60", "90"].includes(normalized)) return false
  return !known.includes(normalized)
 })))
}

export const validateBrainResponse = (input: {
 response: CreatorBrainResponse
 snapshot: AIBrainContextSnapshot
 recentTurns?: AIBrainConversationTurn[]
 growthContext?: CreatorGrowthContext | null
 expectedMode?: CreatorBrainResponse["mode"]
}): BrainAnswerEvaluation => {
 const text = responseText(input.response).toLowerCase()
 const evidenceTerms = [
  input.snapshot.inferredProfile.niche || "",
  ...input.snapshot.inferredProfile.contentPillars,
  ...input.snapshot.inferredProfile.topicClusters,
  ...input.snapshot.inferredProfile.topEvidenceVideos.slice(0, 4).map((video) => video.title),
 ].flatMap((value) => Array.from(words(value)))
 const specificityHits = evidenceTerms.filter((term) => text.includes(term)).length
 // Content drafts (pinned comments, titles, descriptions, video concepts) are fresh
 // creative copy: they should not be held to analytics-grade evidence-echoing, are
 // allowed to contain numbers (years, "top 5") that aren't in the analytics pack, and
 // deliver the asset itself rather than an action verb. Holding them to those rules is
 // what wrongly downgraded good model drafts to "basic guidance".
 const isContentDraft = input.expectedMode === "creator_asset_draft"
 const creatorSpecificity = isContentDraft
  ? 80
  : input.snapshot.inferredProfile.status === "missing"
   ? 60
   : Math.min(100, 35 + specificityHits * 15)
 const evidenceCoverage = input.snapshot.evidencePack.evidenceIds.length === 0
  ? 65
  : Math.min(100, 40 + specificityHits * 12)
 const goal = input.growthContext?.currentGoal || input.snapshot.brain.futureStateMap
 const goalTerms = Array.from(words(goal || ""))
 const goalAlignment = !goalTerms.length ? 65 : goalTerms.some((term) => text.includes(term)) ? 95 : 50
 const actionability = isContentDraft || /\b(create|publish|rewrite|test|compare|open|draft|review|choose|make|schedule|measure|use|build)\b/.test(text)
  ? 90
  : 35
 const recent = (input.recentTurns || []).slice(0, 4)
 const similar = recent
  .map((turn) => ({ id: turn.id, score: similarity(text, turn.assistantText || turn.response?.keyInsight || "") }))
  .filter((item) => item.score >= 0.68)
 const novelty = Math.max(0, Math.round(100 - (similar[0]?.score || 0) * 100))
 const invented = unsupportedNumbers(input.response, input.snapshot)
 const modeMatches = !input.expectedMode || input.response.mode === input.expectedMode
 const answerContent = [
  input.response.keyInsight,
  input.response.body,
  ...(input.response.modules || []).flatMap((module) => [module.title, module.body]),
  ...input.response.actions,
 ].join(" ").toLowerCase()
 const audienceTaskAnswered = input.expectedMode !== "audience_insight" || (
  /\b(audience|viewers?|subscribers?)\b/.test(answerContent)
  && /\b(care|value|interest|want|choose|watch|return|request|payoff)\w*\b/.test(answerContent)
  && /\b(language|words?|phrases?|wording|search terms?|titles?|hooks?)\b/.test(answerContent)
  && /\b(direct|infer\w*|evidence|comments?|transcripts?|search behavior|missing|available)\b/.test(answerContent)
 )
 const average = (creatorSpecificity + evidenceCoverage + goalAlignment + actionability + novelty) / 5
 const repairReasons = [
  creatorSpecificity < 55 ? "Answer does not use available channel-specific evidence." : "",
  actionability < 55 ? "Answer lacks a concrete creator action." : "",
  novelty < 35 ? "Answer is too similar to a recent response." : "",
  !isContentDraft && invented.length ? "Answer contains numbers that are not present in the evidence pack." : "",
  !modeMatches ? `Answer mode ${input.response.mode} does not match the requested ${input.expectedMode} task.` : "",
  !audienceTaskAnswered ? "Answer the audience-language task with an audience finding, concrete language guidance, and an evidence boundary." : "",
 ].filter(Boolean)
 return {
  id: makeId("brain_answer_evaluation"),
  createdAt: new Date().toISOString(),
  scores: { creatorSpecificity, evidenceCoverage, goalAlignment, actionability, novelty },
  passed: average >= 58 && repairReasons.length === 0,
  repairReasons,
  unsupportedNumbers: invented,
  similarTurnIds: similar.map((item) => item.id),
 }
}

const validTone = (value: string): AIBrainAnswerModule["tone"] =>
 (["green", "yellow", "pink", "blue", "orange", "white"] as const).includes(value as any)
  ? value as AIBrainAnswerModule["tone"]
  : "white"

const numOrNull = (value: unknown): number | null =>
 typeof value === "number" && Number.isFinite(value) ? value : null

/**
 * Keep only well-formed, string-sanitized structured data from the model. Numbers
 * pass through as numbers; the unsupported-number guard (see responseText) then
 * rejects any figure not present in the evidence pack, so invented metrics fail
 * validation and trigger repair rather than reaching the creator.
 */
const sanitizeModuleData = (
 data: StructuredBrainModelOutput["modules"][number]["data"],
): AIBrainAnswerModule["data"] | undefined => {
 if (!data || typeof data !== "object") return undefined
 const metrics = (data.metrics || [])
  .slice(0, 3)
  .map((metric) => ({
   label: sanitizeCreatorFacingBrainCopy(metric.label || ""),
   value: numOrNull(metric.value),
   displayValue: metric.displayValue ? sanitizeCreatorFacingBrainCopy(metric.displayValue) : undefined,
   change: numOrNull(metric.change),
  }))
  .filter((metric) => metric.label)
 const points = (data.points || [])
  .slice(0, 24)
  .map((point) => ({ label: sanitizeCreatorFacingBrainCopy(point.label || ""), value: numOrNull(point.value) }))
  .filter((point) => point.label)
 const items = (data.items || [])
  .slice(0, 5)
  .map((item) => ({
   title: sanitizeCreatorFacingBrainCopy(item.title || ""),
   detail: item.detail ? sanitizeCreatorFacingBrainCopy(item.detail) : undefined,
   score: numOrNull(item.score),
   status: item.status ? sanitizeCreatorFacingBrainCopy(item.status) : undefined,
  }))
  .filter((item) => item.title)
 if (!metrics.length && !points.length && !items.length) return undefined
 return {
  ...(metrics.length ? { metrics } : {}),
  ...(points.length ? { points } : {}),
  ...(items.length ? { items } : {}),
 }
}

export const fromStructuredOutput = (
 output: StructuredBrainModelOutput,
 snapshot: AIBrainContextSnapshot,
 allowedEvidenceRecords: EvidenceRecord[] = [],
): CreatorBrainResponse => {
 const normalizeClaim = (value: string): string =>
  sanitizeCreatorFacingBrainCopy(value).trim().replace(/\s+/g, " ").toLowerCase()
 const responseClaimCorpus = [
  sanitizeCreatorFacingBrainCopy(output.headline || ""),
  sanitizeCreatorFacingBrainCopy(output.keyInsight || ""),
  sanitizeCreatorFacingBrainCopy(output.body || "").slice(0, 1200),
  ...(output.modules || []).slice(0, 4).flatMap((module) => [
   sanitizeCreatorFacingBrainCopy(module.title || ""),
   sanitizeCreatorFacingBrainCopy(module.body || "").slice(0, 360),
  ]),
  ...(output.actions || []).slice(0, 4).map(sanitizeCreatorFacingBrainCopy),
 ].join("\n")
 const normalizedResponseCorpus = normalizeClaim(responseClaimCorpus)
 const allowedEvidence = new Map(allowedEvidenceRecords.map((record) => [record.id, record]))
 const claimCandidates = Array.isArray(output.claimEvidence) ? output.claimEvidence.slice(0, 12) : []
 const claimEvidence = claimCandidates.flatMap((item) => {
  const claim = sanitizeCreatorFacingBrainCopy(typeof item?.claim === "string" ? item.claim : "").trim()
  const normalizedClaim = normalizeClaim(claim)
  if (!claim || claim.length > 320 || !normalizedClaim || !normalizedResponseCorpus.includes(normalizedClaim)) return []
  const candidateEvidenceIds = Array.isArray(item?.evidenceIds) ? item.evidenceIds : []
  const evidenceIds = Array.from(new Set(candidateEvidenceIds.filter(
   (id): id is string => typeof id === "string" && allowedEvidence.has(id),
  ))).slice(0, 8)
  const numericTokens = claim.match(/-?\d[\d,]*(?:\.\d+)?\s?[KkMmBb]?%?/g) || []
  const numericClaims = numericTokens.map((raw) => {
   const token = raw.trim()
   const sign = token.startsWith("-") ? -1 : 1
   const parsed = parseNumericToken(token.replace(/^-/, ""))
   return parsed ? { ...parsed, value: parsed.value * sign } : null
  }).filter((token) => token !== null)
  if (!evidenceIds.length || !numericClaims.length) return []
  const directlyMatchingIds = evidenceIds.filter((id) => {
   const value = allowedEvidence.get(id)?.value
   const knownValues = collectKnownNumbers(value)
   return knownValues.size > 0 && numericClaims.some((token) =>
    Array.from(knownValues).some((known) => Math.abs(known - token!.value) <= token!.tolerance),
   )
  })
  const everyNumberMatches = numericClaims.every((token) =>
   directlyMatchingIds.some((id) => {
    const knownValues = collectKnownNumbers(allowedEvidence.get(id)?.value)
    return Array.from(knownValues).some((known) => Math.abs(known - token!.value) <= token!.tolerance)
   }),
  )
  if (!everyNumberMatches) return []
  return [{ claim, evidenceIds: directlyMatchingIds, verification: "direct_value_match" as const }]
 })
 const allowedModes: CreatorBrainResponse["mode"][] = [
  "strategy_brief", "analytics_diagnosis", "seo_keyword_plan", "video_idea_sprint",
  "journal_reflection", "goal_coach", "publishing_checklist", "revenue_levers", "creator_asset_draft", "audience_insight",
 ]
 const mode = allowedModes.includes(output.mode) ? output.mode : "strategy_brief"
 const question: CreatorBrainLearningQuestion[] = output.question?.trim() ? [{
  id: makeId("brain_question"),
  question: sanitizeCreatorFacingBrainCopy(output.question),
  reason: "Your answer will help the Brain rank the next recommendation.",
  category: "creator_goal",
  confidence: "medium",
 }] : []
 const modules: AIBrainAnswerModule[] = (output.modules || []).slice(0, 4).map((module, index) => ({
  id: `brain_module_${index}_${makeId("item")}`,
  title: sanitizeCreatorFacingBrainCopy(module.title),
  body: sanitizeCreatorFacingBrainCopy(module.body).slice(0, 360),
  tone: validTone(module.tone),
  kind: module.kind as AIBrainAnswerModule["kind"],
  source: inferBrainIntent(output.body) === "analytics" ? "analytics" : "growth",
  data: sanitizeModuleData(module.data),
 }))
 return {
  id: makeId("creator_brain_response"),
  mode,
  body: sanitizeCreatorFacingBrainCopy(output.body).slice(0, 1200),
  evidenceIds: snapshot.evidencePack.evidenceIds.slice(0, 10),
  ...(claimEvidence.length ? { claimEvidence } : {}),
  headline: sanitizeCreatorFacingBrainCopy(output.headline),
  keyInsight: sanitizeCreatorFacingBrainCopy(output.keyInsight),
  evidenceChips: [],
  modules,
  actions: (output.actions || []).map(sanitizeCreatorFacingBrainCopy).slice(0, 4),
  learningSummary: "",
  questions: question.slice(0, 1),
  confidence: snapshot.inferredProfile.status === "ready" ? "high" : "medium",
 }
}

const buildFallback = (
 userText: string,
 snapshot: AIBrainContextSnapshot,
 growthContext: CreatorGrowthContext,
): CreatorBrainResponse => {
 const text = buildCreatorBrainLocalFallback(userText, snapshot)
 const response = formatCreatorBrainResponse(text, snapshot, { requestText: userText })
 return { ...response, modules: formatCreatorGrowthModules(response, growthContext, userText) }
}

const withTimeout = async <T>(promise: Promise<T>, milliseconds: number): Promise<T> =>
 Promise.race([
  promise,
  new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Brain response timed out")), milliseconds)),
 ])

export const BRAIN_MODEL_TIMEOUT_MS = 30_000
export const BRAIN_REPAIR_TIMEOUT_MS = 20_000
export const BRAIN_PROMPT_VERSION = "brain-orchestrator-v2"
export const BRAIN_OUTPUT_SCHEMA_VERSION = "structured-brain-output-v1"

export interface RunBrainTurnInput {
 channelId?: string | null
 userText: string
 retryTurnId?: string
 retryGenerationOnly?: boolean
 retryEvidenceMode?: "saved" | "fresh"
 promptOrigin?: { promptId: string; promptVersion: string; action: "sent" | "edited" }
 snapshot: AIBrainContextSnapshot
 systemPrompt: string
 growthContext: CreatorGrowthContext
 recentTurns?: AIBrainConversationTurn[]
 history?: any[]
 allowModel?: boolean
 modelGenerator?: BrainModelGateway["generateStructuredResponse"]
 nicheResolver?: typeof resolveNicheKnowledge
 currentResearcher?: typeof groundCurrentNicheResearch
 projectId?: string | null
 project?: Project | null
 projects?: Project[]
 modelContextWindowTokens?: number | null
 reservedOutputTokens?: number
 contextSafetyMarginTokens?: number
 analyticsWindow?: CanonicalIntelligenceEvidenceBundle["selectedWindow"]
 visibleContext?: Record<string, unknown> | null
 artifactRefs?: string[]
}

const buildCreatorAnswerEvidenceChips = (records: EvidenceRecord[]): string[] =>
 records.slice(0, 8).map((record) => {
  const field = record.id
   .replace(/^creator-answer:[^:]+:/, "")
   .replace(/^channelContext\./, "")
   .replace(/^legacy\./, "legacy ")
   .replace(/[._]/g, " ")
  return `Creator profile evidence: ${field} (${record.id})`
 })

export const buildEvidenceProvenanceChips = (evidence: EvidenceIntelligenceEnvelope | null): string[] => {
 if (!evidence) return []
 const quality = evidence.evidenceQuality
 const chips = [
  `Analytics scope: ${quality.scopeMatch}; window: ${quality.selectedWindow}; confidence: ${quality.confidence}`,
  `Evidence coverage: ${Math.round(quality.coverageRatio * 100)}%; snapshot: ${quality.sourceSnapshotId.slice(0, 8)}`,
 ]
 for (const claim of evidence.evidenceClaims.slice(0, 3)) {
  const value = claim.value === null ? "unknown" : String(claim.value)
  const unit = claim.unit ? ` ${claim.unit}` : ""
  const timeframe = claim.timeframe?.start || claim.timeframe?.end
   ? ` · ${claim.timeframe.start || "start unknown"}–${claim.timeframe.end || "end unknown"}`
   : claim.timeframe?.kind ? ` · ${claim.timeframe.kind}` : ""
  chips.push(`${claim.claim}: ${value}${unit} · ${claim.epistemicState.toLowerCase()} · ${claim.freshness} · source ${claim.sourceOwner}${timeframe}`)
 }
 const staleCount = quality.freshness.staleDatasetIds.length
 const missingCount = quality.missingness.unavailableDatasetIds.length
  + quality.missingness.failedDatasetIds.length
  + quality.missingness.omittedDatasetIds.length
 if (staleCount) chips.push(`Stale datasets: ${staleCount}; treat as historical`)
 if (missingCount) chips.push(`Unavailable/omitted datasets: ${missingCount}; missing is not zero`)
 for (const limitation of quality.limitations.slice(0, 2)) chips.push(`Limitation: ${limitation}`)
 return chips.slice(0, 8)
}

export const runBrainTurn = async (input: RunBrainTurnInput): Promise<BrainOrchestratorResult> => {
 const taskProfile = resolveBrainTaskProfile(input.userText)
 // Non-model turns (including allowModel=false fallbacks) must not read browser-only provider settings.
 let requestedModel = input.modelGenerator || input.allowModel === false ? null : getActiveModel("text")
 let servedModel: string | null = null
 let modelIdentityStatus: "served_known" | "requested_known_served_not_exposed" | "generator_identity_unavailable" | "model_disabled" = input.allowModel === false ? "model_disabled" : requestedModel ? "requested_known_served_not_exposed" : "generator_identity_unavailable"
 const generationInputSnapshot: BrainGenerationInputSnapshot<AIBrainContextSnapshot> = {
  snapshot: input.snapshot,
  systemPrompt: input.systemPrompt,
  growthContext: input.growthContext,
  recentTurns: input.recentTurns || [],
  history: input.history || [],
  projectId: input.projectId || input.project?.id || null,
  project: input.project || null,
  projects: input.projects || [],
  visibleContext: input.visibleContext || null,
  artifactRefs: input.artifactRefs || [],
 }
 const pending = input.retryTurnId
  ? await retryAIBrainTurn(input.retryTurnId, {
    mode: input.retryEvidenceMode || "saved",
    evidenceIds: input.snapshot.evidencePack.evidenceIds,
   })
  : await beginAIBrainTurn({
   channelId: input.channelId,
   userText: input.userText,
   metadata: { source: "brain_orchestrator", ...(input.promptOrigin ? { promptOrigin: input.promptOrigin } : {}), promptVersion: BRAIN_PROMPT_VERSION,
    contextResolverVersion: BRAIN_CONTEXT_RESOLVER_VERSION,
    outputSchemaVersion: BRAIN_OUTPUT_SCHEMA_VERSION,
    requestedModel,
    servedModel,
    modelIdentityStatus,
    evidenceIds: input.snapshot.evidencePack.evidenceIds.slice(0, 50),
    evidenceRequestSpec: input.snapshot.evidencePack.requestSpec,
    evidencePackSnapshot: input.snapshot.evidencePack,
    dataReadinessSnapshot: {
     dataStatus: input.snapshot.evidencePack.dataStatus,
     capturedAt: input.snapshot.vtSync.capturedAt,
     availableMetrics: input.snapshot.evidencePack.availableMetrics,
     missingInputs: input.snapshot.evidencePack.missingInputs,
     sourceStatuses: input.snapshot.sourceStatuses,
     diagnostics: {
      status: input.snapshot.vtSync.diagnostics.status,
      coverage: input.snapshot.vtSync.diagnostics.coverage,
      warnings: input.snapshot.vtSync.diagnostics.warnings,
     },
     warnings: input.snapshot.vtSync.warnings,
    },
    generationInputSnapshot,
    interactionLog: [{
     id: makeId("brain_interaction"),
     type: "creator_input",
     direction: "inbound",
     at: new Date().toISOString(),
     text: input.userText,
    }, {
     id: makeId("brain_interaction"),
     type: "evidence_snapshot",
     direction: "inbound",
     at: new Date().toISOString(),
     evidenceIds: input.snapshot.evidencePack.evidenceIds.slice(0, 100),
     evidenceRequestSpec: input.snapshot.evidencePack.requestSpec,
    }],
    channelId: input.channelId || null,
    projectId: input.projectId || input.project?.id || null,
    contentBuildId: input.project?.contentBuildId || null,
    taskProfileId: taskProfile.id },
  })
 let retryContextContinuity: BrainRetryContextContinuity | undefined
 if (input.retryTurnId && input.retryGenerationOnly) {
  const saved = pending.metadata?.generationInputSnapshot as BrainGenerationInputSnapshot<AIBrainContextSnapshot> | undefined
  const current = generationInputSnapshot
  const retryResolution = resolveBrainRetryInput({
   mode: input.retryEvidenceMode || "saved",
   saved,
   current,
  })
  retryContextContinuity = retryResolution.continuity === "original_input_restored"
   && !(pending.metadata?.originalModelInputSnapshot
    && typeof (pending.metadata.originalModelInputSnapshot as { systemInstruction?: unknown }).systemInstruction === "string")
   ? "legacy_context_reconstructed"
   : retryResolution.continuity
  await recordAIBrainTurnInteraction(pending.id, {
   type: "retry_generation_input",
   direction: "inbound",
   detail: {
    retryEvidenceMode: input.retryEvidenceMode || "saved",
    retryContextContinuity,
    generationInputSnapshot: retryResolution.generationInput,
   },
  })
  input = {
   ...input,
   snapshot: retryResolution.generationInput.snapshot,
   systemPrompt: retryResolution.generationInput.systemPrompt,
   growthContext: retryResolution.generationInput.growthContext as CreatorGrowthContext,
   recentTurns: retryResolution.generationInput.recentTurns as AIBrainConversationTurn[] | undefined,
   history: retryResolution.generationInput.history,
   projectId: retryResolution.generationInput.projectId,
   project: retryResolution.generationInput.project as Project | null | undefined,
   projects: retryResolution.generationInput.projects as Project[] | undefined,
   visibleContext: retryResolution.generationInput.visibleContext,
   artifactRefs: retryResolution.generationInput.artifactRefs,
  }
 }
 const capabilities = selectBrainCapabilities({ channelId: input.channelId, userText: input.userText, snapshot: input.snapshot })
 const capabilityIds = capabilities.map((capability) => capability.id)
 const brainIntent = inferBrainIntent(input.userText)
 const engineControls = readBrainEngineControls(input.channelId)
 const wantsStatisticsIntelligence = capabilityIds.includes("statistics-intelligence")
 const wantsAlgorithmIntelligence = capabilityIds.includes("algorithm-intelligence") && engineControls.channelIntelligence
 const evidenceSectionIds = Array.from(new Set([
  ...(wantsStatisticsIntelligence ? ["executive-summary", "strategy-engine"] : []),
  ...(wantsStatisticsIntelligence && brainIntent === "audience"
   ? ["channel-pulse", "comparative-analysis", "keyword-matrix"]
   : []),
  ...(wantsAlgorithmIntelligence ? ["algorithm-diagnosis", "strategy-engine"] : []),
 ]))
 const evidenceIntelligence = wantsStatisticsIntelligence || wantsAlgorithmIntelligence
  ? resolveEvidenceIntelligence({
    channelId: input.channelId,
    window: input.analyticsWindow,
    sectionIds: evidenceSectionIds,
    includeAudience: wantsStatisticsIntelligence && brainIntent === "audience",
    includeOpportunities: wantsAlgorithmIntelligence && engineControls.opportunityIntelligence,
    includeCurrentTrends: wantsStatisticsIntelligence || wantsAlgorithmIntelligence,
    brainEvidencePack: input.snapshot.evidencePack,
   })
  : null
 // Quality accompanies every analytics-backed task, including algorithm/anomaly requests.
 const evidenceQuality = evidenceIntelligence?.evidenceQuality || null
 // Single evidence array for prompt, grade, and turn snapshot — do not re-derive.
 const promptEvidenceRecords = selectEvidenceRecordsForPrompt(evidenceIntelligence?.evidenceRecords || [])
 const evidenceRecordQuality = buildBrainEvidenceRecordQuality(promptEvidenceRecords, { expectedChannelId: input.channelId })
 const statisticsIntelligence = wantsStatisticsIntelligence
  ? evidenceIntelligence?.statisticsIntelligence || null
  : null
 const audienceIntelligence = wantsStatisticsIntelligence
  ? evidenceIntelligence?.audienceIntelligence || null
  : null
 const surfaceSelection = readBrainSurfaceSelection()
 const savedAiBrainContext = loadAiBrainContext(input.channelId, input.snapshot.channel.label)
 const savedChannelContext = savedAiBrainContext.channelContext
 const creatorAnswerEvidenceRecords = isCreatorAnswerProfileEligible({
  // loadAiBrainContext(channelId, label) reads this channel's scoped key first.
  // A scoped profile is bound by the stable channel key; requiring a display name
  // incorrectly discarded valid answers for profiles whose name field is blank.
  channelScoped: Boolean(input.channelId),
  profileName: savedChannelContext.identity.name,
  activeChannelLabel: input.snapshot.channel.label,
 })
  ? buildCreatorAnswerEvidenceRecords(savedAiBrainContext, input.channelId)
  : []
 const creatorContext = await resolveCreatorContext({
  channelId: input.channelId,
  query: input.userText,
  projectId: input.projectId,
  project: input.project,
  projects: input.projects,
  visibleContext: input.visibleContext,
  selection: surfaceSelection,
  artifactRefs: [...(input.artifactRefs || []), ...(surfaceSelection?.evidenceIds || [])],
 }).catch(() => null)
 const creatorContextMetadata = () => ({
  creatorContextVersion: creatorContext?.version || null,
  creatorProfileLoadedAt: creatorContext?.provenance.profileLoadedAt || null,
  creatorSelectionUpdatedAt: creatorContext?.provenance.selectionUpdatedAt || null,
  creatorContextProjectSource: creatorContext?.provenance.projectSource || null,
  creatorStyleProfileAvailable: Boolean(creatorContext?.styleProfile?.descriptor),
  channelKnowledgeRecordIds: (creatorContext?.channelKnowledge?.records || []).map((record) => record.id).slice(0, 50),
  channelKnowledgeConflictIds: (creatorContext?.channelKnowledge?.contradictions || []).map((record) => record.id).slice(0, 50),
  creatorContextSnapshot: {
   version: creatorContext?.version || null,
   channelId: creatorContext?.channelId || null,
   project: creatorContext?.project ? {
    projectId: creatorContext.project.projectId,
    contentBuildId: creatorContext.project.contentBuildId || null,
    title: creatorContext.project.title || null,
    topic: creatorContext.project.topic || null,
    format: creatorContext.project.format || null,
    evidenceIds: creatorContext.project.evidenceIds || [],
    source: creatorContext?.provenance.projectSource || null,
   } : null,
   selection: creatorContext?.selection ? {
    route: creatorContext.selection.route,
    sourceId: creatorContext.selection.sourceId,
    label: creatorContext.selection.label,
    projectId: creatorContext.selection.projectId || null,
    videoId: creatorContext.selection.videoId || null,
    commentId: creatorContext.selection.commentId || null,
    dateRange: creatorContext.selection.dateRange || null,
    evidenceIds: creatorContext.selection.evidenceIds || [],
    updatedAt: creatorContext.selection.updatedAt,
    locked: creatorContext.selection.locked === true,
   } : null,
   profileLoadedAt: creatorContext?.provenance.profileLoadedAt || null,
   styleProfileAvailable: Boolean(creatorContext?.styleProfile?.descriptor),
   styleProfile: creatorContext?.styleProfile?.descriptor ? {
    id: creatorContext.styleProfile.id,
    scope: creatorContext.styleProfile.scope,
    assetType: creatorContext.styleProfile.assetType || null,
    source: creatorContext.styleProfile.source,
    descriptor: creatorContext.styleProfile.descriptor,
    exemplars: (creatorContext.styleProfile.exemplars || []).slice(0, 5).map((exemplar) => ({
     id: exemplar.id,
     sourceRef: exemplar.sourceRef || null,
     text: exemplar.text,
    })),
   } : null,
   knowledgeItems: (creatorContext?.channelKnowledge?.records || []).slice(0, 10).map((record) => ({
    id: record.id,
    statement: record.statement,
    knowledgeClass: record.knowledgeClass,
    lifecycleState: record.lifecycleState,
    confirmationState: record.confirmationState,
    source: record.source,
    sourceId: record.sourceId,
    evidenceRefs: record.evidenceRefs,
    status: brainKnowledgeStatusFromConfirmation(record.confirmationState),
   })),
   conflictIds: (creatorContext?.channelKnowledge?.contradictions || []).map((record) => record.id).slice(0, 10),
   evidenceRefs: creatorContext?.evidenceRefs || [],
   projectSource: creatorContext?.provenance.projectSource || null,
  },
 })
 const opportunityEvidence = evidenceIntelligence?.opportunityEvidence || []
 const algorithmAccess = wantsAlgorithmIntelligence && input.channelId
  ? await readAlgorithmIntelligenceForBrain({
    channelId: input.channelId,
    project: engineControls.algorithmPriming && creatorContext ? creatorContext.project : null,
    includeAnomalies: engineControls.anomalyIntelligence,
    opportunities: opportunityEvidence,
   }).catch(() => null)
  : null
 const algorithmIntelligence = algorithmAccess?.status === "ok" ? algorithmAccess.value : null
 let nicheKnowledge: NicheKnowledgeProfile | null = null
 let currentResearch = ""
 let citations: BrainResponseCitation[] = []
 let context = buildBrainContextPack({
  channelId: input.channelId,
  capabilityIds,
  modelContextWindowTokens: input.modelContextWindowTokens,
  reservedOutputTokens: input.reservedOutputTokens,
  contextSafetyMarginTokens: input.contextSafetyMarginTokens,
  systemPrompt: input.systemPrompt,
  snapshot: input.snapshot,
  recentTurns: input.recentTurns || [],
  userText: input.userText,
  statisticsIntelligence,
  evidenceQuality,
  evidenceRecords: promptEvidenceRecords,
  evidenceRecordQuality: promptEvidenceRecords.length ? evidenceRecordQuality : null,
  evidenceClaims: evidenceIntelligence?.evidenceClaims,
  sharedEvidenceHealth: evidenceIntelligence?.sharedEvidenceHealth,
  analyticsFindingContext: evidenceIntelligence?.analyticsFindingContext,
  audienceIntelligence,
  algorithmIntelligence,
  creatorContext,
  channelContext: savedChannelContext,
  creatorAnswerEvidenceRecords,
 })
 const questionTrace = beginBrainTrace({ kind: "question", channelId: input.channelId || null })
 questionTrace.setIntent({ intent: taskProfile.id, taskProfileId: taskProfile.id })
 questionTrace.recordCapabilities(capabilityIds)
 questionTrace.recordModelIdentity({
  requested: requestedModel,
  served: null,
  status: modelIdentityStatus,
 })
 questionTrace.recordPromptVersion("orchestrator", BRAIN_PROMPT_VERSION)
 questionTrace.recordPromptVersion("contextResolver", BRAIN_CONTEXT_RESOLVER_VERSION)
 questionTrace.recordPromptVersion("outputSchema", BRAIN_OUTPUT_SCHEMA_VERSION)
 let renderedEvidenceRecords = [] as typeof promptEvidenceRecords
 let renderedCreatorAnswerEvidenceRecords = [] as typeof creatorAnswerEvidenceRecords
 const originalModelInputSnapshot = pending.metadata?.originalModelInputSnapshot as BrainModelInputSnapshot<EvidenceRecord> | undefined
 const restoredModelInputSnapshot = resolveBrainModelInputSnapshot({
  retryTurn: Boolean(input.retryTurnId),
  generationOnly: Boolean(input.retryGenerationOnly),
  mode: input.retryEvidenceMode || "saved",
  continuity: retryContextContinuity,
  saved: originalModelInputSnapshot,
 })
 const restoreOriginalModelInput = Boolean(restoredModelInputSnapshot)
 let modelSystemInstruction: string | undefined
 let modelHistory: any[] | undefined
 try {
  if (!input.retryGenerationOnly && capabilities.some((capability) => capability.id === "niche-knowledge")) {
   nicheKnowledge = await (input.nicheResolver || resolveNicheKnowledge)({
    channelId: input.channelId,
    niche: input.snapshot.inferredProfile.niche,
    topicClusters: input.snapshot.inferredProfile.topicClusters,
    contentPillars: input.snapshot.inferredProfile.contentPillars,
    evidenceFingerprint: input.snapshot.inferredProfile.evidenceFingerprint || `videos:${input.snapshot.inferredProfile.videoCount}`,
   })
   citations.push(...nicheKnowledge.sources.filter((source) => source.source === "wikipedia").slice(0, 3).map((source) => ({
    id: source.id,
    title: source.title,
    url: source.url,
    source: "wikipedia" as const,
    accessedAt: source.accessedAt,
   })))
  }
  if (!input.retryGenerationOnly && input.allowModel && nicheKnowledge?.canonicalNiche && shouldUseCurrentGrounding(input.userText)) {
   const grounded = readCachedCurrentNicheResearch(nicheKnowledge) || await (input.currentResearcher || groundCurrentNicheResearch)({
     canonicalNiche: nicheKnowledge.canonicalNiche,
     publicQuestion: input.userText,
    })
   currentResearch = grounded.text
   citations.push(...grounded.citations)
   if (!readCachedCurrentNicheResearch(nicheKnowledge) && grounded.citations.length) {
    nicheKnowledge = await cacheCurrentNicheResearch({ profile: nicheKnowledge, text: grounded.text, citations: grounded.citations })
   }
  }
  context = buildBrainContextPack({
   channelId: input.channelId,
   capabilityIds,
   modelContextWindowTokens: input.modelContextWindowTokens,
   reservedOutputTokens: input.reservedOutputTokens,
   contextSafetyMarginTokens: input.contextSafetyMarginTokens,
   systemPrompt: input.systemPrompt,
   snapshot: input.snapshot,
   recentTurns: input.recentTurns || [],
   nicheKnowledge,
   currentResearch,
   userText: input.userText,
   statisticsIntelligence,
   evidenceQuality,
  evidenceRecords: promptEvidenceRecords,
  evidenceRecordQuality: promptEvidenceRecords.length ? evidenceRecordQuality : null,
  evidenceClaims: evidenceIntelligence?.evidenceClaims,
   sharedEvidenceHealth: evidenceIntelligence?.sharedEvidenceHealth,
   analyticsFindingContext: evidenceIntelligence?.analyticsFindingContext,
   audienceIntelligence,
   algorithmIntelligence,
   creatorContext,
   channelContext: savedChannelContext,
   creatorAnswerEvidenceRecords,
  })
  // Only retain evidence whose full canonical prompt representation survived
  // section selection and the context budget. An ID substring is not proof that
  // the record itself was supplied to the model.
  renderedEvidenceRecords = restoreOriginalModelInput && Array.isArray(restoredModelInputSnapshot?.evidenceRecords)
   ? originalModelInputSnapshot.evidenceRecords
   : getEvidenceRecordsActuallyRendered(context.systemInstruction, promptEvidenceRecords)
  renderedCreatorAnswerEvidenceRecords = restoreOriginalModelInput && Array.isArray(restoredModelInputSnapshot?.creatorAnswerEvidenceRecords)
   ? originalModelInputSnapshot.creatorAnswerEvidenceRecords
   : getEvidenceRecordsActuallyRendered(context.systemInstruction, creatorAnswerEvidenceRecords)
  modelSystemInstruction = restoreOriginalModelInput
   ? restoredModelInputSnapshot?.systemInstruction
   : context.systemInstruction
  modelHistory = restoreOriginalModelInput && Array.isArray(restoredModelInputSnapshot?.history)
   ? originalModelInputSnapshot.history
   : (input.history || []).slice(-8)
  questionTrace.recordEvidence({
   returned: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords].map((record) => record.id),
   missing: [],
   records: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords],
  })
  questionTrace.recordContext({
   tokensEstimated: context.budget.estimatedInputTokens,
   sectionsIncluded: ["system_instruction", ...(renderedEvidenceRecords.length ? ["analytics_evidence_records"] : []), ...(renderedCreatorAnswerEvidenceRecords.length ? ["creator_answer_evidence_records"] : [])],
   sectionsDropped: [...context.budget.omittedSections],
  })

  try {
   await recordAIBrainTurnInteraction(pending.id, {
    type: input.retryTurnId ? "retry_model_input_snapshot" : "model_input_snapshot",
    direction: "outbound",
    detail: {
     modelInputSnapshot: {
      systemInstruction: modelSystemInstruction || context.systemInstruction,
      history: modelHistory || (input.history || []).slice(-8),
      userText: input.userText,
      evidenceRecords: renderedEvidenceRecords,
      creatorAnswerEvidenceRecords: renderedCreatorAnswerEvidenceRecords,
     },
     retryEvidenceMode: input.retryTurnId ? input.retryEvidenceMode || "saved" : undefined,
     retryContextContinuity,
    },
   })
  } catch (persistenceError) {
   console.warn("[AIBrain] Model input snapshot could not be checkpointed locally:", persistenceError)
  }

  let response = buildFallback(input.userText, input.snapshot, input.growthContext)
  let status: "complete" | "fallback" = "fallback"
  let generationPath: BrainGenerationPath = "basic_guidance"
  let fallbackReason: BrainFallbackReason | undefined = input.allowModel ? undefined : "model_disabled"
  let repairOutcome: BrainRepairOutcome = { attempted: false, succeeded: false, reasons: [] }
  if (input.allowModel) {
   const output = await withTimeout((input.modelGenerator || defaultBrainModelGateway.generateStructuredResponse)({
    history: modelHistory || (input.history || []).slice(-8),
    userText: input.userText,
    systemInstruction: modelSystemInstruction || context.systemInstruction,
   }), BRAIN_MODEL_TIMEOUT_MS)
   if (output.modelIdentity) {
    requestedModel = output.modelIdentity.requestedModel
    servedModel = output.modelIdentity.servedModel
    modelIdentityStatus = servedModel ? "served_known" : "requested_known_served_not_exposed"
    questionTrace.recordModelIdentity({ requested: requestedModel, served: servedModel, status: modelIdentityStatus })
   }
   response = fromStructuredOutput(output, input.snapshot, [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords])
   response = { ...response, modules: formatCreatorGrowthModules(response, input.growthContext, input.userText) }
   status = "complete"
   generationPath = "model"
  }

  let evaluation = validateBrainResponse({
   response,
   snapshot: input.snapshot,
   recentTurns: input.recentTurns,
   growthContext: input.growthContext,
   expectedMode: taskProfile.answerMode,
  })
  if (!evaluation.passed && status === "complete") {
   const initialRepairReasons = [...evaluation.repairReasons]
   repairOutcome = { attempted: true, succeeded: false, reasons: initialRepairReasons, evaluationId: evaluation.id }
   try {
    const repairedOutput = await withTimeout((input.modelGenerator || defaultBrainModelGateway.generateStructuredResponse)({
     history: (input.history || []).slice(-8),
     userText: input.userText,
     systemInstruction: [
      context.systemInstruction,
      "",
      "REPAIR THE PREVIOUS DRAFT:",
      ...initialRepairReasons.map((reason) => `- ${reason}`),
      "- Answer the creator's actual task directly.",
      "- Use only supplied evidence for every numeric or channel-specific claim.",
      "- Differ materially from recent responses in both wording and recommended action.",
     ].join("\n"),
    }), BRAIN_REPAIR_TIMEOUT_MS)
    if (repairedOutput.modelIdentity) {
     requestedModel = repairedOutput.modelIdentity.requestedModel
     servedModel = repairedOutput.modelIdentity.servedModel
     modelIdentityStatus = servedModel ? "served_known" : "requested_known_served_not_exposed"
     questionTrace.recordModelIdentity({ requested: requestedModel, served: servedModel, status: modelIdentityStatus })
    }
    const repairedResponse = fromStructuredOutput(repairedOutput, input.snapshot, [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords])
    const repairedCandidate = {
     ...repairedResponse,
     modules: formatCreatorGrowthModules(repairedResponse, input.growthContext, input.userText),
    }
    const repairedEvaluation = validateBrainResponse({
     response: repairedCandidate,
     snapshot: input.snapshot,
     recentTurns: input.recentTurns,
     growthContext: input.growthContext,
     expectedMode: taskProfile.answerMode,
    })
    if (repairedEvaluation.passed) {
     response = repairedCandidate
     evaluation = repairedEvaluation
     generationPath = "repaired_model"
     repairOutcome = { attempted: true, succeeded: true, reasons: initialRepairReasons, evaluationId: repairedEvaluation.id }
    } else {
     response = buildFallback(input.userText, input.snapshot, input.growthContext)
     evaluation = validateBrainResponse({ response, snapshot: input.snapshot, recentTurns: input.recentTurns, growthContext: input.growthContext, expectedMode: taskProfile.answerMode })
     status = "fallback"
     generationPath = "basic_guidance"
     fallbackReason = "validation_failed"
     repairOutcome = {
      attempted: true,
      succeeded: false,
      reasons: [...initialRepairReasons, ...repairedEvaluation.repairReasons],
      evaluationId: repairedEvaluation.id,
     }
    }
   } catch {
    response = buildFallback(input.userText, input.snapshot, input.growthContext)
    evaluation = validateBrainResponse({ response, snapshot: input.snapshot, recentTurns: input.recentTurns, growthContext: input.growthContext, expectedMode: taskProfile.answerMode })
    status = "fallback"
    generationPath = "basic_guidance"
    fallbackReason = "repair_failed"
   }
  }
  response = {
   ...response,
   evidenceIds: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords].map((record) => record.id).slice(0, 50),
   evidenceChips: [...buildEvidenceProvenanceChips(evidenceIntelligence), ...buildCreatorAnswerEvidenceChips(renderedCreatorAnswerEvidenceRecords)],
   generationPath,
   ...(fallbackReason ? { fallbackReason } : {}),
  }
  const learning = input.retryGenerationOnly ? null : await captureAIBrainLearningEvent({
   channelId: input.channelId || null,
   source: "copilot",
   summary: `Copilot conversation: ${input.userText}`,
   detail: response.keyInsight,
   category: "answer_quality",
   confidence: evaluation.passed ? "high" : "medium",
   evidence: response.modules?.map((module) => module.title) || [],
   metadata: {
    evaluationId: evaluation.id,
    rawUserMessage: input.userText,
    capabilities: capabilityIds,
    taskProfileId: taskProfile.id,
    generationPath,
    fallbackReason,
    promptVersion: BRAIN_PROMPT_VERSION,
    contextResolverVersion: BRAIN_CONTEXT_RESOLVER_VERSION,
    outputSchemaVersion: BRAIN_OUTPUT_SCHEMA_VERSION,
    requestedModel,
    servedModel: null,
    modelIdentityStatus,
    evidenceIds: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords].map((record) => record.id).slice(0, 100),
    channelId: input.channelId || null,
    projectId: input.projectId || input.project?.id || null,
    contentBuildId: input.project?.contentBuildId || null,
    ...creatorContextMetadata(),
    contextBudget: context.budget,
    repairReasons: repairOutcome.reasons,
    repairAttempted: repairOutcome.attempted,
    repairSucceeded: repairOutcome.succeeded,
   },
  })
  if (repairOutcome.attempted) questionTrace.recordRepairAttempt()
  questionTrace.recordGrade("response_validation", evaluation.passed ? 100 : 0)
  const turn = await completeAIBrainTurn({
   turnId: pending.id,
   status,
   assistantText: response.body || response.keyInsight,
   response,
   answerModules: response.modules,
   citations,
   evaluation,
   learningEntryIds: learning ? [learning.id] : [],
   metadata: {
    capabilities: capabilityIds,
    taskProfileId: taskProfile.id,
    generationPath,
    fallbackReason,
    promptVersion: BRAIN_PROMPT_VERSION,
    contextResolverVersion: BRAIN_CONTEXT_RESOLVER_VERSION,
    outputSchemaVersion: BRAIN_OUTPUT_SCHEMA_VERSION,
    requestedModel,
    servedModel: null,
    modelIdentityStatus,
    evidenceIds: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords].map((record) => record.id).slice(0, 100),
    evidenceRecords: renderedEvidenceRecords,
    creatorAnswerEvidenceRecords: renderedCreatorAnswerEvidenceRecords,
    creatorAnswerEvidenceRecordIds: renderedCreatorAnswerEvidenceRecords.map((record) => record.id),
    creatorAnswerEvidenceFingerprint: fingerprintBrainEvidenceRecords(renderedCreatorAnswerEvidenceRecords),
    ...(input.retryTurnId
     ? {
       retryModelInputSnapshot: {
        systemInstruction: modelSystemInstruction || context.systemInstruction,
        history: modelHistory || (input.history || []).slice(-8),
        userText: input.userText,
        evidenceRecords: renderedEvidenceRecords,
        creatorAnswerEvidenceRecords: renderedCreatorAnswerEvidenceRecords,
       },
      }
     : {
       originalModelInputSnapshot: {
        systemInstruction: modelSystemInstruction || context.systemInstruction,
        history: modelHistory || (input.history || []).slice(-8),
        userText: input.userText,
        evidenceRecords: renderedEvidenceRecords,
        creatorAnswerEvidenceRecords: renderedCreatorAnswerEvidenceRecords,
       },
      }),
    evidenceRecordQuality: renderedEvidenceRecords.length
     ? buildBrainEvidenceRecordQuality(renderedEvidenceRecords, { expectedChannelId: input.channelId })
     : null,
    promptEvidenceRecordIds: renderedEvidenceRecords.map((record) => record.id),
    channelId: input.channelId || null,
    projectId: input.projectId || input.project?.id || null,
    contentBuildId: input.project?.contentBuildId || null,
    ...creatorContextMetadata(),
    contextBudget: context.budget,
    evaluationId: evaluation.id,
    repairReasons: repairOutcome.reasons,
    repairAttempted: repairOutcome.attempted,
    repairSucceeded: repairOutcome.succeeded,
    repaired: repairOutcome.attempted,
    ...(retryContextContinuity ? { retryContextContinuity, retryEvidenceMode: input.retryEvidenceMode || "saved" } : {}),
   },
  })
  try {
   questionTrace.complete({
    status: status === "complete" ? "complete" : "fallback",
    outputRef: response.id,
   })
  } catch {
   // Trace persistence must never fail an otherwise completed creator turn.
  }
  return {
   turn,
   response,
   modules: response.modules || [],
   capabilities: capabilityIds,
   contextBudget: context.budget,
   repaired: repairOutcome.attempted,
   generationPath,
   fallbackReason,
   repairOutcome,
  }
 } catch (error) {
  const generationPath: BrainGenerationPath = "basic_guidance"
  const fallbackReason: BrainFallbackReason = input.allowModel ? "provider_error" : "model_disabled"
  const repairOutcome: BrainRepairOutcome = { attempted: false, succeeded: false, reasons: [] }
  const fallbackResponse = buildFallback(input.userText, input.snapshot, input.growthContext)
  const response = {
   ...fallbackResponse,
   evidenceIds: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords].map((record) => record.id).slice(0, 50),
   evidenceChips: [...buildEvidenceProvenanceChips(evidenceIntelligence), ...buildCreatorAnswerEvidenceChips(renderedCreatorAnswerEvidenceRecords)],
   generationPath,
   fallbackReason,
  }
  const evaluation = validateBrainResponse({ response, snapshot: input.snapshot, recentTurns: input.recentTurns, growthContext: input.growthContext, expectedMode: taskProfile.answerMode })
  try {
   questionTrace.recordGrade("response_validation", evaluation.passed ? 100 : 0)
   questionTrace.complete({ status: "fallback", outputRef: response.id, failureReason: error instanceof Error ? error.message : String(error) })
  } catch {
   // Trace persistence must never mask the fallback response.
  }
  const learning = input.retryGenerationOnly ? null : await captureAIBrainLearningEvent({
   channelId: input.channelId || null,
   source: "copilot",
   summary: `Copilot conversation: ${input.userText}`,
   detail: response.keyInsight,
   category: "answer_quality",
   confidence: evaluation.passed ? "high" : "medium",
   evidence: response.modules?.map((module) => module.title) || [],
   metadata: {
    evaluationId: evaluation.id,
    rawUserMessage: input.userText,
    capabilities: capabilityIds,
    taskProfileId: taskProfile.id,
    generationPath,
    fallbackReason,
    promptVersion: BRAIN_PROMPT_VERSION,
    contextResolverVersion: BRAIN_CONTEXT_RESOLVER_VERSION,
    outputSchemaVersion: BRAIN_OUTPUT_SCHEMA_VERSION,
    requestedModel,
    servedModel: null,
    modelIdentityStatus,
    evidenceIds: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords].map((record) => record.id).slice(0, 100),
    channelId: input.channelId || null,
    projectId: input.projectId || input.project?.id || null,
    contentBuildId: input.project?.contentBuildId || null,
    ...creatorContextMetadata(),
    contextBudget: context.budget,
    repairReasons: [],
    repairAttempted: false,
    repairSucceeded: false,
    ...(retryContextContinuity ? { retryContextContinuity, retryEvidenceMode: input.retryEvidenceMode || "saved" } : {}),
   },
  })
  const turn = await completeAIBrainTurn({
   turnId: pending.id,
   status: "fallback",
   assistantText: response.body || response.keyInsight,
   response,
   answerModules: response.modules,
   evaluation,
   learningEntryIds: learning ? [learning.id] : [],
   metadata: {
    orchestrationError: error instanceof Error ? error.message : String(error),
    capabilities: capabilityIds,
    taskProfileId: taskProfile.id,
    generationPath,
    fallbackReason,
    promptVersion: BRAIN_PROMPT_VERSION,
    contextResolverVersion: BRAIN_CONTEXT_RESOLVER_VERSION,
    outputSchemaVersion: BRAIN_OUTPUT_SCHEMA_VERSION,
    requestedModel,
    servedModel: null,
    modelIdentityStatus,
    evidenceIds: [...renderedEvidenceRecords, ...renderedCreatorAnswerEvidenceRecords].map((record) => record.id).slice(0, 100),
    evidenceRecords: renderedEvidenceRecords,
    creatorAnswerEvidenceRecords: renderedCreatorAnswerEvidenceRecords,
    creatorAnswerEvidenceRecordIds: renderedCreatorAnswerEvidenceRecords.map((record) => record.id),
    creatorAnswerEvidenceFingerprint: fingerprintBrainEvidenceRecords(renderedCreatorAnswerEvidenceRecords),
    evidenceRecordQuality: renderedEvidenceRecords.length
     ? buildBrainEvidenceRecordQuality(renderedEvidenceRecords, { expectedChannelId: input.channelId })
     : null,
    promptEvidenceRecordIds: renderedEvidenceRecords.map((record) => record.id),
    channelId: input.channelId || null,
    projectId: input.projectId || input.project?.id || null,
    contentBuildId: input.project?.contentBuildId || null,
    ...creatorContextMetadata(),
    contextBudget: context.budget,
    evaluationId: evaluation.id,
    repairReasons: [],
    repaired: false,
    repairAttempted: repairOutcome.attempted,
    repairSucceeded: repairOutcome.succeeded,
    ...(retryContextContinuity ? { retryContextContinuity, retryEvidenceMode: input.retryEvidenceMode || "saved" } : {}),
   },
  })
  return {
   turn,
   response,
   modules: response.modules || [],
   capabilities: capabilityIds,
   contextBudget: context.budget,
   repaired: false,
   generationPath,
   fallbackReason,
   repairOutcome,
  }
 }
}
