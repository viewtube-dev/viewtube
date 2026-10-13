import {
  appendContentBuildEvent,
  listContentBuildEvents,
} from "./asset-engine/ContentBuildRepository"
import type {
  ContentBuildEvent,
  ContentBuildEventType,
} from "./asset-engine/contracts"
import type { MetadataMasterPackage } from "./metadataMaster"

export type MetadataHistoryOperation = "manual" | "generated" | "refined" | "selected" | "imported"

export type MetadataHistoryField =
  | "title"
  | "thumbnailPrompt"
  | "thumbnailText"
  | "description"
  | "tags"
  | "category"
  | "chapters"
  | "playlistIds"
  | "endScreen"
  | "schedule"
  | "goal"
  | "intensity"
  | "style"
  | "lockedSlots"
  | "appliedSlots"

export interface MetadataHistoryFieldChange {
  field: MetadataHistoryField
  previousValue: unknown
  nextValue: unknown
}

export interface MetadataHistoryEventInput {
  contentBuildId: string
  eventType: ContentBuildEventType
  entityType: string
  entityId: string
  actorType: ContentBuildEvent["actorType"]
  actorId?: string | null
  toolId: "metadata-master" | "video-manager" | "video-publisher"
  previousState?: unknown
  resultingState?: unknown
  timestamp?: string
  metadata: Record<string, unknown>
}

export interface BuildMetadataHistoryEventsInput {
  contentBuildId: string
  projectId?: string | null
  videoId?: string | null
  operation: MetadataHistoryOperation
  actorType?: ContentBuildEvent["actorType"]
  actorId?: string | null
  operationId?: string
  promptVersionId?: string | null
  reason?: string
  package: MetadataMasterPackage
  previousPackage?: MetadataMasterPackage | null
  timestamp?: string
}

const TRACKED_FIELDS: MetadataHistoryField[] = [
  "title",
  "thumbnailPrompt",
  "thumbnailText",
  "description",
  "tags",
  "category",
  "chapters",
  "playlistIds",
  "endScreen",
  "schedule",
  "goal",
  "intensity",
  "style",
  "lockedSlots",
  "appliedSlots",
]

const sameValue = (left: unknown, right: unknown) =>
  JSON.stringify(left) === JSON.stringify(right)

const fieldEventType = (field: MetadataHistoryField): ContentBuildEventType => {
  if (field === "title") return "title.changed"
  if (field === "description") return "description.changed"
  if (field === "tags") return "tags.changed"
  if (field === "thumbnailPrompt" || field === "thumbnailText") return "thumbnail.changed"
  return "metadata.replaced"
}

const makeOperationId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `metadata-op-${Date.now()}-${Math.random().toString(36).slice(2)}`

export const diffMetadataPackageFields = (
  previous: MetadataMasterPackage,
  next: MetadataMasterPackage,
): MetadataHistoryFieldChange[] =>
  TRACKED_FIELDS.flatMap(field =>
    sameValue(previous[field], next[field])
      ? []
      : [{ field, previousValue: previous[field], nextValue: next[field] }],
  )

/**
 * Pure event projection for tests and review. The persisted stream remains the
 * canonical ContentBuild event log; this module does not create another store.
 */
