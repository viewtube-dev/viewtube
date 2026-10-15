import { resolveBrainTaskProfile } from "./BrainTaskProfileRegistry"

export interface BrainContextSectionResolution {
 text: string
 selectedSectionIds: string[]
 omittedSectionIds: string[]
 characterCount: number
 maximumCharacters: number
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
 options: { userText: string; maximumCharacters: number },
): BrainContextSectionResolution => {
 const maximumCharacters = Math.max(0, Math.floor(options.maximumCharacters))
 const profile = resolveBrainTaskProfile(options.userText)
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
  const required = ["system_prompt", "creator_control_policy"].includes(id) || id.endsWith("_task")
  candidates.push({ id, text, index, priority: priorityFor(id, profile.intent), required })
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
 }
}
