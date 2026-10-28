import { describe, expect, it } from "vitest"
import {
  formatEvidenceRecordForPrompt,
  getEvidenceRecordsActuallyRendered,
  type EvidenceRecord,
} from "./EvidenceRecord"

const record = (overrides: Partial<EvidenceRecord> = {}): EvidenceRecord => ({
  id: "evidence-video-123",
  owner: "analytics-canon",
  sourceRef: "video:abc123",
  sourceSnapshotId: "snapshot-1",
  channelId: "channel-1",
  metric: "views",
  value: 4200,
  unit: null,
  freshness: "fresh",
  epistemicState: "OBSERVED",
  provenance: { evidenceIds: ["source-video-abc123"] },
  ...overrides,
})

describe("getEvidenceRecordsActuallyRendered", () => {
  it("returns only records whose complete prompt representation is present", () => {
    const included = record()
    const clipped = record({ id: "evidence-video-clipped" })
    const systemInstruction = [
      "CHANNEL EVIDENCE",
      formatEvidenceRecordForPrompt(included),
      formatEvidenceRecordForPrompt(clipped).slice(0, 45),
    ].join("\n")

    expect(getEvidenceRecordsActuallyRendered(systemInstruction, [included, clipped])).toEqual([included])
  })

  it("does not treat an evidence ID mentioned elsewhere as proof the record was rendered", () => {
    const evidence = record()
    const systemInstruction = [
      "Prior conversation mentioned evidence-video-123 as a reference.",
      "CHANNEL EVIDENCE",
      "Evidence record was omitted to fit the context budget.",
    ].join("\n")

    expect(getEvidenceRecordsActuallyRendered(systemInstruction, [evidence])).toEqual([])
  })

  it("preserves source order and returns an empty list when no evidence was supplied", () => {
    const first = record({ id: "first" })
    const second = record({ id: "second" })
    const systemInstruction = [
      formatEvidenceRecordForPrompt(first),
      "some other section",
      formatEvidenceRecordForPrompt(second),
    ].join("\n")

    expect(getEvidenceRecordsActuallyRendered(systemInstruction, [first, second])).toEqual([first, second])
    expect(getEvidenceRecordsActuallyRendered(systemInstruction, [])).toEqual([])
  })
})
