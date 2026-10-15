import type { DeterministicAnalyticsInsight } from "./DeterministicAnalyticsInsights"

export type FindingEpistemicLayer = "deterministic-fact" | "interpretation" | "hypothesis" | "recommendation"

export interface PresentedAnalyticsFinding {
  id: string
  title: string
  kind: DeterministicAnalyticsInsight["kind"]
  metric: string
  currentValue: number
  baselineValue: number | null
  delta: number | null
  relativeDeltaPercent: number | null
  unit: DeterministicAnalyticsInsight["unit"]
  evidenceRefs: string[]
  sourceSnapshotIds: string[]
  formula: string
  algorithmVersion: string
  confidence: number
  limitations: string[]
  layers: {
    fact: { label: "Deterministic fact"; text: string }
    interpretation: string | null
    hypothesis: string | null
    recommendation: string | null
  }
}

export interface BrainAnalyticsFindingContext {
  status: "ready" | "blocked"
  channelId: string | null
  findingIds: string[]
  findings: Array<{
    id: string
    kind: DeterministicAnalyticsInsight["kind"]
    metric: string
    currentValue: number
    baselineValue: number | null
    delta: number | null
    relativeDeltaPercent: number | null
    unit: DeterministicAnalyticsInsight["unit"]
    evidenceRefs: string[]
    sourceSnapshotIds: string[]
    formula: string
    algorithmVersion: string
    confidence: number
    limitations: string[]
  }>
  blockedReason: string | null
}

export interface AnalyticsRecommendationAction {
  schemaVersion: 1
  id: string
  status: "proposed"
  creatorGoal: string
  action: string
  channelId: string
  projectId: string | null
  findingIds: string[]
  evidenceRefs: string[]
  metric: string
  baselineValue: number | null
  expectedDirection: "increase" | "decrease" | "observe"
  evaluationWindow: "7d" | "28d" | "90d" | "365d"
  baselineSnapshotIds: string[]
  causalClaim: null
}

export interface OutcomeMeasurement {
  channelId: string
  metric: string
  window: "7d" | "28d" | "90d" | "365d"
  value: number
  snapshotId: string
  observedAt: string
}

export interface OutcomeEvaluation {
  schemaVersion: 1
  id: string
  status: "evaluated" | "blocked"
  channelId: string
  metric: string
  window: string
  baselineValue: number | null
  followUpValue: number | null
  absoluteChange: number | null
  percentChange: number | null
  baselineSnapshotId: string | null
  followUpSnapshotId: string | null
  evidenceRefs: string[]
  interpretation: "descriptive-association-only"
  causalConclusion: null
  limitations: string[]
  blockedReason: string | null
}

export interface LearningCandidateReview {
  schemaVersion: 1
  id: string
  status: "review-required"
  channelId: string
  recommendationId: string
  metric: string
  evaluationIds: string[]
  evidenceRefs: string[]
  observedDirection: "increase" | "decrease" | "mixed"
  promotionAllowed: false
  causalConclusion: null
  requiredReviews: string[]
}

const uniqueSorted = (values: string[]): string[] =>
  [...new Set(values.filter((value) => typeof value === "string" && value.trim()))].sort()

const validNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

const validTimestamp = (value: string): boolean =>
  Boolean(value.trim()) && Number.isFinite(Date.parse(value))

const validFinding = (finding: DeterministicAnalyticsInsight): boolean =>
  finding.validationState === "validated"
  && finding.deterministic === true
  && Boolean(finding.id && finding.channelId && finding.metric && finding.formula)
  && validNumber(finding.currentValue)
  && (finding.baselineValue === null || validNumber(finding.baselineValue))
  && (finding.delta === null || validNumber(finding.delta))
  && finding.evidenceRefs.length > 0
  && finding.sourceSnapshotIds.length > 0

