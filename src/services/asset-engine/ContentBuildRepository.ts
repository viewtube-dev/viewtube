import {
 CONTENT_BUILD_SCHEMA_VERSION,
 type BindYouTubeVideoInput,
 type ContentBuildAssetRelation,
 type ContentBuildAssetVersion,
 type ContentBuildEvent,
 type ContentBuildEventType,
 type ContentBuildMetadataHistoryEntry,
 type ContentBuildMetadataOperation,
 type ContentBuildProfile,
 type ContentBuildRelationType,
 type ContentBuildSnapshot,
 type ContentBuildVariantGroup,
 type ContentBuildVariantStatus,
 type ContentBuildStage,
 type CreateContentBuildInput,
} from "./contracts"

const BUILDS_KEY = "viewtube_content_builds_v1"
const EVENTS_KEY = "viewtube_content_build_events_v1"
export const CONTENT_BUILD_REPOSITORY_CHANGED = "vt_content_build_repository_changed"

let memoryBuilds: ContentBuildSnapshot[] = []
let memoryEvents: ContentBuildEvent[] = []

const uuid = () =>
 typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
  ? crypto.randomUUID()
  : "vt-" + Date.now() + "-" + Math.random().toString(36).slice(2)

const nowIso = () => new Date().toISOString()

const canUseStorage = () => {
 try {
  return typeof localStorage !== "undefined"
 } catch {
  return false
 }
}

const readJson = <T,>(key: string, fallback: T): T => {
 if (!canUseStorage()) return fallback
 let raw: string | null
 try {
  raw = localStorage.getItem(key)
 } catch {
  throw new Error("ContentBuild storage could not be read.")
 }
 if (raw === null) return fallback
 try {
  return JSON.parse(raw) as T
 } catch {
  throw new Error("ContentBuild storage is unreadable; refusing to overwrite it.")
 }
}

const writeJson = (key: string, value: unknown) => {
 if (!canUseStorage()) return
 try {
  localStorage.setItem(key, JSON.stringify(value))
 } catch {
  throw new Error("ContentBuild state could not be persisted; refusing to report an unrecorded lifecycle change.")
 }
}

const readBuilds = (): ContentBuildSnapshot[] => {
 const builds = canUseStorage() ? readJson<ContentBuildSnapshot[]>(BUILDS_KEY, []) : memoryBuilds
 if (!Array.isArray(builds) || !builds.every(build =>
  Boolean(build) && typeof build === "object" &&
  typeof build.id === "string" && typeof build.revision === "number"
 )) {
  throw new Error("ContentBuild storage is malformed; refusing to overwrite it.")
 }
 return builds
}

const writeBuilds = (builds: ContentBuildSnapshot[]) => {
 if (canUseStorage()) writeJson(BUILDS_KEY, builds)
 else memoryBuilds = builds
}

const readEvents = (): ContentBuildEvent[] => {
 if (!canUseStorage()) return memoryEvents
 let raw: string | null
 try {
  raw = localStorage.getItem(EVENTS_KEY)
 } catch {
  throw new Error("ContentBuild event storage could not be read.")
 }
 if (raw === null) return []
 let parsed: unknown
 try {
  parsed = JSON.parse(raw)
 } catch {
  throw new Error("ContentBuild event storage is unreadable; refusing to overwrite it.")
 }
 if (!Array.isArray(parsed) || !parsed.every((event) =>
  Boolean(event) &&
  typeof event === "object" &&
  typeof (event as ContentBuildEvent).id === "string" &&
  typeof (event as ContentBuildEvent).contentBuildId === "string" &&
  typeof (event as ContentBuildEvent).timestamp === "string" &&
  typeof (event as ContentBuildEvent).eventType === "string"
 )) {
  throw new Error("ContentBuild event storage is malformed; refusing to overwrite it.")
 }
 return parsed as ContentBuildEvent[]
}

const writeEvents = (events: ContentBuildEvent[]) => {
 if (!canUseStorage()) {
  memoryEvents = events
  return
 }
 try {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
 } catch {
  throw new Error("ContentBuild events could not be persisted; refusing to report an unrecorded lifecycle event.")
 }
 const latest = events[events.length - 1]
 if (typeof window !== "undefined" && latest) {
  window.dispatchEvent(new CustomEvent(CONTENT_BUILD_REPOSITORY_CHANGED, {
   detail: { contentBuildId: latest.contentBuildId, eventId: latest.id, eventType: latest.eventType },
  }))
 }
}

