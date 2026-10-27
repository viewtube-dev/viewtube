import { CHANNEL_CONTEXT_QUESTIONS } from "./channelContextQuestions"
import type { ChannelContextProfile } from "./ChannelContextProfile"

export interface ContextScoreResult {
  completionScore: number
  answeredRequired: number
  requiredCount: number
  missingFields: string[]
}

const readPath = (value: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((current, key) => {
    if (current === null || typeof current !== "object") return undefined
    return (current as Record<string, unknown>)[key]
  }, value)

const hasAnswer = (value: unknown, contextField: string): boolean => {
  if (contextField === "brand.creativity") {
    return typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 10
  }
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "number") return Number.isFinite(value)
  if (Array.isArray(value)) return value.some((item) => String(item).trim().length > 0)
  return value !== null && value !== undefined && typeof value === "boolean"
}

export function scoreContext(context: ChannelContextProfile): ContextScoreResult {
  const required = CHANNEL_CONTEXT_QUESTIONS.filter((question) => question.required)
  const missingFields = required
    .filter((question) => !hasAnswer(readPath(context, question.contextField), question.contextField))
    .map((question) => question.contextField)

  return {
    completionScore: required.length === 0 ? 100 : Math.round(((required.length - missingFields.length) / required.length) * 100),
    answeredRequired: required.length - missingFields.length,
    requiredCount: required.length,
    missingFields,
  }
}
