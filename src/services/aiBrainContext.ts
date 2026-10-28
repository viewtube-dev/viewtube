import type { ChannelContextProfile } from "../context/ChannelContextProfile"
export type BrainPrimaryGoal =
 | "views"
 | "subscribers"
 | "revenue"
 | "retention"
 | "consistency"
 | "watch_time"
 | "output"
 | "engagement"
 | "comments"
 | "ctr"
 | "rpm"

export type AiBrainGoalMetric =
 | "views"
 | "subscribers"
 | "watch_hours"
 | "revenue"
 | "new_videos"
 | "ctr"
 | "comments"
 | "rpm"

export type AiBrainGoalTarget = {
 metric: AiBrainGoalMetric
 label: string
 currentValue: number | null
 recommendedTarget: number | null
 userTarget: number | null
 rationale: string
 source: "analytics" | "creator" | "default"
}

export type AiBrainCreatorProfile = {
 channelDescription: string
 mainTopicFocus: string
 audienceDescription: string
 successDefinition: string
 mainYoutubeGoal: string
 recurringSeriesName: string
 recurringSeriesDescription: string
 biggestWeakness: string
 mostSuccessfulVideo: string
 signupReason: string
}

export type AiBrainContext = AiBrainCreatorProfile & {
 whatNext: string
 primaryGoal: BrainPrimaryGoal
 audienceNiche: string
 oneMonthGoals: AiBrainGoalTarget[]
 completedAt: string | null
 deferredAt: string | null
 updatedAt: string | null
 source: "wizard" | "settings_migration" | "legacy" | "system"
 version: 2
 channelContext: ChannelContextProfile
}

export type AiBrainContextInput = Partial<AiBrainCreatorProfile> &
 Partial<Pick<AiBrainContext, "whatNext" | "primaryGoal" | "audienceNiche" | "oneMonthGoals" | "deferredAt" | "source" | "channelContext">>

export const AI_BRAIN_INTAKE_QUESTIONS: Array<{
 id: keyof AiBrainCreatorProfile
 label: string
 prompt: string
 placeholder: string
}> = [
 {
  id: "channelDescription",
  label: "Channel Description",
  prompt: "How would you describe your channel in 3 sentences?",
  placeholder: "What do you make, who is it for, and why should viewers care?",
 },
 {
  id: "mainTopicFocus",
  label: "Topic Focus",
  prompt: "What is your channel's main topic focus or niche?",
  placeholder: "Example: cinematic military history explainers, restoration projects, creator business advice...",
 },
 {
  id: "audienceDescription",
  label: "Audience",
  prompt: "How would you describe your channel's audience and subscribers?",
  placeholder: "Who watches, what do they want, and what do they already know?",
 },
 {
  id: "successDefinition",
  label: "Success",
  prompt: "How would you define success for your channel?",
  placeholder: "Views, subscribers, watch time, revenue, output, brand deals, a community, better videos...",
 },
 {
  id: "mainYoutubeGoal",
  label: "Main Goal",
  prompt: "What is your main goal on YouTube?",
  placeholder: "Example: reach monetization, grow long-form views, make revenue steadier, publish weekly...",
 },
 {
  id: "recurringSeriesName",
  label: "Series Name",
  prompt: "If you released a regular video series, what would you call it?",
  placeholder: "Example: History in Motion, Creator Clinic, 7-Day Build...",
 },
 {
  id: "recurringSeriesDescription",
  label: "Series Idea",
  prompt: "What would that recurring video series be about?",
  placeholder: "Describe the format, viewer payoff, and why someone would return for another episode.",
 },
 {
  id: "biggestWeakness",
  label: "Biggest Weakness",
  prompt: "What would you say your biggest weakness is on YouTube and why?",
  placeholder: "Examples: consistency, titles, thumbnails, retention, speed, niche clarity, editing, monetization...",
 },
 {
  id: "mostSuccessfulVideo",
  label: "Best Video",
  prompt: "What is your most successful video to date?",
  placeholder: "Paste the title or describe it. Add why you think it worked if you know.",
 },
 {
  id: "signupReason",
  label: "Why ViewTube",
  prompt: "What made you connect ViewTube?",
  placeholder: "Example: understand analytics, plan better content, monetize, generate ideas, manage the channel...",
 },
]

const STORAGE_KEY = "vt_ai_brain_context_v1"
const COMPLETED_KEY = "vt_ai_brain_context_completed_v1"
const DISMISSED_KEY = "vt_ai_brain_context_dismissed_v1"

const scopedKey = (key: string, channelId?: string | null): string =>
 channelId ? `${key}:channel:${encodeURIComponent(channelId.trim().toLocaleLowerCase())}` : key

