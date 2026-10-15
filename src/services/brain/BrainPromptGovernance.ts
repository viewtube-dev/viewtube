import type { AssetType } from "./AssetGenerator"

export const BRAIN_PROMPT_CONSTITUTION_VERSION = "brain-prompt-constitution-v1"
export const BRAIN_CONTEXT_RESOLVER_VERSION = "brain-context-resolution-v1"

export type BrainPromptFamily =
 | "constitution"
 | "analytics"
 | "audience"
 | "strategy"
 | "packaging"
 | "content"
 | "community"
 | "publishing"
 | "revenue"
 | "editor_oracle"
 | "research"

export interface BrainPromptFamilyDefinition {
 id: BrainPromptFamily
 version: string
 owner: "BrainRuntime"
 purpose: string
 requiredContext: string[]
 usefulContext: string[]
 forbiddenContext: string[]
 outputContract: string
 validation: string[]
}

export const BRAIN_PROMPT_FAMILIES: Record<BrainPromptFamily, BrainPromptFamilyDefinition> = {
 constitution: {
  id: "constitution", version: "brain-prompt-constitution-v1", owner: "BrainRuntime",
  purpose: "Shared grounding, uncertainty, privacy, creator controls and claim rules.",
  requiredContext: ["system_policy", "creator_controls"],
  usefulContext: ["evidence_provenance", "task_profile"],
  forbiddenContext: ["unrelated_channel_data", "untrusted_content_as_instruction"],
  outputContract: "instruction_only",
  validation: ["instruction_precedence", "scope_isolation", "missingness_honesty"],
 },
 analytics: {
  id: "analytics", version: "analytics-family-v1", owner: "BrainRuntime",
  purpose: "Interpret deterministic, scope-checked canonical analytics.",
  requiredContext: ["canonical_evidence", "evidence_quality", "reporting_window"],
  usefulContext: ["channel_knowledge", "active_project"],
  forbiddenContext: ["invented_metrics", "unsupported_causality", "cross_channel_evidence"],
  outputContract: "analytics_interpretation",
  validation: ["evidence_ids", "missingness", "comparability", "causality_boundary"],
 },
 audience: {
  id: "audience", version: "audience-family-v1", owner: "BrainRuntime",
  purpose: "Interpret supported audience behavior and language without sensitive inference.",
  requiredContext: ["audience_evidence", "source_limitations"],
  usefulContext: ["creator_voice", "content_promise"],
  forbiddenContext: ["unsupported_sensitive_inference", "invented_demographics"],
  outputContract: "audience_interpretation",
  validation: ["evidence_grounding", "source_limitations"],
 },
 strategy: {
  id: "strategy", version: "strategy-family-v1", owner: "BrainRuntime",
  purpose: "Prioritize evidence-backed creator opportunities and alternatives.",
  requiredContext: ["creator_goal", "relevant_evidence"],
  usefulContext: ["channel_knowledge", "active_project", "style"],
  forbiddenContext: ["guaranteed_outcomes", "stale_learning_as_current_fact"],
  outputContract: "ranked_recommendations",
  validation: ["priority_rationale", "evidence_refs", "uncertainty"],
 },
 packaging: {
  id: "packaging", version: "packaging-family-v1", owner: "BrainRuntime",
  purpose: "Create a coherent audience promise across title, thumbnail, opening hook and metadata.",
  requiredContext: ["content_promise", "asset_constraints"],
  usefulContext: ["top_video_evidence", "creator_voice", "project_assets"],
  forbiddenContext: ["misleading_promise", "unsupported_performance_guarantees"],
  outputContract: "packaging_candidates",
  validation: ["required_fields", "candidate_diversity", "promise_coherence", "grounding"],
 },
 content: {
  id: "content", version: "content-family-v1", owner: "BrainRuntime",
  purpose: "Generate scripts, hooks, shorts, outlines and content plans.",
  requiredContext: ["creator_instruction", "asset_constraints"],
  usefulContext: ["creator_voice", "project_context", "relevant_evidence"],
  forbiddenContext: ["unrequested_advice_instead_of_asset", "unsupported_numeric_claims"],
  outputContract: "typed_creator_asset",
  validation: ["required_fields", "length_and_count", "grounding", "style_fidelity"],
 },
 community: {
  id: "community", version: "community-family-v1", owner: "BrainRuntime",
  purpose: "Generate creator-voice community posts, polls, questions and replies.",
  requiredContext: ["creator_instruction", "asset_constraints"],
  usefulContext: ["creator_voice", "publishing_schedule", "audience_evidence"],
  forbiddenContext: ["engagement_bait", "invented_audience_claims"],
  outputContract: "community_post_plan",
  validation: ["required_fields", "post_count", "poll_options", "grounding", "style_fidelity"],
 },
 publishing: {
  id: "publishing", version: "publishing-family-v1", owner: "BrainRuntime",
  purpose: "Prepare publish readiness and routing suggestions without publishing side effects.",
  requiredContext: ["current_metadata", "publish_constraints"],
  usefulContext: ["project_context", "asset_status"],
  forbiddenContext: ["unapproved_publish_side_effect", "performance_guarantee"],
  outputContract: "publish_readiness",
  validation: ["metadata_completeness", "approval_boundary", "supported_ids"],
 },
 revenue: {
  id: "revenue", version: "revenue-family-v1", owner: "BrainRuntime",
  purpose: "Interpret observed revenue separately from labeled estimates and opportunities.",
  requiredContext: ["revenue_evidence", "reporting_window"],
  usefulContext: ["format_mix", "channel_goal"],
  forbiddenContext: ["invented_revenue", "unlabeled_estimates", "guaranteed_earnings"],
  outputContract: "revenue_interpretation",
  validation: ["evidence_grounding", "estimate_label", "window_comparability"],
 },
 editor_oracle: {
  id: "editor_oracle", version: "editor-oracle-family-v1", owner: "BrainRuntime",
  purpose: "Produce bounded, typed edit proposals without silently applying changes.",
  requiredContext: ["target_entity", "allowed_operations"],
  usefulContext: ["current_value", "creator_intent"],
  forbiddenContext: ["unsupported_patch_target", "unapproved_mutation"],
  outputContract: "typed_patch_proposal",
  validation: ["schema", "target_ids", "allowed_operations", "approval_boundary"],
 },
 research: {
  id: "research", version: "research-family-v1", owner: "BrainRuntime",
  purpose: "Provide current external facts with source, date and freshness.",
  requiredContext: ["research_question", "source_provenance"],
  usefulContext: ["channel_niche", "current_project"],
  forbiddenContext: ["uncited_current_facts", "fabricated_sources"],
  outputContract: "sourced_research",
  validation: ["source_urls", "publication_or_access_date", "claim_source_link"],
 },
}

