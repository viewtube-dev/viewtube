/**
 * Tests for the Evidence-Connected Brain pure core (roadmap item 2).
 * Run: vitest run src/features/capabilities/evidence-connected-brain/evidenceLink.test.ts
 */
import { describe, expect, it } from "vitest"

import type { BrainTurnSourceData } from "../shared/capabilityAdapter"
import {
  buildEvidenceConnectedAnswer,
  deriveAnswerLimits,
  detectUnsupportedNumbers,
  linkAnswerToEvidence,
} from "./evidenceLink"
import type { SuppliedEvidenceRef } from "./evidenceLink"

const pack: SuppliedEvidenceRef[] = [
  {
    evidenceId: "ev_video_001",
    label: "How we hit 480K views",
    source: "evidence-pack",
    knownValues: ["480000", "480K", "12.5", "28"],
  },
  {
    evidenceId: "ev_stats_ctr",
    label: "CTR dataset",
    source: "evidence-pack",
    knownValues: ["4.2", "3.9"],
  },
]

const controls = {
  enabled: true,
  personalization: true,
  allowAnalytics: true,
  learnFromInteractions: true,
}

describe("detectUnsupportedNumbers", () => {
  it("flags figures the supplied evidence cannot account for", () => {
    const unsupported = detectUnsupportedNumbers(
      "Your last video did 480K views; I predict 999K next week.",
      pack,
    )
    expect(unsupported).toContain("999K")
  })

  it("accepts figures the evidence supports", () => {
    const unsupported = detectUnsupportedNumbers(
      "CTR was 4.2% over the last 28 days, consistent with 480K views.",
      pack,
    )
    expect(unsupported).toEqual([])
  })
})

describe("linkAnswerToEvidence", () => {
  it("preserves canonical IDs and drops non-canonical claims", () => {
    const result = linkAnswerToEvidence(["ev_video_001", "ev_fabricated"], pack)
    expect(result.linked.map((ref) => ref.evidenceId)).toEqual(["ev_video_001"])
    expect(result.droppedNonCanonicalIds).toEqual(["ev_fabricated"])
  })

  it("displays nothing when no pack was supplied (and says so upstream)", () => {
    const result = linkAnswerToEvidence(["ev_video_001"], [])
    expect(result.linked).toEqual([])
    expect(result.droppedNonCanonicalIds).toEqual(["ev_video_001"])
  })
})

describe("deriveAnswerLimits", () => {
  it("surfaces unsupported figures, dropped refs, and control restrictions", () => {
    const limits = deriveAnswerLimits({
      userText: "why did views spike?",
      suppliedPack: [],
      controls: { ...controls, allowAnalytics: false },
      unsupportedNumbers: ["999K"],
      droppedNonCanonicalIds: ["ev_fabricated"],
    })
    expect(limits.some((limit) => limit.includes("999K"))).toBe(true)
    expect(limits.some((limit) => limit.includes("ev_fabricated"))).toBe(true)
    expect(limits.some((limit) => limit.includes("disabled"))).toBe(true)
    expect(limits.some((limit) => limit.toLowerCase().includes("review-only"))).toBe(true)
  })
})

describe("buildEvidenceConnectedAnswer", () => {
  it("assembles answer + linked evidence + limits from one turn", () => {
    const turn: BrainTurnSourceData = {
      answerId: "ans_1",
      question: "why did views spike?",
      answerText: "Your last video did 480K views.",
      evidencePackId: "pack_1",
      evidence: [{ evidenceId: "ev_video_001", label: "How we hit 480K views", source: "evidence-pack" }],
      limits: [],
      unsupportedNumbers: [],
    }
    const answer = buildEvidenceConnectedAnswer(turn, pack, controls)
    expect(answer.linkedEvidence.map((ref) => ref.evidenceId)).toEqual(["ev_video_001"])
    expect(answer.unsupportedNumbers).toEqual([])
    expect(answer.limits.length).toBeGreaterThan(0)
  })
})
