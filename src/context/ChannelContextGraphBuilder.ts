import type { ChannelContextProfile } from "./ChannelContextProfile"

export interface ChannelContextGraphNode {
  id: string
  type: "channel" | "competitor" | "topic"
  label: string
  evidenceIds: string[]
}
export interface ChannelContextGraphEdge {
  from: string
  to: string
  relationship: "competes_with" | "contains"
}
export interface ChannelContextGraph {
  nodes: ChannelContextGraphNode[]
  edges: ChannelContextGraphEdge[]
}

/** A deterministic projection of creator-provided context; it is not observed evidence. */
export function buildChannelContextGraph(context: ChannelContextProfile): ChannelContextGraph {
  const graph: ChannelContextGraph = { nodes: [], edges: [] }
  const channelName = context.identity.name?.trim() || "Unknown Channel"
  graph.nodes.push({ id: "channel", type: "channel", label: channelName, evidenceIds: [] })

  const seen = new Set<string>(["channel"])
  for (const competitor of context.identity.competitors ?? []) {
    const label = competitor.trim()
    if (!label) continue
    const id = `competitor:${label.toLocaleLowerCase()}`
    if (!seen.has(id)) {
      graph.nodes.push({ id, type: "competitor", label, evidenceIds: [] })
      seen.add(id)
    }
    graph.edges.push({ from: "channel", to: id, relationship: "competes_with" })
  }

  for (const topic of context.content.priorityThemes ?? []) {
    const label = topic.trim()
    if (!label) continue
    const id = `topic:${label.toLocaleLowerCase()}`
    if (!seen.has(id)) {
      graph.nodes.push({ id, type: "topic", label, evidenceIds: [] })
      seen.add(id)
    }
    graph.edges.push({ from: "channel", to: id, relationship: "contains" })
  }
  return graph
}
