import { beforeEach, describe, expect, it, vi } from "vitest"

const canonicalStores = vi.hoisted(() => ({
  getContentBuild: vi.fn(),
  listContentBuildEvents: vi.fn(),
  listAlgorithmIntelligenceEvents: vi.fn(),
}))

vi.mock("./ContentBuildRepository", () => ({
  getContentBuild: canonicalStores.getContentBuild,
  listContentBuildEvents: canonicalStores.listContentBuildEvents,
}))
vi.mock("../brain/AlgorithmIntelligenceEventLedger", () => ({
  listAlgorithmIntelligenceEvents: canonicalStores.listAlgorithmIntelligenceEvents,
}))

import {
  inspectContentBuildEvidenceLineage,
  reconstructEvidenceLineage,
  type EvidenceLineageNode,
} from "./EvidenceLineageDiagnostics"

const node = (id: string, parentIds: string[] = [], extra: Partial<EvidenceLineageNode> = {}): EvidenceLineageNode => ({
  id,
  type: "contentbuild-event",
  occurredAt: "2026-10-16T12:00:00.000Z",
  parentIds,
  evidenceIds: [],
  sourceRecordRef: id,
  ...extra,
})

describe("Evidence lineage reconstruction", () => {
  it("reconstructs causal order even when records arrive out of order", () => {
    const result = reconstructEvidenceLineage([
      node("learning", ["evaluation"]),
      node("evaluation", ["checkpoint"]),
      node("checkpoint", ["publication"]),
      node("publication", ["recommendation"]),
      node("recommendation"),
    ], "learning")

    expect(result.status).toBe("complete")
    expect(result.orderedNodes.map(item => item.id)).toEqual([
      "recommendation", "publication", "checkpoint", "evaluation", "learning",
    ])
    expect(result.missingParentIds).toEqual([])
    expect(result.cycleNodeIds).toEqual([])
  })

  it("reports missing parents instead of silently asserting verified provenance", () => {
    const result = reconstructEvidenceLineage([
      node("recommendation", ["missing-evidence"]),
    ], "recommendation")

    expect(result.status).toBe("incomplete")
    expect(result.missingParentIds).toEqual(["missing-evidence"])
    expect(result.orderedNodes.map(item => item.id)).toEqual(["recommendation"])
  })

  it("detects circular ancestry and duplicate record identifiers", () => {
    const result = reconstructEvidenceLineage([
      node("a", ["b"]),
      node("b", ["a"]),
      node("a", []),
    ], "a")

    expect(result.status).toBe("invalid")
    expect(result.duplicateNodeIds).toEqual(["a"])
    expect(result.cycleNodeIds).toEqual(["a", "b"])
  })

  it("preserves unverified external evidence references without treating them as missing parents", () => {
    const result = reconstructEvidenceLineage([
      node("recommendation", [], { evidenceIds: ["analytics-evidence-1"] }),
    ], "recommendation")

    expect(result.status).toBe("unverified")
    expect(result.unverifiedEvidenceIds).toEqual(["analytics-evidence-1"])
  })

  it("rejects an unknown root record", () => {
    const result = reconstructEvidenceLineage([node("known")], "unknown")

    expect(result.status).toBe("invalid")
    expect(result.missingParentIds).toEqual(["unknown"])
    expect(result.orderedNodes).toEqual([])
  })
})


describe("canonical lineage diagnostic adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    canonicalStores.getContentBuild.mockReturnValue({
      id: "build-1",
      channelId: "channel-1",
      legacyProjectId: "project-1",
      youtube: { videoId: "video-1" },
    })
    canonicalStores.listContentBuildEvents.mockReturnValue([
      {
        id: "publication",
        contentBuildId: "build-1",
        timestamp: "2026-10-16T12:02:00.000Z",
        eventType: "publish.transaction.completed",
        actorType: "system",
        inputAssetIds: [],
        outputAssetIds: [],
        evidenceIds: [],
        metadata: { parentEventIds: ["recommendation"] },
      },
    ])
    canonicalStores.listAlgorithmIntelligenceEvents.mockReturnValue([
      {
        id: "recommendation",
        channelId: "channel-1",
        projectId: "project-1",
        videoId: "video-1",
        kind: "RECOMMENDATION_CREATED",
        sourceSystem: "workflow",
        parentEventIds: [],
        evidenceIds: [],
        confidence: "high",
        title: "Recommendation",
        summary: "Fixture recommendation",
        evaluationTargets: [],
        metadata: {},
        createdAt: Date.parse("2026-10-16T12:01:00.000Z"),
      },
    ])
  })

  it("queries canonical owners and reconstructs cross-ledger ancestry", () => {
    const result = inspectContentBuildEvidenceLineage("build-1", "publication")

    expect(canonicalStores.getContentBuild).toHaveBeenCalledWith("build-1")
    expect(canonicalStores.listContentBuildEvents).toHaveBeenCalledWith("build-1")
    expect(canonicalStores.listAlgorithmIntelligenceEvents).toHaveBeenCalledWith({
      channelId: "channel-1",
      projectId: "project-1",
      videoId: "video-1",
    })
    expect(result.status).toBe("complete")
    expect(result.orderedNodes.map(item => item.id)).toEqual(["recommendation", "publication"])
  })

  it("does not report an absent ContentBuild as a verified empty chain", () => {
    canonicalStores.getContentBuild.mockReturnValue(null)

    const result = inspectContentBuildEvidenceLineage("missing-build", "publication")

    expect(result.status).toBe("invalid")
    expect(result.missingParentIds).toEqual(["publication"])
    expect(canonicalStores.listContentBuildEvents).not.toHaveBeenCalled()
    expect(canonicalStores.listAlgorithmIntelligenceEvents).not.toHaveBeenCalled()
  })
})
