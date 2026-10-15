import { resolveBrainTaskProfile } from "./BrainTaskProfileRegistry"
import { BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS } from "./BrainCapabilityRegistry"

export const BRAIN_CONTEXT_RESOLVER_VERSION = "brain-context-resolution-v1"
export const BRAIN_CONTEXT_CHARS_PER_TOKEN_ESTIMATE = 3

export interface BrainContextSectionResolution {
 text: string
 selectedSectionIds: string[]
 omittedSectionIds: string[]
 characterCount: number
 maximumCharacters: number
 modelContextWindowTokens: number | null
 reservedOutputTokens: number
 safetyMarginTokens: number
 estimatedInputTokens: number
 budgetSource: "explicit_model_window" | "character_fallback"
}

interface CandidateSection {
 id: string
 text: string
 index: number
 priority: number
 required: boolean
}

const sectionId = (section: string, index: number): string => {
 if (index === 0) return "system_prompt"
 const heading = section.match(/^\s*\n?([^\n]+)\n/)
 const raw = heading?.[1]?.trim() || `section_${index}`
 return raw.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")
}

const REQUIRED_CONTEXT_BY_TASK: Record<string, string[]> = {
 creator_asset_draft: ["creator_style", "active_project_context", "channel_knowledge", "confirmed_creator_context"],
 daily_oracle: ["confirmed_creator_context", "channel_knowledge", "active_project_context", "algorithm_channel_opportunity_intelligence"],
 first_week_plan: ["confirmed_creator_context", "channel_knowledge", "active_project_context", "algorithm_channel_opportunity_intelligence"],
 best_video_autopsy: ["channel_evidence", "evidence_quality", "shared_evidence_contract", "deterministic_statistics_intelligence", "deterministic_analytics_findings"],
 channel_revival: ["confirmed_creator_context", "channel_knowledge", "active_project_context", "current_public_research"],
 strategy: ["confirmed_creator_context", "channel_knowledge", "active_project_context", "algorithm_channel_opportunity_intelligence"],
 analytics: ["channel_evidence", "evidence_quality", "shared_evidence_contract", "deterministic_statistics_intelligence", "deterministic_analytics_findings"],
 seo: ["channel_evidence", "evidence_quality", "creator_style", "public_niche_knowledge"],
 audience: ["channel_evidence", "evidence_quality", "shared_evidence_contract", "deterministic_statistics_intelligence", "audience_intelligence", "channel_knowledge"],
 revenue: ["channel_evidence", "evidence_quality", "shared_evidence_contract", "deterministic_statistics_intelligence", "deterministic_analytics_findings"],
 publishing: ["active_project_context", "confirmed_creator_context", "channel_knowledge"],
 content_analysis: ["channel_evidence", "channel_knowledge", "active_project_context", "public_niche_knowledge"],
 journal: ["confirmed_creator_context", "channel_knowledge", "recent_conversation"],
 goal_coach: ["confirmed_creator_context", "channel_knowledge", "active_project_context", "algorithm_channel_opportunity_intelligence"],
}

const priorityFor = (id: string, intent: string): number => {
 const priority: Record<string, number> = {
  system_prompt: 1000,
  creator_control_policy: 990,
  content_generation_task: 980,
  daily_oracle_task: 980,
  first_week_plan_task: 980,
  best_video_autopsy_task: 980,
  channel_evidence: 60,
  evidence_quality: 65,
  shared_evidence_contract: 65,
  deterministic_statistics_intelligence: 65,
  deterministic_analytics_findings: 65,
  audience_intelligence: 60,
  algorithm_channel_opportunity_intelligence: 65,
  channel_knowledge: 70,
  active_project_context: 75,
  creator_style: 65,
  confirmed_creator_context: 60,
  recent_conversation: 45,
  public_niche_knowledge: 50,
  current_public_research: 55,
 }
 const base = priority[id] ?? 35
 const analytics = ["analytics", "audience", "revenue"].includes(intent)
 const creation = intent === "content_generation"
 if (analytics) {
  if (["channel_evidence", "evidence_quality", "shared_evidence_contract", "deterministic_statistics_intelligence", "deterministic_analytics_findings", "audience_intelligence", "algorithm_channel_opportunity_intelligence"].includes(id)) return base + 40
  if (["active_project_context", "channel_knowledge"].includes(id)) return base - 15
 }
 if (creation) {
  if (id === "creator_style") return 160
  if (id === "active_project_context") return 150
  if (id === "channel_knowledge" || id === "confirmed_creator_context") return base + 50
  if (["channel_evidence", "evidence_quality", "shared_evidence_contract", "deterministic_statistics_intelligence", "deterministic_analytics_findings", "audience_intelligence", "algorithm_channel_opportunity_intelligence"].includes(id)) return base - 30
 }
 if (!analytics && !creation) {
  if (id === "active_project_context" || id === "algorithm_channel_opportunity_intelligence") return base + 35
  if (id === "channel_knowledge" || id === "confirmed_creator_context" || id === "current_public_research") return base + 20
 }
 return base
}

