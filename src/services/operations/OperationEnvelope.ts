export const OPERATION_ENVELOPE_SCHEMA_VERSION = 1 as const

export type OperationActorType =
  | "creator"
  | "brain"
  | "tool"
  | "provider"
  | "youtube"
  | "analytics"
  | "sync"
  | "system"

export interface OperationActor {
  type: OperationActorType
  id: string | null
}

export interface OperationEnvelope {
  schemaVersion: typeof OPERATION_ENVELOPE_SCHEMA_VERSION
  eventId: string
  eventType: string
  operationId: string
  channelId: string | null
  projectId: string | null
  contentBuildId: string | null
  actor: OperationActor
  correlationId: string
  causationId: string | null
  idempotencyKey: string
  occurredAt: string
  evidenceRefs: string[]
  artifactRefs: string[]
}

export interface OperationEnvelopeInput {
  eventId: string
  eventType: string
  operationId: string
  channelId?: string | null
  projectId?: string | null
  contentBuildId?: string | null
  actor: OperationActor
  correlationId: string
  causationId?: string | null
  idempotencyKey: string
  occurredAt: string
  evidenceRefs?: string[]
  artifactRefs?: string[]
}

const requiredString = (value: string, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Operation envelope requires a non-empty ${field}.`)
  }
  return value.trim()
}

/**
 * Creates a normalized event envelope over existing ViewTube domain events.
 * This is a contract/helper only; it intentionally introduces no event store.
 */
export const createOperationEnvelope = (
  input: OperationEnvelopeInput,
): OperationEnvelope => {
  const actorId = input.actor.id == null ? null : requiredString(input.actor.id, "actor.id")
  return {
    schemaVersion: OPERATION_ENVELOPE_SCHEMA_VERSION,
    eventId: requiredString(input.eventId, "eventId"),
    eventType: requiredString(input.eventType, "eventType"),
    operationId: requiredString(input.operationId, "operationId"),
    channelId: input.channelId ?? null,
    projectId: input.projectId ?? null,
    contentBuildId: input.contentBuildId ?? null,
    actor: { type: input.actor.type, id: actorId },
    correlationId: requiredString(input.correlationId, "correlationId"),
    causationId: input.causationId == null ? null : requiredString(input.causationId, "causationId"),
    idempotencyKey: requiredString(input.idempotencyKey, "idempotencyKey"),
    occurredAt: requiredString(input.occurredAt, "occurredAt"),
    evidenceRefs: [...(input.evidenceRefs ?? [])],
    artifactRefs: [...(input.artifactRefs ?? [])],
  }
}

export interface OperationIdempotencyKeyInput {
  operationType: string
  scope: string[]
  commandId: string
}

/**
 * Builds a deterministic, scope-aware key. Length-prefixing each part avoids
 * delimiter collisions; callers must supply a stable commandId for retries.
 */
export const createOperationIdempotencyKey = (
  input: OperationIdempotencyKeyInput,
): string => {
  const parts = [
    requiredString(input.operationType, "operationType"),
    ...input.scope.map((part, index) => requiredString(part, `scope[${index}]`)),
    requiredString(input.commandId, "commandId"),
  ]
  return `vt-op-v1:${parts.map(part => `${part.length}:${part}`).join("")}`
}

/** Returns true when a candidate would repeat an already recorded command. */
export const hasOperationIdempotencyConflict = (
  existing: readonly Pick<OperationEnvelope, "idempotencyKey">[],
  candidate: Pick<OperationEnvelope, "idempotencyKey">,
): boolean => existing.some(event => event.idempotencyKey === candidate.idempotencyKey)
