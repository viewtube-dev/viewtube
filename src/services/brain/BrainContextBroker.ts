import type {
 AIBrainConversationTurn,
 BrainContextBudget,
 NicheKnowledgeProfile,
} from "../../types"
import type { AIBrainContextSnapshot } from "../aiBrainCommandInterface"
import type { ChannelContextProfile } from "../../context/ChannelContextProfile"
import { buildBrainTaskInstruction, resolveBrainTaskProfile } from "./BrainTaskProfileRegistry"
import { buildRelevantNicheKnowledgeContext } from "./NicheKnowledge"
import { readBrainUserControls } from "./BrainUserControls"
import type { StatisticsIntelligenceSnapshot } from "./StatisticsIntelligence"
import type { AudienceIntelligenceSnapshot } from "./AudienceIntelligence"
import type { BrainEvidenceQualityReport } from "./BrainEvidenceQuality"
import type { BrainAnalyticsFindingContext } from "./AnalyticsIntelligenceWorkflow"
import type { CreatorContextEnvelope } from "./CreatorContextResolver"
import { buildAlgorithmIntelligenceContext, type AlgorithmIntelligencePortfolio } from "./AlgorithmIntelligenceOrchestrator"
import { resolveBrainContextSections } from "./BrainContextResolution"
import type { BrainEvidenceClaim, BrainEvidenceHealth } from "./BrainEvidenceContract"
import { formatEvidenceRecordForPrompt, type EvidenceRecord } from "./EvidenceRecord"
import { fingerprintBrainEvidenceRecords, isBrainEvidenceRecordQualityInSync, type BrainEvidenceRecordQualityReport } from "./BrainEvidenceQuality"

const clip = (value: string, maximum: number): string => value.slice(0, Math.max(0, maximum))

const selectCreatorAnswerEvidenceForPrompt = (
 records: EvidenceRecord[],
 userText: string,
 maximumCharacters = 3200,
): string => {
 const terms = new Set(userText.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter((term) => term.length > 2))
 const ranked = records.map((record, index) => {
  const field = record.id.replace(/^creator-answer:[^:]+:/, "").replace(/[._]/g, " ").toLocaleLowerCase()
  const value = String(record.value ?? "").toLocaleLowerCase()
  const score = [...terms].reduce((total, term) => total + (field.includes(term) ? 3 : 0) + (value.includes(term) ? 1 : 0), 0)
  return { record, index, score }
 }).sort((left, right) => right.score - left.score || left.index - right.index)
 const selected: string[] = []
 let characters = 0
 for (const { record } of ranked) {
  const rendered = formatEvidenceRecordForPrompt(record)
  const nextCharacters = characters + (selected.length ? 1 : 0) + rendered.length
  // Skip oversized records rather than clipping a provenance line in half.
  if (nextCharacters > maximumCharacters) continue
  selected.push(rendered)
  characters = nextCharacters
 }
 return selected.join("\n")
}

