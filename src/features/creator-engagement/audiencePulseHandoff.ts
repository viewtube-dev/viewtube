import type { AudiencePulseSignal } from "./audiencePulse"
import {
  createViewTubeActionPacket,
  getViewTubeToolCapability,
  type ViewTubeActionPacket,
} from "../../services/viewTubeToolChains"

const stableFingerprint = (value: string): string => {
  let first = 2166136261
  let second = 5381
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    first = Math.imul(first ^ code, 16777619)
    second = Math.imul(second, 33) ^ code
  }
  return `${(first >>> 0).toString(36)}${(second >>> 0).toString(36)}`
}

/**
 * Build a stable, review-only packet from a signal already derived from canonical
 * source records. Destinations must explicitly accept evidence payloads. Identity
 * includes the evidence snapshot so a refreshed cluster can produce a new proposal.
 */
export const buildAudiencePulseProposalPacket = (
  signal: AudiencePulseSignal,
): ViewTubeActionPacket<AudiencePulseSignal> | null => {
  if (signal.intent === "unknown" || signal.evidenceIds.length === 0) return null

  const suggestedTargets = signal.suggestedTargets.filter((targetId) => {
    const capability = getViewTubeToolCapability(targetId)
    return Boolean(capability && capability.id !== "comment-responder" && capability.accepts.includes("evidence"))
  })
  if (!suggestedTargets.length) return null

  const fingerprint = stableFingerprint(JSON.stringify([
    signal.id,
    [...signal.evidenceIds].sort(),
    signal.sourceWindow,
    signal.confidence,
    signal.limitations,
  ]))
  const identity = `audience-pulse:${signal.id}:${fingerprint}:proposal-v1`
  const packet = createViewTubeActionPacket<AudiencePulseSignal>({
    sourceToolId: "comment-responder",
    sourceKind: "studio-tool",
    payloadKind: "evidence",
    title: `Audience ${signal.intent} signal for review`,
    summary: `Review this ${signal.intent} pattern against its source evidence. No reply, post, experiment, or publication has been executed.`,
    payload: signal,
    channelId: signal.channelId,
    projectId: signal.projectId,
    videoId: signal.videoId,
    evidence: [...signal.evidenceIds],
    provenance: [
      `signal:${signal.id}`,
      ...signal.sourceReferences.map((source) => `source:${source.source}:${source.sourceId}`),
      `source-window-start:${signal.sourceWindow.start || "unknown"}`,
      `source-window-end:${signal.sourceWindow.end || "unknown"}`,
      `pattern-confidence:${signal.confidence === null ? "unknown" : signal.confidence}`,
      ...signal.limitations.map((limitation) => `limitation:${limitation}`),
    ],
    suggestedTargets,
    workflowId: identity,
    operationId: identity,
    idempotencyKey: identity,
    intent: "propose",
    approvalState: "pending",
  })

  // A deterministic packet ID makes repeat clicks idempotent in the canonical
  // action-packet cache and handoff inbox; operation identity is stable too.
  return { ...packet, id: `audience-pulse-proposal:${fingerprint}` }
}
