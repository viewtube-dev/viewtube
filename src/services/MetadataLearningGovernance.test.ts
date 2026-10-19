// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import {
  appendContentBuildEvent,
  createContentBuild,
  listContentBuildEvents,
  resetContentBuildRepositoryForTests,
} from "./asset-engine/ContentBuildRepository"
import {
  createMetadataLearningCandidate,
  listPromotedMetadataLearningCandidates,
  promoteMetadataLearningCandidate,
  summarizeMetadataIntelligence,
} from "./MetadataLearningGovernance"

const addComparison = (index: number, delta: number) => {
  const versionId = `metadata-v${index}`
  appendContentBuildEvent({
    contentBuildId: "cb-learning",
    eventType: "analysis.completed",
    entityType: "metadata-performance-comparison",
    entityId: versionId,
    actorType: "analytics",
    timestamp: `2026-10-${String(10 + index).padStart(2, "0")}T12:00:00.000Z`,
    evidenceIds: [`analytics-evidence-${index}`],
    resultingState: {
      status: "ready",
      metadataVersionId: versionId,
      fieldChanges: [{ field: "title", before: `Old ${index}`, after: `New ${index}` }],
      metrics: [{ metric: "views", absoluteChange: delta, percentChange: delta / 10 }],
      interpretation: "descriptive-association-only",
      causalConclusion: null,
    },
    metadata: { videoId: "video-1", metadataVersionId: versionId },
  })
}

describe("metadata learning governance", () => {
  beforeEach(() => {
    localStorage.clear()
    resetContentBuildRepositoryForTests()
    createContentBuild({ id: "cb-learning", channelId: "channel-1", legacyProjectId: "project-1" })
  })

  it("requires independent ready comparisons and creates a review-only candidate", () => {
    addComparison(1, 10)
    addComparison(2, 20)
    expect(() => createMetadataLearningCandidate({
      contentBuildId: "cb-learning",
      field: "title",
      metric: "views",
      direction: "increase",
    })).toThrow(/requires at least 3 independent ready comparisons/)

    addComparison(3, 15)
    const candidate = createMetadataLearningCandidate({
      contentBuildId: "cb-learning",
      field: "title",
      metric: "views",
      direction: "increase",
      now: new Date("2026-10-17T12:00:00.000Z"),
    })
    expect(candidate.eventType).toBe("learning.candidate.created")
    expect(candidate.resultingState).toMatchObject({
      status: "pending-creator-review",
      interpretation: "descriptive-association-only",
      causalConclusion: null,
      reviewRequired: true,
      promotionEligible: false,
      independentComparisonCount: 3,
    })
    expect(candidate.evidenceIds).toHaveLength(3)
    expect(createMetadataLearningCandidate({
      contentBuildId: "cb-learning",
      field: "title",
      metric: "views",
      direction: "increase",
    }).id).toBe(candidate.id)
  })

  it("requires five independent versions and explicit creator review before promotion", () => {
    for (let index = 1; index <= 5; index += 1) addComparison(index, 5 + index)
    const candidate = createMetadataLearningCandidate({
      contentBuildId: "cb-learning",
      field: "title",
      metric: "views",
      direction: "increase",
    })
    expect(() => promoteMetadataLearningCandidate({
      contentBuildId: "cb-learning",
      candidateEventId: candidate.id,
      approvedBy: "",
    })).toThrow(/named creator reviewer/)

    const promoted = promoteMetadataLearningCandidate({
      contentBuildId: "cb-learning",
      candidateEventId: candidate.id,
      approvedBy: "creator-1",
      now: new Date("2026-10-17T12:00:00.000Z"),
    })
    expect(promoted.eventType).toBe("knowledge.promoted")
    expect(promoted.actorType).toBe("creator")
    expect(promoted.actorId).toBe("creator-1")
    expect(promoted.resultingState).toMatchObject({
      status: "promoted",
      interpretation: "descriptive-association-only",
      causalConclusion: null,
    })
    expect(listPromotedMetadataLearningCandidates("cb-learning").map(event => event.id)).toContain(promoted.id)
    expect(promoteMetadataLearningCandidate({
      contentBuildId: "cb-learning",
      candidateEventId: candidate.id,
      approvedBy: "creator-1",
    }).id).toBe(promoted.id)
  })

  it("projects metadata history into a compact Brain-facing evidence summary", () => {
    addComparison(1, 10)
    const candidate = appendContentBuildEvent({
      contentBuildId: "cb-learning",
      eventType: "learning.candidate.created",
      entityType: "metadata-learning-candidate",
      entityId: "candidate-1",
      actorType: "system",
      evidenceIds: ["candidate-evidence"],
      resultingState: { status: "pending-creator-review" },
    })
    const summary = summarizeMetadataIntelligence(listContentBuildEvents("cb-learning"))
    expect(summary).toMatchObject({
      metadataVersionCount: 0,
      comparisonCount: 1,
      readyComparisonCount: 1,
      learningCandidateCount: 1,
      promotedKnowledgeCount: 0,
      latestComparison: {
        metadataVersionId: "metadata-v1",
        interpretation: "descriptive-association-only",
        causalConclusion: null,
      },
    })
    expect(candidate.id).toBeTruthy()
  })
})
