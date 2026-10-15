import {
  appendContentBuildEvent,
  listContentBuildEvents,
  type ContentBuildEvent,
} from "./asset-engine/ContentBuildRepository"

export type MetadataLearningMetric = "views" | "watchTimeMinutes" | "averageViewPercentage" | "likes" | "comments" | "revenue"
export type MetadataLearningDirection = "increase" | "decrease"

export interface MetadataIntelligenceSummary {
  metadataVersionCount: number
  comparisonCount: number
  readyComparisonCount: number
  learningCandidateCount: number
  promotedKnowledgeCount: number
  latestComparison: {
    eventId: string
    metadataVersionId: string | null
    status: string
    timestamp: string
    evidenceIds: string[]
    interpretation: "descriptive-association-only"
    causalConclusion: null
  } | null
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null

const unique = (values: string[]) => [...new Set(values.filter(Boolean))]

export const summarizeMetadataIntelligence = (
  events: ContentBuildEvent[],
): MetadataIntelligenceSummary => {
  const metadataVersions = events.filter(event => event.entityType === "metadata-version")
  const comparisons = events.filter(event => event.entityType === "metadata-performance-comparison")
  const latest = comparisons[comparisons.length - 1] || null
  const latestResult = asRecord(latest?.resultingState)
  const latestMetadata = asRecord(latest?.metadata)
  return {
    metadataVersionCount: metadataVersions.length,
    comparisonCount: comparisons.length,
    readyComparisonCount: comparisons.filter(event =>
      asRecord(event.resultingState)?.status === "ready"
    ).length,
    learningCandidateCount: events.filter(event =>
      event.eventType === "learning.candidate.created" && event.entityType === "metadata-learning-candidate"
    ).length,
    promotedKnowledgeCount: events.filter(event =>
      event.eventType === "knowledge.promoted" && event.entityType === "metadata-learning-candidate"
    ).length,
    latestComparison: latest ? {
      eventId: latest.id,
      metadataVersionId: typeof latestMetadata?.metadataVersionId === "string" ? latestMetadata.metadataVersionId : null,
      status: typeof latestResult?.status === "string" ? latestResult.status : "unknown",
      timestamp: latest.timestamp,
      evidenceIds: unique(latest.evidenceIds || []),
      interpretation: "descriptive-association-only",
      causalConclusion: null,
    } : null,
  }
}

interface ComparisonRecord {
  event: ContentBuildEvent
  result: Record<string, unknown>
  metadata: Record<string, unknown>
}

const listComparisonRecords = (contentBuildId: string): ComparisonRecord[] =>
  listContentBuildEvents(contentBuildId)
    .filter(event => event.eventType === "analysis.completed" && event.entityType === "metadata-performance-comparison")
    .map(event => ({
      event,
      result: asRecord(event.resultingState) || {},
      metadata: asRecord(event.metadata) || {},
    }))

/**
 * Creates a reviewable candidate from repeated, independent observations.
 * It never promotes a claim directly into Brain knowledge and never labels
 * temporal association as causal impact.
 */
export const createMetadataLearningCandidate = (input: {
  contentBuildId: string
  field: string
  metric: MetadataLearningMetric
  direction: MetadataLearningDirection
  minimumComparisons?: number
  now?: Date
}): ContentBuildEvent => {
  const field = input.field.trim()
  if (!input.contentBuildId.trim() || !field) throw new Error("ContentBuild and metadata field are required.")
  const minimumComparisons = Math.max(3, input.minimumComparisons || 3)
  const eligible = listComparisonRecords(input.contentBuildId).filter(({ result }) =>
    result.status === "ready" &&
    result.interpretation === "descriptive-association-only" &&
    result.causalConclusion === null &&
    Array.isArray(result.fieldChanges) &&
    (result.fieldChanges as Array<Record<string, unknown>>).some(change => change.field === field) &&
    Array.isArray(result.metrics) &&
    (result.metrics as Array<Record<string, unknown>>).some(metric => {
      if (metric.metric !== input.metric) return false
      const delta = typeof metric.absoluteChange === "number" ? metric.absoluteChange : null
      return delta != null && Number.isFinite(delta) &&
        (input.direction === "increase" ? delta > 0 : delta < 0)
    })
  )
  const byVersion = new Map<string, ComparisonRecord>()
  for (const record of eligible) {
    const versionId = typeof record.metadata.metadataVersionId === "string"
      ? record.metadata.metadataVersionId
      : typeof record.result.metadataVersionId === "string" ? record.result.metadataVersionId : null
    if (versionId && !byVersion.has(versionId)) byVersion.set(versionId, record)
  }
  const supporting = [...byVersion.entries()]
  if (supporting.length < minimumComparisons) {
    throw new Error(`Metadata learning candidate requires at least ${minimumComparisons} independent ready comparisons; found ${supporting.length}.`)
  }
  const versionIds = supporting.map(([id]) => id).sort()
  const comparisonEventIds = supporting.map(([, record]) => record.event.id).sort()
  const evidenceIds = unique(supporting.flatMap(([, record]) => record.event.evidenceIds || []))
  if (evidenceIds.length === 0) throw new Error("Metadata learning candidate requires explicit evidence references.")
  const candidateId = `metadata-learning:${input.contentBuildId}:${field}:${input.metric}:${input.direction}:${versionIds.join(",")}`
  const idempotencyKey = candidateId
  const now = (input.now || new Date()).toISOString()
  return appendContentBuildEvent({
    contentBuildId: input.contentBuildId,
    idempotencyKey,
    eventType: "learning.candidate.created",
    entityType: "metadata-learning-candidate",
    entityId: candidateId,
    actorType: "system",
    toolId: "metadata-learning-governance",
    evidenceIds,
    timestamp: now,
    previousState: null,
    resultingState: {
      schemaVersion: 1,
      candidateId,
      contentBuildId: input.contentBuildId,
      field,
      metric: input.metric,
      direction: input.direction,
      supportingMetadataVersionIds: versionIds,
      comparisonEventIds,
      evidenceIds,
      independentComparisonCount: supporting.length,
      status: "pending-creator-review",
      interpretation: "descriptive-association-only",
      causalConclusion: null,
      promotionEligible: supporting.length >= 5,
      reviewRequired: true,
    },
    metadata: {
      candidateId,
      field,
      metric: input.metric,
      direction: input.direction,
      metadataVersionIds: versionIds,
      comparisonEventIds,
      evidenceIds,
      independentComparisonCount: supporting.length,
      status: "pending-creator-review",
      idempotencyKey,
    },
  })
}

/** Explicit creator approval is required; the service only records promotion when five independent comparisons are cited. */
export const promoteMetadataLearningCandidate = (input: {
  contentBuildId: string
  candidateEventId: string
  approvedBy: string
  now?: Date
}): ContentBuildEvent => {
  const approvedBy = input.approvedBy.trim()
  if (!approvedBy) throw new Error("A named creator reviewer is required to promote metadata learning.")
  const events = listContentBuildEvents(input.contentBuildId)
  const candidate = events.find(event =>
    event.id === input.candidateEventId &&
    event.eventType === "learning.candidate.created" &&
    event.entityType === "metadata-learning-candidate"
  )
  if (!candidate) throw new Error("Unknown metadata learning candidate for this ContentBuild.")
  const state = asRecord(candidate.resultingState)
  const versionIds = Array.isArray(state?.supportingMetadataVersionIds)
    ? unique((state.supportingMetadataVersionIds as unknown[]).filter((value): value is string => typeof value === "string"))
    : []
  const evidenceIds = unique(candidate.evidenceIds || [])
  if (versionIds.length < 5 || evidenceIds.length === 0) {
    throw new Error("Promotion requires at least five independent metadata versions and explicit evidence references.")
  }
  const alreadyPromoted = events.find(event =>
    event.eventType === "knowledge.promoted" &&
    event.entityType === "metadata-learning-candidate" &&
    event.metadata?.candidateEventId === candidate.id
  )
  if (alreadyPromoted) return alreadyPromoted
  const timestamp = (input.now || new Date()).toISOString()
  return appendContentBuildEvent({
    contentBuildId: input.contentBuildId,
    idempotencyKey: `metadata-learning-promotion:${candidate.id}`,
    eventType: "knowledge.promoted",
    entityType: "metadata-learning-candidate",
    entityId: candidate.entityId || candidate.id,
    actorType: "creator",
    actorId: approvedBy,
    toolId: "metadata-learning-governance",
    evidenceIds,
    timestamp,
    previousState: state,
    resultingState: {
      ...state,
      status: "promoted",
      approvedBy,
      promotedAt: timestamp,
      interpretation: "descriptive-association-only",
      causalConclusion: null,
    },
    metadata: {
      candidateEventId: candidate.id,
      candidateId: state?.candidateId || candidate.entityId || candidate.id,
      approvedBy,
      supportingMetadataVersionIds: versionIds,
      evidenceIds,
      promotionPolicy: "creator-approved; minimum-five-independent-comparisons",
    },
  })
}
