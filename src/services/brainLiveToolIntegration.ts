import type { ViewTubeActionPacket, ViewTubePayloadKind } from "./viewTubeToolChains"
import { getViewTubeToolCapability, loadViewTubeActionPacket } from "./viewTubeToolChains"
import { listBrainHandoffs, updateBrainHandoffState, type BrainHandoffInboxItem } from "./brainHandoffInbox"
import { recordBrainWorkflowResult } from "./brainWorkflowLearning"
import { validateProductionHandoff } from "./productionHandoffContracts"

export type BrainToolIntegrationState = "ready" | "blocked" | "consumed"

export interface BrainToolIntegrationEnvelope<T = unknown> {
  handoff: BrainHandoffInboxItem
  packet: ViewTubeActionPacket<T>
  destinationToolId: string
  payloadKind: ViewTubePayloadKind
  state: BrainToolIntegrationState
  reason?: string
}

type BrainToolIntegrationCandidate = Omit<BrainToolIntegrationEnvelope, "packet"> & {
  packet: ViewTubeActionPacket | null
}

export const getPendingToolIntegrations = (destinationToolId: string): BrainToolIntegrationEnvelope[] => {
  const target = getViewTubeToolCapability(destinationToolId)
  return listBrainHandoffs(destinationToolId)
    .filter(item => item.state === "queued" || item.state === "opened")
    .map((handoff): BrainToolIntegrationCandidate => {
      const packet = loadViewTubeActionPacket(handoff.packetId)
      if (!packet) return { handoff, packet: null, destinationToolId, payloadKind: handoff.payloadKind, state: "blocked" as const, reason: "ActionPacket is no longer available." }
      if (!target) return { handoff, packet, destinationToolId, payloadKind: packet.payloadKind, state: "blocked" as const, reason: "Destination tool is not registered." }
      const validation = validateProductionHandoff(packet, target)
      if (!validation.ok) return { handoff, packet, destinationToolId, payloadKind: packet.payloadKind, state: "blocked" as const, reason: validation.issues.join(" ") }
      return { handoff, packet, destinationToolId, payloadKind: packet.payloadKind, state: "ready" as const, reason: validation.warnings.length ? validation.warnings.join(" ") : undefined }
    })
    .filter((row): row is BrainToolIntegrationEnvelope => row.packet !== null)
}

export const openToolIntegration = (handoffId: string) => updateBrainHandoffState(handoffId, "opened")
export const acceptToolIntegration = (handoffId: string) => {
  const handoff = listBrainHandoffs().find(item => item.id === handoffId)
  if (!handoff || (handoff.state !== "queued" && handoff.state !== "opened")) return null
  const packet = loadViewTubeActionPacket(handoff.packetId)
  const target = getViewTubeToolCapability(handoff.destinationToolId)
  if (!packet || !target || !validateProductionHandoff(packet, target).ok) return null
  return updateBrainHandoffState(handoffId, "accepted")
}
export const completeToolIntegration = (handoffId: string, channelId?: string | null, chainId?: string) => {
  const handoff = listBrainHandoffs().find(item => item.id === handoffId)
  if (!handoff || handoff.state !== "accepted") return null
  const packet = loadViewTubeActionPacket(handoff.packetId)
  const target = getViewTubeToolCapability(handoff.destinationToolId)
  if (!packet || !target || !validateProductionHandoff(packet, target).ok) return null
  const item = updateBrainHandoffState(handoffId, "completed")
  if (item && channelId) recordBrainWorkflowResult({ channelId, chainId: chainId || packet.workflowId || "live-tool-handoff", goal: "produce", outcome: "completed", scoreBefore: 0.5 })
  return item
}
export const dismissToolIntegration = (handoffId: string, channelId?: string | null, chainId = "live-tool-handoff") => {
  const item = updateBrainHandoffState(handoffId, "dismissed")
  if (item && channelId) recordBrainWorkflowResult({ channelId, chainId, goal: "produce", outcome: "rejected", scoreBefore: 0.5 })
  return item
}

export const extractToolPrefill = <T extends Record<string, unknown> = Record<string, unknown>>(packet: ViewTubeActionPacket): Partial<T> => {
  if (packet.payload && typeof packet.payload === "object" && !Array.isArray(packet.payload)) return packet.payload as Partial<T>
  return { handoffValue: packet.payload } as unknown as Partial<T>
}