const contentBuildEventParents = (event: ContentBuildEvent): string[] => {
 const legacyParents = (event.metadata as Record<string, unknown> | undefined)?.parentEventIds
 const parents = event.parentEventIds ?? (Array.isArray(legacyParents) ? legacyParents : [])
 return [...new Set(parents.filter((id): id is string => typeof id === "string" && id.trim().length > 0))]
}

const wouldCreateContentBuildEventCycle = (
 candidateId: string,
 parentIds: string[],
 events: ContentBuildEvent[],
): boolean => {
 const parentsById = new Map(events.map(event => [event.id, contentBuildEventParents(event)]))
 const reachesCandidate = (currentId: string, visited: Set<string>): boolean => {
  if (currentId === candidateId) return true
  if (visited.has(currentId)) return false
  visited.add(currentId)
  return (parentsById.get(currentId) || []).some(parentId => reachesCandidate(parentId, visited))
 }
 return parentIds.some(parentId => reachesCandidate(parentId, new Set()))
}

export const appendContentBuildEvent = <T = Record<string, unknown>>(input: {
 contentBuildId: string
 eventType: ContentBuildEventType
 idempotencyKey?: string | null
 entityType?: string | null
 entityId?: string | null
 actorType?: ContentBuildEvent["actorType"]
 actorId?: string | null
 toolId?: string | null
 previousState?: unknown
 resultingState?: unknown
 inputAssetIds?: string[]
 outputAssetIds?: string[]
 evidenceIds?: string[]
 parentEventIds?: string[]
 generationRecordId?: string | null
 actionPacketId?: string | null
 traceId?: string | null
 metadata?: T
 timestamp?: string
}): ContentBuildEvent<T> => {
 const events = readEvents()
 const idempotencyKey = input.idempotencyKey?.trim() || null
 const normalizedParents = [...new Set((input.parentEventIds || []).filter(id => typeof id === "string" && id.trim().length > 0))]
 if (idempotencyKey) {
  const existing = events.find(event =>
   event.idempotencyKey === idempotencyKey ||
   (event.metadata as Record<string, unknown> | undefined)?.idempotencyKey === idempotencyKey
  )
  if (existing) {
   if (
    existing.contentBuildId !== input.contentBuildId ||
    existing.eventType !== input.eventType ||
    (existing.entityType || null) !== (input.entityType || null) ||
    (input.entityId !== undefined && (existing.entityId || null) !== (input.entityId || null)) ||
    (input.parentEventIds !== undefined && contentBuildEventParents(existing).slice().sort().join("\\0") !== normalizedParents.slice().sort().join("\\0"))
   ) {
    throw new Error("ContentBuild event idempotency key was reused for a different event.")
   }
   return existing as ContentBuildEvent<T>
  }
 }
 const id = idempotencyKey ? `event:${encodeURIComponent(idempotencyKey)}` : uuid()
 if (normalizedParents.includes(id)) throw new Error("ContentBuild event cannot be its own parent.")
 if (wouldCreateContentBuildEventCycle(id, normalizedParents, events)) throw new Error("ContentBuild event parent references would create circular provenance.")
 const event: ContentBuildEvent<T> = {
  id,
  idempotencyKey,
  contentBuildId: input.contentBuildId,
  timestamp: input.timestamp || nowIso(),
  eventType: input.eventType,
  entityType: input.entityType || null,
  entityId: input.entityId || null,
  actorType: input.actorType || "system",
  actorId: input.actorId || null,
  toolId: input.toolId || null,
  previousState: input.previousState,
  resultingState: input.resultingState,
  inputAssetIds: input.inputAssetIds || [],
  outputAssetIds: input.outputAssetIds || [],
  evidenceIds: input.evidenceIds || [],
  parentEventIds: normalizedParents,
  generationRecordId: input.generationRecordId || null,
  actionPacketId: input.actionPacketId || null,
  traceId: input.traceId || null,
  metadata: input.metadata,
 }
 events.push(event as ContentBuildEvent)
 writeEvents(events)
 return event
}

export const getContentBuild = (contentBuildId: string): ContentBuildSnapshot | null =>
 readBuilds().find(build => build.id === contentBuildId) || null

