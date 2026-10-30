export const CONTENT_BUILD_SCHEMA_VERSION = 1 as const

export type ContentBuildStage =
 | "idea"
 | "research"
 | "concept"
 | "outline"
 | "script"
 | "storyboard"
 | "media"
 | "package"
 | "edit"
 | "review"
 | "scheduled"
 | "published"
 | "launch"
 | "monitor"
 | "evaluation"
 | "learning"
 | "archived"

export type ContentBuildFormat = "short" | "long" | "live" | "other"

export interface ContentBuildStyleProfile {
 tone?: string
 narrativeStyle?: string
 visualStyle?: string
 editingStyle?: string
 pacingStyle?: string
 voiceStyle?: string
 musicStyle?: string
 references?: string[]
 constraints?: string[]
 doNotDo?: string[]
}

export interface ContentBuildStrategyProfile {
 positioning?: string
 discoveryIntent?: string
 packagingIntent?: string
 retentionIntent?: string
 launchIntent?: string
 successDefinition?: string
}

export interface ContentBuildProfile {
 subject?: string
 topic?: string
 niche?: string
 subNiche?: string
 originalIdea?: string
 originalPrompt?: string
 workingConcept?: string
 intention?: string
 creatorGoal?: string
 audiencePromise?: string
 targetAudience?: string
 audienceSegments?: string[]
 format?: ContentBuildFormat
 plannedDurationSeconds?: number | null
 style?: ContentBuildStyleProfile
 strategy?: ContentBuildStrategyProfile
}

export type ContentBuildRelationType =
 | "derived-from"
 | "generated-from"
 | "edited-from"
 | "supports"
 | "used-by"
 | "selected-as"
 | "published-as"
 | "belongs-to"
 | "adapted-from"
 | "forked-from"
 | "evaluated-by"
 | "resulted-in"

export interface ContentBuildAssetRelation {
 id: string
 contentBuildId: string
 fromAssetId: string
 toAssetId: string
 relation: ContentBuildRelationType
 createdAt: string
 sourceToolId?: string | null
 metadata?: Record<string, unknown>
}

export type ContentBuildVariantStatus = "candidate" | "selected" | "final" | "rejected" | "archived"

export interface ContentBuildAssetVersion {
 id: string
 contentBuildId: string
 assetId: string
 slot: string
 version: number
 label?: string | null
 parentVersionId?: string | null
 parentAssetId?: string | null
 sourceToolId?: string | null
 generationRecordId?: string | null
 createdAt: string
 metadata?: Record<string, unknown>
}

export interface ContentBuildVariantMember {
 assetId: string
 versionId?: string | null
 label?: string | null
 status: ContentBuildVariantStatus
 score?: number | null
 createdAt: string
 metadata?: Record<string, unknown>
}

export interface ContentBuildVariantGroup {
 id: string
 contentBuildId: string
 slot: string
 label: string
 sourceToolId?: string | null
 members: ContentBuildVariantMember[]
 selectedAssetId?: string | null
 finalAssetId?: string | null
 createdAt: string
 updatedAt: string
 metadata?: Record<string, unknown>
}

export const CONTENT_BUILD_PUBLICATION_IDENTITY_SCHEMA_VERSION = 1 as const

export type ContentBuildProjectAssociationStatus = "verified" | "snapshot-only"

/**
 * Canonical, evidence-carrying identity for one completed external publication.
 * Project association is explicitly qualified; missing legacy linkage is never
 * silently promoted to a verified association.
 */
export interface ContentBuildPublicationIdentity {
 schemaVersion: typeof CONTENT_BUILD_PUBLICATION_IDENTITY_SCHEMA_VERSION
 contentBuildId: string
 projectId: string
 projectAssociationStatus: ContentBuildProjectAssociationStatus
 videoPackageId: string
 publishTransactionId: string
 youtubeVideoId: string
 channelId: string | null
 approvedSnapshotId: string
 approvedSnapshotHash: string
 selectedVariantAssetIds: string[]
 correlationId: string
 /** Stable operation identity captured by the publication transaction. */
 operationId?: string | null
 /** Decision/action identity that led to this exact publication, when supplied. */
 actionPacketId?: string | null
 workflowId?: string | null
 recommendationId?: string | null
 experimentId?: string | null
 /** Stable producer outcome IDs linked to the exact selected assets at publication time. */
 assetOutcomeRecordIds?: string[]
 /** Generation traces for the selected assets; missing traces are not fabricated. */
 generationTraceIds?: string[]
 idempotencyKey: string
 publishedAt: string | null
}

export interface ContentBuildYouTubeBinding {
 channelId?: string | null
 videoId: string
 canonicalUrl: string
 uploadStartedAt?: string | null
 uploadCompletedAt?: string | null
 scheduledAt?: string | null
 premiereAt?: string | null
 publishedAt?: string | null
 status: "uploaded" | "scheduled" | "published" | "private" | "unlisted" | "removed" | "unknown"
 initialTitleAssetId?: string | null
 initialThumbnailAssetId?: string | null
 finalRenderAssetId?: string | null
 lastVerifiedAt?: string | null
}

