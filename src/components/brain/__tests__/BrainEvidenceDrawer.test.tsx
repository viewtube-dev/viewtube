// @vitest-environment jsdom

import React, { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import type { AIBrainEvidencePack } from "../../../types"
import { BrainEvidenceDrawer } from "../BrainEvidenceDrawer"

const emptyPack = (dataStatus: AIBrainEvidencePack["dataStatus"]): AIBrainEvidencePack => ({
 promptVersion: "brain-chat-v2",
 requestSpec: { count: null, since: null, until: null, formats: [], filters: [], rankBy: "views", selectionMode: "top" },
 intent: "strategy",
 channelId: null,
 channelName: null,
 channelDescription: null,
 capturedAt: null,
 dataStatus,
 topVideos: [],
 recentVideos: [],
 searchTerms: [],
 trafficSources: [],
 items: [],
 availableMetrics: [],
 missingInputs: [],
 evidenceIds: [],
 transcriptRouteRequired: false,
})

describe("BrainEvidenceDrawer empty state", () => {
 let container: HTMLDivElement
 let root: Root

 beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
 })

 afterEach(() => {
  act(() => root.unmount())
  container.remove()
 })

 it("explains when no evidence references were attached instead of hiding the evidence panel", async () => {
  await act(async () => {
   root.render(<BrainEvidenceDrawer evidencePack={emptyPack("ready")} />)
  })

  expect(container.textContent).toContain("No evidence references were attached to this answer.")
  expect(container.querySelector('[role="status"]')).not.toBeNull()
 })

 it("explains missing data without implying a search returned no results", async () => {
  await act(async () => {
   root.render(<BrainEvidenceDrawer evidencePack={emptyPack("missing")} />)
  })

  expect(container.textContent).toContain("No evidence was available for this answer.")
  expect(container.textContent).toContain("Connect or sync a data source, then ask again.")
 })
})
