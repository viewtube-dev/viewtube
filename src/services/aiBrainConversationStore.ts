import type {
 AIBrainAnswerModule,
 AIBrainConversationDigest,
 AIBrainConversationThread,
 AIBrainConversationTurn,
 AIBrainConversationTurnStatus,
 AIBrainLearningEntry,
 AIBrainQuestionAnswer,
 CreatorBrainLearningQuestion,
 CreatorBrainResponse,
 CreatorGrowthContext,
 CreatorGrowthCapabilityStatus,
} from "../types"
import {
 getAIBrainConversationTurnDB,
 getAIBrainConversationThreadDB,
 listAIBrainConversationThreadsDB,
 listAIBrainConversationTurnsDB,
 saveAIBrainConversationThreadDB,
 saveAIBrainConversationTurnDB,
} from "./brain/Persistence"
import {
 buildConversationAnalyticDigest,
 captureAIBrainLearningEvent,
} from "./aiBrainSelfImprovement"
import type { AIBrainContextSnapshot } from "./aiBrainCommandInterface"
import { buildBrainProfileCoverageItems } from "./brain/profileCoverage"

const nowIso = () => new Date().toISOString()

const makeId = (prefix: string): string => {
 const random =
  typeof crypto !== "undefined" && "randomUUID" in crypto
   ? crypto.randomUUID()
   : `${Date.now()}-${Math.random().toString(36).slice(2)}`
 return `${prefix}_${random}`
}

const clean = (value: unknown): string => String(value || "").replace(/\s+/g, " ").trim()

export const reconcileBrainLearningQuestions = (
 questions: CreatorBrainLearningQuestion[],
 savedAnswers: AIBrainQuestionAnswer[],
 reopenedQuestionIds: string[] = [],
): CreatorBrainLearningQuestion[] => {
 const reopened = new Set(reopenedQuestionIds)
 const validAnswers = savedAnswers.filter((answer) =>
  clean(answer.answer) &&
  !["outdated", "superseded", "rejected"].includes(answer.status || "confirmed") &&
  !/\b(outdated|superseded|rejected)\b/i.test(answer.answer),
 )
 return questions.filter((question) => {
  if (reopened.has(question.id)) return true
  const exactAnswer = validAnswers.some((answer) =>
   answer.questionId === question.id ||
   (clean(answer.question).toLowerCase() === clean(question.question).toLowerCase() && answer.category === question.category),
  )
  if (exactAnswer) return false

  // Preference questions remain answered across regenerated prompt IDs. Facts stay
  // question-specific because one saved channel fact must not suppress other facts.
  if (["creator_goal", "content_style", "audience_insight"].includes(question.category)) {
   return !validAnswers.some((answer) => answer.category === question.category)
  }
  return true
 })
}

const THREAD_HINT_KEY = (channelId?: string | null): string =>
 `vt_ai_brain_thread_seen_${channelId || "default"}`

/**
 * A synchronous hint that a channel has saved conversation turns. IndexedDB reads are
 * async, so this lets the UI decide, on the very first render, whether to hold for a
 * restored conversation (avoiding a launchpad flash) or show the launchpad immediately.
 */
export const markAIBrainThreadSeen = (channelId?: string | null): void => {
 try {
  localStorage.setItem(THREAD_HINT_KEY(channelId), "1")
 } catch {
  /* storage unavailable: fall back to the async path */
 }
}

export const aiBrainThreadHasTurnsHint = (channelId?: string | null): boolean => {
 try {
  return localStorage.getItem(THREAD_HINT_KEY(channelId)) === "1"
 } catch {
  return false
 }
}

const defaultThreadId = (channelId?: string | null): string =>
 `ai_brain_thread_${channelId || "default"}`

const titleFromPrompt = (value: string): string =>
 sanitizeCreatorFacingBrainCopy(value).slice(0, 72) || "ViewTube Brain conversation"

const summarizeThread = (turns: AIBrainConversationTurn[]): string =>
 turns
  .filter((turn) => turn.status !== "pending")
  .slice(-4)
  .map((turn) => `${turn.rawUserMessage ?? turn.userText}: ${turn.response?.keyInsight || turn.assistantText}`)
  .join(" ")
  .slice(0, 1400)

