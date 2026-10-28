import { describe, expect, it } from "vitest"
import { buildBrainEvidenceRecordQuality, fingerprintBrainEvidenceRecords } from "./BrainEvidenceQuality"
import type { EvidenceRecord } from "./EvidenceRecord"
import { getPromptEvidenceIntegrityStatus, readPromptEvidenceRecords, readCreatorAnswerEvidenceRecords } from "./PromptEvidenceIntegrity"

const record = (overrides: Partial<EvidenceRecord> = {}): EvidenceRecord => ({
 id: "evidence-1",
 owner: "analytics-canon",
 sourceRef: "analytics:videos:1",
 sourceSnapshotId: "snapshot-1",
 channelId: "channel-1",
 metric: "views",
 value: 120,
 freshness: "fresh",
 epistemicState: "OBSERVED",
 availability: "available",
 provenance: { evidenceIds: ["snapshot-1:videos:1"], sourceRoute: "/analytics" },
 ...overrides,
})

const metadataFor = (records: EvidenceRecord[], creatorRecords: EvidenceRecord[] = []) => ({
 promptEvidenceRecordIds: records.map((item) => item.id),
 evidenceRecords: records,
 evidenceRecordQuality: records.length
  ? buildBrainEvidenceRecordQuality(records, { expectedChannelId: "channel-1" })
  : null,
 creatorAnswerEvidenceRecords: creatorRecords,
 creatorAnswerEvidenceRecordIds: creatorRecords.map((item) => item.id),
 creatorAnswerEvidenceFingerprint: fingerprintBrainEvidenceRecords(creatorRecords),
})

describe("PromptEvidenceIntegrity", () => {
 it("verifies the exact ordered prompt records when IDs and fingerprint agree", () => {
  const records = [record()]
  const metadata = metadataFor(records)

  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("verified")
  expect(readPromptEvidenceRecords(metadata)).toEqual(records)
  expect(readCreatorAnswerEvidenceRecords(metadata)).toEqual(metadata.creatorAnswerEvidenceRecords as EvidenceRecord[])
 })

 it("rejects changed record content even when the record ID is unchanged", () => {
  const original = record()
  const metadata = metadataFor([original])
  metadata.evidenceRecords[0] = { ...original, value: 999 }

  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("mismatch")
  expect(readPromptEvidenceRecords(metadata)).toBeUndefined()
 })

 it("rejects changed creator-answer evidence even when analytics evidence remains valid", () => {
  const creatorEvidence = record({
   id: "creator-answer:channel-1:audience",
   owner: "creator-confirmed",
   sourceRef: "creator-profile:audience",
   value: "new creators",
  })
  const metadata = metadataFor([record()], [creatorEvidence])
  metadata.creatorAnswerEvidenceRecords[0] = { ...creatorEvidence, value: "changed audience" }

  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("mismatch")
  expect(readPromptEvidenceRecords(metadata)).toBeUndefined()
  expect(readCreatorAnswerEvidenceRecords(metadata)).toBeUndefined()
 })

 it("accepts historical empty creator-answer evidence without a fingerprint", () => {
  const metadata = metadataFor([record()])
  metadata.creatorAnswerEvidenceFingerprint = undefined as unknown as string

  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("verified")
 })

 it("rejects a missing creator-answer evidence manifest when creator records are present", () => {
  const metadata = metadataFor([record()], [record({ id: "creator-answer:channel-1:goal" })])
  metadata.creatorAnswerEvidenceFingerprint = undefined as unknown as string

  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("mismatch")
 })

 it("requires the quality fingerprint to match only the records persisted as prompt-rendered", () => {
  const first = record()
  const second = record({ id: "evidence-2", sourceRef: "analytics:videos:2", value: 240 })
  const metadata = metadataFor([first, second])

  // The broker may omit records that do not survive context selection. Saving
  // the original quality report beside only the rendered subset is not valid.
  metadata.evidenceRecords = [first]
  metadata.promptEvidenceRecordIds = [first.id]
  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("mismatch")

  metadata.evidenceRecordQuality = buildBrainEvidenceRecordQuality([first], { expectedChannelId: "channel-1" })
  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("verified")
 })
 
 it("rejects record IDs that differ from the recorded prompt manifest", () => {
  const metadata = metadataFor([record()])
  metadata.promptEvidenceRecordIds = ["another-evidence-id"]

  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("mismatch")
 })

 it("treats an explicitly recorded empty evidence selection as verified", () => {
  expect(getPromptEvidenceIntegrityStatus(metadataFor([]))).toBe("verified")
  expect(readPromptEvidenceRecords(metadataFor([]))).toEqual([])
 })

 it("keeps legacy turns without an evidence manifest unavailable", () => {
  expect(getPromptEvidenceIntegrityStatus({ evidenceRecords: [record()] })).toBe("unavailable")
  expect(readPromptEvidenceRecords({ evidenceRecords: [record()] })).toBeUndefined()
 })

 it("rejects non-empty evidence records without a quality fingerprint", () => {
  const metadata = metadataFor([record()])
  metadata.evidenceRecordQuality = null

  expect(getPromptEvidenceIntegrityStatus(metadata)).toBe("mismatch")
 })
})