export const listContentBuilds = (): ContentBuildSnapshot[] =>
 readBuilds().slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

export const listContentBuildEvents = (contentBuildId: string): ContentBuildEvent[] =>
 readEvents()
  .filter(event => event.contentBuildId === contentBuildId)
  .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

export interface RecordContentBuildMetadataChangeInput {
 contentBuildId: string
 metadataVersionId: string
 operationId: string
 operation: ContentBuildMetadataOperation
 fields: ContentBuildMetadataHistoryEntry["fields"]
 actorType?: ContentBuildEvent["actorType"]
 actorId?: string | null
 sourceToolId?: string | null
 generationRecordId?: string | null
 promptRecipeId?: string | null
 promptRecipeVersion?: string | null
 sourceAssetIds?: string[]
 resultingAssetIds?: string[]
 publishTransactionId?: string | null
 approvedSnapshotId?: string | null
 approvedSnapshotHash?: string | null
 publishedVideoId?: string | null
 analyticsCheckpointIds?: string[]
 evidenceIds?: string[]
 occurredAt?: string
}

/** Append a reconstructable, provenance-carrying metadata version to ContentBuild's canonical event stream. */
export const recordContentBuildMetadataChange = (
 input: RecordContentBuildMetadataChangeInput,
): ContentBuildMetadataHistoryEntry => {
 const contentBuildId = input.contentBuildId.trim()
 const metadataVersionId = input.metadataVersionId.trim()
 const operationId = input.operationId.trim()
 if (!contentBuildId || !metadataVersionId || !operationId) {
  throw new Error("Metadata history requires ContentBuild, metadata version, and operation IDs.")
 }
 if (!Array.isArray(input.fields) || input.fields.length === 0) {
  throw new Error("Metadata history requires at least one field-level change.")
 }
 const seen = new Set<string>()
 const fields = input.fields.map(change => {
  const field = change.field.trim()
  if (!field || seen.has(field)) throw new Error("Metadata history field names must be non-empty and unique per version.")
  seen.add(field)
  return { field, before: change.before, after: change.after }
 })
 const existingVersion = listContentBuildMetadataHistory(contentBuildId)
  .find(existing => existing.metadataVersionId === metadataVersionId)
 if (existingVersion) {
  if (JSON.stringify(existingVersion) !== JSON.stringify({
   schemaVersion: 1,
   contentBuildId,
   metadataVersionId,
   operationId,
   operation: input.operation,
   fields,
   actorType: input.actorType || "system",
   actorId: input.actorId || null,
   sourceToolId: input.sourceToolId || null,
   generationRecordId: input.generationRecordId || null,
   promptRecipeId: input.promptRecipeId || null,
   promptRecipeVersion: input.promptRecipeVersion || null,
   sourceAssetIds: [...new Set(input.sourceAssetIds || [])],
   resultingAssetIds: [...new Set(input.resultingAssetIds || [])],
   publishTransactionId: input.publishTransactionId || null,
   approvedSnapshotId: input.approvedSnapshotId || null,
   approvedSnapshotHash: input.approvedSnapshotHash || null,
   publishedVideoId: input.publishedVideoId || null,
   analyticsCheckpointIds: [...new Set(input.analyticsCheckpointIds || [])],
   evidenceIds: [...new Set(input.evidenceIds || [])],
   occurredAt: input.occurredAt || existingVersion.occurredAt,
  })) {
   throw new Error("Metadata version ID was reused with different content; metadata history is immutable.")
  }
  return existingVersion
 }
 const entry: ContentBuildMetadataHistoryEntry = {
  schemaVersion: 1,
  contentBuildId,
  metadataVersionId,
  operationId,
  operation: input.operation,
  fields,
  actorType: input.actorType || "system",
  actorId: input.actorId || null,
  sourceToolId: input.sourceToolId || null,
  generationRecordId: input.generationRecordId || null,
  promptRecipeId: input.promptRecipeId || null,
  promptRecipeVersion: input.promptRecipeVersion || null,
  sourceAssetIds: [...new Set(input.sourceAssetIds || [])],
  resultingAssetIds: [...new Set(input.resultingAssetIds || [])],
  publishTransactionId: input.publishTransactionId || null,
  approvedSnapshotId: input.approvedSnapshotId || null,
  approvedSnapshotHash: input.approvedSnapshotHash || null,
  publishedVideoId: input.publishedVideoId || null,
  analyticsCheckpointIds: [...new Set(input.analyticsCheckpointIds || [])],
  evidenceIds: [...new Set(input.evidenceIds || [])],
  occurredAt: input.occurredAt || nowIso(),
 }
 const eventType: ContentBuildEventType = input.operation === "publish"
  ? "package.published"
  : input.operation === "select"
   ? "metadata.selected"
   : input.operation === "replace"
    ? "metadata.replaced"
    : input.operation === "create"
     ? "metadata.created"
     : input.operation === "refine"
      ? "metadata.refined"
      : input.operation === "edit" && input.publishedVideoId
       ? "published.metadata.changed"
       : fields.length === 1 && fields[0].field.toLowerCase() === "title"
        ? "title.changed"
        : fields.length === 1 && fields[0].field.toLowerCase() === "description"
         ? "description.changed"
         : fields.length === 1 && fields[0].field.toLowerCase() === "tags"
          ? "tags.changed"
          : "metadata.refined"
 const event = appendContentBuildEvent({
  contentBuildId,
  idempotencyKey: `metadata-version:${contentBuildId}:${metadataVersionId}`,
  eventType,
  entityType: "metadata-version",
  entityId: metadataVersionId,
  actorType: entry.actorType,
  actorId: entry.actorId,
  toolId: entry.sourceToolId,
  previousState: Object.fromEntries(fields.map(field => [field.field, field.before])),
  resultingState: Object.fromEntries(fields.map(field => [field.field, field.after])),
  inputAssetIds: entry.sourceAssetIds,
  outputAssetIds: entry.resultingAssetIds,
  evidenceIds: entry.evidenceIds,
  generationRecordId: entry.generationRecordId,
  timestamp: entry.occurredAt,
  metadata: { metadataHistory: entry, operationId, idempotencyKey: `metadata-version:${contentBuildId}:${metadataVersionId}` },
 })
 const recorded = (event.metadata as Record<string, unknown> | undefined)?.metadataHistory
 if (recorded && typeof recorded === "object") return recorded as ContentBuildMetadataHistoryEntry
 return entry
}

