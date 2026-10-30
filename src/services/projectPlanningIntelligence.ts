import { defaultBrainModelGateway } from "./brain/runtime/BrainModelGateway"
import type { Project, WorkspaceBrain } from "../types"

export type ProjectPlanningKind = "todo" | "goal"
export interface ProjectPlanningSuggestion { text: string; category: string; rationale: string; evidence: string }

const PROJECT_PLANNING_SCHEMA: Record<string, unknown> = {
 type: "ARRAY",
 items: {
  type: "OBJECT",
  properties: {
   text: { type: "STRING" },
   category: { type: "STRING" },
   rationale: { type: "STRING" },
   evidence: { type: "STRING" },
  },
  required: ["text", "category", "rationale", "evidence"],
 },
}

const parse = (raw: unknown): ProjectPlanningSuggestion[] => {
 const candidates = Array.isArray(raw)
  ? raw
  : typeof raw === "string"
   ? (() => {
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) return []
    try { return JSON.parse(match[0]) } catch { return [] }
   })()
   : []
 if (!Array.isArray(candidates)) return []
 return candidates.filter(item => item && typeof item === "object" && item.text).slice(0, 8).map(item => ({
  text: String(item.text),
  category: String(item.category || "Production"),
  rationale: String(item.rationale || "Project context"),
  evidence: String(item.evidence || "Project plan"),
 }))
}

export const generateProjectPlanningSuggestions = async (kind: ProjectPlanningKind, project: Project, brain: WorkspaceBrain) => {
 const generateJsonObject = defaultBrainModelGateway.generateJsonObject
 if (!generateJsonObject) throw new Error("BrainModelGateway JSON generation is unavailable.")
 const userText = `Generate 5 ${kind === "todo" ? "actionable production tasks" : "measurable project goals"} for this specific ViewTube project.\nPROJECT: ${JSON.stringify({name:project.name,status:project.status,publishDate:project.publishDate,concept:project.concept,niche:project.niche,description:project.description,script:project.script,plan:project.plan,tasks:project.tasks,goals:project.plan?.projectGoals||[]})}\nCHANNEL CONTEXT: ${JSON.stringify({targetNiche:brain.targetNiche,channelProfile:brain.channelProfile})}\nReturn ONLY JSON array objects with text, category, rationale, evidence.`
 const raw = await generateJsonObject({
  userText,
  systemInstruction: "Use the supplied project and channel context as authoritative. Keep every suggestion specific to this project. Return only JSON.",
  responseSchema: PROJECT_PLANNING_SCHEMA,
  capability: "thinking",
 })
 return parse(raw)
}
