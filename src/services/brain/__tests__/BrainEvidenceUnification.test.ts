import { describe, expect, it } from "vitest"
import type { EvidenceRecord } from "../EvidenceRecord"
import { buildBrainContextPack } from "../BrainContextBroker"
import { buildBrainEvidenceRecordQuality } from "../BrainEvidenceQuality"
import { DEFAULT_BRAIN_USER_CONTROLS } from "../BrainUserControls"

const record: EvidenceRecord = {
 id: "analytics:snapshot-1:videos:views",
 owner: "analytics-canon",
 sourceRef: "videos",
 sourceSnapshotId: "snapshot-1",
 channelId: "channel-1",
 datasetId: "videos",
 metric: "views",
 value: 1234,
 unit: "count",
 aggregation: "sum",
 population: "videos",
 format: "all",
 geography: null,
 window: { kind: "28d" },
 observedAt: "2026-10-19T10:00:00.000Z",
 updatedAt: "2026-10-19T10:00:00.000Z",
 freshness: "fresh",
 epistemicState: "observed",
 confidence: 1,
 coverage: 1,
 availability: "available",
 missingness: [],
 limitations: [],
 provenance: {
  evidenceIds: ["snapshot-1:videos:1"],
  sourceRoute: "/analytics",
  sourceVersion: "test-v1",
 },
}

const snapshot = {
 brain: {
  identityAndAspirations: "",
  contentDNA: "",
  futureStateMap: "",
 },
 channel: { label: "Test Channel" },
 conversations: { recentFacts: [] },
 inferredProfile: {
  niche: "Test niche",
  contentPillars: [],
  topicClusters: [],
  videoCount: 99,
  topEvidenceVideos: [{ videoId: "legacy-video", title: "LEGACY UNGRADED VIDEO", views: 999999 }],
 },
 evidencePack: { missingInputs: [], evidenceIds: [] },
} as any

describe("Brain evidence unification", () => {
 it("renders and grades the same EvidenceRecord ids without reusing topEvidenceVideos", () => {
  const evidenceRecords = [record]
  const evidenceRecordQuality = buildBrainEvidenceRecordQuality(evidenceRecords, {
   expectedChannelId: "channel-1",
  })
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "How many views?",
   evidenceRecords,
   evidenceRecordQuality,
   creatorContext: {
    channelId: "channel-1",
    controls: { ...DEFAULT_BRAIN_USER_CONTROLS, allowAnalytics: true },
   } as any,
  })

  expect(result.systemInstruction).toContain("Evidence id=analytics:snapshot-1:videos:views")
  expect(result.systemInstruction).toContain("metric=views; value=1234 count")
  expect(result.systemInstruction).toContain("recordGrade=high")
  expect(evidenceRecordQuality.evidenceRecordIds).toEqual(evidenceRecords.map((item) => item.id))
  expect(result.systemInstruction).not.toContain("LEGACY UNGRADED VIDEO")
  expect(result.systemInstruction).not.toContain("Known videos: 99")
 })
})