export const listContentBuildMetadataHistory = (
 contentBuildId: string,
): ContentBuildMetadataHistoryEntry[] => listContentBuildEvents(contentBuildId)
 .map(event => (event.metadata as Record<string, unknown> | undefined)?.metadataHistory)
 .filter((entry): entry is ContentBuildMetadataHistoryEntry =>
  Boolean(entry) && typeof entry === "object" &&
  (entry as ContentBuildMetadataHistoryEntry).schemaVersion === 1 &&
  (entry as ContentBuildMetadataHistoryEntry).contentBuildId === contentBuildId
 )
 .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt))

export const createContentBuild = (input: CreateContentBuildInput = {}): ContentBuildSnapshot => {
 const createdAt = input.createdAt || nowIso()
 const id = input.id || uuid()
 const existing = getContentBuild(id)
 if (existing) return existing
 const build: ContentBuildSnapshot = {
  schemaVersion: CONTENT_BUILD_SCHEMA_VERSION,
  id,
  revision: 1,
  channelId: input.channelId || null,
  legacyProjectId: input.legacyProjectId || null,
  legacyProjectName: input.legacyProjectName || null,
  profile: input.profile || {},
  stage: input.stage || "idea",
  assetIds: [],
  selections: {},
  relations: [],
  versions: [],
  variantGroups: [],
  workflow: { completedStepIds: [], blockerIds: [] },
  youtube: null,
  createdAt,
  updatedAt: createdAt,
 }
 writeBuilds([...readBuilds(), build])
 appendContentBuildEvent({
  contentBuildId: id,
  eventType: "build.created",
  entityType: "content-build",
  entityId: id,
  actorType: input.actorType || "system",
  actorId: input.actorId || null,
  toolId: input.toolId || null,
  resultingState: build,
  timestamp: createdAt,
 })
 return build
}