/** Presentation projection keeps facts immutable and prose layers explicitly separate. */
export const presentAnalyticsFindings = (
  findings: DeterministicAnalyticsInsight[],
  expectedChannelId: string,
): PresentedAnalyticsFinding[] => findings
  .filter((finding) => finding.channelId === expectedChannelId && validFinding(finding))
  .map((finding) => ({
    id: finding.id,
    title: finding.label,
    kind: finding.kind,
    metric: finding.metric,
    currentValue: finding.currentValue,
    baselineValue: finding.baselineValue,
    delta: finding.delta,
    relativeDeltaPercent: finding.relativeDeltaPercent,
    unit: finding.unit,
    evidenceRefs: uniqueSorted(finding.evidenceRefs),
    sourceSnapshotIds: uniqueSorted(finding.sourceSnapshotIds),
    formula: finding.formula,
    algorithmVersion: finding.algorithmVersion,
    confidence: Math.max(0, Math.min(1, finding.confidence)),
    limitations: [...finding.limitations],
    layers: {
      fact: {
        label: "Deterministic fact",
        text: finding.baselineValue === null
          ? `${finding.metric}: ${finding.currentValue} (no comparable baseline)`
          : `${finding.metric}: ${finding.currentValue}; baseline ${finding.baselineValue}; change ${finding.delta ?? "undefined"}`,
      },
      interpretation: finding.interpretation,
      hypothesis: null,
      recommendation: finding.recommendation,
    },
  }))
  .sort((left, right) => left.id.localeCompare(right.id))

/** Brain receives a bounded, evidence-linked projection only for an exact channel scope. */
export const buildBrainAnalyticsFindingContext = (input: {
  expectedChannelId?: string | null
  canonicalChannelId?: string | null
  findings: DeterministicAnalyticsInsight[]
  limit?: number
}): BrainAnalyticsFindingContext => {
  const channelId = input.expectedChannelId?.trim() || null
  if (!channelId || input.canonicalChannelId !== channelId) {
    return {
      status: "blocked",
      channelId,
      findingIds: [],
      findings: [],
      blockedReason: "Analytics findings require an exact match between requested and canonical channel scope.",
    }
  }

  const limit = Math.max(0, Math.min(20, Math.floor(input.limit ?? 8)))
  const findings = presentAnalyticsFindings(input.findings, channelId).slice(0, limit).map((finding) => ({
    id: finding.id,
    kind: finding.kind,
    metric: finding.metric,
    currentValue: finding.currentValue,
    baselineValue: finding.baselineValue,
    delta: finding.delta,
    relativeDeltaPercent: finding.relativeDeltaPercent,
    unit: finding.unit,
    evidenceRefs: finding.evidenceRefs,
    sourceSnapshotIds: finding.sourceSnapshotIds,
    formula: finding.formula,
    algorithmVersion: finding.algorithmVersion,
    confidence: finding.confidence,
    limitations: finding.limitations,
  }))
  return {
    status: "ready",
    channelId,
    findingIds: findings.map((finding) => finding.id),
    findings,
    blockedReason: null,
  }
}

/** Recommendations are proposals; approval/execution belongs to the creator workflow. */
export const buildAnalyticsRecommendationAction = (input: {
  id: string
  creatorGoal: string
  action: string
  channelId: string
  projectId?: string | null
  finding: DeterministicAnalyticsInsight
  expectedDirection?: "increase" | "decrease" | "observe"
  evaluationWindow: "7d" | "28d" | "90d" | "365d"
}): AnalyticsRecommendationAction | null => {
  if (!input.id.trim() || !input.creatorGoal.trim() || !input.action.trim()) return null
  if (input.finding.channelId !== input.channelId || !validFinding(input.finding)) return null
  const period = input.finding.period
  return {
    schemaVersion: 1,
    id: input.id,
    status: "proposed",
    creatorGoal: input.creatorGoal.trim(),
    action: input.action.trim(),
    channelId: input.channelId,
    projectId: input.projectId || null,
    findingIds: [input.finding.id],
    evidenceRefs: uniqueSorted(input.finding.evidenceRefs),
    metric: input.finding.metric,
    baselineValue: input.finding.baselineValue,
    expectedDirection: input.expectedDirection || "observe",
    evaluationWindow: input.evaluationWindow,
    baselineSnapshotIds: uniqueSorted(input.finding.sourceSnapshotIds),
    causalClaim: null,
  }
}

const stableId = (prefix: string, value: string): string => {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return `${prefix}-${(hash >>> 0).toString(16).padStart(8, "0")}`
}