export const sanitizeCreatorFacingBrainCopy = (value: string): string =>
 clean(value)
  .replace(/\bVT-SYNC\b/gi, "your synced channel data")
  .replace(/\bsync bundles?\b/gi, "data areas")
  .replace(/\bbundles?\b/gi, "data areas")
  .replace(/\bmanifest\b/gi, "channel data summary")
  .replace(/\bdiagnostics?\b/gi, "channel data notes")
  .replace(/\bIndexedDB\b/g, "saved Brain memory")
  .replace(/\blocalStorage\b/g, "saved Brain memory")
  .replace(/\bAPI\b/g, "channel data")
  .replace(/\bfunctions?\b/gi, "tools")
  .replace(/\btechnical\b/gi, "channel")
  .replace(/\bfailed\b/gi, "incomplete")
  .replace(/\berror\b/gi, "gap")
  .replace(/\bsync process\b/gi, "channel data")
  .replace(/\bProfile Confidence\b/gi, "Channel Read")
  .replace(/\bWhat The Brain Learned\b/gi, "Saved Context")
  .replace(/\bBest Next Action\b/gi, "What To Do Next")

const statusFor = (ready: boolean, partial: boolean): CreatorGrowthCapabilityStatus =>
 ready ? "ready" : partial ? "partial" : "missing"

const firstOr = (values: string[], fallback: string): string => values.map(clean).find(Boolean) || fallback

