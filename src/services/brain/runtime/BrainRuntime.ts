import { runBrainTurn, type RunBrainTurnInput } from "../BrainOrchestrator"
import type { AIBrainEvidenceVideo } from "../../../types"
import { fetchPublicChannelSnapshot } from "../../publicHandleMode"
import { defaultBrainModelGateway } from "./BrainModelGateway"
import { resolveBrainAssistantContinuity, type BrainAssistantEvidenceTrace } from "../BrainAssistantContinuity"
import type {
 BrainRuntimeMetadata,
 BrainRuntimeRequest,
 BrainRuntimeResult,
} from "./BrainRuntimeContracts"

export const BRAIN_RUNTIME_VERSION = "brain-runtime-v1"

const toLegacyInput = (input: BrainRuntimeRequest): RunBrainTurnInput => ({
 operationId: input.operationId,
 channelId: input.channelId,
 userText: input.userText,
 retryTurnId: input.retryTurnId,
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
 projects: input.projects,
 modelContextWindowTokens: input.modelContextWindowTokens,
 reservedOutputTokens: input.reservedOutputTokens,
 contextSafetyMarginTokens: input.contextSafetyMarginTokens,
 analyticsWindow: input.analyticsWindow,
 visibleContext: input.visibleContext,
 artifactRefs: input.artifactRefs,
})

export const buildBrainRuntimeMetadata = (
 input: BrainRuntimeRequest,
): BrainRuntimeMetadata => ({
 runtimeVersion: BRAIN_RUNTIME_VERSION,
 operationId: input.operationId || null,
 surface: input.surface || "unknown",
 projectId: input.projectId || null,
 contentBuildId: typeof input.visibleContext?.contentBuildId === "string" ? input.visibleContext.contentBuildId : null,
 artifactRefs: Array.from(new Set(input.artifactRefs || [])).slice(0, 50),
 hasVisibleContext: Boolean(input.visibleContext && Object.keys(input.visibleContext).length),
})

const normalizeHandle = (value: string | null | undefined): string =>
 String(value || "").trim().replace(/^@+/, "").toLowerCase()

/**
 * Refreshes public metadata only when a caller explicitly supplies the public
 * handle selected in Settings. Never infer public mode from channelId.
 */
const resolvePublicHandleContext = async (input: BrainRuntimeRequest): Promise<{
 block: string
 metadata: Record<string, unknown> | null
 evidenceVideos: AIBrainEvidenceVideo[]
}> => {
 const selected = input.publicHandleContext
 const handle = typeof selected?.handle === "string" ? selected.handle.trim() : ""
 if (!handle || (input.channelId && input.channelId !== selected?.channelId)) return { block: "", metadata: null, evidenceVideos: [] }

 try {
  const snapshot = await fetchPublicChannelSnapshot(handle)
  if (!snapshot || snapshot.source !== "public_page") return { block: "", metadata: null, evidenceVideos: [] }
  if (selected?.channelId && selected.channelId !== snapshot.channelId) return { block: "", metadata: null, evidenceVideos: [] }
  const requestedHandle = normalizeHandle(handle)
  const resolvedHandle = normalizeHandle(snapshot.handle)
  if (requestedHandle.startsWith("uc")) {
   if (requestedHandle !== snapshot.channelId.toLowerCase()) return { block: "", metadata: null, evidenceVideos: [] }
  } else if (resolvedHandle && requestedHandle !== resolvedHandle) {
   return { block: "", metadata: null, evidenceVideos: [] }
  }

  const videos = snapshot.topVideos
   .filter((video) => video.videoId && video.title.trim())
   .slice(0, 25)
  const evidenceVideos: AIBrainEvidenceVideo[] = videos.map((video) => ({
   id: `public:${video.videoId}`,
   evidenceId: `public-video:${video.videoId}`,
   title: video.title,
   publishedAt: video.publishedAt || null,
   format: null,
   descriptionSnippet: null,
   tags: [],
   metrics: { views: null, watchTime: null, subscribers: null, revenue: null, ctr: null, averagePercentageViewed: null, likes: null, comments: null },
  }))
  const provenance = snapshot.provenance
  const metadata = {
   mode: "public_handle",
   identity: { handle: snapshot.handle, channelId: snapshot.channelId },
   fetchedAt: snapshot.fetchedAt,
   cacheStatus: provenance?.cacheStatus || "unknown",
   sourceRefs: provenance?.sourceRefs || [
    `https://www.youtube.com/channel/${snapshot.channelId}`,
    `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(snapshot.channelId)}`,
   ],
   limitations: provenance?.limitations || ["Public titles and publish dates only; performance metrics and ownership are not verified."],
   videoCount: evidenceVideos.length,
  }
  const block = [
   "PUBLIC CHANNEL EVIDENCE (explicitly selected public-handle source)",
   `Identity: ${snapshot.handle || handle} · channel ID: ${snapshot.channelId}`,
   `Fetched at: ${snapshot.fetchedAt || "unknown"} · cache status: ${metadata.cacheStatus}`,
   "Source: public YouTube channel page and RSS feed.",
   "Limitations: title/date metadata only. Do not infer ownership, private analytics, subscriber counts, views, watch time, revenue, likes, or comments. Missing metrics remain unavailable.",
   ...evidenceVideos.map((video) => `- ${video.title}${video.publishedAt ? ` (published ${video.publishedAt})` : ""} [video ID: ${video.id.replace(/^public:/, "")}]`),
  ].join("\n")
  return { block, metadata, evidenceVideos }
 } catch {
  // Public resolver failures are non-fatal and never become negative evidence.
  return { block: "", metadata: null, evidenceVideos: [] }
 }
}