export const buildMetadataHistoryEvents = (
  input: BuildMetadataHistoryEventsInput,
): MetadataHistoryEventInput[] => {
  const operationId = input.operationId || makeOperationId()
  const timestamp = input.timestamp || new Date().toISOString()
  const previousPackage = input.previousPackage ?? null
  const pkg = input.package
  const commonMetadata = {
    projectId: input.projectId ?? pkg.projectId ?? null,
    videoId: input.videoId ?? pkg.videoId ?? null,
    metadataPackageId: pkg.id,
    packageVersion: pkg.version,
    operation: input.operation,
    operationId,
    promptVersionId: input.promptVersionId ?? null,
    reason: input.reason ?? null,
    provenance: pkg.provenance,
    goal: pkg.goal,
    intensity: pkg.intensity,
    style: pkg.style,
    score: pkg.score,
    warnings: pkg.warnings,
  }

  if (input.operation === "selected") {
    return [{
      contentBuildId: input.contentBuildId,
      eventType: "metadata.selected",
      entityType: "metadata-package",
      entityId: pkg.id,
      actorType: input.actorType || "creator",
      actorId: input.actorId ?? null,
      toolId: "metadata-master",
      previousState: previousPackage ?? undefined,
      resultingState: pkg,
      timestamp,
      metadata: commonMetadata,
    }]
  }

  const events: MetadataHistoryEventInput[] = [{
    contentBuildId: input.contentBuildId,
    eventType: previousPackage ? "package.versioned" : "package.created",
    entityType: "metadata-package",
    entityId: pkg.id,
    actorType: input.actorType || (input.operation === "generated" || input.operation === "refined" ? "brain" : "creator"),
    actorId: input.actorId ?? null,
    toolId: "metadata-master",
    previousState: previousPackage ?? undefined,
    resultingState: pkg,
    timestamp,
    metadata: commonMetadata,
  }]

  if (previousPackage) {
    for (const change of diffMetadataPackageFields(previousPackage, pkg)) {
      events.push({
        contentBuildId: input.contentBuildId,
        eventType: fieldEventType(change.field),
        entityType: "metadata-field",
        entityId: change.field,
        actorType: input.actorType || (input.operation === "generated" || input.operation === "refined" ? "brain" : "creator"),
        actorId: input.actorId ?? null,
        toolId: "metadata-master",
        previousState: change.previousValue,
        resultingState: change.nextValue,
        timestamp,
        metadata: {
          ...commonMetadata,
          field: change.field,
        },
      })
    }
  }

  return events
}

export const recordMetadataPackageVersion = (
  input: BuildMetadataHistoryEventsInput,
): ContentBuildEvent[] => {
  if (!input.contentBuildId) return []
  return buildMetadataHistoryEvents(input).map(event => appendContentBuildEvent(event))
}

export const buildPublishedMetadataSettingsEvent = (input: {
  contentBuildId: string
  videoId: string
  previousSettings: Record<string, unknown>
  nextSettings: Record<string, unknown>
  operationId?: string
  actorType?: ContentBuildEvent["actorType"]
  actorId?: string | null
  toolId?: "video-manager" | "video-publisher"
  timestamp?: string
}): MetadataHistoryEventInput | null => {
  if (!input.contentBuildId || sameValue(input.previousSettings, input.nextSettings)) return null
  return {
    contentBuildId: input.contentBuildId,
    eventType: "publishing.settings.changed",
    entityType: "published-video-settings",
    entityId: input.videoId,
    actorType: input.actorType || "creator",
    actorId: input.actorId ?? null,
    toolId: input.toolId || "video-manager",
    previousState: input.previousSettings,
    resultingState: input.nextSettings,
    timestamp: input.timestamp || new Date().toISOString(),
    metadata: {
      videoId: input.videoId,
      operation: "manual",
      operationId: input.operationId || makeOperationId(),
    },
  }
}

export const recordPublishedMetadataSettingsChange = (
  input: Parameters<typeof buildPublishedMetadataSettingsEvent>[0],
): ContentBuildEvent | null => {
  const event = buildPublishedMetadataSettingsEvent(input)
  return event ? appendContentBuildEvent(event) : null
}