export const updateContentBuild = (
 contentBuildId: string,
 updater: (current: ContentBuildSnapshot) => ContentBuildSnapshot,
): ContentBuildSnapshot => {
 const builds = readBuilds()
 const index = builds.findIndex(build => build.id === contentBuildId)
 if (index < 0) throw new Error("Unknown ContentBuild: " + contentBuildId)
 const current = builds[index]
 const next = {
  ...updater({
   ...current,
   versions: current.versions || [],
   variantGroups: current.variantGroups || [],
  }),
  id: current.id,
  schemaVersion: CONTENT_BUILD_SCHEMA_VERSION,
  revision: current.revision + 1,
  updatedAt: nowIso(),
 }
 builds[index] = next
 writeBuilds(builds)
 return next
}

export const patchContentBuildProfile = (
 contentBuildId: string,
 patch: Partial<ContentBuildProfile>,
 input: { actorType?: ContentBuildEvent["actorType"]; actorId?: string | null; toolId?: string | null } = {},
) => {
 const current = getContentBuild(contentBuildId)
 if (!current) throw new Error("Unknown ContentBuild: " + contentBuildId)
 const previous = current.profile
 const next = updateContentBuild(contentBuildId, build => ({
  ...build,
  profile: { ...build.profile, ...patch },
 }))
 appendContentBuildEvent({
  contentBuildId,
  eventType: "profile.updated",
  entityType: "content-build-profile",
  entityId: contentBuildId,
  actorType: input.actorType || "creator",
  actorId: input.actorId || null,
  toolId: input.toolId || null,
  previousState: previous,
  resultingState: next.profile,
 })
 return next
}

export const setContentBuildStage = (
 contentBuildId: string,
 stage: ContentBuildStage,
 input: { actorType?: ContentBuildEvent["actorType"]; actorId?: string | null; toolId?: string | null } = {},
) => {
 const current = getContentBuild(contentBuildId)
 if (!current) throw new Error("Unknown ContentBuild: " + contentBuildId)
 const next = updateContentBuild(contentBuildId, build => ({ ...build, stage }))
 if (current.stage !== stage) {
  appendContentBuildEvent({
   contentBuildId,
   eventType: "stage.changed",
   entityType: "content-build",
   entityId: contentBuildId,
   actorType: input.actorType || "tool",
   actorId: input.actorId || null,
   toolId: input.toolId || null,
   previousState: current.stage,
   resultingState: stage,
  })
 }
 return next
}

export const attachAssetToContentBuild = (
 contentBuildId: string,
 assetId: string,
 input: {
  toolId?: string | null
  evidenceIds?: string[]
  generationRecordId?: string | null
  traceId?: string | null
  metadata?: Record<string, unknown>
 } = {},
) => {
 const current = getContentBuild(contentBuildId)
 if (!current) throw new Error("Unknown ContentBuild: " + contentBuildId)
 const existed = current.assetIds.includes(assetId)
 const next = existed
  ? current
  : updateContentBuild(contentBuildId, build => ({ ...build, assetIds: [...build.assetIds, assetId] }))
 if (!existed) {
  appendContentBuildEvent({
   contentBuildId,
   eventType: "asset.attached",
   entityType: "asset",
   entityId: assetId,
   actorType: "tool",
   toolId: input.toolId || null,
   outputAssetIds: [assetId],
   evidenceIds: input.evidenceIds || [],
   generationRecordId: input.generationRecordId || null,
   traceId: input.traceId || null,
   metadata: input.metadata,
  })
 }
 return next
}

export const setContentBuildSelection = (
 contentBuildId: string,
 slot: string,
 assetId: string | null,
 input: { toolId?: string | null; actorType?: ContentBuildEvent["actorType"]; final?: boolean } = {},
) => {
 const current = getContentBuild(contentBuildId)
 if (!current) throw new Error("Unknown ContentBuild: " + contentBuildId)
 if (assetId && !current.assetIds.includes(assetId)) {
  attachAssetToContentBuild(contentBuildId, assetId, { toolId: input.toolId })
 }
 const refreshed = getContentBuild(contentBuildId)!
 const previous = refreshed.selections[slot] || null
 if (previous === assetId && !input.final) return refreshed
 if (input.final && previous === assetId && readEvents().some(event =>
  event.contentBuildId === contentBuildId &&
  event.eventType === "asset.finalized" &&
  event.entityId === slot &&
  event.resultingState === assetId
 )) return refreshed
 const next = updateContentBuild(contentBuildId, build => ({
  ...build,
  selections: { ...build.selections, [slot]: assetId },
 }))
 appendContentBuildEvent({
  contentBuildId,
  eventType: input.final ? "asset.finalized" : "asset.selected",
  entityType: "asset-selection",
  entityId: slot,
  actorType: input.actorType || "creator",
  toolId: input.toolId || null,
  previousState: previous,
  resultingState: assetId,
  inputAssetIds: previous ? [previous] : [],
  outputAssetIds: assetId ? [assetId] : [],
  metadata: { slot },
 })
 return next
}

