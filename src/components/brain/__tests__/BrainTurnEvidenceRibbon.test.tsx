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

const render = (evidenceRecords?: EvidenceRecord[], evidencePack: AIBrainEvidencePack = pack) => renderToStaticMarkup(
 <MemoryRouter>
  <BrainTurnEvidenceRibbon turnId="turn-1" evidencePack={evidencePack} evidenceRecords={evidenceRecords} />
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


describe("BrainTurnEvidenceRibbon selection request", () => {
 it("renders stored count, format, date, ranking, text-filter, and cohort constraints", () => {
  const requestPack = {
   ...pack,
   requestSpec: {
    count: 10,
    formats: ["long", "live"],
    since: "2025-10-22",
    until: "2026-10-22",
    rankBy: "views",
    filters: ["tutorial", "beginner"],
    selectionMode: "top",
   },
  } as unknown as AIBrainEvidencePack
  const html = render([], requestPack)

  expect(html).toContain('data-vt-brain-part="evidence-request-constraints"')
  expect(html).toContain("Selection request")
  expect(html).toContain("10 items")
  expect(html).toContain("Long-form, Live")
  expect(html).toContain("2025-10-22 – 2026-10-22")
  expect(html).toContain("tutorial, beginner")
  expect(html).toContain("All selection constraints")
 })

 it("explains when a legacy saved turn did not retain request constraints", () => {
  const legacyPack = { ...pack, requestSpec: undefined } as unknown as AIBrainEvidencePack
  const html = render([], legacyPack)

  expect(html).toContain("Selection constraints were not recorded for this saved turn.")
  expect(html).toContain("cannot be reconstructed safely")
 })
})