export const buildCreatorGrowthContext = (
 snapshot: AIBrainContextSnapshot,
 recentTurns: AIBrainConversationTurn[] = [],
 learningEntries: AIBrainLearningEntry[] = [],
): CreatorGrowthContext => {
 const profileReady = snapshot.inferredProfile.status !== "missing"
 const pillars = snapshot.inferredProfile.contentPillars.slice(0, 5)
 const topVideos = snapshot.inferredProfile.topEvidenceVideos.slice(0, 5)
 const recentFacts = recentTurns
  .flatMap((turn) => turn.digest?.keyFacts || [])
  .map(sanitizeCreatorFacingBrainCopy)
  .slice(0, 8)
 const learnedFacts = learningEntries
  .filter((entry) => ["creator_goal", "content_style", "channel_fact", "preference"].includes(entry.category))
  .map((entry) => sanitizeCreatorFacingBrainCopy(entry.summary))
  .slice(0, 8)
 const currentGoal = snapshot.brain.futureStateMap || firstOr(learnedFacts, "Pick one measurable channel goal for this month.")
 const topPatterns = snapshot.inferredProfile.successDrivers.length
  ? snapshot.inferredProfile.successDrivers.map(sanitizeCreatorFacingBrainCopy)
  : topVideos.map((video) => `${video.title}${typeof video.views === "number" ? ` has ${video.views.toLocaleString()} views` : ""}`)
 const audiencePromise = profileReady
  ? `Your audience promise appears connected to ${firstOr(snapshot.inferredProfile.topicClusters.slice(0, 3), "your strongest recurring channel themes")}. Make the next upload clearly promise that payoff in the title, opening hook, and thumbnail.`
  : "The Brain needs more title, topic, and audience evidence before it can state a reliable audience promise."
 const seoQueue = snapshot.inferredProfile.topicClusters.slice(0, 5).map((cluster) =>
  `Build one search-friendly title and description angle around ${cluster}.`,
 )
 const dailyActions = [
  "Choose one growth goal before changing titles or formats.",
  profileReady ? "Turn the strongest profile lane into one repeatable upload idea." : "Answer one profile question so the Brain can rank opportunities.",
  "Improve one title, hook, thumbnail promise, or end screen today.",
 ]
 const profileCoverage = buildBrainProfileCoverageItems(snapshot).map(({ id, label, complete }) => ({ id, label, complete }))
 const confirmedProfileChecks = profileCoverage.filter((item) => item.complete).length
 const incompleteProfileChecks = profileCoverage.filter((item) => !item.complete).map((item) => item.label)

 return {
  profileCoverage,
  currentGoal,
  inferredNiche: snapshot.inferredProfile.niche || "Channel niche still needs stronger creator confirmation.",
  contentPillars: pillars,
  topPerformerPatterns: topPatterns,
  audiencePromise,
  memoryChanges: learnedFacts,
  newUploadFitChecklist: [
   "Does the topic match one confirmed content pillar?",
   "Does the title promise a clear viewer payoff?",
   "Does the first 30 seconds prove the promise fast?",
   "Does the thumbnail make the audience and outcome obvious?",
  ],
  dailyOracleActions: dailyActions,
  journalProfileUpdates: learningEntries
   .filter((entry) => entry.source === "journal")
   .map((entry) => sanitizeCreatorFacingBrainCopy(entry.summary))
   .slice(0, 5),
  goalAwareRecommendations: [
   `Current goal direction: ${sanitizeCreatorFacingBrainCopy(currentGoal)}`,
   "Rank ideas by the goal they serve: views, subscribers, revenue, watch time, consistency, or workflow.",
  ],
  seoOpportunityQueue: seoQueue.length ? seoQueue : ["Confirm the channel niche, then build a focused SEO opportunity queue."],
  unresolvedQuestions: recentTurns
   .flatMap((turn) => turn.response?.questions || [])
   .map((question) => question.question)
   .slice(0, 6),
  recentConversationFacts: recentFacts,
  capabilities: [
   {
    id: "profile_coverage",
    label: "Profile Coverage Checklist",
    status: statusFor(profileCoverage.length > 0 && confirmedProfileChecks === profileCoverage.length, confirmedProfileChecks > 0),
    summary: `${confirmedProfileChecks} of ${profileCoverage.length} profile checks confirmed${incompleteProfileChecks.length ? `; still to confirm: ${incompleteProfileChecks.join(", ")}` : ""}.`,
   },
   {
    id: "creator_confirmation",
    label: "Creator Confirmation",
    status: statusFor(recentTurns.some((turn) => turn.questionAnswers.length > 0), recentTurns.length > 0),
    summary: "Creator answers are saved into the Brain conversation thread.",
   },
   {
    id: "top_performer_patterns",
    label: "Top Performer Patterns",
    status: statusFor(topPatterns.length > 0, topVideos.length > 0),
    summary: firstOr(topPatterns, "Top performer patterns need more video evidence."),
   },
   {
    id: "audience_promise",
    label: "Audience Promise",
    status: statusFor(profileReady, snapshot.inferredProfile.topicClusters.length > 0),
    summary: audiencePromise,
   },
   {
    id: "memory_change_log",
    label: "Memory Change Log",
    status: statusFor(learningEntries.length > 0, recentTurns.length > 0),
    summary: learningEntries.length ? `${learningEntries.length} recent Brain learning entries.` : "No recent creator learning entries yet.",
   },
   {
    id: "new_upload_fit",
    label: "New Upload Fit",
    status: statusFor(profileReady, snapshot.inferredProfile.topicClusters.length > 0),
    summary: "Draft ideas can be checked against niche, pillar, promise, hook, and packaging fit.",
   },
   {
    id: "daily_oracle",
    label: "Daily Oracle",
    status: "ready",
    summary: dailyActions[0],
   },
   {
    id: "journal_profile_updates",
    label: "Journal Profile Updates",
    status: statusFor(learningEntries.some((entry) => entry.source === "journal"), learningEntries.length > 0),
    summary: "AI Journal entries can update goals, style, constraints, and audience notes.",
   },
   {
    id: "goal_aware_recommendations",
    label: "Goal-Aware Recommendations",
    status: currentGoal ? "ready" : "partial",
    summary: sanitizeCreatorFacingBrainCopy(currentGoal),
   },
   {
    id: "seo_opportunity_queue",
    label: "SEO Opportunity Queue",
    status: statusFor(seoQueue.length > 0, profileReady),
    summary: firstOr(seoQueue, "SEO queue needs clearer topic clusters."),
   },
  ],
 }
}

