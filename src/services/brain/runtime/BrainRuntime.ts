import { runBrainTurn, type RunBrainTurnInput } from "../BrainOrchestrator"
import { defaultBrainModelGateway } from "./BrainModelGateway"
import { resolveBrainAssistantContinuity, type BrainAssistantEvidenceTrace } from "../BrainAssistantContinuity"
import type {
 BrainRuntimeMetadata,
 BrainRuntimeRequest,
 BrainRuntimeResult,
} from "./BrainRuntimeContracts"

export const BRAIN_RUNTIME_VERSION = "brain-runtime-v1"

const toLegacyInput = (input: BrainRuntimeRequest): RunBrainTurnInput => ({
 channelId: input.channelId,
 userText: input.userText,
 snapshot: input.snapshot,
 systemPrompt: input.systemPrompt,
 growthContext: input.growthContext,
 recentTurns: input.recentTurns,
 history: input.history,
 allowModel: input.allowModel,
 modelGenerator: input.modelGenerator || defaultBrainModelGateway.generateStructuredResponse,
 nicheResolver: input.nicheResolver,
 currentResearcher: input.currentResearcher,
 projectId: input.projectId,
 project: input.project,
 analyticsWindow: input.analyticsWindow,
 visibleContext: input.visibleContext,
 artifactRefs: input.artifactRefs,
})

export const buildBrainRuntimeMetadata = (
 input: BrainRuntimeRequest,
): BrainRuntimeMetadata => ({
 runtimeVersion: BRAIN_RUNTIME_VERSION,
 surface: input.surface || "unknown",
 projectId: input.projectId || null,
 contentBuildId: typeof input.visibleContext?.contentBuildId === "string" ? input.visibleContext.contentBuildId : null,
 artifactRefs: Array.from(new Set(input.artifactRefs || [])).slice(0, 50),
 hasVisibleContext: Boolean(input.visibleContext && Object.keys(input.visibleContext).length),
})

/**
 * Canonical additive entry point for creator-facing Brain tasks.
 *
 * Phase 1 deliberately delegates orchestration to the existing BrainOrchestrator
 * so creator behavior, validation, repair, fallbacks, learning, and persistence
 * remain unchanged. Structured generation is injected through BrainModelGateway,
 * establishing the provider-neutral seam without changing the current provider.
 */
export const runBrainTask = async (
 input: BrainRuntimeRequest,
): Promise<BrainRuntimeResult> => {
 const visibleContext = input.visibleContext || {}
 const surface = input.surface === "sidebar-chatbot"
  ? "sidebar"
  : input.surface === "brain-hub-widget"
   ? "brain_hub"
   : "workspace"
 const evidenceIds = Array.isArray(input.snapshot?.evidencePack?.evidenceIds)
  ? input.snapshot.evidencePack.evidenceIds
  : []
 const continuity = resolveBrainAssistantContinuity({
  location: {
   surface,
   route: typeof visibleContext.route === "string" ? visibleContext.route : null,
   toolId: typeof visibleContext.toolId === "string" ? visibleContext.toolId : null,
   channelId: input.channelId,
   projectId: input.projectId || input.project?.id || (typeof visibleContext.projectId === "string" ? visibleContext.projectId : null),
   contentBuildId: typeof visibleContext.contentBuildId === "string" ? visibleContext.contentBuildId : input.project?.contentBuildId || null,
   videoId: typeof visibleContext.videoId === "string" ? visibleContext.videoId : null,
  },
  userText: input.userText,
  contextSections: [
   `SYSTEM_PROMPT\n${input.systemPrompt}`,
   `ACTIVE_PROJECT_CONTEXT\n${JSON.stringify({
    projectId: input.projectId || input.project?.id || null,
    contentBuildId: input.project?.contentBuildId || visibleContext.contentBuildId || null,
    projectName: input.project?.name || null,
   })}`,
   `CURRENT_VIEW_CONTEXT\n${JSON.stringify(visibleContext)}`,
   `EVIDENCE_REFERENCES\n${JSON.stringify(evidenceIds.slice(0, 50))}`,
  ],
  evidenceIds,
 })
 const runtimeInput: BrainRuntimeRequest = {
  ...input,
  systemPrompt: `${input.systemPrompt}\n\nASSISTANT CONTINUITY TRACE (scope metadata, not additional evidence)\n${JSON.stringify(continuity.trace, null, 2)}\nRespect the declared channel/project/video scope. Omitted context is unavailable, not negative evidence.`,
  visibleContext: {
   ...visibleContext,
   assistantContinuityTrace: continuity.trace,
  },
 }
 const result = await runBrainTurn(toLegacyInput(runtimeInput))
 return {
  ...result,
  runtime: {
   ...buildBrainRuntimeMetadata(runtimeInput),
   assistantContinuityTrace: continuity.trace,
  },
 }
}


// Specialist structured-output tasks share the public BrainRuntime entry module.
export { runBrainJsonTask } from "./BrainJsonTask"
export type { BrainJsonTaskRequest, BrainJsonTaskResult } from "./BrainJsonTask"