/** Strict outcome comparison: never coerce missing values to zero or imply causality. */
export const evaluateAnalyticsOutcome = (input: {
  recommendation: AnalyticsRecommendationAction
  baseline: OutcomeMeasurement
  followUp: OutcomeMeasurement
}): OutcomeEvaluation => {
  const { recommendation, baseline, followUp } = input
  const limitations: string[] = []
  let blockedReason: string | null = null
  if (baseline.channelId !== recommendation.channelId || followUp.channelId !== recommendation.channelId) {
    blockedReason = "Baseline, follow-up, and recommendation must share the same channel."
  } else if (baseline.metric !== recommendation.metric || followUp.metric !== recommendation.metric) {
    blockedReason = "Baseline and follow-up metric must match the recommendation validation metric."
  } else if (baseline.window !== recommendation.evaluationWindow || followUp.window !== recommendation.evaluationWindow) {
    blockedReason = "Baseline and follow-up must use the recommendation's declared canonical window."
  } else if (baseline.snapshotId === followUp.snapshotId) {
    blockedReason = "Baseline and follow-up must use distinct analytics snapshots."
  } else if (!validNumber(baseline.value) || !validNumber(followUp.value)) {
    blockedReason = "Baseline and follow-up values must be finite numeric observations."
  } else if (!validTimestamp(baseline.observedAt) || !validTimestamp(followUp.observedAt) || Date.parse(followUp.observedAt) <= Date.parse(baseline.observedAt)) {
    blockedReason = "Follow-up observation must have a valid timestamp later than baseline."
  }
  if (blockedReason) limitations.push("No outcome conclusion is available until comparability requirements pass.")
  limitations.push("Before/after association does not establish that the action caused the change.")
  const valid = blockedReason === null
  const absoluteChange = valid ? followUp.value - baseline.value : null
  const percentChange = valid && baseline.value !== 0
    ? ((followUp.value - baseline.value) / Math.abs(baseline.value)) * 100
    : null
  if (valid && baseline.value === 0) limitations.push("Relative percentage change is undefined because the baseline is zero.")
  const evidenceRefs = uniqueSorted([
    ...recommendation.evidenceRefs,
    `analytics:${baseline.snapshotId}:${baseline.metric}`,
    `analytics:${followUp.snapshotId}:${followUp.metric}`,
  ])
  const identity = `${recommendation.id}|${baseline.snapshotId}|${followUp.snapshotId}|${baseline.metric}`
  return {
    schemaVersion: 1,
    id: stableId("outcome", identity),
    status: valid ? "evaluated" : "blocked",
    channelId: recommendation.channelId,
    metric: recommendation.metric,
    window: recommendation.evaluationWindow,
    baselineValue: valid ? baseline.value : null,
    followUpValue: valid ? followUp.value : null,
    absoluteChange,
    percentChange,
    baselineSnapshotId: valid ? baseline.snapshotId : null,
    followUpSnapshotId: valid ? followUp.snapshotId : null,
    evidenceRefs,
    interpretation: "descriptive-association-only",
    causalConclusion: null,
    limitations: uniqueSorted(limitations),
    blockedReason,
  }
}

/** Candidate generation requires repeated, consistent observations and always remains review-only. */
export const buildLearningCandidateReview = (input: {
  id: string
  recommendation: AnalyticsRecommendationAction
  evaluations: OutcomeEvaluation[]
  minimumEvaluations?: number
}): LearningCandidateReview | null => {
  const minimum = Math.max(3, Math.floor(input.minimumEvaluations ?? 3))
  const valid = input.evaluations.filter((evaluation) =>
    evaluation.status === "evaluated"
    && evaluation.channelId === input.recommendation.channelId
    && evaluation.metric === input.recommendation.metric
    && evaluation.window === input.recommendation.evaluationWindow
    && evaluation.causalConclusion === null
    && evaluation.evidenceRefs.length > 0
  )
  if (valid.length < minimum || !input.id.trim()) return null
  const directions = new Set(valid.map((evaluation) =>
    (evaluation.absoluteChange ?? 0) > 0 ? "increase" : (evaluation.absoluteChange ?? 0) < 0 ? "decrease" : "mixed"
  ))
  const observedDirection = directions.size === 1 ? [...directions][0] : "mixed"
  return {
    schemaVersion: 1,
    id: input.id,
    status: "review-required",
    channelId: input.recommendation.channelId,
    recommendationId: input.recommendation.id,
    metric: input.recommendation.metric,
    evaluationIds: uniqueSorted(valid.map((evaluation) => evaluation.id)),
    evidenceRefs: uniqueSorted(valid.flatMap((evaluation) => evaluation.evidenceRefs)),
    observedDirection,
    promotionAllowed: false,
    causalConclusion: null,
    requiredReviews: [
      "Creator approval",
      "Confounder and scope review",
      "Evidence-quality and comparability review",
      "Governance threshold review before any promotion",
    ],
  }
}
