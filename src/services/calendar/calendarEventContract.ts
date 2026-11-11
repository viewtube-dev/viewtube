/**
 * Shared read-model contract for calendar surfaces.
 *
 * This is deliberately a projection contract, not a persistence model. The
 * owning Project, ContentBuild/Publisher, Asset Engine, or analytics subsystem
 * remains authoritative and all writes must return to that owner.
 */
export type CalendarEventKind =
  | "project"
  | "publish"
  | "premiere"
  | "livestream"
  | "task"
  | "deadline"
  | "milestone"
  | "analytics_checkpoint"

export type CalendarEventStatus =
  | "planned"
  | "in_progress"
  | "blocked"
  | "ready"
  | "approved"
  | "scheduled"
  | "published"
  | "completed"
  | "cancelled"
  | "unknown"

export type CalendarEventSourceKind =
  | "project"
  | "project_task"
  | "content_build"
  | "asset"
  | "analytics"

export type CalendarDateKey = `${number}-${number}-${number}`

export interface CalendarEventSource {
  /** Stable ID in the system that owns the record. */
  recordId: string
  /** Source-of-truth system; never a calendar-local record. */
  owner: CalendarEventSourceKind
  /** Owning project, when the event participates in a project lifecycle. */
  projectId?: string
  contentBuildId?: string
  assetId?: string
}

export interface CalendarEventProjection {
  /** Stable projection identity: owner + recordId + event role. */
  id: string
  source: CalendarEventSource
  kind: CalendarEventKind
  title: string
  status: CalendarEventStatus
  /** Inclusive local calendar date in YYYY-MM-DD form. */
  startDate: CalendarDateKey
  /** Inclusive final date. Omit for a one-day event. */
  endDate?: CalendarDateKey
  /** IANA timezone for timed publication events; date-only events may omit it. */
  timeZone?: string
  /** Asset Engine/Vault identity; UI resolves the current preview URL. */
  thumbnailAssetId?: string
  /** Optional verified external schedule timestamp, not an inferred publish state. */
  externalScheduledAt?: string
  externalVerifiedAt?: string
}

export interface CalendarEventProjectionSource {
  projects: readonly unknown[]
  /** Publisher/ContentBuild snapshots are joined by their canonical IDs. */
  contentBuildIds?: readonly string[]
}

/**
 * Existing owner mapping:
 * - Project.publishDate -> project / publish, one-day date
 * - Project.tasks[].dueDate -> project_task / task, one-day date
 * - ContentBuild.youtube.scheduledAt -> content_build / publish, verified state only
 * - Multi-day bars require an explicit start/end range from the owning record.
 *
 * Do not add Project.startDate/endDate or a calendar event table until the
 * project persistence contract has been reviewed and the owner is ready to
 * store those fields. Never reinterpret publishDate as a project range.
 */
