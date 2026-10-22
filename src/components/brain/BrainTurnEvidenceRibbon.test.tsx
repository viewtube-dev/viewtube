import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import type { AIBrainEvidencePack } from "../../types"
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
 it("shows distinct stale, missing, and conflicting evidence conditions", () => {
  const html = renderToStaticMarkup(
   <MemoryRouter>
    <BrainTurnEvidenceRibbon
     turnId="turn-conditions"
     evidencePack={pack({ dataStatus: "partial" })}
     evidenceIntegrityStatus="verified"
     evidenceRecords={[
      record({ id: "stale", freshness: "stale", epistemicState: "STALE" }),
      record({ id: "missing", freshness: "unknown", epistemicState: "MISSING", value: null, availability: "unavailable", missingness: ["retention"] }),
      record({ id: "conflict", epistemicState: "CONFLICTING", availability: "partial" }),
     ]}
    />
   </MemoryRouter>,
  )
  expect(html).toContain("Evidence conditions")
  expect(html).toContain("Partial coverage")
  expect(html).toContain("1 stale")
  expect(html).toContain("1 missing")
  expect(html).toContain("1 conflicting")
  expect(html).toContain('aria-label="Evidence condition summary"')
 })

 it("explains a truly empty evidence pack separately from unavailable evidence", () => {
  const html = renderToStaticMarkup(
   <MemoryRouter>
    <BrainTurnEvidenceRibbon
     turnId="turn-no-selection"
     evidencePack={pack({ dataStatus: "ready", items: [], evidenceIds: [], missingInputs: [] })}
     evidenceIntegrityStatus="verified"
     evidenceRecords={[]}
    />
   </MemoryRouter>,
  )
  expect(html).toContain("No evidence items were selected for this turn")
  expect(html).not.toContain("Missing evidence")
 })

 it("keeps legacy record absence separate from a recorded empty evidence set", () => {
  const html = renderToStaticMarkup(
   <MemoryRouter>
    <BrainTurnEvidenceRibbon
     turnId="turn-legacy-empty"
     evidencePack={pack({ items: [], evidenceIds: [] })}
     evidenceIntegrityStatus="unavailable"
     evidenceRecords={undefined}
    />
   </MemoryRouter>,
  )
  expect(html).toContain("Prompt evidence identity unavailable")
  expect(html).toContain("Record-level provenance is unavailable")
 })

})


const record = (overrides: Partial<import("../../services/brain/EvidenceRecord").EvidenceRecord> = {}) => ({
 id: "analytics:snapshot-1:channel_summary:views",
 owner: "analytics-canon" as const,
 sourceRef: "channel_summary",
 sourceSnapshotId: "snapshot-1",
 metric: "views",
 value: 2800,
 freshness: "fresh" as const,
 epistemicState: "OBSERVED" as const,
 availability: "available" as const,
 provenance: { evidenceIds: ["source-evidence-1"], sourceRoute: "/analytics" },
 ...overrides,
})

describe("BrainTurnEvidenceRibbon", () => {
 it("distinguishes prepared evidence from sources actually cited in the answer", () => {
  const html = renderToStaticMarkup(
   <MemoryRouter>
    <BrainTurnEvidenceRibbon turnId="turn-123" evidencePack={pack()} citedEvidenceIds={["video:abc"]} />
   </MemoryRouter>,
  )
  expect(html).toContain('data-vt-brain-turn-id="turn-123"')
  expect(html).toContain("Evidence snapshot")
  expect(html).toContain("1 prepared")
  expect(html).toContain("1 cited")
  expect(html).toContain("Recent retention data")
 })

 it("keeps missing timestamps and missing evidence distinct instead of inventing freshness", () => {
  const html = renderToStaticMarkup(
   <MemoryRouter>
    <BrainTurnEvidenceRibbon turnId="turn-empty" evidencePack={pack({ capturedAt: null, dataStatus: "missing", items: [], evidenceIds: [], missingInputs: ["Analytics connection"] })} />
   </MemoryRouter>,
  )
  expect(html).toContain("Capture time unavailable")
  expect(html).toContain("Missing evidence")
  expect(html).toContain("Analytics connection")
  expect(html).not.toContain("Fresh")
  expect(html).not.toContain("0 views")
 })
})