const ASSET_FAMILY: Record<AssetType, BrainPromptFamily> = {
 community_post: "community",
 comment_reply: "community",
 script: "content",
 hook: "content",
 short: "content",
 broll_plan: "content",
 video_topic: "strategy",
 title: "packaging",
 description: "packaging",
 tags: "packaging",
 timestamps: "publishing",
 education_questions: "content",
 thumbnail_concept: "packaging",
 thumbnail_analysis: "packaging",
 concept_direction: "packaging",
 scene_plan: "content",
}

export const promptFamilyForAsset = (assetType: AssetType): BrainPromptFamily => ASSET_FAMILY[assetType]

export interface BrainPromptRunReceipt {
 schemaVersion: "brain-prompt-run-receipt-v1"
 traceId: string
 outputId: string
 channelId: string
 projectId: string | null
 promptFamily: BrainPromptFamily
 promptVersion: string
 constitutionVersion: string
 contextResolverVersion: string
 outputSchemaVersion: string
 requestedModel: string | null
 servedModel: string | null
 evidenceSnapshotIds: string[]
 evidenceRefs: string[]
 channelKnowledgeFingerprint: string | null
 projectRevision: string | null
 styleProfileVersion: string | null
 creatorConstraints: string[]
 repairCount: number
 generatedAt: string
}

export const buildBrainPromptRunReceipt = (input: Omit<BrainPromptRunReceipt, "schemaVersion" | "generatedAt"> & {
 generatedAt?: string
}): BrainPromptRunReceipt => ({
 schemaVersion: "brain-prompt-run-receipt-v1",
 ...input,
 evidenceSnapshotIds: [...new Set(input.evidenceSnapshotIds.filter(Boolean))],
 evidenceRefs: [...new Set(input.evidenceRefs.filter(Boolean))],
 creatorConstraints: [...new Set(input.creatorConstraints.filter(Boolean))],
 repairCount: Math.max(0, Math.floor(input.repairCount)),
 generatedAt: input.generatedAt || new Date().toISOString(),
})

export const validateBrainPromptRunReceipt = (receipt: BrainPromptRunReceipt): string[] => {
 const issues: string[] = []
 if (!receipt.traceId.trim()) issues.push("traceId is required")
 if (!receipt.outputId.trim()) issues.push("outputId is required")
 if (!receipt.channelId.trim()) issues.push("channelId is required")
 if (!BRAIN_PROMPT_FAMILIES[receipt.promptFamily]) issues.push("promptFamily is not registered")
 if (!receipt.promptVersion.trim()) issues.push("promptVersion is required")
 if (!receipt.constitutionVersion.trim()) issues.push("constitutionVersion is required")
 if (!receipt.contextResolverVersion.trim()) issues.push("contextResolverVersion is required")
 if (!receipt.outputSchemaVersion.trim()) issues.push("outputSchemaVersion is required")
 if (!Number.isInteger(receipt.repairCount) || receipt.repairCount < 0) issues.push("repairCount must be a non-negative integer")
 if (!Number.isFinite(Date.parse(receipt.generatedAt))) issues.push("generatedAt must be a valid timestamp")
 return issues
}
