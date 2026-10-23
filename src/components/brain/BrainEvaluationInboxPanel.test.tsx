import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { BrainEvaluationInboxPanel } from "./BrainEvaluationInboxPanel"
import { buildBrainEvaluationInbox } from "../../services/brain/BrainEvaluationInbox"

vi.mock("../../services/brain/BrainEvaluationInbox", () => ({
 buildBrainEvaluationInbox: vi.fn(),
}))

describe("BrainEvaluationInboxPanel Studio controls", () => {
 it("uses canonical Studio controls for evidence tracing and governed learning decisions", () => {
  vi.mocked(buildBrainEvaluationInbox).mockReturnValue({
   counts: { critical: 1 },
   items: [
    { id: "review-1", kind: "learning_review", priority: "high", title: "Review learning candidate", summary: "Creator approval is required before profile promotion.", requiredMetrics: ["views"], sourceEventId: "event-1", metadata: { candidate: { id: "candidate-1" } } },
    { id: "promotion-1", kind: "learning_promotion", priority: "medium", title: "Promote approved learning", summary: "Measured learning is ready for a separate promotion decision.", requiredMetrics: [], sourceEventId: "event-2", metadata: { candidate: { id: "candidate-2" } } },
   ],
  } as any)
  const html = renderToStaticMarkup(<BrainEvaluationInboxPanel channelId="channel-1" />)
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Trace evidence")
  expect(html).toContain("Hold")
  expect(html).toContain("Reject")
  expect(html).toContain("Approve")
  expect(html).toContain("Promote to channel profile")
  expect(html).toContain("profile review only")
 })
})