export const formatCreatorGrowthModules = (
 response: CreatorBrainResponse,
 growthContext: CreatorGrowthContext,
 requestText = "",
): AIBrainAnswerModule[] => {
 const request = clean(requestText).toLowerCase()
 const asksForPlan = /\b(plan|strategy|roadmap|priorit(?:y|ies)|next steps|recommend|what should i|how can i improve|help me grow|30[- ]day|weekly|daily|action plan|steps to)\b/.test(request)
 const asksForDiagnosis = /\b(diagnos|why (?:are|did|do|is|has|have)|what caused|what changed|root cause|drop|spike|decline|performance|revenue|rpm|ctr|retention|traffic source|analytics)\b/.test(request)
 const isAssetRequest = response.mode === "creator_asset_draft"
 const isDiagnosis = response.mode === "analytics_diagnosis" || response.mode === "revenue_levers" || asksForDiagnosis
 const isStrategyIntent = asksForPlan || [
  "strategy_brief",
  "goal_coach",
  "publishing_checklist",
  "video_idea_sprint",
  "seo_keyword_plan",
  "journal_reflection",
 ].includes(response.mode)
 const isDirectFactualQuestion = /^(what|who|when|where|which|how many|how much|is|are|does|do|can|did)\b/.test(request) &&
  !asksForPlan && !asksForDiagnosis && !isAssetRequest

 const modules: AIBrainAnswerModule[] = response.modules?.length ? response.modules : (response.sections || []).map((section) => ({
  id: section.id,
  title: section.title,
  body: section.body,
  tone: section.tone,
  source: section.id === "why" ? "analytics" : "growth",
 }))
 const cleaned = modules
  .map((item) => ({
   ...item,
   title: sanitizeCreatorFacingBrainCopy(item.title),
   body: sanitizeCreatorFacingBrainCopy(item.body),
  }))
  .filter((item) => !/profile confidence|growth read|content opportunity|what the brain learned|best next action|seo queue/i.test(item.title))
  .filter((item) => {
   const title = item.title.toLowerCase()
   if (/30-day goal path/.test(title)) return isStrategyIntent
   if (/why this is happening/.test(title)) return isDiagnosis || isStrategyIntent
   return true
  })

 // Asset requests should return the asset itself. Factual answers should stay direct.
 // Diagnosis keeps only supplied evidence/caveat modules; it must not inherit a plan.
 if (isAssetRequest) return cleaned.slice(0, 4)
 if (isDiagnosis) return cleaned.slice(0, 4)
 if (isDirectFactualQuestion) return cleaned.slice(0, 2)
 if (cleaned.length >= 2) return cleaned.slice(0, 4)
 if (!isStrategyIntent) return cleaned.slice(0, 4)

 const topPattern = firstOr(growthContext.topPerformerPatterns, firstOr(growthContext.contentPillars, growthContext.inferredNiche))
 const goal = sanitizeCreatorFacingBrainCopy(growthContext.currentGoal)
 const fallbackModules: AIBrainAnswerModule[] = [
  {
   id: "what-to-do-next",
   title: "What To Do Next",
   body: sanitizeCreatorFacingBrainCopy(response.nextAction || response.keyInsight || `Pick one repeatable channel move tied to ${goal}.`),
   tone: "green",
   source: "growth",
  },
  {
   id: "why-this-is-happening",
   title: "Why This Is Happening",
   body: topPattern
    ? `The clearest channel pattern to use right now is ${sanitizeCreatorFacingBrainCopy(topPattern)}. Build the next decision around that evidence instead of treating every upload as a new experiment.`
    : "The safest move is to connect the next upload to one clear viewer promise, then judge it by views, watch time, subscribers, and comments.",
   tone: "blue",
   source: "analytics",
  },
  {
   id: "thirty-day-goal-path",
   title: "30-Day Goal Path",
   body: goal || "Choose one 30-day target for views, subscribers, watch time, revenue, output, CTR, comments, or RPM so the Brain can rank advice by the result that matters.",
   tone: "yellow",
   source: "oracle",
  },
 ]
 return fallbackModules.slice(0, 3)
}

/** Read a canonical saved turn without creating a second persistence path. */
export const getAIBrainConversationTurn = async (turnId: string): Promise<AIBrainConversationTurn | null> =>
 getAIBrainConversationTurnDB(turnId)

