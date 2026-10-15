import type { BrainOrchestratorResult } from "../../../types"
import type { RunBrainTurnInput } from "../BrainOrchestrator"
import type { BrainAssistantEvidenceTrace } from "../BrainAssistantContinuity"

export type BrainRuntimeSurface =
 | "ai-brain"
 | "brain-hub-widget"
 | "sidebar-chatbot"
 | "intelligence-hub"
 | "analytics-copilot"
 | "studio-tool"
 | "project"
 | "unknown"

export interface BrainRuntimeRequest extends RunBrainTurnInput {
 surface?: BrainRuntimeSurface | (string & {})
 projectId?: string | null
 visibleContext?: Record<string, unknown> | null
 artifactRefs?: string[]
 requestedOutput?: string | null
}

export interface BrainRuntimeMetadata {
 runtimeVersion: string
 surface: string
 projectId: string | null
 contentBuildId: string | null
 artifactRefs: string[]
 hasVisibleContext: boolean
 assistantContinuityTrace?: BrainAssistantEvidenceTrace
}

export type BrainRuntimeResult = BrainOrchestratorResult & {
 runtime: BrainRuntimeMetadata
}
