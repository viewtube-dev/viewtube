import { describe, expect, it } from "vitest"
import {
  createEmptyMetadataMasterPackage,
  finalizeMetadataMasterPackage,
  packageToHandoffPayload,
  scoreMetadataMasterPackage,
} from "./metadataMaster"

describe("Metadata Master package system", () => {
  it("scores a complete package and surfaces duplicate-tag hygiene", () => {
    const pkg = finalizeMetadataMasterPackage(createEmptyMetadataMasterPackage({
      title: "How to Build a Better YouTube Channel",
      description: "A complete description with enough context to make the publication package useful to viewers and downstream systems.",
      tags: ["youtube", "youtube"],
      category: "Education",
      thumbnailPrompt: "High-contrast visual showing the transformation described by the video",
      thumbnailText: "BUILD BETTER",
    }))
    expect(pkg.score).toBeGreaterThan(0)
    expect(pkg.warnings).toContain("Duplicate tags detected.")
  })

  it("creates a transport-safe publication package payload", () => {
    const pkg = finalizeMetadataMasterPackage(createEmptyMetadataMasterPackage({
      title: "Test package",
      description: "Description",
      tags: ["one"],
      category: "Education",
      thumbnailPrompt: "Visual direction",
    }))
    const payload = packageToHandoffPayload(pkg)
    expect(payload).toMatchObject({
      packageId: pkg.id,
      title: pkg.title,
      tags: pkg.tags,
      goal: pkg.goal,
      intensity: pkg.intensity,
    })
  })

  it("keeps the score deterministic", () => {
    const pkg = createEmptyMetadataMasterPackage({
      title: "A title that is long enough to evaluate clearly",
      description: "A sufficiently detailed description for deterministic scoring.",
      tags: ["alpha", "beta"],
      category: "Education",
      thumbnailPrompt: "A complementary visual direction",
      thumbnailText: "COMPLEMENT",
    })
    expect(scoreMetadataMasterPackage(pkg)).toBe(scoreMetadataMasterPackage(pkg))
  })
})
