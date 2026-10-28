import { describe, expect, it } from "vitest"
import { buildBrainContextPack } from "../BrainContextBroker"
import { formatEvidenceRecordForPrompt } from "../EvidenceRecord"
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
   evidenceRecordQuality: buildBrainEvidenceRecordQuality([record], { expectedChannelId: "channel-1" }),
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


 it("fails closed when evidence records have no grade", () => {
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
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "How many views?",
   evidenceRecords: records,
  })

  expect(result.systemInstruction).toContain("or no grade was supplied")
  expect(result.systemInstruction).not.toContain("value=2800")
 })

 it("includes saved channel context as creator-provided guidance, never as verified evidence", () => {
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "Plan my content",
   channelContext: {
    identity: { name: "History Channel", niche: "Historical explainers" },
    goals: { primaryGoal: "Grow a loyal audience" },
    audience: { idealViewer: "Curious history fans" },
    content: { priorityThemes: ["primary sources"] },
    brand: { voice: "measured and accessible" },
    intelligence: { sources: ["public videos"], capabilities: ["research"] },
   },
  })

  expect(result.systemInstruction).toContain("CREATOR-PROVIDED CHANNEL CONTEXT")
  expect(result.systemInstruction).toContain("Historical explainers")
  expect(result.systemInstruction).toContain("USER_PROVIDED")
  expect(result.systemInstruction).toContain("not verified public evidence")
 })

 it("selects relevant complete creator evidence records instead of truncating the evidence line", () => {
  const records = Array.from({ length: 12 }, (_, index) => {
   const id = index === 11
    ? "creator-answer:channel-1:channelContext.audience.transformation"
    : `creator-answer:channel-1:channelContext.content.types${index}`
   return {
    id,
    owner: "creator-confirmed",
    sourceRef: `ai-brain-context:${id}`,
    sourceSnapshotId: "2026-10-27T10:00:00.000Z",
    channelId: "channel-1",
    metric: null,
    value: index === 11 ? "Help viewers understand complex topics" : `Creator answer detail ${index} ${"long descriptive context ".repeat(5)}`,
    unit: null,
    freshness: "fresh",
    epistemicState: "USER_PROVIDED",
    confidence: 1,
    observedAt: "2026-10-27T10:00:00.000Z",
    limitations: ["Creator answer; not independently verified."],
    provenance: { evidenceIds: [id], sourceRoute: "settings/ai/channel-context", sourceVersion: "creator-context-unification-v1" },
   }
  }) as any[]
  const target = records[11]
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "audience transformation",
   channelContext: {
    identity: { name: "History Channel", niche: "Historical explainers" },
    goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
   },
   creatorContext: {
    version: "vt-creator-context-v1",
    channelId: "channel-1",
    controls: { ...DEFAULT_BRAIN_USER_CONTROLS, personalization: true, allowAnalytics: false },
    profile: null,
    channelKnowledge: null,
    styleProfile: null,
    project: null,
    surface: null,
    selection: null,
    evidenceRefs: [],
    provenance: { profileLoadedAt: null, selectionUpdatedAt: null, projectSource: null },
   } as any,
   creatorAnswerEvidenceRecords: records,
  })
  expect(result.systemInstruction).toContain(target.id)
  expect(result.systemInstruction).toContain(formatEvidenceRecordForPrompt(target))
 })

 it("does not inject channel context when the saved profile names another channel", () => {
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "Plan my content",
   channelContext: {
    identity: { name: "Different Channel", niche: "Unrelated topic" },
    goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
   },
  })

  expect(result.systemInstruction).not.toContain("Unrelated topic")
  expect(result.budget.omittedSections).toContain("channel_context_channel_name_mismatch")
 })

 it("respects the existing personalization control for saved channel context", () => {
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "Plan my content",
   channelContext: {
    identity: { name: "History Channel", niche: "Private niche preference" },
    goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
   },
   creatorContext: {
    version: "vt-creator-context-v1",
    channelId: "channel-1",
    controls: { ...DEFAULT_BRAIN_USER_CONTROLS, personalization: false, allowAnalytics: false },
    profile: null,
    channelKnowledge: null,
    styleProfile: null,
    project: null,
    surface: null,
    selection: null,
    evidenceRefs: [],
    provenance: { profileLoadedAt: null, selectionUpdatedAt: null, projectSource: null },
   } as any,
  })

  expect(result.systemInstruction).not.toContain("Private niche preference")
  expect(result.budget.omittedSections).toContain("creator_personalization_disabled")
 })


 it("includes creator intake answers as channel-scoped USER_PROVIDED evidence", () => {
  const answerRecord = {
   id: "creator-answer:channel-1:channelContext.identity.niche",
   owner: "creator-confirmed",
   sourceRef: "ai-brain-context:channelContext.identity.niche",
   sourceSnapshotId: "2026-10-27T10:00:00.000Z",
   channelId: "channel-1",
   metric: null,
   value: "Historical explainers",
   unit: null,
   freshness: "fresh",
   epistemicState: "USER_PROVIDED",
   confidence: 1,
   observedAt: "2026-10-27T10:00:00.000Z",
   limitations: ["Creator answer; not independently verified."],
   provenance: { evidenceIds: ["creator-answer:channel-1:channelContext.identity.niche"], sourceRoute: "settings/ai/channel-context", sourceVersion: "creator-context-unification-v1" },
  } as any
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "Plan my content",
   channelContext: {
    identity: { name: "History Channel", niche: "Historical explainers" },
    goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
   },
   creatorAnswerEvidenceRecords: [answerRecord],
  })
  expect(result.systemInstruction).toContain("CREATOR ANSWER EVIDENCE")
  expect(result.systemInstruction).toContain(answerRecord.id)
  expect(result.systemInstruction).toContain("state=USER_PROVIDED")
  expect(result.systemInstruction).toContain("not independently verified")
 })


 it("never injects creator-answer evidence from a different channel", () => {
  const records = [
   {
    id: "creator-answer:channel-1:channelContext.identity.niche",
    owner: "creator-confirmed",
    sourceRef: "ai-brain-context:channelContext.identity.niche",
    sourceSnapshotId: "2026-10-27T10:00:00.000Z",
    channelId: "channel-1",
    metric: null,
    value: "History for channel one",
    unit: null,
    freshness: "fresh",
    epistemicState: "USER_PROVIDED",
    confidence: 1,
    observedAt: "2026-10-27T10:00:00.000Z",
    limitations: ["Creator answer; not independently verified."],
    provenance: { evidenceIds: ["creator-answer:channel-1:channelContext.identity.niche"] },
   },
   {
    id: "creator-answer:channel-2:channelContext.identity.niche",
    owner: "creator-confirmed",
    sourceRef: "ai-brain-context:channelContext.identity.niche",
    sourceSnapshotId: "2026-10-27T10:00:00.000Z",
    channelId: "channel-2",
    metric: null,
    value: "PRIVATE FACT FROM ANOTHER CHANNEL",
    unit: null,
    freshness: "fresh",
    epistemicState: "USER_PROVIDED",
    confidence: 1,
    observedAt: "2026-10-27T10:00:00.000Z",
    limitations: ["Creator answer; not independently verified."],
    provenance: { evidenceIds: ["creator-answer:channel-2:channelContext.identity.niche"] },
   },
  ] as any[]
  const result = buildBrainContextPack({
   channelId: "channel-1",
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "Plan my content",
   channelContext: {
    identity: { name: "History Channel", niche: "Historical explainers" },
    goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
   },
   creatorAnswerEvidenceRecords: records,
  })

  expect(result.systemInstruction).toContain("History for channel one")
  expect(result.systemInstruction).not.toContain("PRIVATE FACT FROM ANOTHER CHANNEL")
  expect(result.systemInstruction).not.toContain("creator-answer:channel-2:channelContext.identity.niche")
 })


 it("fails closed for creator-answer evidence when no active channel ID is available", () => {
  const result = buildBrainContextPack({
   systemPrompt: "SYSTEM",
   snapshot,
   recentTurns: [],
   userText: "Plan my content",
   channelContext: {
    identity: { name: "History Channel", niche: "Historical explainers" },
    goals: {}, audience: {}, content: {}, brand: {}, intelligence: {},
   },
   creatorAnswerEvidenceRecords: [{
    id: "creator-answer:channel-1:channelContext.identity.niche",
    owner: "creator-confirmed",
    sourceRef: "ai-brain-context:channelContext.identity.niche",
    sourceSnapshotId: "2026-10-27T10:00:00.000Z",
    channelId: "channel-1",
    metric: null,
    value: "SHOULD NOT BE USED WITHOUT ACTIVE CHANNEL SCOPE",
    unit: null,
    freshness: "fresh",
    epistemicState: "USER_PROVIDED",
    confidence: 1,
    observedAt: "2026-10-27T10:00:00.000Z",
    limitations: ["Creator answer; not independently verified."],
    provenance: { evidenceIds: ["creator-answer:channel-1:channelContext.identity.niche"] },
   }] as any,
  })

  expect(result.systemInstruction).not.toContain("SHOULD NOT BE USED WITHOUT ACTIVE CHANNEL SCOPE")
  expect(result.budget.omittedSections).toContain("creator_answer_evidence_channel_mismatch")
 })

})
