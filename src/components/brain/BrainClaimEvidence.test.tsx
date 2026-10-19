import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import type { AIBrainEvidencePack } from "../../types"
import { BrainClaimEvidence } from "./BrainClaimEvidence"

const evidencePack = {
  topVideos: [],
  recentVideos: [],
  searchTerms: [],
  trafficSources: [],
  items: [],
  requestSpec: { count: null, formats: [], since: null, until: null, rankBy: "performance", filters: [], selectionMode: "top" },
  availableMetrics: [],
  transcriptRouteRequired: false,
  promptVersion: "brain-chat-v2",
  intent: "channel_strategy",
  channelId: null,
  channelName: null,
  channelDescription: null,
  missingInputs: ["Recent retention data"],
  dataStatus: "partial",
  capturedAt: null,
  evidenceIds: [],
} as unknown as AIBrainEvidencePack

describe("BrainClaimEvidence", () => {
  it("keeps the evidence explanation available without inventing a confidence value", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <BrainClaimEvidence evidencePack={evidencePack} />
      </MemoryRouter>,
    )
    expect(markup).toContain("Why this recommendation")
    expect(markup).toContain("Recent retention data")
    expect(markup).not.toContain("Strong evidence")
  })

  it("uses the shared confidence primitive when confidence is supplied", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <BrainClaimEvidence evidencePack={evidencePack} confidence="medium" />
      </MemoryRouter>,
    )
    expect(markup).toContain("Partial evidence")
    expect(markup).toContain('data-vt-brain-confidence="medium"')
  })
})