/**
 * Resolve context by task relevance under a strict character budget.
 * Required policy/task sections win; optional sections are ranked by the resolved
 * Brain task profile, then emitted in their original readable order.
 */
export const resolveBrainContextSections = (
 sections: string[],
 options: {
  userText: string
  maximumCharacters: number
  capabilityIds?: string[]
  modelContextWindowTokens?: number | null
  reservedOutputTokens?: number
  safetyMarginTokens?: number
 },
): BrainContextSectionResolution => {
 const requestedCharacterBudget = Math.max(0, Math.floor(options.maximumCharacters))
 const modelContextWindowTokens = Number.isFinite(options.modelContextWindowTokens) && (options.modelContextWindowTokens || 0) > 0
  ? Math.floor(options.modelContextWindowTokens as number)
  : null
 const reservedOutputTokens = Math.max(0, Math.floor(options.reservedOutputTokens ?? 2048))
 const safetyMarginTokens = Math.max(0, Math.floor(options.safetyMarginTokens ?? 512))
 const availableInputTokens = modelContextWindowTokens === null
  ? null
  : Math.max(0, modelContextWindowTokens - reservedOutputTokens - safetyMarginTokens)
 const modelCharacterBudget = availableInputTokens === null
  ? Number.POSITIVE_INFINITY
  : Math.floor(availableInputTokens * BRAIN_CONTEXT_CHARS_PER_TOKEN_ESTIMATE)
 const maximumCharacters = Math.min(requestedCharacterBudget, modelCharacterBudget)
 const budgetSource = modelContextWindowTokens === null ? "character_fallback" as const : "explicit_model_window" as const
 const profile = resolveBrainTaskProfile(options.userText)
 const taskRequired = REQUIRED_CONTEXT_BY_TASK[profile.id] || []
 const capabilityRequired = Array.from(new Set((options.capabilityIds || []).flatMap(
  (capabilityId) => BRAIN_CAPABILITY_EVIDENCE_REQUIREMENTS[capabilityId] || [],
 )))
 const explicitRequired = Array.from(new Set([...taskRequired, ...capabilityRequired]))
 const requiredSet = new Set(explicitRequired)
 const seen = new Set<string>()
 const candidates: CandidateSection[] = []
 const omittedSectionIds: string[] = []
 sections.forEach((text, index) => {
  if (!text) return
  const id = sectionId(text, index)
  const normalized = text.replace(/\s+/g, " ").trim().toLowerCase()
  if (normalized.length > 80 && seen.has(normalized)) {
   omittedSectionIds.push(`${id}:duplicate`)
   return
  }
  if (normalized.length > 80) seen.add(normalized)
  const required = ["system_prompt", "creator_control_policy"].includes(id) || id.endsWith("_task") || requiredSet.has(id)
  candidates.push({ id, text, index, priority: priorityFor(id, profile.intent), required })
 })
 const availableSectionIds = new Set(candidates.map((candidate) => candidate.id))
 explicitRequired.forEach((id) => {
  if (!availableSectionIds.has(id)) omittedSectionIds.push(`required_evidence_missing:${id}`)
 })
 const ranked = [...candidates].sort((a, b) =>
  Number(b.required) - Number(a.required) || b.priority - a.priority || a.index - b.index,
 )
 const chosen = new Map<number, { id: string; text: string }>()
 let used = 0
 for (const candidate of ranked) {
  const separatorCost = chosen.size ? 1 : 0
  const remaining = maximumCharacters - used - separatorCost
  if (remaining <= 0) {
   omittedSectionIds.push(candidate.id)
   continue
  }
  if (candidate.text.length <= remaining) {
   chosen.set(candidate.index, { id: candidate.id, text: candidate.text })
   used += candidate.text.length + separatorCost
   continue
  }
  if (remaining > 0 && (candidate.required || remaining >= 160)) {
   chosen.set(candidate.index, { id: candidate.id, text: candidate.text.slice(0, remaining) })
   used += remaining + separatorCost
   omittedSectionIds.push(`${candidate.id}:truncated`)
  } else {
   omittedSectionIds.push(candidate.id)
  }
 }
 const selected = [...chosen.entries()].sort(([left], [right]) => left - right).map(([, value]) => value)
 return {
  text: selected.map((entry) => entry.text).join("\n"),
  selectedSectionIds: selected.map((entry) => entry.id),
  omittedSectionIds: [...new Set(omittedSectionIds)],
  characterCount: selected.reduce((sum, entry) => sum + entry.text.length, 0) + Math.max(0, selected.length - 1),
  maximumCharacters,
  modelContextWindowTokens,
  reservedOutputTokens,
  safetyMarginTokens,
  estimatedInputTokens: Math.ceil((selected.reduce((sum, entry) => sum + entry.text.length, 0) + Math.max(0, selected.length - 1)) / BRAIN_CONTEXT_CHARS_PER_TOKEN_ESTIMATE),
  budgetSource,
 }
}