export const addContentBuildAssetRelation = (input: {
 contentBuildId: string
 fromAssetId: string
 toAssetId: string
 relation: ContentBuildRelationType
 sourceToolId?: string | null
 metadata?: Record<string, unknown>
}): ContentBuildAssetRelation => {
 const build = getContentBuild(input.contentBuildId)
 if (!build) throw new Error("Unknown ContentBuild: " + input.contentBuildId)
 const existing = build.relations.find(relation =>
  relation.fromAssetId === input.fromAssetId &&
  relation.toAssetId === input.toAssetId &&
  relation.relation === input.relation
 )
 if (existing) return existing
 const relation: ContentBuildAssetRelation = {
  id: uuid(),
  contentBuildId: input.contentBuildId,
  fromAssetId: input.fromAssetId,
  toAssetId: input.toAssetId,
  relation: input.relation,
  createdAt: nowIso(),
  sourceToolId: input.sourceToolId || null,
  metadata: input.metadata,
 }
 updateContentBuild(input.contentBuildId, current => ({
  ...current,
  relations: [...current.relations, relation],
 }))
 appendContentBuildEvent({
  contentBuildId: input.contentBuildId,
  eventType: "asset.relation.created",
  entityType: "asset-relation",
  entityId: relation.id,
  actorType: "tool",
  toolId: input.sourceToolId || null,
  inputAssetIds: [input.fromAssetId],
  outputAssetIds: [input.toAssetId],
  metadata: { relation: input.relation, ...(input.metadata || {}) },
 })
 return relation
}

export const createContentBuildAssetVersion = (input: {
 contentBuildId: string
 assetId: string
 slot: string
 label?: string | null
 parentVersionId?: string | null
 parentAssetId?: string | null
 sourceToolId?: string | null
 generationRecordId?: string | null
 metadata?: Record<string, unknown>
}): ContentBuildAssetVersion => {
 const build = getContentBuild(input.contentBuildId)
 if (!build) throw new Error("Unknown ContentBuild: " + input.contentBuildId)
 attachAssetToContentBuild(input.contentBuildId, input.assetId, {
  toolId: input.sourceToolId,
  generationRecordId: input.generationRecordId,
 })
 const refreshed = getContentBuild(input.contentBuildId)!
 const slotVersions = (refreshed.versions || []).filter(version => version.slot === input.slot)
 const version: ContentBuildAssetVersion = {
  id: uuid(),
  contentBuildId: input.contentBuildId,
  assetId: input.assetId,
  slot: input.slot,
  version: slotVersions.length ? Math.max(...slotVersions.map(item => item.version)) + 1 : 1,
  label: input.label || null,
  parentVersionId: input.parentVersionId || null,
  parentAssetId: input.parentAssetId || null,
  sourceToolId: input.sourceToolId || null,
  generationRecordId: input.generationRecordId || null,
  createdAt: nowIso(),
  metadata: input.metadata,
 }
 updateContentBuild(input.contentBuildId, current => ({
  ...current,
  versions: [...(current.versions || []), version],
 }))
 if (input.parentAssetId) {
  addContentBuildAssetRelation({
   contentBuildId: input.contentBuildId,
   fromAssetId: input.parentAssetId,
   toAssetId: input.assetId,
   relation: "edited-from",
   sourceToolId: input.sourceToolId,
   metadata: { versionId: version.id, slot: input.slot },
  })
 }
 appendContentBuildEvent({
  contentBuildId: input.contentBuildId,
  eventType: "asset.versioned",
  entityType: "asset-version",
  entityId: version.id,
  actorType: "tool",
  toolId: input.sourceToolId || null,
  inputAssetIds: input.parentAssetId ? [input.parentAssetId] : [],
  outputAssetIds: [input.assetId],
  generationRecordId: input.generationRecordId || null,
  resultingState: version,
  metadata: { slot: input.slot, version: version.version },
 })
 return version
}

