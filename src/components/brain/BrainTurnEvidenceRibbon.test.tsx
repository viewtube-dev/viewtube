import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import type { AIBrainEvidencePack, BrainClaimEvidenceLink } from "../../types"
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

describe("BrainTurnEvidenceRibbon", () => {
 it("links each verified prompt record by canonical ID and preserves the requested analytics scope", () => {
  const html = render({
   evidencePack: pack({
    channelId: "channel-9",
    requestSpec: {
     count: 10,
     formats: ["long"],
     since: "2026-01-01",
     until: "2026-10-01",
     rankBy: "views",
     filters: ["title:analysis"],
     selectionMode: "top",
    },
   }),
   evidenceIntegrityStatus: "verified",
   evidenceRecords: [record({
    id: "analytics:snapshot-1:video-abc:views",
    sourceRef: "video-abc",
    channelId: "channel-9",
    freshness: "stale",
    epistemicState: "STALE",
    availability: "partial",
    coverage: 0.6,
    window: { kind: "28d" },
   })],
  })

  expect(html).toContain('data-vt-evidence-record-id="analytics:snapshot-1:video-abc:views"')
  expect(html).toContain("Partial coverage")
  expect(html).toContain("60% coverage")
  expect(html).toContain("Stale")
  expect(html).toContain("Open Analytics with evidence context")
  expect(html).toContain("brainEvidenceId=analytics%3Asnapshot-1%3Avideo-abc%3Aviews")
  expect(html).toContain("brainEvidenceSource=analytics-canon")
  expect(html).toContain("snapshotId=snapshot-1")
  expect(html).toContain("sourceRef=video-abc")
  expect(html).toContain("metric=views")
  expect(html).toContain("window=28d")
  expect(html).toContain("channelId=channel-9")
  expect(html).toContain("count=10")
  expect(html).toContain("since=2026-01-01")
  expect(html).toContain("until=2026-10-01")
  expect(html).toContain("format=long")
  expect(html).toContain("rankBy=views")
  expect(html).toContain("selectionMode=top")
  expect(html).toContain("filter=title%3Aanalysis")
 })

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
 claimEvidence?: BrainClaimEvidenceLink[]
 evidenceIntegrityStatus?: "verified" | "unavailable" | "mismatch"
 citedEvidenceIds?: string[]
} = {}) => renderToStaticMarkup(
 <MemoryRouter>
  <BrainTurnEvidenceRibbon
   turnId="turn-test"
   evidencePack={options.evidencePack || pack()}
   evidenceRecords={options.evidenceRecords}
   claimEvidence={options.claimEvidence}
   evidenceIntegrityStatus={options.evidenceIntegrityStatus}
   citedEvidenceIds={options.citedEvidenceIds}
  />
 </MemoryRouter>,
)

describe("BrainTurnEvidenceRibbon", () => {
 it("renders evidence state and quality chips with the canonical Studio badge primitive", () => {
  const html = render({
   evidencePack: pack({ dataStatus: "partial" }),
   evidenceIntegrityStatus: "verified",
   evidenceRecords: [
    record({ id: "stale", freshness: "stale", epistemicState: "STALE" }),
    record({ id: "missing", freshness: "unknown", epistemicState: "MISSING", value: null, availability: "unavailable" }),
   ],
   citedEvidenceIds: ["video:abc", "video:not-in-pack"],
  })

  expect(html).toContain('data-vt-studio-split-badge="left"')
  expect(html).toContain('data-vt-library-component="StudioSplitLeftBadge"')
  expect(html).not.toContain('style="background-color:')
  expect(html).not.toContain('class="border border-black bg-[#FFDA47] px-1.5 py-1 text-[9px] font-[1000] uppercase"')
 })

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

 it("shows claim-to-record mappings only for verified prompt evidence", () => {
  const linkedClaim = "Views increased to 12,400 after the title change."
  const html = render({
   evidenceIntegrityStatus: "verified",
   evidenceRecords: [record({ id: "record-views", metric: "views", value: 12400 })],
   claimEvidence: [{ claim: linkedClaim, evidenceIds: ["record-views"], verification: "direct_value_match" }],
  })
  expect(html).toContain("Claim text with matching recorded value")
  expect(html).toContain(linkedClaim)
 })

 it("withholds claim mappings when the saved prompt evidence identity is mismatched", () => {
  const html = render({
   evidenceIntegrityStatus: "mismatch",
   evidenceRecords: [record({ id: "record-views" })],
   claimEvidence: [{ claim: "Unverified claim text", evidenceIds: ["record-views"], verification: "direct_value_match" }],
  })
  expect(html).not.toContain("Claim text with matching recorded value")
  expect(html).not.toContain("Unverified claim text")
 })

 it("resolves typed evidence-record citations when the saved manifest is verified", () => {
  const html = render({
   evidencePack: pack({ items: [{ id: "different-pack-id", source: "analytics", label: "Prepared item" } as AIBrainEvidencePack["items"][number]] }),
   evidenceIntegrityStatus: "verified",
   evidenceRecords: [record({ id: "typed-record-id" })],
   citedEvidenceIds: ["typed-record-id"],
  })
  expect(html).toContain("1 cited")
  expect(html).not.toContain("unresolved citation")
 })

 it("does not resolve typed evidence-record citations when the saved manifest mismatches", () => {
  const html = render({
   evidencePack: pack({ items: [{ id: "different-pack-id", source: "analytics", label: "Prepared item" } as AIBrainEvidencePack["items"][number]] }),
   evidenceIntegrityStatus: "mismatch",
   evidenceRecords: undefined,
   citedEvidenceIds: ["typed-record-id"],
  })
  expect(html).toContain("1 unresolved citation")
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