/** Append a local interaction receipt to the canonical turn metadata in IndexedDB. */
export const recordAIBrainTurnInteraction = async (
 turnId: string,
 event: { type: string; direction: "inbound" | "outbound" | "local"; detail?: Record<string, unknown> },
): Promise<AIBrainConversationTurn> => {
 const existing = await getAIBrainConversationTurnDB(turnId)
 if (!existing) throw new Error(`AI Brain turn not found: ${turnId}`)
 const currentLog = Array.isArray(existing.metadata?.interactionLog)
  ? existing.metadata.interactionLog as Array<Record<string, unknown>>
  : []
 const receipt = {
  id: makeId("brain_interaction"),
  type: event.type,
  direction: event.direction,
  at: nowIso(),
  ...(event.detail || {}),
 }
 const detail = event.detail || {}
 const snapshot = detail.modelInputSnapshot
 const rootSnapshotUpdates = event.type === "model_input_snapshot"
  && !existing.metadata?.originalModelInputSnapshot
  && snapshot
  ? { originalModelInputSnapshot: snapshot }
  : event.type === "retry_model_input_snapshot" && snapshot
   ? { latestRetryModelInputSnapshot: snapshot }
   : {}
 const updated: AIBrainConversationTurn = {
  ...existing,
  updatedAt: nowIso(),
  metadata: { ...(existing.metadata || {}), ...rootSnapshotUpdates, interactionLog: [...currentLog, receipt] },
 }
 await saveAIBrainConversationTurnDB(updated)
 return updated
}

export const saveAIBrainConversationTurn = async (input: {
 channelId?: string | null
 userText: string
 assistantText: string
 response?: CreatorBrainResponse
 answerModules?: AIBrainAnswerModule[]
 questionAnswers?: AIBrainQuestionAnswer[]
 feedback?: AIBrainConversationTurn["feedback"]
 learningEntryIds?: string[]
 metadata?: Record<string, unknown>
}): Promise<AIBrainConversationTurn> => {
 const pending = await beginAIBrainTurn({
  channelId: input.channelId,
  userText: input.userText,
  metadata: input.metadata,
 })
 return completeAIBrainTurn({
  turnId: pending.id,
  status: "complete",
  assistantText: input.assistantText,
  response: input.response,
  answerModules: input.answerModules,
  questionAnswers: input.questionAnswers,
  feedback: input.feedback,
  learningEntryIds: input.learningEntryIds,
  metadata: input.metadata,
 })
}

export const beginAIBrainTurn = async (input: {
 channelId?: string | null
 userText: string
 metadata?: Record<string, unknown>
}): Promise<AIBrainConversationTurn> => {
 const createdAt = nowIso()
 const channelId = input.channelId || null
 const threadId = defaultThreadId(channelId)
 const existingThread = (await listAIBrainConversationThreadsDB(channelId))
  .find((thread) => thread.id === threadId)
 const suppliedInteractionLog = Array.isArray(input.metadata?.interactionLog)
  ? input.metadata.interactionLog as Array<Record<string, unknown>>
  : []
 const hasInputReceipt = suppliedInteractionLog.some((event) =>
  event.type === "creator_input" && event.direction === "inbound" && event.text === input.userText,
 )
 const source = String(input.metadata?.source || "")
 const inboundType = source === "feedback"
  ? "creator_feedback"
  : source === "question_module"
   ? "creator_answer"
   : "creator_input"
 const interactionLog = hasInputReceipt
  ? suppliedInteractionLog
  : [...suppliedInteractionLog, {
   id: makeId("brain_interaction"),
   type: inboundType,
   direction: "inbound",
   at: createdAt,
   text: input.userText,
  }]
 const turn: AIBrainConversationTurn = {
  id: makeId("ai_brain_turn"),
  threadId,
  channelId,
  createdAt,
  updatedAt: createdAt,
  status: "pending",
  rawUserMessage: input.userText,
  displayUserMessage: sanitizeCreatorFacingBrainCopy(input.userText),
  userText: input.userText,
  assistantText: "",
  answerModules: [],
  questionAnswers: [],
  learningEntryIds: [],
  metadata: { ...(input.metadata || {}), interactionLog },
 }
 const thread: AIBrainConversationThread = existingThread || {
  id: threadId,
  channelId,
  createdAt,
  updatedAt: createdAt,
  title: titleFromPrompt(input.userText),
  turnIds: [],
 }
 thread.updatedAt = createdAt
 thread.selectedTurnId = turn.id
 thread.turnIds = Array.from(new Set([...thread.turnIds, turn.id]))
 await saveAIBrainConversationTurnDB(turn)
 await saveAIBrainConversationThreadDB(thread)
 markAIBrainThreadSeen(channelId)
 return turn
}

