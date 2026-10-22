import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import type { AIBrainEvidencePack } from "../../types"
import { BrainEvidenceDrawer } from "./BrainEvidenceDrawer"

const evidencePack = (overrides: Partial<AIBrainEvidencePack> = {}): AIBrainEvidencePack => ({
 promptVersion: "brain-chat-v2",
 requestSpec: {
  count: 10,
  formats: ["long-form", "shorts"],
  since: "2026-01-01",
  until: "2026-10-01",
  rankBy: "views",
  filters: ["title:analysis", "language:en"],
  selectionMode: "top",
 },
 intent: "analysis",
 channelId: "channel-1",
 channelName: "Test channel",
 channelDescription: null,
 capturedAt: "2026-10-19T12:00:00.000Z",
 dataStatus: "partial",
 topVideos: [],
 recentVideos: [],
 searchTerms: [],
 trafficSources: [],
 items: [{
  id: "video:abc",
  source: "analytics",
  label: "Retention test",
  detail: "Views",
  capturedAt: null,
 } as AIBrainEvidencePack["items"][number]],
 availableMetrics: ["views"],
 missingInputs: ["Retention"],
 evidenceIds: ["video:abc"],
 transcriptRouteRequired: false,
 ...overrides,
 it("gives the full evidence disclosure a large, visible keyboard focus target", () => {
  const html = render()
  expect(html).toContain("min-h-11")
  expect(html).toContain("focus-visible:outline-2")
  expect(html).toContain("focus-visible:outline-offset-2")
 })

})

const render = (pack = evidencePack()) => renderToStaticMarkup(
 <MemoryRouter>
  <BrainEvidenceDrawer evidencePack={pack} summaryLabel="Inspect evidence" />
 </MemoryRouter>,
)

describe("BrainEvidenceDrawer", () => {
 it("preserves evidence selection constraints when navigating to the canonical analytics surface", () => {
  const html = render()
  expect(html).toContain('href="/analytics?')
  expect(html).toContain("brainEvidenceId=video%3Aabc")
  expect(html).toContain("brainEvidenceSource=analytics")
  expect(html).toContain("videoId=abc")
  expect(html).toContain("rankBy=views")
  expect(html).toContain("selectionMode=top")
  expect(html).toContain("count=10")
  expect(html).toContain("since=2026-01-01")
  expect(html).toContain("until=2026-10-01")
  expect(html).toContain("format=long-form")
  expect(html).toContain("format=shorts")
  expect(html).toContain("filter=title%3Aanalysis")
  expect(html).toContain("filter=language%3Aen")
 })

 it("does not present an empty filtered result as proof that no source data exists", () => {
  const html = render(evidencePack({ items: [], evidenceIds: [], missingInputs: [], dataStatus: "ready" }))
  expect(html).toContain("No evidence references were attached to this answer")
  expect(html).toContain("does not establish that evidence does not exist")
 })

 it("distinguishes missing-source data from a valid empty selection", () => {
  const html = render(evidencePack({ items: [], evidenceIds: [], missingInputs: ["Analytics connection"], dataStatus: "missing" }))
  expect(html).toContain("Evidence unavailable")
  expect(html).toContain("Connect or sync a data source")
 })
})
