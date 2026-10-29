import { reportDiagnostic, type DiagnosticLevel, type DiagnosticDetails } from "../diagnostics"

export type UnifiedDiagnosticStatus = "passed" | "failed" | "blocked" | "skipped" | "degraded" | "unknown"
export type DiagnosticConfidence = "confirmed" | "high" | "medium" | "low" | "unknown"
export type DiagnosticPrivacy = "public" | "sanitized" | "sensitive"

export interface UnifiedDiagnosticEvent {
  source: string
  subsystem: string
  kind: string
  severity: DiagnosticLevel
  status: UnifiedDiagnosticStatus
  code: string
  summary: string
  correlationId?: string
  expected?: string
  actual?: string
  evidenceRefs?: readonly string[]
  recommendedActions?: readonly string[]
  confidence?: DiagnosticConfidence
  privacy?: DiagnosticPrivacy
  metadata?: Record<string, unknown>
}

export interface DiagnosticIntegrationAdapter {
  /** Stable identifier for a runner, subsystem, plugin, or external test source. */
  id: string
  /** Convert an external payload into the shared event contract; return null for unsupported payloads. */
  normalize: (raw: unknown) => UnifiedDiagnosticEvent | null
}

const adapters = new Map<string, DiagnosticIntegrationAdapter>()
const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,79}$/

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)

const isDiagnosticLevel = (value: unknown): value is DiagnosticLevel =>
  value === "info" || value === "warn" || value === "error"

const isStatus = (value: unknown): value is UnifiedDiagnosticStatus =>
  value === "passed" || value === "failed" || value === "blocked" ||
  value === "skipped" || value === "degraded" || value === "unknown"

const isConfidence = (value: unknown): value is DiagnosticConfidence =>
  value === "confirmed" || value === "high" || value === "medium" ||
  value === "low" || value === "unknown"

const isPrivacy = (value: unknown): value is DiagnosticPrivacy =>
  value === "public" || value === "sanitized" || value === "sensitive"

const validEvent = (value: unknown): value is UnifiedDiagnosticEvent => {
  if (!isRecord(value)) return false
  return typeof value.source === "string" &&
    typeof value.subsystem === "string" && SAFE_ID.test(value.subsystem) &&
    typeof value.kind === "string" && SAFE_ID.test(value.kind) &&
    isDiagnosticLevel(value.severity) &&
    isStatus(value.status) &&
    typeof value.code === "string" && SAFE_ID.test(value.code) &&
    typeof value.summary === "string" && value.summary.trim().length > 0 &&
    (value.correlationId === undefined || typeof value.correlationId === "string") &&
    (value.expected === undefined || typeof value.expected === "string") &&
    (value.actual === undefined || typeof value.actual === "string") &&
    (value.evidenceRefs === undefined || (Array.isArray(value.evidenceRefs) && value.evidenceRefs.every((item) => typeof item === "string"))) &&
    (value.recommendedActions === undefined || (Array.isArray(value.recommendedActions) && value.recommendedActions.every((item) => typeof item === "string"))) &&
    (value.confidence === undefined || isConfidence(value.confidence)) &&
    (value.privacy === undefined || isPrivacy(value.privacy)) &&
    (value.metadata === undefined || isRecord(value.metadata))
}

/** Register an integration once; duplicate IDs fail rather than silently replacing an existing adapter. */
export const registerDiagnosticAdapter = (adapter: DiagnosticIntegrationAdapter): (() => void) => {
  if (!SAFE_ID.test(adapter.id)) throw new Error("Diagnostic adapter id must be a stable safe identifier")
  if (adapters.has(adapter.id)) throw new Error(`Diagnostic adapter already registered: ${adapter.id}`)
  adapters.set(adapter.id, adapter)
  return () => {
    if (adapters.get(adapter.id) === adapter) adapters.delete(adapter.id)
  }
}

export const listDiagnosticAdapters = (): readonly string[] => [...adapters.keys()].sort()

/**
 * Ingest an external test or system result into ViewTube's existing diagnostics
 * ring buffer. No new persistence layer is introduced; credentials are redacted
 * by the canonical diagnostics sanitizer before the event is retained.
 */
export const ingestDiagnostic = (adapterId: string, raw: unknown): boolean => {
  const adapter = adapters.get(adapterId)
  if (!adapter) return false

  let normalized: UnifiedDiagnosticEvent | null
  try {
    normalized = adapter.normalize(raw)
  } catch {
    return false
  }
  if (!validEvent(normalized)) return false

  const details: DiagnosticDetails = {
    source: adapterId,
    subsystem: normalized.subsystem,
    kind: normalized.kind,
    status: normalized.status,
    correlationId: normalized.correlationId,
    expected: normalized.expected,
    actual: normalized.actual,
    evidenceRefs: normalized.evidenceRefs,
    recommendedActions: normalized.recommendedActions,
    confidence: normalized.confidence,
    privacy: normalized.privacy ?? "sanitized",
    metadata: normalized.metadata,
  }

  reportDiagnostic({
    area: normalized.subsystem,
    event: normalized.code,
    level: normalized.severity,
    whatHappened: normalized.summary,
    whatItMeans: `Integration ${adapterId} reported ${normalized.status}.`,
    whatToCheck: normalized.recommendedActions,
    debugData: normalized.metadata,
    details,
  })
  return true
}