export const retryAIBrainTurn = async (
 turnId: string,
 options: { mode?: "saved" | "fresh"; evidenceIds?: string[] } = {},
): Promise<AIBrainConversationTurn> => {
 const existing = await getAIBrainConversationTurnDB(turnId)
 if (!existing) throw new Error(`AI Brain turn not found: ${turnId}`)
 if (existing.status !== "interrupted") {
  throw new Error(`Only interrupted AI Brain turns can be retried: ${turnId}`)
 }

 const updatedAt = nowIso()
 const retryCount = Number(existing.metadata?.retryCount || 0) + 1
 const mode = options.mode || "saved"
 const retryAttempts = Array.isArray(existing.metadata?.retryAttempts)
  ? existing.metadata.retryAttempts as Array<Record<string, unknown>>
  : []
 const interactionLog = Array.isArray(existing.metadata?.interactionLog)
  ? existing.metadata.interactionLog as Array<Record<string, unknown>>
  : []
 const retryEvent = {
  id: makeId("brain_interaction"),
  type: "generation_retry",
  direction: "local",
  at: updatedAt,
  evidenceMode: mode,
  evidenceIds: (options.evidenceIds || []).slice(0, 100),
 }
 const turn: AIBrainConversationTurn = {
  ...existing,
  updatedAt,
  status: "pending",
  assistantText: "",
  response: undefined,
  answerModules: [],
  citations: undefined,
  evaluation: undefined,
  metadata: {
   ...(existing.metadata || {}),
   retryCount,
   lastRetryAt: updatedAt,
   retryEvidenceMode: mode,
   retryAttempts: [...retryAttempts, { ...retryEvent }],
   interactionLog: [...interactionLog, retryEvent],
  },
 }
 await saveAIBrainConversationTurnDB(turn)

 const thread = await getAIBrainConversationThreadDB(existing.threadId)
 if (thread) {
  thread.updatedAt = updatedAt
  thread.selectedTurnId = existing.id
  await saveAIBrainConversationThreadDB(thread)
 }
 return turn
}


