import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { BrainLiveToolInbox } from "./BrainLiveToolInbox"
import { getPendingToolIntegrations } from "../../services/brainLiveToolIntegration"

vi.mock("../../services/brainLiveToolIntegration", () => ({
 getPendingToolIntegrations: vi.fn(),
 openToolIntegration: vi.fn(),
 acceptToolIntegration: vi.fn(),
 completeToolIntegration: vi.fn(),
 dismissToolIntegration: vi.fn(),
 extractToolPrefill: vi.fn(),
}))

describe("BrainLiveToolInbox Studio controls", () => {
 it("uses canonical Studio buttons for handoff actions and preserves evidence disclosure", () => {
  vi.mocked(getPendingToolIntegrations).mockReturnValue([{
   handoff: { id: "handoff-1" },
   packet: { sourceToolId: "brain", title: "Prepare thumbnail", summary: "A review-only handoff", evidence: ["evidence-1"], provenance: ["trace-1"] },
   destinationToolId: "thumbnail-studio",
   payloadKind: "thumbnail",
   state: "ready",
  } as any])
  const html = renderToStaticMarkup(<BrainLiveToolInbox destinationToolId="thumbnail-studio" channelId="channel-1" />)
  expect(html.match(/data-vt-studio-button="true"/g)?.length).toBe(3)
  expect(html).toContain("Load into tool")
  expect(html).toContain("Complete")
  expect(html).toContain("Dismiss")
  expect(html).toContain("Evidence + provenance")
  expect(html).toContain("evidence-1")
 })
})
