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