const readStoredContext = (key: string): AiBrainContext | null => {
 try {
  const raw = localStorage.getItem(key)
  return raw ? normalizeContext(JSON.parse(raw) as Partial<AiBrainContext>) : null
 } catch {
  return null
 }
}

const sameChannelLabel = (left?: string | null, right?: string | null): boolean => {
 const normalize = (value?: string | null) => String(value || "").trim().replace(/^@/, "").replace(/\\s+/g, " ").toLocaleLowerCase()
 return Boolean(normalize(left) && normalize(left) === normalize(right))
}

const defaultGoalTargets = (): AiBrainGoalTarget[] => [
 { metric: "views", label: "Views", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "Set a realistic one-month view target once the Brain sees your current pace.", source: "default" },
 { metric: "subscribers", label: "Subscribers", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "Use a subscriber target that matches your view volume and conversion rate.", source: "default" },
 { metric: "watch_hours", label: "Watch Hours", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "Watch-hour goals help the Brain prioritize retention and long-form structure.", source: "default" },
 { metric: "revenue", label: "Revenue", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "Revenue goals should follow monetization status, RPM, and upload mix.", source: "default" },
 { metric: "new_videos", label: "New Videos", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "Output goals keep strategy connected to an upload schedule you can actually sustain.", source: "default" },
 { metric: "ctr", label: "CTR", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "CTR goals help prioritize titles, thumbnails, and topic packaging.", source: "default" },
 { metric: "comments", label: "Comments", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "Comment goals help the Brain improve audience prompts and community engagement.", source: "default" },
 { metric: "rpm", label: "RPM", currentValue: null, recommendedTarget: null, userTarget: null, rationale: "RPM goals help separate pure view growth from revenue efficiency.", source: "default" },
]

const defaultContext: AiBrainContext = {
 channelDescription: "",
 mainTopicFocus: "",
 audienceDescription: "",
 successDefinition: "",
 mainYoutubeGoal: "",
 recurringSeriesName: "",
 recurringSeriesDescription: "",
 biggestWeakness: "",
 mostSuccessfulVideo: "",
 signupReason: "",
 whatNext: "",
 primaryGoal: "views",
 audienceNiche: "",
 oneMonthGoals: defaultGoalTargets(),
 completedAt: null,
 deferredAt: null,
 updatedAt: null,
 source: "system",
 version: 2,
 channelContext: { identity: {}, goals: {}, audience: {}, content: {}, brand: {}, intelligence: {} },
}

const clean = (value: unknown): string => String(value || "").replace(/\s+/g, " ").trim()

const normalizePrimaryGoal = (value: unknown): BrainPrimaryGoal => {
 const allowed: BrainPrimaryGoal[] = ["views", "subscribers", "revenue", "retention", "consistency", "watch_time", "output", "engagement", "comments", "ctr", "rpm"]
 return allowed.includes(value as BrainPrimaryGoal) ? (value as BrainPrimaryGoal) : "views"
}

const normalizeGoalTargets = (value: unknown): AiBrainGoalTarget[] => {
 const defaults = defaultGoalTargets()
 if (!Array.isArray(value)) return defaults
 const byMetric = new Map(defaults.map((goal) => [goal.metric, goal]))
 value.forEach((entry) => {
  if (!entry || typeof entry !== "object") return
  const target = entry as Partial<AiBrainGoalTarget>
  if (!target.metric || !byMetric.has(target.metric)) return
  const current = byMetric.get(target.metric)!
  byMetric.set(target.metric, {
   ...current,
   ...target,
   label: clean(target.label) || current.label,
   currentValue: typeof target.currentValue === "number" && Number.isFinite(target.currentValue) ? target.currentValue : current.currentValue,
   recommendedTarget: typeof target.recommendedTarget === "number" && Number.isFinite(target.recommendedTarget) ? target.recommendedTarget : current.recommendedTarget,
   userTarget: typeof target.userTarget === "number" && Number.isFinite(target.userTarget) ? target.userTarget : current.userTarget,
   rationale: clean(target.rationale) || current.rationale,
   source: target.source || current.source,
  })
 })
 return Array.from(byMetric.values())
}

