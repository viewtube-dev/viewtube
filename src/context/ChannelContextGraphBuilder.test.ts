import { describe, expect, it } from "vitest"
import { buildChannelContextGraph } from "./ChannelContextGraphBuilder"

describe("buildChannelContextGraph", () => {
  it("projects creator-provided competitors and themes without inventing evidence", () => {
    const graph = buildChannelContextGraph({
      identity: { name: "History Channel", competitors: ["History Lab"] },
      goals: {},
      audience: {},
      content: { priorityThemes: ["Primary sources"] },
      brand: {},
      intelligence: {},
    })

    expect(graph.nodes).toEqual([
      { id: "channel", type: "channel", label: "History Channel", evidenceIds: [] },
      { id: "competitor:history lab", type: "competitor", label: "History Lab", evidenceIds: [] },
      { id: "topic:primary sources", type: "topic", label: "Primary sources", evidenceIds: [] },
    ])
    expect(graph.edges).toEqual([
      { from: "channel", to: "competitor:history lab", relationship: "competes_with" },
      { from: "channel", to: "topic:primary sources", relationship: "contains" },
    ])
  })

  it("trims blanks and deduplicates identifiers and edges case-insensitively", () => {
    const graph = buildChannelContextGraph({
      identity: { name: "Channel", competitors: [" Alpha ", "alpha", "", "BETA"] },
      goals: {},
      audience: {},
      content: { priorityThemes: ["History", " history ", ""] },
      brand: {},
      intelligence: {},
    })

    expect(graph.nodes.map((node) => node.id)).toEqual([
      "channel", "competitor:alpha", "competitor:beta", "topic:history",
    ])
    expect(graph.edges).toHaveLength(4)
  })

  it("uses a safe fallback label for an unnamed channel", () => {
    const graph = buildChannelContextGraph({
      identity: {},
      goals: {},
      audience: {},
      content: {},
      brand: {},
      intelligence: {},
    })
    expect(graph.nodes[0].label).toBe("Unknown Channel")
  })
})