export interface ContentBuildWorkflowState {
 definitionId?: string | null
 instanceId?: string | null
 currentStepId?: string | null
 completedStepIds: string[]
 blockerIds: string[]
}

export interface ContentBuildSnapshot {
 schemaVersion: typeof CONTENT_BUILD_SCHEMA_VERSION
 id: string
 revision: number
 channelId?: string | null
 legacyProjectId?: string | null
 legacyProjectName?: string | null
 profile: ContentBuildProfile
 stage: ContentBuildStage
 assetIds: string[]
 selections: Record<string, string | null>
 relations: ContentBuildAssetRelation[]
 versions: ContentBuildAssetVersion[]
 variantGroups: ContentBuildVariantGroup[]
 workflow: ContentBuildWorkflowState
 youtube?: ContentBuildYouTubeBinding | null
 createdAt: string
 updatedAt: string
}

export type ContentBuildMetadataOperation = "create" | "refine" | "edit" | "select" | "replace" | "publish" | "restore"

export interface ContentBuildMetadataHistoryEntry {
 schemaVersion: 1
 contentBuildId: string
 metadataVersionId: string
 operationId: string
 operation: ContentBuildMetadataOperation
 fields: Array<{ field: string; before: unknown; after: unknown }>
 actorType: ContentBuildEvent["actorType"]
 actorId: string | null
 sourceToolId: string | null
 generationRecordId: string | null
 promptRecipeId: string | null
 promptRecipeVersion: string | null
 sourceAssetIds: string[]
 resultingAssetIds: string[]
 publishTransactionId: string | null
 approvedSnapshotId: string | null
 approvedSnapshotHash: string | null
 publishedVideoId: string | null
 analyticsCheckpointIds: string[]
 evidenceIds: string[]
 occurredAt: string
}

export type ContentBuildEventType =
 | "build.created"
 | "profile.updated"
 | "stage.changed"
 | "asset.created"
 | "asset.attached"
 | "asset.detached"
 | "asset.versioned"
 | "asset.variant.created"
 | "asset.selected"
 | "asset.finalized"
 | "asset.relation.created"
 | "tool.input.received"
 | "tool.output.recorded"
 | "handoff.created"
 | "handoff.accepted"
 | "handoff.rejected"
 | "workflow.started"
 | "workflow.step.completed"
 | "workflow.blocker.added"
 | "workflow.blocker.resolved"
 | "youtube.bound"
 | "youtube.state.changed"
 | "publish.transaction.started"
 | "publish.transaction.step.completed"
 | "publish.transaction.step.ambiguous"
 | "publish.transaction.step.reconciled-not-applied"
 | "publish.transaction.failed"
 | "publish.transaction.completed"
 | "analytics.checkpoint"
 | "comment.observed"
 | "comment.reply.posted"
 | "experiment.started"
 | "experiment.completed"
 | "learning.candidate.created"
 | "metadata.created"
 | "metadata.refined"
 | "metadata.replaced"
 | "metadata.selected"
 | "package.created"
 | "package.versioned"
 | "package.published"
 | "published.metadata.changed"
 | "thumbnail.changed"
 | "title.changed"
 | "description.changed"
 | "tags.changed"
 | "publishing.settings.changed"
 | "analysis.completed"
 | "observation.recorded"
 | "knowledge.promoted"

export interface ContentBuildEvent<T = Record<string, unknown>> {
 id: string
 idempotencyKey?: string | null
 contentBuildId: string
 timestamp: string
 eventType: ContentBuildEventType
 entityType?: string | null
 entityId?: string | null
 actorType: "creator" | "brain" | "tool" | "youtube" | "analytics" | "sync" | "system"
 actorId?: string | null
 toolId?: string | null
 previousState?: unknown
 resultingState?: unknown
 inputAssetIds: string[]
 outputAssetIds: string[]
 evidenceIds: string[]
 /** Explicit causal parents; absent parents are allowed during delayed/out-of-order delivery and reported by diagnostics. */
 parentEventIds?: string[]
 generationRecordId?: string | null
 actionPacketId?: string | null
 traceId?: string | null
 metadata?: T
}

export interface CreateContentBuildInput {
 id?: string
 channelId?: string | null
 legacyProjectId?: string | null
 legacyProjectName?: string | null
 stage?: ContentBuildStage
 profile?: ContentBuildProfile
 createdAt?: string
 actorType?: ContentBuildEvent["actorType"]
 actorId?: string | null
 toolId?: string | null
}

export interface BindYouTubeVideoInput {
 idempotencyKey?: string | null
 contentBuildId: string
 videoId: string
 channelId?: string | null
 canonicalUrl?: string
 status?: ContentBuildYouTubeBinding["status"]
 uploadStartedAt?: string | null
 uploadCompletedAt?: string | null
 scheduledAt?: string | null
 premiereAt?: string | null
 publishedAt?: string | null
 initialTitleAssetId?: string | null
 initialThumbnailAssetId?: string | null
 finalRenderAssetId?: string | null
 lastVerifiedAt?: string | null
 toolId?: string | null
}
