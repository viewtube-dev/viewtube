import { describe, expect, it, vi } from "vitest"
import { submitBrainContextCorrection } from "../BrainContextCorrection"

const claim = {
 id: "claim-1",
 channelId: "channel-1",
 scope: "creator",
 category: "preference",
 value: "Old preference",
 status: "active",
 evidence: ["source-evidence-1"],
 confidence: "high",
 source: "journal",
 createdAt: "2026-10-01T00:00:00.000Z",
 updatedAt: "2026-10-01T00:00:00.000Z",
 validFrom: "2026-10-01T00:00:00.000Z",
 validTo: null,
 confirmationState: "explicit",
 learningEntryIds: ["learning-1"],
} as any

describe("submitBrainContextCorrection", () => {
 it("routes a correction to an active canonical memory claim through explicit teaching and verifies the resulting claim", async () => {
  const teachExplicitly = vi.fn(async () => ({
   entry: { id: "learning-2" },
   promotion: { allowed: true, entryId: "learning-2", blockedBy: [], confidence: "high", reason: "creator confirmed" },
  }))
  const correctedClaim = { ...claim, id: "claim-2", value: "New preference", supersedesClaimId: "claim-1" }
  const result = await submitBrainContextCorrection({
   channelId: "channel-1",
   source: "brain_memory_claim",
   sourceId: "claim-1",
   currentStatement: "Old preference",
   correctedStatement: "New preference",
   evidenceRefs: ["evidence-2"],
  }, {
   getClaim: vi.fn(async () => claim),
   listActiveClaims: vi.fn(async () => [correctedClaim]),
   teachExplicitly,
   captureProposal: vi.fn(),
  })

  expect(teachExplicitly).toHaveBeenCalledWith(expect.objectContaining({
   channelId: "channel-1",
   summary: "New preference",
   detail: "New preference",
   category: "preference",
   evidence: expect.arrayContaining(["claim-1", "evidence-2"]),
  }))
  expect(result).toMatchObject({ status: "applied", claimId: "claim-2", supersededClaimId: "claim-1" })
 })

 it("records a governed proposal instead of mutating a model hypothesis without an owner-specific update contract", async () => {
  const captureProposal = vi.fn(async () => ({ id: "proposal-1", metadata: { confirmed: false } }))
  const teachExplicitly = vi.fn()
  const result = await submitBrainContextCorrection({
   channelId: "channel-1",
   source: "channel_knowledge_model",
   sourceId: "hypothesis-4",
   currentStatement: "The audience prefers short videos",
   correctedStatement: "The audience prefers detailed long-form explainers",
   evidenceRefs: ["analytics-1"],
  }, {
   getClaim: vi.fn(),
   listActiveClaims: vi.fn(),
   teachExplicitly,
   captureProposal,
  })

  expect(captureProposal).toHaveBeenCalledWith(expect.objectContaining({
   channelId: "channel-1",
   category: "correction",
   metadata: expect.objectContaining({
    confirmed: false,
    sourceId: "hypothesis-4",
    proposedReplacement: "The audience prefers detailed long-form explainers",
   }),
  }))
  expect(teachExplicitly).not.toHaveBeenCalled()
  expect(result).toMatchObject({ status: "proposal_recorded", entryId: "proposal-1" })
 })

 it("rejects a claim from another channel before invoking governance", async () => {
  const teachExplicitly = vi.fn()
  await expect(submitBrainContextCorrection({
   channelId: "channel-2",
   source: "brain_memory_claim",
   sourceId: "claim-1",
   currentStatement: "Old preference",
   correctedStatement: "New preference",
  }, {
   getClaim: vi.fn(async () => claim),
   listActiveClaims: vi.fn(),
   teachExplicitly,
   captureProposal: vi.fn(),
  })).rejects.toThrow(/does not belong to the active channel/i)
  expect(teachExplicitly).not.toHaveBeenCalled()
 })

 it("rejects an empty correction", async () => {
  await expect(submitBrainContextCorrection({
   channelId: "channel-1",
   source: "brain_memory_claim",
   sourceId: "claim-1",
   currentStatement: "Old preference",
   correctedStatement: "   ",
  }, {
   getClaim: vi.fn(async () => claim),
   listActiveClaims: vi.fn(),
   teachExplicitly: vi.fn(),
   captureProposal: vi.fn(),
  })).rejects.toThrow(/enter a correction/i)
 })
})
