import { describe, expect, it } from "vitest"
import type { DeterministicAnalyticsInsight } from "./DeterministicAnalyticsInsights"
import {
  buildAnalyticsRecommendationAction,
  buildBrainAnalyticsFindingContext,
  buildLearningCandidateReview,
  evaluateAnalyticsOutcome,
  presentAnalyticsFindings,
} from "./AnalyticsIntelligenceWorkflow"

const finding = (overrides: Partial<DeterministicAnalyticsInsight> = {}): DeterministicAnalyticsInsight => ({
  id: "finding-1",
  kind: "comparison",
  findingType: "comparison",
  label: "Views increased",
  channelId: "channel-1",
  datasetId: "daily",
  metric: "views",
  filters: {},
  window: "28d",
  sourceSnapshotIds: ["snapshot-before", "snapshot-after"],
  sourceObservedAt: "2026-10-15T00:00:00.000Z",
  aggregation: "sum",
  observedFact: {
    currentValue: 140,
    baselineValue: 100,
    delta: 40,
    relativeDeltaPercent: 40,
  },
  calculation: {
    formula: "delta = current - baseline",
    algorithmVersion: "vt-deterministic-analytics-insights-v1",
    deterministic: true,
  },
  validationState: "validated",
  interpretation: "The metric increased across comparable periods.",
  recommendation: "Review the successful format and consider a controlled follow-up.",
  currentValue: 140,
  baselineValue: 100,
  delta: 40,
  relativeDeltaPercent: 40,
  unit: "source-metric-value",
  confidence: 0.8,
  evidenceRefs: ["analytics:snapshot-before:daily:views", "analytics:snapshot-after:daily:views"],
  formula: "delta = current - baseline",
  algorithmVersion: "vt-deterministic-analytics-insights-v1",
  deterministic: true,
  period: {
    current: { label: "current", startDate: "2026-09-18", endDate: "2026-10-15" },
    baseline: { label: "baseline", startDate: "2026-08-21", endDate: "2026-09-17" },
    window: "28d",
  },
  limitations: ["Descriptive comparison only; it does not establish causation."],
  ...overrides,
})

const recommendation = () =>
  buildAnalyticsRecommendationAction({
    id: "recommendation-1",
    creatorGoal: "Increase qualified watch time",
    action: "Test a clearer opening sequence",
    channelId: "channel-1",
    projectId: "project-1",
    finding: finding(),
    evaluationWindow: "28d",
    expectedDirection: "increase",
  })!

const measurement = (overrides: Partial<{
  channelId: string
  metric: string
  window: "7d" | "28d" | "90d" | "365d"
  value: number
  snapshotId: string
  observedAt: string
  periodStartDate: string
  periodEndDate: string
}> = {}) => ({
  channelId: "channel-1",
  metric: "views",
  window: "28d" as const,
  value: 100,
  snapshotId: "snapshot-before",
  observedAt: "2026-09-17T00:00:00.000Z",
  periodStartDate: "2026-08-21",
  periodEndDate: "2026-09-17",
  ...overrides,
})

describe("Analytics intelligence workflow phases 5–8", () => {
  it("keeps deterministic facts separate from interpretation and does not invent a hypothesis", () => {
    const [presented] = presentAnalyticsFindings([finding()], "channel-1")
    expect(presented.layers.fact.label).toBe("Deterministic fact")
    expect(presented.layers.interpretation).toContain("increased")
    expect(presented.layers.hypothesis).toBeNull()
    expect(presented.layers.recommendation).toContain("controlled follow-up")
    expect(presented.evidenceRefs).toHaveLength(2)
  })

  it("blocks Brain context when the requested channel and canonical channel differ", () => {
    const context = buildBrainAnalyticsFindingContext({
      expectedChannelId: "channel-1",
      canonicalChannelId: "channel-2",
      findings: [finding()],
    })
    expect(context.status).toBe("blocked")
    expect(context.findings).toEqual([])
    expect(context.findingIds).toEqual([])
  })

  it("passes only validated, same-channel findings into bounded Brain context", () => {
    const context = buildBrainAnalyticsFindingContext({
      expectedChannelId: "channel-1",
      canonicalChannelId: "channel-1",
      findings: [
        finding(),
        finding({ id: "wrong-channel", channelId: "channel-2" }),
        ({ ...finding({ id: "unvalidated" }), validationState: "blocked" } as unknown as DeterministicAnalyticsInsight),
      ],
      limit: 1,
    })
    expect(context.status).toBe("ready")
    expect(context.findingIds).toEqual(["finding-1"])
    expect(context.findings[0].currentValue).toBe(140)
    expect(context.findings[0].formula).toBe("delta = current - baseline")
  })

  it("creates a proposed, goal-aware action with provenance and evaluation criteria", () => {
    const action = recommendation()
    expect(action.status).toBe("proposed")
    expect(action.creatorGoal).toBe("Increase qualified watch time")
    expect(action.findingIds).toEqual(["finding-1"])
    expect(action.evidenceRefs).toHaveLength(2)
    expect(action.evaluationWindow).toBe("28d")
    expect(action.causalClaim).toBeNull()
  })

  it("blocks an outcome comparison with a mismatched metric", () => {
    const result = evaluateAnalyticsOutcome({
      recommendation: recommendation(),
      baseline: measurement(),
      followUp: measurement({
        snapshotId: "snapshot-after",
        metric: "likes",
        value: 120,
        observedAt: "2026-10-15T00:00:00.000Z",
      }),
    })
    expect(result.status).toBe("blocked")
    expect(result.absoluteChange).toBeNull()
    expect(result.causalConclusion).toBeNull()
  })

  it("evaluates comparable snapshots and leaves zero-baseline percentage undefined", () => {
    const result = evaluateAnalyticsOutcome({
      recommendation: recommendation(),
      baseline: measurement({ value: 0 }),
      followUp: measurement({
        value: 12,
        snapshotId: "snapshot-after",
        observedAt: "2026-10-15T00:00:00.000Z",
        periodStartDate: "2026-09-18",
        periodEndDate: "2026-10-15",
      }),
    })
    expect(result.status).toBe("evaluated")
    expect(result.absoluteChange).toBe(12)
    expect(result.percentChange).toBeNull()
    expect(result.interpretation).toBe("descriptive-association-only")
    expect(result.causalConclusion).toBeNull()
    expect(result.limitations.some((item) => item.includes("baseline is zero"))).toBe(true)
  })

  it("keeps learning candidates review-only and requires repeated evaluated outcomes", () => {
    const action = recommendation()
    const base = evaluateAnalyticsOutcome({
      recommendation: action,
      baseline: measurement(),
      followUp: measurement({ value: 120, snapshotId: "snapshot-after-1", periodStartDate: "2026-09-18", periodEndDate: "2026-10-15", observedAt: "2026-10-15T00:00:00.000Z" }),
    })
    const second = { ...base, id: "outcome-2", followUpSnapshotId: "snapshot-after-2", absoluteChange: 15 }
    const third = { ...base, id: "outcome-3", followUpSnapshotId: "snapshot-after-3", absoluteChange: 10 }
    expect(buildLearningCandidateReview({ id: "candidate-too-early", recommendation: action, evaluations: [base, second] })).toBeNull()
    const candidate = buildLearningCandidateReview({
      id: "candidate-1",
      recommendation: action,
      evaluations: [base, second, third],
    })
    expect(candidate?.status).toBe("review-required")
    expect(candidate?.promotionAllowed).toBe(false)
    expect(candidate?.causalConclusion).toBeNull()
    expect(candidate?.requiredReviews.length).toBeGreaterThan(0)
  })
})
