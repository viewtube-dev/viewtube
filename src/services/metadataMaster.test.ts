import { describe, expect, it } from "vitest"
import {
  buildMetadataStrategyBrief,
  createEmptyMetadataMasterPackage,
  createMetadataMasterSet,
  finalizeMetadataMasterPackage,
  packageToHandoffPayload,
  scoreMetadataMasterPackage,
} from "./metadataMaster"

describe("Metadata Master package system", () => {
  it("keeps metadata-set style explicit and creates a goal-aware strategy brief", () => {
    const pkg = createEmptyMetadataMasterPackage({ goal: "subscribers", intensity: "aggressive" })
    const set = createMetadataMasterSet(pkg, "PACKAGE A", "channel-fit", "channel-native")
    expect(set).toMatchObject({ style: "channel-native", package: { goal: "subscribers", intensity: "aggressive", style: "channel-native" } })
    expect(buildMetadataStrategyBrief("subscribers", "aggressive", "channel-native")).toContain("subscriber conversion")
    expect(buildMetadataStrategyBrief("subscribers", "aggressive", "channel-native")).toContain("channel-native")
  })

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
      style: pkg.style,
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