export const completeAIBrainTurn = async (input: {
 turnId: string
 status: Exclude<AIBrainConversationTurnStatus, "pending">
 assistantText: string
 response?: CreatorBrainResponse
 answerModules?: AIBrainAnswerModule[]
 questionAnswers?: AIBrainQuestionAnswer[]
 feedback?: AIBrainConversationTurn["feedback"]
 learningEntryIds?: string[]
 citations?: AIBrainConversationTurn["citations"]
 evaluation?: AIBrainConversationTurn["evaluation"]
 metadata?: Record<string, unknown>
}): Promise<AIBrainConversationTurn> => {
 const existing = await getAIBrainConversationTurnDB(input.turnId)
 if (!existing) throw new Error(`AI Brain turn not found: ${input.turnId}`)
 const updatedAt = nowIso()
 const digest: AIBrainConversationDigest = buildConversationAnalyticDigest({
  channelId: existing.channelId,
  userText: existing.rawUserMessage ?? existing.userText,
  response: input.response || input.assistantText,
  learningEntryIds: input.learningEntryIds || existing.learningEntryIds,
 })
 const existingMetadata = existing.metadata || {}
 const mergedMetadata = { ...existingMetadata, ...(input.metadata || {}) }
 const interactionLog = Array.isArray(existingMetadata.interactionLog)
  ? existingMetadata.interactionLog as Array<Record<string, unknown>>
  : []
 const outboundEvent = {
  id: makeId("brain_interaction"),
  type: "assistant_response",
  direction: "outbound",
  at: updatedAt,
  status: input.status,
  text: input.assistantText,
  responseId: input.response?.id || null,
  evidenceIds: Array.isArray(mergedMetadata.evidenceIds) ? mergedMetadata.evidenceIds : [],
  promptEvidenceRecordIds: Array.isArray(mergedMetadata.promptEvidenceRecordIds) ? mergedMetadata.promptEvidenceRecordIds : [],
  creatorAnswerEvidenceRecordIds: Array.isArray(mergedMetadata.creatorAnswerEvidenceRecordIds) ? mergedMetadata.creatorAnswerEvidenceRecordIds : [],
  evidenceIntegrityStatus: typeof mergedMetadata.evidenceIntegrityStatus === "string" ? mergedMetadata.evidenceIntegrityStatus : "recorded_with_turn_metadata",
 }
 const turn: AIBrainConversationTurn = {
  ...existing,
  updatedAt,
  status: input.status,
  assistantText: sanitizeCreatorFacingBrainCopy(input.assistantText),
  response: input.response,
  answerModules: input.answerModules || input.response?.modules || [],
  questionAnswers: input.questionAnswers || existing.questionAnswers || [],
  feedback: input.feedback || existing.feedback,
  learningEntryIds: input.learningEntryIds || existing.learningEntryIds || [],
  citations: input.citations,
  evaluation: input.evaluation,
  digest,
  metadata: { ...mergedMetadata, interactionLog: [...interactionLog, outboundEvent] },
 }
 await saveAIBrainConversationTurnDB(turn)

 const allTurns = (await listAIBrainConversationTurnsDB(existing.channelId))
  .filter((item) => item.threadId === existing.threadId)
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
 const storedThread = (await listAIBrainConversationThreadsDB(existing.channelId))
  .find((thread) => thread.id === existing.threadId)
 const thread: AIBrainConversationThread = storedThread || {
  id: existing.threadId,
  channelId: existing.channelId,
  createdAt: existing.createdAt,
  updatedAt,
  title: titleFromPrompt(existing.userText),
  turnIds: [],
 }
 thread.updatedAt = updatedAt
 thread.selectedTurnId = turn.id
 thread.turnIds = Array.from(new Set([...thread.turnIds, ...allTurns.map((item) => item.id)]))
 thread.latestDigest = digest
 thread.rollingSummary = summarizeThread(allTurns)
 await saveAIBrainConversationThreadDB(thread)
 return turn
}

export const resumeAIBrainThread = async (
 channelId?: string | null,
): Promise<{ thread: AIBrainConversationThread; turns: AIBrainConversationTurn[] }> => {
 const normalizedChannelId = channelId || null
 const threadId = defaultThreadId(normalizedChannelId)
 let turns: AIBrainConversationTurn[] = (await listAIBrainConversationTurnsDB(normalizedChannelId))
  .filter((turn) => !turn.threadId || turn.threadId === threadId)
  .map((turn) => ({
   ...turn,
   rawUserMessage: turn.rawUserMessage ?? turn.userText,
   displayUserMessage: turn.displayUserMessage ?? turn.userText,
   threadId: turn.threadId || threadId,
   updatedAt: turn.updatedAt || turn.createdAt,
   status: turn.status || "complete" as const,
   answerModules: turn.answerModules || turn.response?.modules || [],
   questionAnswers: turn.questionAnswers || [],
   learningEntryIds: turn.learningEntryIds || [],
  }))
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

 const hadPending = turns.some((turn) => turn.status === "pending")
 for (const turn of turns.filter((item) => item.status === "pending")) {
  await completeAIBrainTurn({
   turnId: turn.id,
   status: "interrupted",
   assistantText: "That response was interrupted. Send the question again and I will continue from the saved conversation.",
   metadata: { interruptedOnResume: true },
  })
 }
 if (hadPending) {
  turns = (await listAIBrainConversationTurnsDB(normalizedChannelId))
   .filter((turn) => turn.threadId === threadId)
   .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
 }

 const stored = (await listAIBrainConversationThreadsDB(normalizedChannelId))
  .find((thread) => thread.id === threadId)
 const timestamp = turns.at(-1)?.updatedAt || turns.at(-1)?.createdAt || nowIso()
 const thread: AIBrainConversationThread = stored || {
  id: threadId,
  channelId: normalizedChannelId,
  createdAt: turns[0]?.createdAt || timestamp,
  updatedAt: timestamp,
  title: titleFromPrompt(turns[0]?.userText || "ViewTube Brain conversation"),
  turnIds: turns.map((turn) => turn.id),
  selectedTurnId: turns.at(-1)?.id,
  rollingSummary: summarizeThread(turns),
  latestDigest: turns.at(-1)?.digest,
 }
 await saveAIBrainConversationThreadDB(thread)
 return { thread, turns }
}