const normalizeContext = (parsed: Partial<AiBrainContext> = {}): AiBrainContext => {
 const legacyWhatNext = clean(parsed.whatNext)
 const legacyAudience = clean(parsed.audienceNiche)
 return {
  ...defaultContext,
  channelDescription: clean(parsed.channelDescription),
  mainTopicFocus: clean(parsed.mainTopicFocus || legacyAudience),
  audienceDescription: clean(parsed.audienceDescription || legacyAudience),
  successDefinition: clean(parsed.successDefinition || legacyWhatNext),
  mainYoutubeGoal: clean(parsed.mainYoutubeGoal || legacyWhatNext),
  recurringSeriesName: clean(parsed.recurringSeriesName),
  recurringSeriesDescription: clean(parsed.recurringSeriesDescription),
  biggestWeakness: clean(parsed.biggestWeakness),
  mostSuccessfulVideo: clean(parsed.mostSuccessfulVideo),
  signupReason: clean(parsed.signupReason),
  whatNext: legacyWhatNext,
  primaryGoal: normalizePrimaryGoal(parsed.primaryGoal),
  audienceNiche: legacyAudience,
  oneMonthGoals: normalizeGoalTargets(parsed.oneMonthGoals),
  completedAt: parsed.completedAt || null,
  deferredAt: parsed.deferredAt || null,
  updatedAt: parsed.updatedAt || parsed.completedAt || null,
  source: parsed.version === 2 ? parsed.source || "system" : "legacy",
  version: 2,
  channelContext: parsed.channelContext && typeof parsed.channelContext === "object" ? parsed.channelContext : defaultContext.channelContext,
 }
}

/**
 * Load the profile for one channel. Legacy global data is only migrated when
 * its saved channel name exactly matches the active channel label; it is never
 * silently assigned to a different channel.
 */
export const loadAiBrainContext = (
 channelId?: string | null,
 activeChannelLabel?: string | null,
): AiBrainContext => {
 if (!channelId) return readStoredContext(STORAGE_KEY) || defaultContext
 const key = scopedKey(STORAGE_KEY, channelId)
 const scoped = readStoredContext(key)
 if (scoped) return scoped
 const legacy = readStoredContext(STORAGE_KEY)
 const label = activeChannelLabel || channelId
 if (legacy && sameChannelLabel(legacy.channelContext.identity.name, label)) {
  try {
   localStorage.setItem(key, JSON.stringify(legacy))
   localStorage.setItem(scopedKey(COMPLETED_KEY, channelId), legacy.completedAt ? "true" : "false")
  } catch {
   // Keep the original legacy record untouched if browser storage is unavailable.
  }
  return legacy
 }
 return defaultContext
}

/** Notify other Brain surfaces that the canonical local creator profile changed. */
const notifyCreatorContextUpdated = (context: AiBrainContext): void => {
 if (typeof window === "undefined") return
 window.dispatchEvent(new CustomEvent("vt_creator_channel_context_updated", {
  detail: { updatedAt: context.updatedAt, completedAt: context.completedAt },
 }))
}

export const syncLegacyAnswersToChannelContext = (
 profile: ChannelContextProfile,
 input: AiBrainContextInput,
 preserveExisting = false,
): ChannelContextProfile => {
 const next: ChannelContextProfile = {
  ...profile,
  identity: { ...profile.identity },
  goals: { ...profile.goals },
  audience: { ...profile.audience },
  content: { ...profile.content },
  intelligence: { ...profile.intelligence },
  brand: { ...profile.brand },
 }
 const fields: Array<{ key: keyof AiBrainCreatorProfile; path: string }> = [
  { key: "channelDescription", path: "identity.description" },
  { key: "mainTopicFocus", path: "identity.niche" },
  { key: "audienceDescription", path: "audience.idealViewer" },
  { key: "successDefinition", path: "goals.successDefinition" },
  { key: "mainYoutubeGoal", path: "goals.primaryGoal" },
  { key: "recurringSeriesName", path: "content.recurringSeriesName" },
  { key: "recurringSeriesDescription", path: "content.recurringSeriesDescription" },
  { key: "biggestWeakness", path: "content.biggestWeakness" },
  { key: "mostSuccessfulVideo", path: "content.mostSuccessfulVideo" },
  { key: "signupReason", path: "intelligence.signupReason" },
 ]
 const inputRecord = input as unknown as Record<string, unknown>
 fields.forEach(({ key, path }) => {
  if (!Object.prototype.hasOwnProperty.call(inputRecord, key)) return
  const [section, field] = path.split(".")
  const sectionRecord = next[section as keyof ChannelContextProfile] as Record<string, unknown>
  if (preserveExisting && clean(sectionRecord[field])) return
  sectionRecord[field] = clean(inputRecord[key])
 })
 if (!clean(inputRecord.mainTopicFocus) && clean(inputRecord.audienceNiche) && (!preserveExisting || !clean(next.identity.niche))) {
  next.identity.niche = clean(inputRecord.audienceNiche)
 }
 if (!clean(inputRecord.successDefinition) && clean(inputRecord.whatNext) && (!preserveExisting || !clean(next.goals.successDefinition))) {
  next.goals.successDefinition = clean(inputRecord.whatNext)
 }
 return next
}