/**
 * Canonical additive entry point for creator-facing Brain tasks.
 *
 * Existing orchestration remains delegated to BrainOrchestrator. Public
 * metadata is refreshed only through an explicit publicHandleContext supplied
 * by a logged-out caller; connected-channel identity and the synchronous
 * snapshot builder are left untouched.
 */
export const runBrainTask = async (
 input: BrainRuntimeRequest,
): Promise<BrainRuntimeResult> => {
 const visibleContext = input.visibleContext || {}
 const publicContext = await resolvePublicHandleContext(input)
 const contextWithPublic = publicContext.metadata
  ? { ...visibleContext, publicHandleEvidence: publicContext.metadata }
  : visibleContext
 const surface = input.surface === "sidebar-chatbot"
  ? "sidebar"
  : input.surface === "brain-hub-widget"
   ? "brain_hub"
   : "workspace"
 const runtimeChannelId = publicContext.metadata
  ? (publicContext.metadata.identity as { channelId: string }).channelId
  : input.channelId
 const evidenceIds = publicContext.metadata
  ? publicContext.evidenceVideos.map((video) => video.evidenceId)
  : Array.isArray(input.snapshot?.evidencePack?.evidenceIds)
   ? input.snapshot.evidencePack.evidenceIds
   : []
 const continuity = resolveBrainAssistantContinuity({
  location: {
   surface,
   route: typeof contextWithPublic.route === "string" ? contextWithPublic.route : null,
   toolId: typeof contextWithPublic.toolId === "string" ? contextWithPublic.toolId : null,
   channelId: runtimeChannelId,
   projectId: input.projectId || input.project?.id || (typeof contextWithPublic.projectId === "string" ? contextWithPublic.projectId : null),
   contentBuildId: typeof contextWithPublic.contentBuildId === "string" ? contextWithPublic.contentBuildId : input.project?.contentBuildId || null,
   videoId: typeof contextWithPublic.videoId === "string"
    ? contextWithPublic.videoId
    : typeof contextWithPublic.selectedVideoId === "string"
     ? contextWithPublic.selectedVideoId
     : null,
  },
  userText: input.userText,
  contextSections: [
   `SYSTEM_PROMPT\n${input.systemPrompt}`,
   `ACTIVE_PROJECT_CONTEXT\n${JSON.stringify({
    projectId: input.projectId || input.project?.id || null,
    contentBuildId: input.project?.contentBuildId || contextWithPublic.contentBuildId || null,
    projectName: input.project?.name || null,
   })}`,
   `CURRENT_VIEW_CONTEXT\n${JSON.stringify(contextWithPublic)}`,
   `EVIDENCE_REFERENCES\n${JSON.stringify(evidenceIds.slice(0, 50))}`,
   ...(publicContext.block ? [publicContext.block] : []),
  ],
  evidenceIds,
 })
 const runtimeSnapshot = publicContext.metadata
  ? {
    ...input.snapshot,
    channel: {
     ...input.snapshot.channel,
     connected: false,
     label: String((publicContext.metadata.identity as { handle?: string | null }).handle || "Public channel"),
     handle: (publicContext.metadata.identity as { handle?: string | null }).handle || null,
     subscribers: null,
     totalViews: null,
    },
    evidencePack: {
     ...input.snapshot.evidencePack,
     channelId: (publicContext.metadata.identity as { channelId: string }).channelId,
     channelName: String((publicContext.metadata.identity as { handle?: string | null }).handle || "Public channel"),
     channelDescription: null,
     capturedAt: String(publicContext.metadata.fetchedAt || ""),
     dataStatus: publicContext.evidenceVideos.length ? "partial" as const : "missing" as const,
     topVideos: publicContext.evidenceVideos,
     recentVideos: publicContext.evidenceVideos,
     searchTerms: [],
     trafficSources: [],
     items: publicContext.evidenceVideos.map((video) => ({
      id: video.evidenceId,
      label: video.title,
      source: "public YouTube metadata",
      detail: video.publishedAt ? `published ${video.publishedAt}; performance metrics unavailable` : "performance metrics unavailable",
     })),
     availableMetrics: [],
     missingInputs: ["public titles and publish dates only; performance metrics and ownership are unavailable"],
     evidenceIds: publicContext.evidenceVideos.map((video) => video.evidenceId),
    },
   }
  : input.snapshot
 const runtimeInput: BrainRuntimeRequest = {
  ...input,
  channelId: runtimeChannelId,
  snapshot: runtimeSnapshot,
  systemPrompt: [
   input.systemPrompt,
   `ASSISTANT CONTINUITY TRACE (scope metadata, not additional evidence)\n${JSON.stringify(continuity.trace, null, 2)}\nRespect the declared channel/project/video scope. Omitted context is unavailable, not negative evidence.`,
   publicContext.block,
  ].filter(Boolean).join("\n\n"),
  visibleContext: {
   ...contextWithPublic,
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
