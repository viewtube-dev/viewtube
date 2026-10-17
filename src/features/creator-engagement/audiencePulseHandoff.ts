import type { AudiencePulseSignal } from "./audiencePulse"
import {
  createViewTubeActionPacket,
  getViewTubeToolCapability,
  type ViewTubeActionPacket,
} from "../../services/viewTubeToolChains"

/**
 * Build a stable, review-only packet from a signal already derived from canonical
 * source records. Destinations must explicitly accept evidence payloads.
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

  const identity = `audience-pulse:${signal.id}:proposal-v1`
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
  return { ...packet, id: `audience-pulse-proposal:${encodeURIComponent(signal.id)}` }
}