export const createContentBuildVariantGroup = (input: {
 contentBuildId: string
 slot: string
 label: string
 sourceToolId?: string | null
 metadata?: Record<string, unknown>
}): ContentBuildVariantGroup => {
 const build = getContentBuild(input.contentBuildId)
 if (!build) throw new Error("Unknown ContentBuild: " + input.contentBuildId)
 const existing = (build.variantGroups || []).find(group =>
  group.slot === input.slot && group.label === input.label
 )
 if (existing) return existing
 const timestamp = nowIso()
 const group: ContentBuildVariantGroup = {
  id: uuid(),
  contentBuildId: input.contentBuildId,
  slot: input.slot,
  label: input.label,
  sourceToolId: input.sourceToolId || null,
  members: [],
  selectedAssetId: null,
  finalAssetId: null,
  createdAt: timestamp,
  updatedAt: timestamp,
  metadata: input.metadata,
 }
 updateContentBuild(input.contentBuildId, current => ({
  ...current,
  variantGroups: [...(current.variantGroups || []), group],
 }))
 return group
}

export const addContentBuildVariant = (input: {
 contentBuildId: string
 groupId: string
 assetId: string
 versionId?: string | null
 label?: string | null
 status?: ContentBuildVariantStatus
 score?: number | null
 sourceToolId?: string | null
 metadata?: Record<string, unknown>
}): ContentBuildVariantGroup => {
 const build = getContentBuild(input.contentBuildId)
 if (!build) throw new Error("Unknown ContentBuild: " + input.contentBuildId)
 const group = (build.variantGroups || []).find(candidate => candidate.id === input.groupId)
 if (!group) throw new Error("Unknown ContentBuild variant group: " + input.groupId)
 attachAssetToContentBuild(input.contentBuildId, input.assetId, { toolId: input.sourceToolId })
 const existing = group.members.find(member => member.assetId === input.assetId)
 if (existing) return group
 const member = {
  assetId: input.assetId,
  versionId: input.versionId || null,
  label: input.label || null,
  status: input.status || "candidate" as ContentBuildVariantStatus,
  score: input.score ?? null,
  createdAt: nowIso(),
  metadata: input.metadata,
 }
 let nextGroup: ContentBuildVariantGroup | null = null
 updateContentBuild(input.contentBuildId, current => ({
  ...current,
  variantGroups: (current.variantGroups || []).map(candidate => {
   if (candidate.id !== input.groupId) return candidate
   nextGroup = { ...candidate, members: [...candidate.members, member], updatedAt: nowIso() }
   return nextGroup
  }),
 }))
 appendContentBuildEvent({
  contentBuildId: input.contentBuildId,
  eventType: "asset.variant.created",
  entityType: "variant-group",
  entityId: input.groupId,
  actorType: "tool",
  toolId: input.sourceToolId || null,
  outputAssetIds: [input.assetId],
  metadata: { slot: group.slot, label: input.label || null, versionId: input.versionId || null },
 })
 return nextGroup!
}

export const selectContentBuildVariant = (input: {
 contentBuildId: string
 groupId: string
 assetId: string
 final?: boolean
 sourceToolId?: string | null
 actorType?: ContentBuildEvent["actorType"]
}): ContentBuildVariantGroup => {
 const build = getContentBuild(input.contentBuildId)
 if (!build) throw new Error("Unknown ContentBuild: " + input.contentBuildId)
 const group = (build.variantGroups || []).find(candidate => candidate.id === input.groupId)
 if (!group) throw new Error("Unknown ContentBuild variant group: " + input.groupId)
 if (!group.members.some(member => member.assetId === input.assetId)) {
  throw new Error("Asset is not a member of variant group: " + input.assetId)
 }
 let nextGroup: ContentBuildVariantGroup | null = null
 updateContentBuild(input.contentBuildId, current => ({
  ...current,
  variantGroups: (current.variantGroups || []).map(candidate => {
   if (candidate.id !== input.groupId) return candidate
   nextGroup = {
    ...candidate,
    selectedAssetId: input.assetId,
    finalAssetId: input.final ? input.assetId : candidate.finalAssetId || null,
    members: candidate.members.map(member => ({
     ...member,
     status: member.assetId === input.assetId
      ? (input.final ? "final" : "selected")
      : member.status === "final" && !input.final
        ? member.status
        : "candidate",
    })),
    updatedAt: nowIso(),
   }
   return nextGroup
  }),
 }))
 setContentBuildSelection(input.contentBuildId, group.slot, input.assetId, {
  toolId: input.sourceToolId,
  actorType: input.actorType || "creator",
  final: input.final,
 })
 return nextGroup!
}

