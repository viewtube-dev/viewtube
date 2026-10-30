/**
 * Governed entry points for creator assets.
 *
 * This is what feature code calls. It hides the strategy/runner/evidence wiring so a widget
 * or controller does not have to know the generation architecture, and — more importantly —
 * so it cannot accidentally bypass it.
 *
 * Evidence assembly here is deliberately thin: it uses the channel context a caller already
 * holds. It is a placeholder for the Evidence Planner, which will resolve typed dataset
 * requests through `analytics-canon`. Passing through this seam now means that upgrade
 * changes one function rather than every call site.
 */

import {
 EMPTY_ASSET_EVIDENCE,
 generateAsset,
 type AssetEvidence,
 type AssetRecord,
} from "./AssetGenerator"
import { geminiAssetModelRunner } from "./assetModelRunner"
import { pinnedCommentStrategy, type PinnedCommentDraft } from "./assetStrategies/commentReply"
import { videoPublisherSeoStrategy } from "./assetStrategies/videoPublisherSeo"
import { tagSuggestionsStrategy, type TagSuggestion } from "./assetStrategies/tagSuggestions"
import type { SeoResult } from "../../types"
import {
 communityPostStrategy,
 communitySinglePostStrategy,
 type CommunityPostPlan,
 type CommunitySinglePost,
} from "./assetStrategies/communityPost"

export interface CreatorChannelContext {
 channelId: string
 channelName?: string
 recentVideoTitles?: string[]
 subscriberCount?: number
}

/**
 * Build evidence from the caller's channel context.
 *
 * `payload` is what numeric claims are checked against, so only facts that genuinely came
 * from the channel belong in it. Anything the caller could not supply is listed in
 * `missing`, which reaches the prompt so the model can name the gap instead of inventing
 * around it.
 */
export const buildChannelAssetEvidence = (
 context: CreatorChannelContext,
 requested: string[],
): AssetEvidence => {
 const titles = (context.recentVideoTitles || []).filter(Boolean).slice(0, 8)
 const payload: Record<string, unknown> = {
  channel: {
   ...(context.channelName ? { label: context.channelName } : {}),
   ...(typeof context.subscriberCount === "number" ? { subscribers: context.subscriberCount } : {}),
  },
  recentVideoTitles: titles,
 }

 const summary = [
  context.channelName ? `Channel: ${context.channelName}` : "",
  typeof context.subscriberCount === "number"
   ? `Subscribers: ${context.subscriberCount.toLocaleString()}`
   : "",
  titles.length ? `Recent videos:\n${titles.map((title) => `- ${title}`).join("\n")}` : "",
 ].filter(Boolean).join("\n")

 const provided = new Set<string>()
 if (context.channelName || typeof context.subscriberCount === "number") provided.add("channel_profile")
 if (titles.length) provided.add("top_videos")

 return {
  requested,
  refs: titles.length ? [`context:recent_videos:${titles.length}`] : [],
  missing: requested.filter((entry) => !provided.has(entry)),
  payload,
  summary,
 }
}

export interface CommunityPostDraftResult {
 /** The post copy, ready for the creator to review and edit. */
 body: string
 pollOptions?: string[]
 record: AssetRecord<CommunitySinglePost>
}

/**
 * Draft one community post under the full contract set.
 *
 * Replaces a bare `refineCommunityPost` call that returned an unchecked string. The creator
 * still receives the draft even when a gate fails — they are the review step for a post they
 * have not published — but the failure is now recorded on the asset and its trace instead of
 * being invisible.
 */
