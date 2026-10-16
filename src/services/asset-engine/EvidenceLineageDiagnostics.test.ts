import { describe, expect, it } from "vitest"
import { reconstructEvidenceLineage, type EvidenceLineageNode } from "./EvidenceLineageDiagnostics"

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
