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

/**
 * Explicit public identity supplied by the caller after the user selects a
 * public handle. It is deliberately separate from channelId, which may refer
 * to an authenticated/private channel.
 */
export interface BrainRuntimePublicHandleContext {
 handle: string
 channelId?: string | null
}

export interface BrainRuntimeRequest extends RunBrainTurnInput {
 surface?: BrainRuntimeSurface | (string & {})
 projectId?: string | null
 visibleContext?: Record<string, unknown> | null
 artifactRefs?: string[]
 requestedOutput?: string | null
 publicHandleContext?: BrainRuntimePublicHandleContext | null
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
