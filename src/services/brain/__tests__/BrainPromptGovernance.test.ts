import { describe, expect, it } from "vitest"
import {
 BRAIN_PROMPT_FAMILIES,
 buildBrainPromptRunReceipt,
 promptFamilyForAsset,
 validateBrainPromptRunReceipt,
} from "../BrainPromptGovernance"

describe("Brain prompt governance", () => {
 it("registers stable prompt families with required and forbidden context", () => {
  expect(BRAIN_PROMPT_FAMILIES.analytics.requiredContext).toContain("canonical_evidence")
  expect(BRAIN_PROMPT_FAMILIES.analytics.forbiddenContext).toContain("cross_channel_evidence")
  expect(promptFamilyForAsset("community_post")).toBe("community")
  expect(promptFamilyForAsset("title")).toBe("packaging")
 })

 it("builds reproducible receipts with de-duplicated evidence and creator constraints", () => {
  const receipt = buildBrainPromptRunReceipt({
   traceId: "trace-1", outputId: "asset-1", channelId: "channel-1", projectId: null,
   promptFamily: "community", promptVersion: "community-post-v1",
   constitutionVersion: "asset-constitution-v1", contextResolverVersion: "brain-context-resolution-v1",
   outputSchemaVersion: "community-post-plan-v1", requestedModel: null, servedModel: "gemini-test",
   evidenceSnapshotIds: ["snapshot-1", "snapshot-1", ""], evidenceRefs: ["dataset:top_videos:snap-1", "dataset:top_videos:snap-1"], channelKnowledgeFingerprint: null,
   projectRevision: null, styleProfileVersion: null, creatorConstraints: ["no spoilers", "no spoilers"],
   repairCount: 1, generatedAt: "2026-10-15T00:00:00.000Z",
  })
  expect(receipt.evidenceSnapshotIds).toEqual(["snapshot-1"])
  expect(receipt.evidenceRefs).toEqual(["dataset:top_videos:snap-1"])
  expect(receipt.creatorConstraints).toEqual(["no spoilers"])
  expect(validateBrainPromptRunReceipt(receipt)).toEqual([])
 })

 it("reports missing provenance rather than silently accepting an incomplete receipt", () => {
  const receipt = buildBrainPromptRunReceipt({
   traceId: "", outputId: "", channelId: "", projectId: null,
   promptFamily: "community", promptVersion: "", constitutionVersion: "",
   contextResolverVersion: "", outputSchemaVersion: "", requestedModel: null, servedModel: null,
   evidenceSnapshotIds: [], evidenceRefs: [], channelKnowledgeFingerprint: null, projectRevision: null,
   styleProfileVersion: null, creatorConstraints: [], repairCount: -1, generatedAt: "not-a-date",
  })
  expect(validateBrainPromptRunReceipt(receipt)).toEqual(expect.arrayContaining([
   "traceId is required", "outputId is required", "channelId is required",
   "promptVersion is required", "outputSchemaVersion is required", "repairCount must be a non-negative integer",
   "generatedAt must be a valid timestamp",
  ]))
 })
})