export const recordPublishedMetadataChange = (input: {
  contentBuildId: string
  projectId?: string | null
  videoId: string
  operation: Exclude<MetadataHistoryOperation, "selected">
  actorType?: ContentBuildEvent["actorType"]
  actorId?: string | null
  operationId?: string
  reason?: string
  previousPackage: MetadataMasterPackage
  package: MetadataMasterPackage
  timestamp?: string
  analyticsReference?: string | null
  previousSettings?: Record<string, unknown>
  nextSettings?: Record<string, unknown>
}): ContentBuildEvent[] => {
  if (!input.contentBuildId || !input.videoId) return []
  const operationId = input.operationId || makeOperationId()
  const timestamp = input.timestamp || new Date().toISOString()
  const commonMetadata = {
    projectId: input.projectId ?? input.package.projectId ?? null,
    videoId: input.videoId,
    metadataPackageId: input.package.id,
    packageVersion: input.package.version,
    operation: input.operation,
    operationId,
    reason: input.reason ?? null,
    analyticsReference: input.analyticsReference ?? null,
    provenance: input.package.provenance,
  }
  const events: MetadataHistoryEventInput[] = [{
    contentBuildId: input.contentBuildId,
    eventType: "published.metadata.changed",
    entityType: "published-video-metadata",
    entityId: input.videoId,
    actorType: input.actorType || "creator",
    actorId: input.actorId ?? null,
    toolId: "video-manager",
    previousState: input.previousPackage,
    resultingState: input.package,
    timestamp,
    metadata: commonMetadata,
  }]

  for (const change of diffMetadataPackageFields(input.previousPackage, input.package)) {
    events.push({
      contentBuildId: input.contentBuildId,
      eventType: fieldEventType(change.field),
      entityType: "metadata-field",
      entityId: change.field,
      actorType: input.actorType || "creator",
      actorId: input.actorId ?? null,
      toolId: "video-manager",
      previousState: change.previousValue,
      resultingState: change.nextValue,
      timestamp,
      metadata: { ...commonMetadata, field: change.field },
    })
  }

  if (input.previousSettings && input.nextSettings) {
    const settingsEvent = buildPublishedMetadataSettingsEvent({
      contentBuildId: input.contentBuildId,
      videoId: input.videoId,
      previousSettings: input.previousSettings,
      nextSettings: input.nextSettings,
      operationId,
      actorType: input.actorType || "creator",
      actorId: input.actorId ?? null,
      toolId: "video-manager",
      timestamp,
    })
    if (settingsEvent) events.push(settingsEvent)
  }

  return events.map(event => appendContentBuildEvent(event))
}

export const recordMetadataAnalyticsAssociation = (input: {
  contentBuildId: string
  projectId?: string | null
  videoId?: string | null
  metadataPackageId: string
  packageVersion: number
  changeEventId?: string | null
  observationId: string
  analyticsSource: string
  beforeWindow?: { start: string; end: string } | null
  afterWindow?: { start: string; end: string } | null
  metricReferences: string[]
  observation: string
  confidence: "low" | "medium" | "high"
  causality: "unknown" | "suggestive" | "stronger-evidence"
}): ContentBuildEvent | null => {
  if (!input.contentBuildId) return null
  return appendContentBuildEvent({
    contentBuildId: input.contentBuildId,
    eventType: "analytics.checkpoint",
    entityType: "metadata-outcome-observation",
    entityId: input.observationId,
    actorType: "analytics",
    toolId: "content-analysis",
    metadata: {
      projectId: input.projectId ?? null,
      videoId: input.videoId ?? null,
      metadataPackageId: input.metadataPackageId,
      packageVersion: input.packageVersion,
      changeEventId: input.changeEventId ?? null,
      analyticsSource: input.analyticsSource,
      beforeWindow: input.beforeWindow ?? null,
      afterWindow: input.afterWindow ?? null,
      metricReferences: input.metricReferences,
      observation: input.observation,
      confidence: input.confidence,
      causality: input.causality,
      note: "Analytics remains the canonical measurement source; this event stores references and interpretation only.",
    },
  })
}

const METADATA_HISTORY_EVENT_TYPES = new Set<ContentBuildEventType>([
  "metadata.created",
  "metadata.refined",
  "metadata.replaced",
  "metadata.selected",
  "package.created",
  "package.versioned",
  "package.published",
  "published.metadata.changed",
  "thumbnail.changed",
  "title.changed",
  "description.changed",
  "tags.changed",
  "publishing.settings.changed",
  "analysis.completed",
  "observation.recorded",
  "knowledge.promoted",
  "analytics.checkpoint",
])

export const listMetadataHistory = (contentBuildId: string): ContentBuildEvent[] =>
  listContentBuildEvents(contentBuildId)
    .filter(event => METADATA_HISTORY_EVENT_TYPES.has(event.eventType))
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