export const buildBrainContextPack = (input: {
 channelId?: string | null
 capabilityIds?: string[]
 modelContextWindowTokens?: number | null
 reservedOutputTokens?: number
 contextSafetyMarginTokens?: number
 systemPrompt: string
 snapshot: AIBrainContextSnapshot
 recentTurns: AIBrainConversationTurn[]
 nicheKnowledge?: NicheKnowledgeProfile | null
 userText: string
 currentResearch?: string
 statisticsIntelligence?: StatisticsIntelligenceSnapshot | null
 evidenceQuality?: BrainEvidenceQualityReport | null
 evidenceRecords?: EvidenceRecord[] | null
 creatorAnswerEvidenceRecords?: EvidenceRecord[] | null
 evidenceRecordQuality?: BrainEvidenceRecordQualityReport | null
 evidenceClaims?: BrainEvidenceClaim[] | null
 sharedEvidenceHealth?: BrainEvidenceHealth | null
 analyticsFindingContext?: BrainAnalyticsFindingContext | null
 audienceIntelligence?: AudienceIntelligenceSnapshot | null
 algorithmIntelligence?: AlgorithmIntelligencePortfolio | null
 creatorContext?: CreatorContextEnvelope | null
 channelContext?: ChannelContextProfile | null
 maximumCharacters?: number
}): { systemInstruction: string; budget: BrainContextBudget } => {
 const requestedChannelId = input.channelId || null
 const creatorContextMatchesChannel = Boolean(
  input.creatorContext
  && (input.creatorContext.channelId || null) === requestedChannelId,
 )
 const controls = creatorContextMatchesChannel && input.creatorContext
  ? input.creatorContext.controls
  : readBrainUserControls(input.channelId)
 const maximumCharacters = input.maximumCharacters || 24_000
 const omittedSections: string[] = []
 const normalizeChannelName = (value: unknown): string =>
  String(value || "").trim().toLocaleLowerCase().replace(/ +/g, " ")
 const savedChannelName = normalizeChannelName(input.channelContext?.identity.name)
 const activeChannelName = normalizeChannelName(input.snapshot.channel.label)
 const channelContextMatchesChannel = Boolean(savedChannelName && activeChannelName && savedChannelName === activeChannelName)
 if (input.channelContext && !channelContextMatchesChannel) omittedSections.push("channel_context_channel_name_mismatch")
 const evidenceRecordQualityInSync = Boolean(
  input.evidenceRecordQuality
  && isBrainEvidenceRecordQualityInSync(input.evidenceRecords || [], input.evidenceRecordQuality),
 )
 const hasPromptEvidenceRecords = Boolean(input.evidenceRecords?.length)
 const evidenceRecordParityBlocked = Boolean(
  controls.allowAnalytics
  && hasPromptEvidenceRecords
  && !evidenceRecordQualityInSync,
 )
 const analyticsScopeBlocked = Boolean(
  controls.allowAnalytics
  && (
   evidenceRecordParityBlocked
   || (input.evidenceQuality
    && (!requestedChannelId || input.evidenceQuality.scopeMatch === "mismatch" || input.evidenceQuality.scopeMatch === "unscoped" || input.evidenceQuality.scopeMatch === "not_requested"))
  ),
 )
 const system = clip(input.systemPrompt, 11_000)
 if (system.length < input.systemPrompt.length) omittedSections.push("system_overflow")

 const conversation = controls.personalization
  ? input.recentTurns
    .filter((turn) => turn.status !== "pending")
    .slice(0, 4)
    .reverse()
    .map((turn) => `Creator: ${turn.userText}\nCopilot: ${turn.response?.keyInsight || turn.assistantText}`)
    .join("\n")
  : ""
 const clippedConversation = clip(conversation, 3200)
 if (clippedConversation.length < conversation.length) omittedSections.push("older_conversation_detail")
 if (!controls.personalization) omittedSections.push("creator_personalization_disabled")

 const memory = controls.personalization
  ? clip([
    input.snapshot.brain.identityAndAspirations,
    input.snapshot.brain.contentDNA,
    input.snapshot.brain.futureStateMap,
    ...input.snapshot.conversations.recentFacts,
   ].filter(Boolean).join("\n"), 3200)
  : ""

 const evidence = controls.allowAnalytics && !analyticsScopeBlocked
  ? (input.evidenceRecords || []).map(formatEvidenceRecordForPrompt).join("\n")
  : analyticsScopeBlocked
   ? evidenceRecordParityBlocked
    ? "Analytics evidence is blocked because the evidence records do not match their quality grade or no grade was supplied. Do not use channel-specific metrics or performance claims for this turn."
    : "Analytics evidence is blocked because the canonical bundle is unscoped or belongs to a different channel. Do not use channel-specific metrics or performance claims for this turn."
   : "Analytics evidence access is disabled by the creator in Brain User Controls. Do not infer private channel metrics or quote stored analytics values."
 const channelProfile = controls.allowAnalytics && !analyticsScopeBlocked
  ? clip([
    `Channel: ${input.snapshot.channel.label}`,
    `Inferred niche: ${input.snapshot.inferredProfile.niche || "unknown"}`,
    `Content pillars: ${input.snapshot.inferredProfile.contentPillars.join(", ") || "unknown"}`,
   ].join("\n"), 1200)
  : ""
 const evidenceGaps = controls.allowAnalytics && !analyticsScopeBlocked
  ? clip(input.snapshot.evidencePack.missingInputs.map((value) => `Missing: ${value}`).join("\n"), 1200)
  : ""
 if (!controls.allowAnalytics) omittedSections.push("analytics_access_disabled")
 if (analyticsScopeBlocked) omittedSections.push("analytics_scope_blocked")

 const sharedEvidenceContract = controls.allowAnalytics && !analyticsScopeBlocked && input.sharedEvidenceHealth
  ? clip([
    `confidence=${input.sharedEvidenceHealth.confidence}; coverage=${Math.round(input.sharedEvidenceHealth.coverageRatio * 100)}%; scope=${input.sharedEvidenceHealth.scope}; claims=${input.sharedEvidenceHealth.usableClaims}/${input.sharedEvidenceHealth.totalClaims}`,
    ...(input.evidenceClaims || []).slice(0, 12).map((claim) => `${claim.epistemicState} ${claim.claim}=${claim.value === null ? "unknown" : String(claim.value)}${claim.unit ? ` ${claim.unit}` : ""}; source=${claim.sourceOwner}:${claim.sourceId}; scope=channel:${claim.channelId || "unknown"}/project:${claim.projectId || "none"}/video:${claim.videoId || "none"}; refs=${claim.provenance.evidenceIds.join(",") || "none"}`),
    ...input.sharedEvidenceHealth.limitations.map((value) => `Limitation: ${value}`),
    "Shared evidence policy: source ownership and provenance must be preserved; missing is not zero; inferred, estimated and hypothetical claims are not observed facts; channel/project/video scope mismatch blocks use.",
   ].join("\n"), 2400)
  : ""

 const evidenceRecordQuality = controls.allowAnalytics && input.evidenceRecordQuality
  ? clip([
    `parity=${evidenceRecordQualityInSync ? "verified" : "MISMATCH"}; gradedFingerprint=${input.evidenceRecordQuality.evidenceFingerprint}; promptFingerprint=${fingerprintBrainEvidenceRecords(input.evidenceRecords || [])}`,
    `recordGrade=${input.evidenceRecordQuality.confidence}; scope=${input.evidenceRecordQuality.scopeMatch}; records=${input.evidenceRecordQuality.totalRecords}; numeric=${input.evidenceRecordQuality.numericRecords}; observed=${input.evidenceRecordQuality.observedRecords}; stale=${input.evidenceRecordQuality.staleRecords}; missing=${input.evidenceRecordQuality.missingRecords}`,
    `gradedRecordIds=${input.evidenceRecordQuality.evidenceRecordIds.join(",") || "none"}`,
    ...(!evidenceRecordQualityInSync ? ["PARITY FAILURE: the quality report does not describe the exact records currently supplied for prompt rendering. Do not make analytics claims from this grade; treat the grade as invalid."] : []),
    ...input.evidenceRecordQuality.limitations.map((value) => `Record limitation: ${value}`),
    "Record-grade policy: this grade applies only to the EvidenceRecord ids rendered in CHANNEL EVIDENCE; it does not replace dataset readiness.",
   ].join("\n"), 1200)
  : ""

 const evidenceQuality = controls.allowAnalytics && input.evidenceQuality
  ? clip([
    `confidence=${input.evidenceQuality.confidence}; coverage=${Math.round(input.evidenceQuality.coverageRatio * 100)}%; scope=${input.evidenceQuality.scopeMatch}; window=${input.evidenceQuality.selectedWindow}; snapshot=${input.evidenceQuality.sourceSnapshotId}; refs=${input.evidenceQuality.evidenceReferenceCount}`,
    ...input.evidenceQuality.missingness.unavailableDatasetIds.slice(0, 10).map((id) => `Missing dataset: ${id}`),
    ...input.evidenceQuality.missingness.failedDatasetIds.slice(0, 10).map((id) => `Failed dataset: ${id}`),
    ...input.evidenceQuality.freshness.staleDatasetIds.slice(0, 10).map((id) => `Stale dataset: ${id}`),
    ...(input.evidenceQuality.evaluatedDatasetIds?.length ? [`Task datasets: ${input.evidenceQuality.evaluatedDatasetIds.join(", ")}`] : []),
    ...input.evidenceQuality.missingness.partialDatasetIds.slice(0, 10).map((id) => `Partial dataset: ${id}`),
    ...input.evidenceQuality.limitations.map((value) => `Limitation: ${value}`),
    "Evidence policy: missing/unavailable is not zero; stale evidence is historical, not current; partial evidence supports qualified claims only; separate observed measurements from calculations, estimates and hypotheses.",
    ...(input.evidenceQuality.confidence === "insufficient" ? ["Evidence fitness is insufficient for precise channel-specific metric claims or confident ranking."] : []),
   ].join("\n"), 3200)
  : ""

 const analyticsFindings = controls.allowAnalytics && !analyticsScopeBlocked && input.analyticsFindingContext?.status === "ready" && input.analyticsFindingContext.findings.length > 0
  ? clip([
    ...input.analyticsFindingContext.findings.slice(0, 8).map((finding) =>
     `id=${finding.id}; kind=${finding.kind}; metric=${finding.metric}; current=${finding.currentValue}; baseline=${finding.baselineValue ?? "not comparable"}; delta=${finding.delta ?? "undefined"}; relativeDeltaPercent=${finding.relativeDeltaPercent ?? "undefined"}; unit=${finding.unit}; formula=${finding.formula}; algorithm=${finding.algorithmVersion}; confidence=${finding.confidence}; snapshots=${finding.sourceSnapshotIds.join(",")}; evidence=${finding.evidenceRefs.join(",")}; limitations=${finding.limitations.join("; ")}`),
    "Finding policy: these values are deterministic source-linked facts. Do not recalculate, overwrite, or infer missing values. Keep explanation, hypothesis, and recommendation separate from observed/calculated facts.",
   ].join("\\n"), 2600)
  : ""

 const statistics = controls.allowAnalytics && !analyticsScopeBlocked && input.statisticsIntelligence
  ? clip([
    `confidence=${input.statisticsIntelligence.confidence}; coverage=${Math.round(input.statisticsIntelligence.coverageRatio * 100)}%; window=${input.statisticsIntelligence.selectedWindow}`,
    ...input.statisticsIntelligence.metrics.slice(0, 18).map((metric) =>
     `${metric.datasetId}.${metric.metric}: n=${metric.count}; sum=${metric.sum}; avg=${metric.average}; min=${metric.minimum}; max=${metric.maximum}; evidence=${metric.evidenceRef || "none"}`),
    ...input.statisticsIntelligence.limitations.map((value) => `Limitation: ${value}`),
   ].join("\n"), 4200)
  : ""

 const audience = controls.allowAnalytics && !analyticsScopeBlocked && input.audienceIntelligence
  ? clip([
    `confidence=${input.audienceIntelligence.confidence}; window=${input.audienceIntelligence.selectedWindow}`,
    ...input.audienceIntelligence.signals.slice(0, 16).map((signal) =>
     `${signal.kind} | ${signal.label} | ${JSON.stringify(signal.metrics)} | evidence=${signal.evidenceRef || "none"}`),
    ...input.audienceIntelligence.missingEvidence.map((id) => `Missing audience dataset: ${id}`),
    ...input.audienceIntelligence.evidenceBoundary.map((rule) => `Boundary: ${rule}`),
   ].join("\n"), 4200)
  : ""

 const algorithm = controls.allowAnalytics && !analyticsScopeBlocked && input.algorithmIntelligence
  ? clip(buildAlgorithmIntelligenceContext(input.algorithmIntelligence), 4800)
  : ""

 const creatorContext = creatorContextMatchesChannel ? input.creatorContext : null
 const channelKnowledge = controls.personalization && creatorContext?.channelKnowledge
  ? clip([
    ...creatorContext.channelKnowledge.records.slice(0, 10).map((record) =>
     `[${record.knowledgeClass}/${record.confidence}; state=${record.lifecycleState}] ${record.statement} | evidence=${record.evidenceRefs.join(",") || "none"}`),
    ...creatorContext.channelKnowledge.contradictions.slice(0, 6).map((record) =>
     `Contradiction: [${record.confidence}] ${record.statement} | evidence=${record.evidenceRefs.join(",") || "none"}`),
   ].join("\n"), 4200)
  : ""

 const projectContext = controls.allowProjects && creatorContext?.project
  ? clip([
    `projectId=${creatorContext.project.projectId || "none"}`,
    `contentBuildId=${creatorContext.project.contentBuildId || "none"}`,
    creatorContext.project.title ? `title=${creatorContext.project.title}` : "",
    creatorContext.project.topic ? `topic=${creatorContext.project.topic}` : "",
    creatorContext.project.format ? `format=${creatorContext.project.format}` : "",
    creatorContext.project.plannedPublishAt ? `plannedPublishAt=${creatorContext.project.plannedPublishAt}` : "",
    creatorContext.project.lifecycle?.currentPhase ? `currentLifecyclePhase=${creatorContext.project.lifecycle.currentPhase}` : "",
    creatorContext.project.lifecycle?.relevantCapabilities?.length ? `phaseCapabilities=${creatorContext.project.lifecycle.relevantCapabilities.join(",")}` : "",
    creatorContext.project.lifecycle?.blockers?.length ? `workflowBlockers=${creatorContext.project.lifecycle.blockers.join(",")}` : "",
    creatorContext.project.lifecycle ? "Capability policy: prioritize only phase-relevant capabilities; do not claim later stages are complete." : "",
    creatorContext.provenance.projectSource ? `source=${creatorContext.provenance.projectSource}` : "",
    creatorContext.project.evidenceIds?.length
     ? `evidence=${creatorContext.project.evidenceIds.join(",")}`
     : "",
   ].filter(Boolean).join("\n"), 2200)
  : ""

 const creatorStyle = controls.personalization && creatorContext?.styleProfile
  ? clip([
    `scope=${creatorContext.styleProfile.scope}; confidence=${creatorContext.styleProfile.confidence}; source=${creatorContext.styleProfile.source}`,
    creatorContext.styleProfile.assetType ? `assetType=${creatorContext.styleProfile.assetType}` : "",
    creatorContext.styleProfile.descriptor.voice ? `voice=${creatorContext.styleProfile.descriptor.voice}` : "",
    creatorContext.styleProfile.descriptor.pacing ? `pacing=${creatorContext.styleProfile.descriptor.pacing}` : "",
    creatorContext.styleProfile.descriptor.structure ? `structure=${creatorContext.styleProfile.descriptor.structure}` : "",
    creatorContext.styleProfile.descriptor.openingPattern ? `opening=${creatorContext.styleProfile.descriptor.openingPattern}` : "",
    creatorContext.styleProfile.descriptor.closingPattern ? `closing=${creatorContext.styleProfile.descriptor.closingPattern}` : "",
    creatorContext.styleProfile.descriptor.productionQuality ? `productionQuality=${creatorContext.styleProfile.descriptor.productionQuality}` : "",
    creatorContext.styleProfile.descriptor.vocabulary.prefer.length
     ? `prefer=${creatorContext.styleProfile.descriptor.vocabulary.prefer.join(",")}`
     : "",
    creatorContext.styleProfile.descriptor.vocabulary.avoid.length
     ? `avoid=${creatorContext.styleProfile.descriptor.vocabulary.avoid.join(",")}`
     : "",
   ].filter(Boolean).join("\n"), 2200)
  : ""

 const channelContext = controls.personalization && channelContextMatchesChannel && input.channelContext
  ? clip([
    "Epistemic status: USER_PROVIDED. These are the creator's stated preferences and goals, not verified public evidence or measured channel facts.",
    input.channelContext.identity.description ? `Description: ${input.channelContext.identity.description}` : "",
    input.channelContext.identity.niche ? `Primary niche: ${input.channelContext.identity.niche}` : "",
    input.channelContext.identity.subNiches?.length ? `Sub-niches: ${input.channelContext.identity.subNiches.join(", ")}` : "",
    input.channelContext.identity.competitors?.length ? `Competitors / inspiration: ${input.channelContext.identity.competitors.join(", ")}` : "",
    input.channelContext.goals.primaryGoal ? `Primary goal: ${input.channelContext.goals.primaryGoal}` : "",
    input.channelContext.goals.successDefinition ? `12-month success: ${input.channelContext.goals.successDefinition}` : "",
    input.channelContext.goals.priorityRanking?.length ? `Goal priorities: ${input.channelContext.goals.priorityRanking.join(", ")}` : "",
    input.channelContext.goals.offers?.length ? `Offers: ${input.channelContext.goals.offers.join(", ")}` : "",
    input.channelContext.goals.primaryCTA ? `Primary CTA: ${input.channelContext.goals.primaryCTA}` : "",
    input.channelContext.audience.idealViewer ? `Ideal viewer: ${input.channelContext.audience.idealViewer}` : "",
    input.channelContext.audience.experienceLevel ? `Audience level: ${input.channelContext.audience.experienceLevel}` : "",
    input.channelContext.audience.problem ? `Audience problem: ${input.channelContext.audience.problem}` : "",
    input.channelContext.audience.transformation ? `Viewer transformation: ${input.channelContext.audience.transformation}` : "",
    input.channelContext.audience.segments?.length ? `Audience segments: ${input.channelContext.audience.segments.join(", ")}` : "",
    input.channelContext.content.types?.length ? `Content types: ${input.channelContext.content.types.join(", ")}` : "",
    input.channelContext.content.frequency ? `Publishing frequency: ${input.channelContext.content.frequency}` : "",
    input.channelContext.content.bestFormats?.length ? `Best formats: ${input.channelContext.content.bestFormats.join(", ")}` : "",
    input.channelContext.content.priorityThemes?.length ? `Prioritize themes: ${input.channelContext.content.priorityThemes.join(", ")}` : "",
    input.channelContext.content.blockedThemes?.length ? `Avoid themes: ${input.channelContext.content.blockedThemes.join(", ")}` : "",
    input.channelContext.brand.voice ? `Brand voice: ${input.channelContext.brand.voice}` : "",
    input.channelContext.brand.influences?.length ? `Style influences: ${input.channelContext.brand.influences.join(", ")}` : "",
    typeof input.channelContext.brand.creativity === "number" ? `Creativity preference (1–10): ${input.channelContext.brand.creativity}` : "",
    input.channelContext.intelligence.sources?.length ? `Creator-approved source preferences: ${input.channelContext.intelligence.sources.join(", ")}` : "",
    input.channelContext.intelligence.capabilities?.length ? `Creator-requested capabilities: ${input.channelContext.intelligence.capabilities.join(", ")}` : "",
    "Use these as creator-stated preferences only. They do not grant technical permissions, override privacy controls, or establish that a source was accessed.",
   ].filter(Boolean).join("\\n"), 2600)
  : ""
 const scopedCreatorAnswerEvidenceRecords = requestedChannelId
  ? (input.creatorAnswerEvidenceRecords || []).filter((record) => record.channelId === requestedChannelId)
  : []
 if (scopedCreatorAnswerEvidenceRecords.length !== (input.creatorAnswerEvidenceRecords || []).length) {
  omittedSections.push("creator_answer_evidence_channel_mismatch")
 }
 const creatorAnswerEvidence = controls.personalization && channelContextMatchesChannel && scopedCreatorAnswerEvidenceRecords.length
  ? selectCreatorAnswerEvidenceForPrompt(scopedCreatorAnswerEvidenceRecords, input.userText, 3200)
  : ""
 const knowledge = clip(buildRelevantNicheKnowledgeContext(input.nicheKnowledge || null, input.userText, 2200), 2200)
 const research = clip(input.currentResearch || "", 1800)
 const taskInstruction = buildBrainTaskInstruction(resolveBrainTaskProfile(input.userText))
 const controlInstruction = [
  "\nCREATOR CONTROL POLICY",
  `Brain enabled: ${controls.enabled ? "yes" : "no"}`,
  `Personalization: ${controls.personalization ? "allowed" : "disabled"}`,
  `Analytics evidence: ${controls.allowAnalytics ? "allowed" : "disabled"}`,
  `Learning from interactions: ${controls.learnFromInteractions ? "allowed" : "disabled"}`,
  "Never work around a disabled creator permission by reconstructing private data from memory.",
 ].join("\n")

 const sections = [
  system,
  controlInstruction,
  "\nCHANNEL EVIDENCE\n" + evidence,
  channelProfile ? "\nCHANNEL PROFILE CONTEXT\n" + channelProfile : "",
  evidenceGaps ? "\nEVIDENCE GAPS\n" + evidenceGaps : "",
  evidenceQuality ? "\nEVIDENCE QUALITY\n" + evidenceQuality : "",
  evidenceRecordQuality ? "\nPROMPT EVIDENCE RECORD QUALITY\n" + evidenceRecordQuality : "",
  sharedEvidenceContract ? "\nSHARED EVIDENCE CONTRACT\n" + sharedEvidenceContract : "",
  statistics ? "\nDETERMINISTIC STATISTICS INTELLIGENCE\n" + statistics : "",
  analyticsFindings ? "\nDETERMINISTIC ANALYTICS FINDINGS\n" + analyticsFindings : "",
  audience ? "\nAUDIENCE INTELLIGENCE\n" + audience : "",
  algorithm ? "\nALGORITHM / CHANNEL / OPPORTUNITY INTELLIGENCE\n" + algorithm : "",
  channelKnowledge ? "\nCHANNEL KNOWLEDGE\n" + channelKnowledge : "",
  projectContext ? "\nACTIVE PROJECT CONTEXT\n" + projectContext : "",
  creatorStyle ? "\nCREATOR STYLE\n" + creatorStyle : "",
  memory ? "\nCONFIRMED CREATOR CONTEXT\n" + memory : "",
  channelContext ? "\nCREATOR-PROVIDED CHANNEL CONTEXT\n" + channelContext : "",
  creatorAnswerEvidence ? "\nCREATOR ANSWER EVIDENCE (USER_PROVIDED; NOT INDEPENDENTLY VERIFIED)\n" + creatorAnswerEvidence : "",
  clippedConversation ? "\nRECENT CONVERSATION\n" + clippedConversation : "",
  knowledge ? "\nPUBLIC NICHE KNOWLEDGE\n" + knowledge : "",
  research ? "\nCURRENT PUBLIC RESEARCH\n" + research : "",
  taskInstruction ? `\n${taskInstruction}` : "",
 ].filter(Boolean)
 const resolvedContext = resolveBrainContextSections(sections, {
  userText: input.userText,
  maximumCharacters,
  capabilityIds: input.capabilityIds,
  modelContextWindowTokens: input.modelContextWindowTokens,
  reservedOutputTokens: input.reservedOutputTokens,
  safetyMarginTokens: input.contextSafetyMarginTokens,
 })
 omittedSections.push(...resolvedContext.omittedSectionIds)
 const systemInstruction = resolvedContext.text

 return {
  systemInstruction,
  budget: {
   maximumCharacters: resolvedContext.maximumCharacters,
   modelContextWindowTokens: resolvedContext.modelContextWindowTokens,
   reservedOutputTokens: resolvedContext.reservedOutputTokens,
   estimatedInputTokens: resolvedContext.estimatedInputTokens,
   contextBudgetSource: resolvedContext.budgetSource,
   systemCharacters: system.length,
   evidenceCharacters: evidence.length + channelProfile.length + evidenceGaps.length + evidenceQuality.length + evidenceRecordQuality.length + sharedEvidenceContract.length + statistics.length + analyticsFindings.length + audience.length + algorithm.length,
   memoryCharacters: memory.length + channelKnowledge.length + projectContext.length + creatorStyle.length + channelContext.length,
   knowledgeCharacters: knowledge.length + research.length,
   conversationCharacters: clippedConversation.length,
   omittedSections,
  },
 }
}
