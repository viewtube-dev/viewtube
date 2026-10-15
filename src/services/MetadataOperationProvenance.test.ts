// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import {
  createContentBuild,
  listContentBuildEvents,
  resetContentBuildRepositoryForTests,
} from "./asset-engine/ContentBuildRepository"
import { recordMetadataOperationProvenance } from "./MetadataOperationProvenance"

describe("metadata operation provenance", () => {
  beforeEach(() => {
    localStorage.clear()
    resetContentBuildRepositoryForTests()
    createContentBuild({ id: "cb-operation", channelId: "channel-1" })
  })

  it("records recipe, context and output references without persisting raw source text", () => {
    const input = {
      contentBuildId: "cb-operation",
      operationId: "operation-1",
      operation: "generate" as const,
      toolId: "metadata-master" as const,
      recipeId: "metadata-master.seo-package",
      recipeVersion: "1",
      contentBuildRevision: 4,
      fields: ["title", "description"],
      outputPackageIds: ["package-1"],
      evidenceIds: ["evidence-1"],
      inputFingerprintSource: {
        concept: "Private creator draft source",
        script: "Long source script that must not be persisted",
      },
      timestamp: "2026-10-15T12:00:00.000Z",
    }
    const event = recordMetadataOperationProvenance(input)
    const replay = recordMetadataOperationProvenance(input)
    const serialized = JSON.stringify(event)

    expect(replay.id).toBe(event.id)
    expect(event.entityType).toBe("metadata-operation")
    expect(event.resultingState).toMatchObject({
      operationId: "operation-1",
      recipe: { id: "metadata-master.seo-package", version: "1" },
      inputFingerprint: expect.any(String),
      rawPromptPersisted: false,
      rawSourceTextPersisted: false,
    })
    expect(serialized).not.toContain("Long source script that must not be persisted")
    expect(listContentBuildEvents("cb-operation").filter(item => item.entityType === "metadata-operation")).toHaveLength(1)
  })
})