export const saveAiBrainContext = (next: AiBrainContextInput, channelId?: string | null): AiBrainContext => {
 const previous = loadAiBrainContext(channelId, next.channelContext?.identity?.name)
 const updatedAt = new Date().toISOString()
 const migratedProfile = syncLegacyAnswersToChannelContext(previous.channelContext, previous, true)
 // Legacy intake surfaces sometimes submit a full stale profile object. Only project legacy
 // fields that actually changed in this save, so unchanged aliases cannot overwrite newer
 // canonical questionnaire answers.
 const legacyPatch: AiBrainContextInput = {}
 for (const question of AI_BRAIN_INTAKE_QUESTIONS) {
  const key = question.id
  if (!Object.prototype.hasOwnProperty.call(next, key)) continue
  if (clean((next as Record<string, unknown>)[key]) === clean((previous as Record<string, unknown>)[key])) continue
  ;(legacyPatch as Record<string, unknown>)[key] = (next as Record<string, unknown>)[key]
 }
 const canonicalProfile = syncLegacyAnswersToChannelContext(next.channelContext || migratedProfile, legacyPatch)
 const normalized = normalizeContext({
  ...previous,
  ...next,
  channelContext: canonicalProfile,
  whatNext: clean(next.whatNext ?? next.mainYoutubeGoal ?? previous.whatNext),
  primaryGoal: normalizePrimaryGoal(next.primaryGoal || previous.primaryGoal),
  audienceNiche: clean(next.audienceNiche ?? next.mainTopicFocus ?? previous.audienceNiche),
  oneMonthGoals: normalizeGoalTargets(next.oneMonthGoals || previous.oneMonthGoals),
  completedAt: updatedAt,
  deferredAt: null,
  updatedAt,
  source: next.source || "wizard",
  version: 2,
 })
 const payload = syncChannelContextToLegacyAnswers(normalized, canonicalProfile)
 localStorage.setItem(scopedKey(STORAGE_KEY, channelId), JSON.stringify(payload))
 localStorage.setItem(scopedKey(COMPLETED_KEY, channelId), "true")
 localStorage.removeItem(scopedKey(DISMISSED_KEY, channelId))
 notifyCreatorContextUpdated(payload)
 return payload
}

export const syncChannelContextToLegacyAnswers = (
 context: AiBrainContext,
 channelContext: ChannelContextProfile,
): AiBrainContext => ({
 ...context,
 channelContext,
 channelDescription: clean(channelContext.identity.description),
 mainTopicFocus: clean(channelContext.identity.niche),
 audienceDescription: clean(channelContext.audience.idealViewer),
 successDefinition: clean(channelContext.goals.successDefinition),
 mainYoutubeGoal: clean(channelContext.goals.primaryGoal),
 recurringSeriesName: clean(channelContext.content.recurringSeriesName),
 recurringSeriesDescription: clean(channelContext.content.recurringSeriesDescription),
 biggestWeakness: clean(channelContext.content.biggestWeakness),
 mostSuccessfulVideo: clean(channelContext.content.mostSuccessfulVideo),
 signupReason: clean(channelContext.intelligence.signupReason),
 whatNext: clean(channelContext.goals.successDefinition),
 audienceNiche: clean(channelContext.identity.niche),
})

export const saveChannelContextProfile = (channelContext: ChannelContextProfile, channelId?: string | null): AiBrainContext => {
 const previous = loadAiBrainContext(channelId, channelContext.identity.name)
 const normalized = normalizeContext({
  ...previous,
  channelContext,
  updatedAt: new Date().toISOString(),
 })
 const payload = syncChannelContextToLegacyAnswers(normalized, channelContext)
 localStorage.setItem(scopedKey(STORAGE_KEY, channelId), JSON.stringify(payload))
 notifyCreatorContextUpdated(payload)
 return payload
}

export const hasCompletedAiBrainContext = (channelId?: string | null): boolean =>
 localStorage.getItem(scopedKey(COMPLETED_KEY, channelId)) === "true" || Boolean(loadAiBrainContext(channelId).completedAt)

export const shouldShowAiBrainIntake = (isAuthenticated: boolean, channelId?: string | null): boolean => {
 if (!isAuthenticated) return false
 if (hasCompletedAiBrainContext(channelId)) return false
 if (localStorage.getItem(scopedKey(DISMISSED_KEY, channelId)) === "true") return false
 const hasSignupEmail = clean(localStorage.getItem("vt_signup_email")).length > 0
 const hasKnownEmail = clean(localStorage.getItem("vt_known_user_email")).length > 0
 return hasSignupEmail || hasKnownEmail
}

export const dismissAiBrainIntake = (channelId?: string | null): void => {
 const current = loadAiBrainContext(channelId)
 const deferredAt = new Date().toISOString()
 localStorage.setItem(scopedKey(STORAGE_KEY, channelId), JSON.stringify({ ...current, deferredAt, updatedAt: deferredAt }))
 localStorage.setItem(scopedKey(DISMISSED_KEY, channelId), "true")
}
