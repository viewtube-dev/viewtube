// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { deriveAlgorithmLearningCandidates } from "./AlgorithmLearningCandidates"
import { recordAlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"

const STORAGE_KEY = "vt_algorithm_intelligence_events_v1"

const recordOutcome = (id: string, status: "positive" | "negative" | "neutral" | "mixed", recommendationId = "recommendation:shared") =>
 recordAlgorithmIntelligenceEvent({
  id,
  channelId: "channel-learning-threshold",
  kind: "OUTCOME_MEASURED",
  sourceSystem: "workflow",
  sourceId: "same-recommendation",
  recommendationId,
  title: "Measured recommendation outcome",
  summary: "Test outcome",
  confidence: "medium",
  evidenceIds: [`evidence-${id}`],
  metadata: { evaluation: { status } },
 })

describe("AlgorithmLearningCandidates evidence threshold", () => {
 beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY)
 })

 it("does not let neutral or mixed outcomes satisfy the decisive sample minimum", () => {
  recordOutcome("positive-1", "positive")
  recordOutcome("positive-2", "positive")
  recordOutcome("neutral-1", "neutral")
  recordOutcome("mixed-1", "mixed")

  const [candidate] = deriveAlgorithmLearningCandidates("channel-learning-threshold")

  expect(candidate).toMatchObject({
   sampleSize: 2,
   positiveRate: 1,
   status: "insufficient_evidence",
   confidence: "low",
  })
 })

 it("allows a candidate only after at least three decisive outcomes meet the positive-rate threshold", () => {
  recordOutcome("positive-1", "positive")
  recordOutcome("positive-2", "positive")
  recordOutcome("positive-3", "positive")
  recordOutcome("negative-1", "negative")

  const [candidate] = deriveAlgorithmLearningCandidates("channel-learning-threshold")

  expect(candidate).toMatchObject({
   sampleSize: 4,
   positiveRate: 3 / 4,
   status: "candidate",
   confidence: "medium",
  })
 })

 it("keeps recommendations with shared suffixes in separate evidence cohorts", () => {
  recordOutcome("alpha-1", "positive", "recommendation:alpha:shared")
  recordOutcome("alpha-2", "positive", "recommendation:alpha:shared")
  recordOutcome("beta-1", "positive", "recommendation:beta:shared")
  recordOutcome("beta-2", "positive", "recommendation:beta:shared")

  const candidates = deriveAlgorithmLearningCandidates("channel-learning-threshold")

  expect(candidates).toHaveLength(2)
  expect(candidates.map((candidate) => candidate.status)).toEqual([
   "insufficient_evidence",
   "insufficient_evidence",
  ])
  expect(candidates.map((candidate) => candidate.sampleSize)).toEqual([2, 2])
 })
})
