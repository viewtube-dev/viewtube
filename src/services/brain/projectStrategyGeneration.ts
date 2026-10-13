import type { Project, ProjectPlan } from "../../types"
import {
  parseProjectStrategyJson,
  buildProjectStrategyPrompt,
  type ProjectStrategyPromptInput,
} from "./projectStrategyPrompt"
import { runBrainJsonTask } from "./runtime/BrainJsonTask"

export interface ProjectStrategyGenerationRequest {
  project: Project
  channelId?: string | null
  niche: string
  targetAudience: string
  surface?: string
  artifactRefs?: string[]
}

export interface ProjectStrategyGenerationResult {
  plan: ProjectPlan
  runtime: Awaited<ReturnType<typeof runBrainJsonTask>>["runtime"]
}

export const generateProjectStrategyWithBrain = async (
  request: ProjectStrategyGenerationRequest,
): Promise<ProjectStrategyGenerationResult> => {
  const project = request.project
  const promptInput: ProjectStrategyPromptInput = {
    concept: project.concept || project.name,
    niche: request.niche,
    targetAudience: request.targetAudience,
    projectId: project.id,
    contentBuildId: project.contentBuildId || null,
  }
  const userText = buildProjectStrategyPrompt(promptInput)
  const generated = await runBrainJsonTask<string | Record<string, unknown>>({
    channelId: request.channelId,
    projectId: project.id,
    project,
    contentBuildId: project.contentBuildId || null,
    surface: request.surface || "project",
    artifactRefs: request.artifactRefs,
    userText,
    systemInstruction: [
      "You are ViewTube's Project Strategy specialist operating through AI Brain.",
      "Produce a useful, concrete plan for the creator's selected video project.",
      "Do not invent channel analytics or performance claims.",
      "The output must contain non-empty string fields: topic, description, length, audience, vision, hook.",
    ].join("\n"),
  })

  const raw = typeof generated.value === "string"
    ? generated.value
    : JSON.stringify(generated.value)
  const plan = parseProjectStrategyJson(raw)
  plan.concept = promptInput.concept
  plan.niche = promptInput.niche

  return { plan, runtime: generated.runtime }
}