export const generateCommunityPostDraft = async (input: {
 context: CreatorChannelContext
 /** What the creator typed, or the existing draft when refining. */
 instruction: string
 postType?: string
 /** Format, linked video and poll context the caller already renders. */
 mediaContext?: string
 mediaAttachments?: string[]
 projectId?: string
}): Promise<CommunityPostDraftResult> => {
 const evidence = buildChannelAssetEvidence(
  input.context,
  communitySinglePostStrategy.evidenceClasses,
 )

 const result = await generateAsset<CommunitySinglePost>({
  request: {
   channelId: input.context.channelId,
   assetType: "community_post",
   instruction: input.instruction,
   ...(input.projectId ? { projectId: input.projectId } : {}),
   inputs: {
    postType: input.postType || "text",
    ...(input.mediaContext ? { mediaContext: input.mediaContext } : {}),
   },
  },
  strategy: communitySinglePostStrategy,
  evidence,
  runner: geminiAssetModelRunner,
  ...(input.mediaAttachments?.length
   ? { mediaAttachments: input.mediaAttachments }
   : {}),
 })

 if (result.record.status === "failed") {
  throw new Error("ViewTube could not generate this post. Try again.")
 }

 return {
  body: result.record.output?.body || "",
  ...(result.record.output?.pollOptions ? { pollOptions: result.record.output.pollOptions } : {}),
  record: result.record,
 }
}

/** Draft a multi-day community plan. */
export const generateCommunityPostPlan = async (input: {
 context: CreatorChannelContext
 instruction: string
 days?: number
 schedule?: string
 projectId?: string
}): Promise<AssetRecord<CommunityPostPlan>> => {
 const evidence = buildChannelAssetEvidence(
  input.context,
  communityPostStrategy.evidenceClasses,
 ) || EMPTY_ASSET_EVIDENCE

 const result = await generateAsset<CommunityPostPlan>({
  request: {
   channelId: input.context.channelId,
   assetType: "community_post",
   instruction: input.instruction,
   ...(input.projectId ? { projectId: input.projectId } : {}),
   inputs: {
    ...(input.days ? { days: input.days } : {}),
    ...(input.schedule ? { schedule: input.schedule } : {}),
   },
  },
  strategy: communityPostStrategy,
  evidence,
  runner: geminiAssetModelRunner,
 })

 return result.record
}


/**
 * Draft a pinned comment through the governed creator-asset pipeline.
 * The selected video and operation identity travel with the trace and prompt receipt;
 * the widget never talks to the Gemini SDK directly.
 */
export const generatePinnedCommentDraft = async (input: {
 context: CreatorChannelContext
 videoId: string
 videoTitle: string
 publishedAt?: string
 projectId?: string
}): Promise<{ body: string; record: AssetRecord<PinnedCommentDraft> }> => {
 const videoId = input.videoId.trim()
 const videoTitle = input.videoTitle.trim()
 if (!input.context.channelId.trim() || !videoId || !videoTitle) {
  throw new Error("A connected channel and selected video are required to draft a pinned comment.")
 }
 const operationId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
  ? `pinned-comment:${crypto.randomUUID()}`
  : `pinned-comment:${Date.now()}:${Math.random().toString(36).slice(2)}`
 const evidence = buildChannelAssetEvidence({
  ...input.context,
  recentVideoTitles: [videoTitle, ...(input.context.recentVideoTitles || [])],
 }, pinnedCommentStrategy.evidenceClasses)
 const result = await generateAsset<PinnedCommentDraft>({
  request: {
   channelId: input.context.channelId,
   assetType: "comment_reply",
   operationId,
   workflowId: `workflow:pinned-comment:${input.context.channelId}:${videoId}`,
   instruction: "Draft one concise pinned top-level comment for the selected video.",
   ...(input.projectId ? { projectId: input.projectId } : {}),
   inputs: {
    videoId,
    videoTitle,
    publishedAt: input.publishedAt || "",
   },
  },
  strategy: pinnedCommentStrategy,
  evidence,
  runner: geminiAssetModelRunner,
 })
 if (result.record.status === "failed" || !result.record.output?.body?.trim()) {
  throw new Error("ViewTube could not generate a pinned comment. Try again.")
 }
 return { body: result.record.output.body.trim(), record: result.record }
}


