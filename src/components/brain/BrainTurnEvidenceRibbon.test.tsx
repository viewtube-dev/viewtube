import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import type { AIBrainEvidencePack } from "../../types"
import type { EvidenceRecord } from "../../services/brain/EvidenceRecord"
import { BrainTurnEvidenceRibbon } from "./BrainTurnEvidenceRibbon"

const pack = (overrides: Partial<AIBrainEvidencePack> = {}): AIBrainEvidencePack => ({
 promptVersion: "brain-chat-v2",
 requestSpec: { count: null, formats: [], since: null, until: null, rankBy: "performance", filters: [], selectionMode: "top" },
 intent: "strategy",
 channelId: null,
 channelName: null,
 channelDescription: null,
 capturedAt: "2026-10-19T12:00:00.000Z",
 dataStatus: "partial",
 topVideos: [],
 recentVideos: [],
 searchTerms: [],
 trafficSources: [],
 items: [{ id: "video:abc", source: "analytics", label: "Video ABC", detail: "Views", capturedAt: null } as AIBrainEvidencePack["items"][number]],
 availableMetrics: ["views"],
 missingInputs: ["Recent retention data"],
 evidenceIds: ["video:abc"],
 transcriptRouteRequired: false,
 ...overrides,
})

const record = (overrides: Partial<EvidenceRecord> = {}): EvidenceRecord => ({
 id: "analytics:snapshot-1:channel_summary:views",
 owner: "analytics-canon",
 sourceRef: "channel_summary",
 sourceSnapshotId: "snapshot-1",
 metric: "views",
 value: 2800,
 freshness: "fresh",
 epistemicState: "OBSERVED",
 availability: "available",
 provenance: { evidenceIds: ["source-evidence-1"], sourceRoute: "/analytics" },
 ...overrides,
})

const render = (options: {
 evidencePack?: AIBrainEvidencePack
 evidenceRecords?: EvidenceRecord[]
 evidenceIntegrityStatus?: "verified" | "unavailable" | "mismatch"
 citedEvidenceIds?: string[]
} = {}) => renderToStaticMarkup(
 <MemoryRouter>
  <BrainTurnEvidenceRibbon
   turnId="turn-test"
   evidencePack={options.evidencePack || pack()}
   evidenceRecords={options.evidenceRecords}
   evidenceIntegrityStatus={options.evidenceIntegrityStatus}
   citedEvidenceIds={options.citedEvidenceIds}
  />
 </MemoryRouter>,
)

describe("BrainTurnEvidenceRibbon", () => {
 it("distinguishes prepared evidence from sources actually cited in the answer", () => {
  const html = render({ citedEvidenceIds: ["video:abc"] })
  expect(html).toContain('data-vt-brain-turn-id="turn-test"')
  expect(html).toContain("Evidence snapshot")
  expect(html).toContain("1 prepared")
  expect(html).toContain("1 cited")
  expect(html).toContain("Recent retention data")
 })

 it("keeps missing timestamps and missing evidence distinct instead of inventing freshness", () => {
  const html = render({ evidencePack: pack({ capturedAt: null, dataStatus: "missing", items: [], evidenceIds: [], missingInputs: ["Analytics connection"] }) })
  expect(html).toContain("Capture time unavailable")
  expect(html).toContain("Missing evidence")
  expect(html).toContain("Analytics connection")
  expect(html).not.toContain("Fresh")
  expect(html).not.toContain("0 views")
 })

 it("shows distinct stale, missing, and conflicting evidence conditions", () => {
  const html = render({
   evidencePack: pack({ dataStatus: "partial" }),
   evidenceIntegrityStatus: "verified",
   evidenceRecords: [
    record({ id: "stale", freshness: "stale", epistemicState: "STALE" }),
    record({ id: "missing", freshness: "unknown", epistemicState: "MISSING", value: null, availability: "unavailable", missingness: ["retention"] }),
    record({ id: "conflict", epistemicState: "CONFLICTING", availability: "partial" }),
   ],
  })
  expect(html).toContain("Evidence conditions")
  expect(html).toContain("Partial coverage")
  expect(html).toContain("1 stale")
  expect(html).toContain("1 missing")
  expect(html).toContain("1 conflicting")
  expect(html).toContain('aria-label="Evidence condition summary"')
 })

 it("explains a truly empty evidence pack separately from unavailable evidence", () => {
  const html = render({
   evidencePack: pack({ dataStatus: "ready", items: [], evidenceIds: [], missingInputs: [] }),
   evidenceIntegrityStatus: "verified",
   evidenceRecords: [],
  })
  expect(html).toContain("No evidence items were selected for this turn")
  expect(html).not.toContain("Missing evidence")
 })

 it("keeps legacy record absence separate from a recorded empty evidence set", () => {
  const html = render({
   evidencePack: pack({ items: [], evidenceIds: [] }),
   evidenceIntegrityStatus: "unavailable",
   evidenceRecords: undefined,
  })
  expect(html).toContain("Prompt evidence identity unavailable")
  expect(html).toContain("Record-level provenance is unavailable")
 })
 it("counts only citations that resolve to the prepared evidence list", () => {
  const html = render({
   evidencePack: pack(),
   evidenceIntegrityStatus: "verified",
   evidenceRecords: [record()],
   citedEvidenceIds: ["video:abc", "video:not-in-pack", "video:not-in-pack"],
  })
  expect(html).toContain("1 cited")
  expect(html).toContain("1 unresolved citation")
  expect(html).toContain("not counted as cited")
 })

})
