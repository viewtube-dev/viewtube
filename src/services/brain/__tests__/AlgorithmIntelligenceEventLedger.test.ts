// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../BrainIntelligencePersistence", () => ({
  persistBrainIntelligence: vi.fn().mockResolvedValue(undefined),
}))

import {
  recordAlgorithmIntelligenceEvent,
  upsertAlgorithmIntelligenceEvents,
  listAlgorithmIntelligenceEvents,
  type AlgorithmIntelligenceEvent,
} from "../AlgorithmIntelligenceEventLedger"

const event = (overrides: Partial<AlgorithmIntelligenceEvent> = {}): AlgorithmIntelligenceEvent => ({
  id: "event-zero-time",
  channelId: "channel-1",
  kind: "RECOMMENDATION_CREATED",
  sourceSystem: "workflow",
  sourceId: "source-1",
  parentEventIds: [],
  evidenceIds: [],
  confidence: "high",
  title: "Timestamp test",
  summary: "Preserve valid epoch timestamps",
  evaluationTargets: [],
  checkpointAt: 0,
  metadata: {},
  createdAt: 0,
  ...overrides,
})

describe("AlgorithmIntelligenceEventLedger timestamp integrity", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("preserves an existing event's zero creation timestamp when recording an update", () => {
    localStorage.setItem("vt_algorithm_intelligence_events_v1", JSON.stringify([event()]))

    recordAlgorithmIntelligenceEvent({
      id: "event-zero-time",
      channelId: "channel-1",
      kind: "RECOMMENDATION_CREATED",
      sourceSystem: "workflow",
      sourceId: "source-1",
      title: "Timestamp test updated",
      summary: "Preserve original creation time",
      confidence: "high",
    })

    expect(listAlgorithmIntelligenceEvents({ channelId: "channel-1" })[0].createdAt).toBe(0)
  })

  it("preserves zero when merging durable event history", () => {
    localStorage.setItem("vt_algorithm_intelligence_events_v1", JSON.stringify([event({ createdAt: 100 })]))

    upsertAlgorithmIntelligenceEvents([event({ createdAt: 0 })])

    expect(listAlgorithmIntelligenceEvents({ channelId: "channel-1" })[0].createdAt).toBe(0)
  })
})