/** Generate the full Video Publisher SEO package through the shared asset governance path. */
export const generateVideoPublisherSeoPackage = async (input: {
 context: CreatorChannelContext
 instruction: string
 inputs: {
  concept: string
  niche: string
  audience?: string
  script: string
  videoLength: string
  channelHandle: string
  resourceLinks?: string
  stats?: string
  videoFormat: "Longform" | "Shorts"
  videoTitle?: string
 }
 projectId?: string
 contentBuildId?: string
 contextRevision?: number
 operationId?: string
 workflowId?: string
}): Promise<{ output: SeoResult; record: AssetRecord<SeoResult> }> => {
 if (!input.context.channelId.trim()) {
  throw new Error("Connect a YouTube channel before generating governed publishing metadata.")
 }
 const evidence = buildChannelAssetEvidence({
  ...input.context,
  recentVideoTitles: input.inputs.videoTitle
   ? [input.inputs.videoTitle, ...(input.context.recentVideoTitles || [])]
   : input.context.recentVideoTitles,
 }, videoPublisherSeoStrategy.evidenceClasses)
 const result = await generateAsset<SeoResult>({
  request: {
   channelId: input.context.channelId,
   assetType: "title",
   instruction: input.instruction,
   ...(input.projectId ? { projectId: input.projectId } : {}),
   ...(input.contentBuildId ? { contentBuildId: input.contentBuildId } : {}),
   ...(input.contextRevision !== undefined ? { contextRevision: input.contextRevision } : {}),
   ...(input.operationId ? { operationId: input.operationId } : {}),
   ...(input.workflowId ? { workflowId: input.workflowId } : {}),
   inputs: input.inputs,
  },
  strategy: videoPublisherSeoStrategy,
  evidence,
  runner: geminiAssetModelRunner,
 })
 if (result.record.status === "failed" || !result.record.output) {
  throw new Error("ViewTube could not generate a governed SEO package. Review the generation trace and try again.")
 }
 return {
  output: {
   ...result.record.output,
   id: result.record.id,
   timestamp: Date.parse(result.record.createdAt),
   concept: input.inputs.concept,
   niche: input.inputs.niche,
  },
  record: result.record,
 }
}


/** Generate or assess tags through the shared specialist asset governance path. */
export const generateGovernedTagSuggestions = async (input: {
 context: CreatorChannelContext
 title: string
 description: string
 tags?: string[]
 mode?: "generate" | "analyze"
 projectId?: string
 operationId?: string
 workflowId?: string
}): Promise<{ suggestions: TagSuggestion[]; record: AssetRecord<TagSuggestion[]> }> => {
 if (!input.context.channelId.trim()) {
  throw new Error("A connected or explicitly identified channel is required for governed tag suggestions.")
 }
 const mode = input.mode || "generate"
 const evidence = buildChannelAssetEvidence(input.context, tagSuggestionsStrategy.evidenceClasses)
 const result = await generateAsset<TagSuggestion[]>({
  request: {
   channelId: input.context.channelId,
   assetType: "tags",
   instruction: mode === "analyze"
    ? "Assess the supplied YouTube tags against the supplied video metadata."
    : "Suggest relevant YouTube tags for the supplied video metadata.",
   ...(input.projectId ? { projectId: input.projectId } : {}),
   ...(input.operationId ? { operationId: input.operationId } : {}),
   ...(input.workflowId ? { workflowId: input.workflowId } : {}),
   inputs: { mode, title: input.title, description: input.description, tags: input.tags || [] },
  },
  strategy: tagSuggestionsStrategy,
  evidence,
  runner: geminiAssetModelRunner,
 })
 if (result.record.status === "failed" || result.record.status === "needs_review" || !result.record.output?.length) {
  throw new Error("ViewTube could not produce verified tag suggestions. Review the generation trace and try again.")
 }
 return { suggestions: result.record.output, record: result.record }
}
