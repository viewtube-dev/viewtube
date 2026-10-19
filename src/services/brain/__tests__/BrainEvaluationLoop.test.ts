import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  listAlgorithmIntelligenceEvents: vi.fn(),
  recordAlgorithmEvaluation: vi.fn(),
  recordAlgorithmLearningCandidates: vi.fn(),
  buildCanonicalEvaluationEvidence: vi.fn(),
  hydrateEvaluationTargetsWithLifecycleCohorts: vi.fn(),
  captureCanonicalLifecycleObservations: vi.fn(),
}))

vi.mock("../AlgorithmIntelligenceEventLedger", () => ({
  listAlgorithmIntelligenceEvents: mocks.listAlgorithmIntelligenceEvents,
}))
vi.mock("../AlgorithmEvaluationEngine", () => ({
  recordAlgorithmEvaluation: mocks.recordAlgorithmEvaluation,
}))
vi.mock("../AlgorithmLearningCandidates", () => ({
  recordAlgorithmLearningCandidates: mocks.recordAlgorithmLearningCandidates,
}))
vi.mock("../CanonicalAlgorithmEvaluation", () => ({
  buildCanonicalEvaluationEvidence: mocks.buildCanonicalEvaluationEvidence,
}))
vi.mock("../AlgorithmLifecycleBaseline", () => ({
  hydrateEvaluationTargetsWithLifecycleCohorts: mocks.hydrateEvaluationTargetsWithLifecycleCohorts,
}))
vi.mock("../AlgorithmLifecycleObservationStore", () => ({
  captureCanonicalLifecycleObservations: mocks.captureCanonicalLifecycleObservations,
}))

import { listDueAlgorithmEvaluations } from "../BrainEvaluationLoop"
import type { AlgorithmIntelligenceEvent } from "../AlgorithmIntelligenceEventLedger"

const makeEvent = (overrides: Partial<AlgorithmIntelligenceEvent> = {}): AlgorithmIntelligenceEvent => ({
  id: "recommendation-zero",
  channelId: "channel-1",
  kind: "RECOMMENDATION_CREATED",
  sourceSystem: "workflow",
  sourceId: "recommendation-zero",
  parentEventIds: [],
  evidenceIds: [],
  confidence: "high",
  title: "Test recommendation",
  summary: "Test checkpoint scheduling",
  evaluationTargets: [{ metric: "views", direction: "increase", baselineValue: 0, targetValue: 10 }],
  checkpointAt: 0,
  metadata: {},
  createdAt: 0,
  ...overrides,
})

describe("BrainEvaluationLoop checkpoint scheduling", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.listAlgorithmIntelligenceEvents.mockImplementation(({ kind }: { kind?: string }) =>
      kind === "OUTCOME_MEASURED" ? [] : [makeEvent()],
    )
    mocks.recordAlgorithmEvaluation.mockReturnValue({ evaluation: { status: "positive" } })
    mocks.recordAlgorithmLearningCandidates.mockReturnValue([])
  })

  it("includes a checkpoint at timestamp zero when now is explicitly zero", () => {
    const due = listDueAlgorithmEvaluations({ channelId: "channel-1", now: 0 })

    expect(due).toHaveLength(1)
    expect(due[0]).toMatchObject({
      event: { id: "recommendation-zero", checkpointAt: 0 },
      dueAt: 0,
      overdueByMs: 0,
      requiredMetrics: ["views"],
    })
  })

  it("does not replace an explicit zero timestamp with the current clock", () => {
    mocks.listAlgorithmIntelligenceEvents.mockImplementation(({ kind }: { kind?: string }) =>
      kind === "OUTCOME_MEASURED" ? [] : [
        makeEvent({ checkpointAt: 1 }),
      ],
    )

    expect(listDueAlgorithmEvaluations({ channelId: "channel-1", now: 0 })).toHaveLength(0)
  })

  it("treats a missing checkpoint as unscheduled rather than due at creation time", () => {
    mocks.listAlgorithmIntelligenceEvents.mockImplementation(({ kind }: { kind?: string }) =>
      kind === "OUTCOME_MEASURED" ? [] : [
        makeEvent({ checkpointAt: null, createdAt: 0 }),
      ],
    )

    expect(listDueAlgorithmEvaluations({ channelId: "channel-1", now: 10_000 })).toHaveLength(0)
  })
})
