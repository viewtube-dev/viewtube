import {
 resolveBrainContextSections,
 type BrainContextSectionResolution,
} from "./BrainContextResolution"
import { resolveBrainTaskProfile, type BrainTaskProfile } from "./BrainTaskProfileRegistry"

export type BrainAssistantSurface = "sidebar" | "brain_hub" | "workspace"

export interface BrainAssistantLocationContext {
 surface: BrainAssistantSurface
 route?: string | null
 toolId?: string | null
 channelId?: string | null
 projectId?: string | null
 contentBuildId?: string | null
 videoId?: string | null
}

export interface BrainAssistantEvidenceTrace {
 version: "vt-brain-assistant-trace-v1"
 taskProfileId: BrainTaskProfile["id"]
 surface: BrainAssistantSurface
 scope: {
  channelId: string | null
  projectId: string | null
  contentBuildId: string | null
  videoId: string | null
 }
 selectedSectionIds: string[]
 omittedSectionIds: string[]
 evidenceIds: string[]
 limitations: string[]
}

export interface BrainAssistantContinuityResult {
 version: "vt-brain-assistant-context-v1"
 contextKey: string
 location: BrainAssistantLocationContext
 taskProfile: BrainTaskProfile
 resolution: BrainContextSectionResolution
 trace: BrainAssistantEvidenceTrace
}

/**
 * Shared, deterministic context entry point for Sidebar, Brain Hub and the full
 * Brain workspace. Callers provide the same source-owned context sections;
 * this helper applies the canonical task-aware resolver and returns an audit
 * trace without persisting or mutating evidence/knowledge.
 */
export const resolveBrainAssistantContinuity = (input: {
 location: BrainAssistantLocationContext
 userText: string
 contextSections: string[]
 evidenceIds?: string[]
 maximumCharacters?: number
}): BrainAssistantContinuityResult => {
 const location = {
  surface: input.location.surface,
  route: input.location.route?.trim() || null,
  toolId: input.location.toolId?.trim() || null,
  channelId: input.location.channelId?.trim() || null,
  projectId: input.location.projectId?.trim() || null,
  contentBuildId: input.location.contentBuildId?.trim() || null,
  videoId: input.location.videoId?.trim() || null,
 }
 const taskProfile = resolveBrainTaskProfile(input.userText)
 const resolution = resolveBrainContextSections(input.contextSections, {
  userText: input.userText,
  maximumCharacters: input.maximumCharacters ?? 12000,
 })
 const evidenceIds = [...new Set((input.evidenceIds || []).map((id) => id.trim()).filter(Boolean))].sort()
 const limitations: string[] = []
 if (!location.channelId) limitations.push("No channel scope was provided; channel-specific knowledge must not be inferred.")
 if (location.projectId && !location.channelId) limitations.push("Project context is unverified without a channel scope.")
 if (location.videoId && !location.channelId) limitations.push("Video context is unverified without a channel scope.")
 if (resolution.omittedSectionIds.length) limitations.push("Some context sections were omitted or truncated by the context budget.")
 if (!evidenceIds.length) limitations.push("No evidence identifiers were supplied for an evidence trace.")

 const scope = {
  channelId: location.channelId,
  projectId: location.projectId,
  contentBuildId: location.contentBuildId,
  videoId: location.videoId,
 }
 const contextKey = [
  location.channelId || "no-channel",
  location.projectId || "no-project",
  location.contentBuildId || "no-build",
  location.videoId || "no-video",
  taskProfile.id,
 ].join(":")

 return {
  version: "vt-brain-assistant-context-v1",
  contextKey,
  location,
  taskProfile,
  resolution,
  trace: {
   version: "vt-brain-assistant-trace-v1",
   taskProfileId: taskProfile.id,
   surface: location.surface,
   scope,
   selectedSectionIds: [...resolution.selectedSectionIds],
   omittedSectionIds: [...resolution.omittedSectionIds],
   evidenceIds,
   limitations,
  },
 }
}
