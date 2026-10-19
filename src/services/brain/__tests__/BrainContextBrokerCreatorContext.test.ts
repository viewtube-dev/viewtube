import { describe, expect, it } from "vitest"
import { buildBrainContextPack } from "../BrainContextBroker"
import { DEFAULT_BRAIN_USER_CONTROLS } from "../BrainUserControls"
import { buildBrainEvidenceRecordQuality } from "../BrainEvidenceQuality"

const snapshot = {
 brain: {
  identityAndAspirations: "Build a serious history channel.",
  contentDNA: "Primary-source historical storytelling.",
  futureStateMap: "Publish one researched longform video weekly.",
 },
 channel: { label: "History Channel" },
 conversations: { recentFacts: [] },
 inferredProfile: {
  niche: "Napoleonic history",
  contentPillars: ["Napoleon"],
  topicClusters: ["Austerlitz"],
  videoCount: 12,
  topEvidenceVideos: [],
 },
 evidencePack: { missingInputs: [], evidenceIds: [] },
} as any

describe("BrainContextBroker creator-context convergence", () => {
 it("uses the unified Creator Context envelope for controls, knowledge, project and style", () => {
  const creatorContext = {
   version: "vt-creator-context-v1",
   channelId: "channel-1",
   controls: {
    ...DEFAULT_BRAIN_USER_CONTROLS,
    allowAnalytics: false,
   },
   profile: null,
   channelKnowledge: {
    records: [{
     knowledgeClass: "CREATOR_PREFERENCE",
     confidence: "high",
     lifecycleState: "active",
     statement: "Prefer concise titles.",
     evidenceRefs: ["creator:preference:title-length"],
    }],
    contradictions: [],
   },
   styleProfile: {
    id: "style-1",
    channelId: "channel-1",
    scope: "channel",
    descriptor: {
     voice: "measured and documentary",
     pacing: "deliberate",
     vocabulary: { prefer: ["eyewitness"], avoid: ["insane"] },
     structure: "chronological",
     openingPattern: "immediate historical scene",
     closingPattern: "reflective consequence",
     productionQuality: "cinematic",
    },
    exemplars: [],
    features: {},
    source: "creator_authored",
    confidence: "high",
    createdAt: "2026-09-26T00:00:00.000Z",
    updatedAt: "2026-09-26T00:00:00.000Z",
    contradictions: [],
   },
   project: {
    channelId: "channel-1",
    projectId: "project-1",
    contentBuildId: "content-1",
    title: "Austerlitz",
    topic: "Battle of Austerlitz",
    format: "longform",
    plannedPublishAt: null,
    evidenceIds: ["asset-1"],
   },
   surface: null,
   selection: null,
   evidenceRefs: ["asset-1"],
   provenance: {
    profileLoadedAt: null,
    selectionUpdatedAt: null,
    projectSource: "canonical_project_content_build",
   },
  } as any

  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "Help improve this project.",
   creatorContext,
  })

  expect(result.systemInstruction).toContain("Analytics evidence access is disabled")
  expect(result.systemInstruction).toContain("CHANNEL KNOWLEDGE")
  expect(result.systemInstruction).toContain("Prefer concise titles.")
  expect(result.systemInstruction).toContain("ACTIVE PROJECT CONTEXT")
  expect(result.systemInstruction).toContain("Austerlitz")
  expect(result.systemInstruction).toContain("contentBuildId=content-1")
  expect(result.systemInstruction).toContain("CREATOR STYLE")
  expect(result.systemInstruction).toContain("measured and documentary")
  expect(result.systemInstruction).toContain("avoid=insane")
 })

 it("keeps ungraded profile facts and missing-input notes outside the graded evidence section", () => {
  const record = {
   id: "analytics:snapshot-1:channel_summary:views",
   owner: "analytics-canon",
   sourceRef: "channel_summary",
   sourceSnapshotId: "snapshot-1",
   channelId: "channel-1",
   metric: "views",
   value: 2800,
   unit: "count",
   freshness: "fresh",
   observedAt: "2026-09-27T16:00:00.000Z",
   epistemicState: "observed",
   confidence: 1,
   provenance: { evidenceIds: ["evidence:channel-summary"] },
  } as any
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot: {
    ...snapshot,
    evidencePack: { missingInputs: ["revenue unavailable"], evidenceIds: [] },
   },
   recentTurns: [],
   userText: "How many views?",
   evidenceRecords: [record],
   evidenceRecordQuality: {
    version: "vt-brain-evidence-record-quality-v1",
    generatedAt: "2026-10-19T00:00:00.000Z",
    expectedChannelId: "channel-1",
    evidenceRecordIds: [record.id],
    totalRecords: 1,
    numericRecords: 1,
    observedRecords: 1,
    staleRecords: 0,
    missingRecords: 0,
    scopeMatch: "exact",
    confidence: "high",
    limitations: [],
   },
  })

  const prompt = result.systemInstruction
  const evidenceSection = prompt.split("CHANNEL EVIDENCE\n")[1]?.split("\nCHANNEL PROFILE CONTEXT")[0] || ""
  expect(evidenceSection).toContain(record.id)
  expect(evidenceSection).toContain("value=2800")
  expect(evidenceSection).not.toContain("Inferred niche")
  expect(evidenceSection).not.toContain("Content pillars")
  expect(evidenceSection).not.toContain("Missing: revenue unavailable")
  expect(prompt).toContain("CHANNEL PROFILE CONTEXT")
  expect(prompt).toContain("Inferred niche: Napoleonic history")
  expect(prompt).toContain("EVIDENCE GAPS")
  expect(prompt).toContain("revenue unavailable")
 })


 it("fails closed when prompt evidence differs from the evidence record grade", () => {
  const records = [{
   id: "analytics:snapshot-1:channel_summary:views",
   owner: "analytics-canon",
   sourceRef: "channel_summary",
   sourceSnapshotId: "snapshot-1",
   channelId: "channel-1",
   metric: "views",
   value: 2800,
   unit: "count",
   freshness: "fresh",
   observedAt: null,
   updatedAt: "2026-10-19T00:00:00.000Z",
   epistemicState: "OBSERVED",
   availability: "available",
   confidence: 1,
   provenance: { evidenceIds: ["evidence:channel-summary"] },
  }] as any
  const grade = buildBrainEvidenceRecordQuality(records, { expectedChannelId: "channel-1" })
  const changedRecords = records.map((record: any) => ({ ...record, value: 9999 }))
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "How many views?",
   evidenceRecords: changedRecords,
   evidenceRecordQuality: grade,
  })

  expect(result.systemInstruction).toContain("evidence records do not match their quality grade")
  expect(result.systemInstruction).not.toContain("value=9999")
  expect(result.systemInstruction).not.toContain("Analytics evidence access is disabled")
 })

})
