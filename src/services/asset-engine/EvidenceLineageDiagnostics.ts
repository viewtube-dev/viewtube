import { getContentBuild, listContentBuildEvents } from "./ContentBuildRepository"
import type { ContentBuildEvent } from "./contracts"
import { listAlgorithmIntelligenceEvents } from "../brain/AlgorithmIntelligenceEventLedger"
import type { AlgorithmIntelligenceEvent } from "../brain/AlgorithmIntelligenceEventLedger"

export type EvidenceLineageNodeType = "contentbuild-event" | "brain-event"

export interface EvidenceLineageNode {
  id: string
  type: EvidenceLineageNodeType
  occurredAt: string
  parentIds: string[]
  evidenceIds: string[]
  sourceRecordRef: string
}

export type EvidenceLineageStatus = "complete" | "incomplete" | "unverified" | "invalid"

export interface EvidenceLineageReconstruction {
  rootId: string
  status: EvidenceLineageStatus
  orderedNodes: EvidenceLineageNode[]
  missingParentIds: string[]
  duplicateNodeIds: string[]
  cycleNodeIds: string[]
  unverifiedEvidenceIds: string[]
}

const stringIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0))]
    : []

const metadataRecord = (event: ContentBuildEvent | AlgorithmIntelligenceEvent): Record<string, unknown> =>
  event.metadata && typeof event.metadata === "object" ? event.metadata as Record<string, unknown> : {}

export const reconstructEvidenceLineage = (
  nodes: EvidenceLineageNode[],
  rootId: string,
): EvidenceLineageReconstruction => {
  const counts = new Map<string, number>()
  for (const node of nodes) counts.set(node.id, (counts.get(node.id) || 0) + 1)
  const duplicateNodeIds = [...counts.entries()].filter(([, count]) => count > 1).map(([id]) => id).sort()
  const byId = new Map<string, EvidenceLineageNode>()
  for (const node of nodes) if (!byId.has(node.id)) byId.set(node.id, node)

  const missingParentIds = new Set<string>()
  const cycleNodeIds = new Set<string>()
  const unverifiedEvidenceIds = new Set<string>()
  const orderedNodes: EvidenceLineageNode[] = []
  const state = new Map<string, "visiting" | "visited">()

  if (!byId.has(rootId)) missingParentIds.add(rootId)

  const visit = (id: string, stack: string[]) => {
    const currentState = state.get(id)
    if (currentState === "visited") return
    if (currentState === "visiting") {
      const cycleStart = stack.indexOf(id)
      for (const cycleId of stack.slice(cycleStart < 0 ? 0 : cycleStart)) cycleNodeIds.add(cycleId)
      cycleNodeIds.add(id)
      return
    }

    const node = byId.get(id)
    if (!node) {
      missingParentIds.add(id)
      return
    }

    state.set(id, "visiting")
    for (const parentId of node.parentIds) {
      if (!byId.has(parentId)) missingParentIds.add(parentId)
      else visit(parentId, [...stack, id])
    }
    for (const evidenceId of node.evidenceIds) {
      if (!byId.has(evidenceId)) unverifiedEvidenceIds.add(evidenceId)
    }
    state.set(id, "visited")
    orderedNodes.push(node)
  }

  visit(rootId, [])
  const missing = [...missingParentIds].sort()
  const cycles = [...cycleNodeIds].sort()
  const unverified = [...unverifiedEvidenceIds].sort()
  const status: EvidenceLineageStatus =
    duplicateNodeIds.length > 0 || cycles.length > 0 || (!byId.has(rootId) && missing.length > 0)
      ? "invalid"
      : missing.length > 0
        ? "incomplete"
        : unverified.length > 0
          ? "unverified"
          : "complete"

  return {
    rootId,
    status,
    orderedNodes,
    missingParentIds: missing,
    duplicateNodeIds,
    cycleNodeIds: cycles,
    unverifiedEvidenceIds: unverified,
  }
}

const contentBuildNode = (event: ContentBuildEvent): EvidenceLineageNode => {
  const metadata = metadataRecord(event)
  return {
    id: event.id,
    type: "contentbuild-event",
    occurredAt: event.timestamp,
    parentIds: stringIds(metadata.parentEventIds),
    evidenceIds: stringIds(event.evidenceIds),
    sourceRecordRef: `contentbuild-event:${event.id}`,
  }
}

const brainNode = (event: AlgorithmIntelligenceEvent): EvidenceLineageNode => {
  const metadata = metadataRecord(event)
  const parentIds = stringIds(event.parentEventIds)
  if (event.sourceId && !parentIds.includes(event.sourceId)) parentIds.push(event.sourceId)
  // A source reference is causal ancestry only when explicitly recorded by the producer.
  return {
    id: event.id,
    type: "brain-event",
    occurredAt: new Date(event.createdAt).toISOString(),
    parentIds,
    evidenceIds: stringIds(event.evidenceIds),
    sourceRecordRef: `brain-event:${event.id}`,
  }
}

/**
 * Reconstructs lineage from the existing ContentBuild event stream and Brain
 * Algorithm Intelligence ledger. This is a read-only projection: it creates no
 * new persistence owner and never upgrades unresolved references to verified.
 */
export const inspectContentBuildEvidenceLineage = (
  contentBuildId: string,
  rootRecordId: string,
): EvidenceLineageReconstruction => {
  const build = getContentBuild(contentBuildId)
  if (!build) return reconstructEvidenceLineage([], rootRecordId)

  const contentEvents = listContentBuildEvents(contentBuildId)
  const brainEvents = listAlgorithmIntelligenceEvents({
    channelId: build.channelId,
    projectId: build.legacyProjectId,
    videoId: build.youtube?.videoId,
  })
  const nodes = [
    ...contentEvents.map(contentBuildNode),
    ...brainEvents.map(brainNode),
  ]
  return reconstructEvidenceLineage(nodes, rootRecordId)
}