export const listAIBrainConversationTurns = async (input: {
 channelId?: string | null
 limit?: number
} = {}): Promise<AIBrainConversationTurn[]> => {
 const turns = await listAIBrainConversationTurnsDB(input.channelId)
 return turns.map((turn) => ({
  ...turn,
  rawUserMessage: turn.rawUserMessage ?? turn.userText,
  displayUserMessage: turn.displayUserMessage ?? turn.userText,
  updatedAt: turn.updatedAt || turn.createdAt,
  status: turn.status || "complete",
  answerModules: turn.answerModules || turn.response?.modules || [],
  questionAnswers: turn.questionAnswers || [],
  learningEntryIds: turn.learningEntryIds || [],
 })).slice(0, input.limit || 20)
}

export const answerAIBrainQuestionModule = async (input: {
 channelId?: string | null
 question: CreatorBrainLearningQuestion
 answer: string
}): Promise<AIBrainQuestionAnswer> => {
 const normalizedAnswer = clean(input.answer).toLocaleLowerCase()
 const priorTurns = await listAIBrainConversationTurnsDB(input.channelId || null)
 const priorAnswers = priorTurns.flatMap((turn) => turn.questionAnswers || [])
 const priorAnswer = priorAnswers.find((answer) =>
  answer.questionId === input.question.id &&
  clean(answer.answer).toLocaleLowerCase() === normalizedAnswer &&
  !["outdated", "superseded", "rejected"].includes(answer.status || "confirmed") &&
  !/\b(outdated|superseded|rejected)\b/i.test(answer.answer),
 )
 if (priorAnswer) return priorAnswer

 const entry = await captureAIBrainLearningEvent({
  channelId: input.channelId || null,
  source: "copilot",
  summary: `Creator answered: ${input.question.question}`,
  detail: input.answer,
  category: input.question.category,
  confidence: "high",
  evidence: ["AI Brain question module"],
 })
 const answer: AIBrainQuestionAnswer = {
  id: makeId("ai_brain_question_answer"),
  questionId: input.question.id,
  channelId: input.channelId || null,
  question: input.question.question,
  answer: input.answer,
  category: input.question.category,
  createdAt: nowIso(),
  learningEntryId: entry.id,
  status: "confirmed",
 }
 const broadPreferenceCategory = ["creator_goal", "content_style", "audience_insight"].includes(input.question.category)
 for (const turn of priorTurns) {
  let changed = false
  const questionAnswers = (turn.questionAnswers || []).map((savedAnswer) => {
   const sameScope = savedAnswer.questionId === input.question.id ||
    (broadPreferenceCategory && savedAnswer.category === input.question.category)
   const savedAnswerIsCurrent = !["outdated", "superseded", "rejected"].includes(savedAnswer.status || "confirmed") &&
    !/\b(outdated|superseded|rejected)\b/i.test(savedAnswer.answer)
   if (!sameScope || !savedAnswerIsCurrent || clean(savedAnswer.answer).toLocaleLowerCase() === normalizedAnswer) return savedAnswer
   changed = true
   return {
    ...savedAnswer,
    status: "superseded" as const,
    supersededByAnswerId: answer.id,
    statusReason: "Replaced by a newer creator answer in the same question scope.",
   }
  })
  if (changed) {
   await saveAIBrainConversationTurnDB({ ...turn, updatedAt: nowIso(), questionAnswers })
  }
 }
 await saveAIBrainConversationTurn({
  channelId: input.channelId || null,
  userText: input.answer,
  assistantText: `Saved your answer for: ${input.question.question}`,
  questionAnswers: [answer],
  learningEntryIds: [entry.id],
  metadata: {
   source: "question_module",
   learningReceiptSnapshot: {
    entryId: entry.id,
    summary: entry.summary,
    detail: entry.detail,
    category: entry.category,
    status: entry.status,
    scope: entry.status === "promoted" ? "durable_knowledge" : "learning_ledger_not_durable",
    createdAt: entry.createdAt,
   },
  },
 })
 return answer
}
