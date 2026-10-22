import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import type { AIBrainEvidencePack } from "../../../types"
import type { EvidenceRecord } from "../../../services/brain/EvidenceRecord"
import { BrainTurnEvidenceRibbon } from "../BrainTurnEvidenceRibbon"

const pack = {
 items: [],
 missingInputs: [],
 capturedAt: "2026-10-22T00:00:00.000Z",
 dataStatus: "partial",
 intent: "analytics",
 evidenceIds: [],
 availableMetrics: [],
} as unknown as AIBrainEvidencePack

const record: EvidenceRecord = {
 id: "analytics:snapshot-1:channel_summary:views",
 owner: "analytics-canon",
 sourceRef: "channel_summary",
 sourceSnapshotId: "snapshot-1",
 channelId: "channel-1",
 metric: "views",
 value: 2800,
 unit: "count",
 freshness: "stale",
 epistemicState: "OBSERVED",
 observedAt: null,
 updatedAt: "2026-10-01T00:00:00.000Z",
 availability: "available",
 provenance: { evidenceIds: ["source-evidence-1"], sourceRoute: "/analytics" },
}
const missingRecord: EvidenceRecord = {
 ...record,
 id: "analytics:snapshot-1:channel_summary:impressions:missing",
 metric: "impressions",
 value: null,
 freshness: "unknown",
 epistemicState: "MISSING",
 availability: "unavailable",
 missingness: ["impressions"],
 provenance: { evidenceIds: ["source-missing-1"] },
}

const render = (evidenceRecords?: EvidenceRecord[]) => renderToStaticMarkup(
 <MemoryRouter>
  <BrainTurnEvidenceRibbon turnId="turn-1" evidencePack={pack} evidenceRecords={evidenceRecords} />
 </MemoryRouter>,
)

describe("BrainTurnEvidenceRibbon", () => {
 it("shows the exact typed evidence records captured for the model turn", () => {
  const html = render([record, missingRecord])

  expect(html).toContain('data-vt-evidence-record-id="analytics:snapshot-1:channel_summary:views"')
  expect(html).toContain("2,800 count")
  expect(html).toContain("stale")
  expect(html).toContain("OBSERVED")
  expect(html).toContain("source-evidence-1")
  expect(html).toContain("analytics:snapshot-1:channel_summary:impressions:missing")
  expect(html).toContain("Unknown / missing")
  expect(html).toContain("MISSING")
  expect(html).toContain("No zero value is inferred")
  expect(html).toContain('href="/analytics"')
 })

 it("does not imply typed provenance exists for legacy turns without persisted records", () => {
  const html = render(undefined)

  expect(html).toContain("Record-level provenance is unavailable for this saved turn")
 })
})