export const bindYouTubeVideo = (input: BindYouTubeVideoInput): ContentBuildSnapshot => {
 const build = getContentBuild(input.contentBuildId)
 if (!build) throw new Error("Unknown ContentBuild: " + input.contentBuildId)
 const previous = build.youtube || null
 const idempotencyKey = input.idempotencyKey?.trim() || null
 if (idempotencyKey) {
  const existingEvent = listContentBuildEvents(input.contentBuildId).find(event =>
   event.idempotencyKey === idempotencyKey ||
   (event.metadata as Record<string, unknown> | undefined)?.idempotencyKey === idempotencyKey
  )
  if (existingEvent) {
   if (build.youtube?.videoId !== input.videoId) {
    throw new Error("YouTube binding idempotency key conflicts with the current ContentBuild video identity.")
   }
   return build
  }
  if (previous?.videoId && previous.videoId !== input.videoId) {
   throw new Error("ContentBuild is already bound to a different YouTube video; refusing to overwrite publication lineage.")
  }
 }
 const binding = {
  channelId: input.channelId || build.channelId || null,
  videoId: input.videoId,
  canonicalUrl: input.canonicalUrl || "https://www.youtube.com/watch?v=" + input.videoId,
  status: input.status || "uploaded" as const,
  uploadStartedAt: input.uploadStartedAt || null,
  uploadCompletedAt: input.uploadCompletedAt || null,
  scheduledAt: input.scheduledAt || null,
  premiereAt: input.premiereAt || null,
  publishedAt: input.publishedAt || null,
  initialTitleAssetId: input.initialTitleAssetId || null,
  initialThumbnailAssetId: input.initialThumbnailAssetId || null,
  finalRenderAssetId: input.finalRenderAssetId || null,
  lastVerifiedAt: input.lastVerifiedAt || null,
 }
 const next = updateContentBuild(input.contentBuildId, current => ({ ...current, youtube: binding }))
 appendContentBuildEvent({
  contentBuildId: input.contentBuildId,
  idempotencyKey,
  eventType: previous ? "youtube.state.changed" : "youtube.bound",
  entityType: "youtube-video",
  entityId: input.videoId,
  actorType: "youtube",
  toolId: input.toolId || null,
  previousState: previous,
  resultingState: binding,
  inputAssetIds: [input.finalRenderAssetId, input.initialTitleAssetId, input.initialThumbnailAssetId].filter((id): id is string => Boolean(id)),
 })
 return next
}

const legacyIdPart = (value: string) => encodeURIComponent(value.trim())

export const deriveLegacyContentBuildId = (input: {
 projectId?: string | null
 videoId?: string | null
}): string | null => {
 if (input.projectId) return "cb:project:" + legacyIdPart(input.projectId)
 if (input.videoId) return "cb:video:" + legacyIdPart(input.videoId)
 return null
}

export const ensureContentBuild = (input: CreateContentBuildInput & { videoId?: string | null } = {}): ContentBuildSnapshot | null => {
 const id = input.id || deriveLegacyContentBuildId({ projectId: input.legacyProjectId, videoId: input.videoId })
 if (!id) return null
 const existing = getContentBuild(id)
 if (existing) {
  if (input.videoId && existing.youtube?.videoId !== input.videoId) {
   return bindYouTubeVideo({
    contentBuildId: existing.id,
    videoId: input.videoId,
    channelId: input.channelId || existing.channelId || null,
    toolId: input.toolId || null,
   })
  }
  return existing
 }
 const build = createContentBuild({ ...input, id })
 if (input.videoId) {
  return bindYouTubeVideo({
   contentBuildId: build.id,
   videoId: input.videoId,
   channelId: input.channelId || null,
   toolId: input.toolId || null,
  })
 }
 return build
}

export const resetContentBuildRepositoryForTests = () => {
 memoryBuilds = []
 memoryEvents = []
 if (canUseStorage()) {
  localStorage.removeItem(BUILDS_KEY)
  localStorage.removeItem(EVENTS_KEY)
 }
}
