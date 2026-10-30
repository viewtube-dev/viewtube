import { beforeEach, describe, expect, it, vi } from "vitest"

const runBrainTurn = vi.hoisted(() => vi.fn())
const gatewayGenerate = vi.hoisted(() => vi.fn())
const fetchPublicChannelSnapshot = vi.hoisted(() => vi.fn())

vi.mock("../BrainOrchestrator", () => ({
 runBrainTurn,
}))

vi.mock("../../publicHandleMode", () => ({
 fetchPublicChannelSnapshot,
}))

vi.mock("../runtime/BrainModelGateway", () => ({
 defaultBrainModelGateway: {
  generateStructuredResponse: gatewayGenerate,
 },
}))

import {
 BRAIN_RUNTIME_VERSION,
 buildBrainRuntimeMetadata,
 runBrainTask,
} from "../runtime/BrainRuntime"

describe("BrainRuntime", () => {
 beforeEach(() => {
  runBrainTurn.mockReset()
  gatewayGenerate.mockReset()
  fetchPublicChannelSnapshot.mockReset()
  fetchPublicChannelSnapshot.mockResolvedValue(null)
 })

 it("forwards project and evidence context while keeping surface metadata in the runtime", async () => {
  const orchestratorResult = {
   response: { id: "response-1" },
   modules: [],
   capabilities: ["channel-profile"],
   contextBudget: { maximumCharacters: 24000 },
   repaired: false,
   generationPath: "model",
   repairOutcome: { attempted: false, succeeded: false, reasons: [] },
  }
  runBrainTurn.mockResolvedValue(orchestratorResult)

  const snapshot = { channel: { label: "Channel" } }
  const growthContext = { currentGoal: "Grow" }
  const result = await runBrainTask({
   channelId: "channel-1",
   userText: "What should I make next?",
   snapshot: snapshot as any,
   systemPrompt: "system",
   growthContext: growthContext as any,
   recentTurns: [],
   history: [],
   allowModel: true,
   surface: "ai-brain",
   projectId: "project-1",
   analyticsWindow: "90d",
   visibleContext: { selectedVideoId: "video-1", contentBuildId: "cb-1" },
   artifactRefs: ["asset-1", "asset-1", "asset-2"],
   requestedOutput: "strategy brief",
  })

  expect(runBrainTurn).toHaveBeenCalledTimes(1)
  const [turnInput] = runBrainTurn.mock.calls[0]
  expect(turnInput).toMatchObject({
   channelId: "channel-1",
   userText: "What should I make next?",
   snapshot,
   growthContext,
   recentTurns: [],
   history: [],
   allowModel: true,
   modelGenerator: gatewayGenerate,
   nicheResolver: undefined,
   currentResearcher: undefined,
   projectId: "project-1",
   analyticsWindow: "90d",
   artifactRefs: ["asset-1", "asset-1", "asset-2"],
  })
  expect(turnInput.systemPrompt).toContain("ASSISTANT CONTINUITY TRACE")
  expect(turnInput.visibleContext).toMatchObject({
   selectedVideoId: "video-1",
   contentBuildId: "cb-1",
   assistantContinuityTrace: {
    version: "vt-brain-assistant-trace-v1",
    scope: {
     channelId: "channel-1",
     projectId: "project-1",
     contentBuildId: "cb-1",
    },
   },
  })
  // Runtime metadata may add trace fields while preserving the stable public contract.
  expect(result).toMatchObject({
   ...orchestratorResult,
   runtime: {
    runtimeVersion: BRAIN_RUNTIME_VERSION,
    surface: "ai-brain",
    projectId: "project-1",
    contentBuildId: "cb-1",
    artifactRefs: ["asset-1", "asset-2"],
    hasVisibleContext: true,
   },
  })
 })


 it("refreshes an explicitly selected public handle and replaces private evidence with public-only evidence", async () => {
  runBrainTurn.mockResolvedValue({ turn: { id: "turn-public" } })
  fetchPublicChannelSnapshot.mockResolvedValue({
   mode: "public_handle",
   source: "public_page",
   fetchedAt: "2026-10-30T00:00:00.000Z",
   channelId: "UC1234567890123456789012",
   handle: "@publiccreator",
   title: "Public Creator",
   subscriberCount: null,
   videoCount: null,
   viewCount: null,
   topVideos: [{
    videoId: "video-public-1",
    title: "Public video title",
    publishedAt: "2026-10-29T00:00:00.000Z",
    viewCount: null,
    likeCount: null,
    commentCount: null,
   }],
   provenance: {
    schemaVersion: 1,
    outcome: "resolved",
    cacheStatus: "cached",
    identity: { handle: "@publiccreator", channelId: "UC1234567890123456789012" },
    fetchedAt: "2026-10-30T00:00:00.000Z",
    expiresAt: "2026-10-30T03:00:00.000Z",
    sourceRefs: ["https://www.youtube.com/channel/UC1234567890123456789012"],
    limitations: ["Public metadata only."],
   },
  })

  await runBrainTask({
   channelId: null,
   publicHandleContext: { handle: "@publiccreator", channelId: "UC1234567890123456789012" },
   userText: "Summarize this public channel",
   snapshot: {
    channel: { connected: false, label: "Old private context", handle: null, subscribers: 500, totalViews: 9000 },
    evidencePack: {
     promptVersion: "brain-chat-v2",
     requestSpec: {},
     intent: "channel_overview",
     channelId: "private-channel",
     channelName: "Private",
     channelDescription: "private",
     capturedAt: "2026-10-29T00:00:00.000Z",
     dataStatus: "ready",
     topVideos: [{ evidenceId: "private-video", title: "Private title" }],
     recentVideos: [{ evidenceId: "private-video", title: "Private title" }],
     searchTerms: [{ evidenceId: "private-search" }],
     trafficSources: [{ evidenceId: "private-traffic" }],
     items: [],
     availableMetrics: ["views"],
     missingInputs: [],
     evidenceIds: ["private-video"],
     transcriptRouteRequired: false,
    },
   } as any,
   systemPrompt: "system",
   growthContext: {} as any,
  })

  expect(fetchPublicChannelSnapshot).toHaveBeenCalledWith("@publiccreator")
  const [turnInput] = runBrainTurn.mock.calls[0]
  expect(turnInput.channelId).toBe("UC1234567890123456789012")
  expect(turnInput.snapshot.evidencePack.topVideos).toHaveLength(1)
  expect(turnInput.snapshot.evidencePack.topVideos[0]).toMatchObject({
   evidenceId: "public-video:video-public-1",
   metrics: { views: null, watchTime: null, subscribers: null, revenue: null, ctr: null, averagePercentageViewed: null, likes: null, comments: null },
  })
  expect(turnInput.snapshot.evidencePack.searchTerms).toEqual([])
  expect(turnInput.snapshot.evidencePack.trafficSources).toEqual([])
  expect(turnInput.snapshot.evidencePack.evidenceIds).toEqual(["public-video:video-public-1"])
  expect(turnInput.snapshot.channel).toMatchObject({ connected: false, subscribers: null, totalViews: null })
  expect(turnInput.systemPrompt).toContain("PUBLIC CHANNEL EVIDENCE")
  expect(turnInput.systemPrompt).toContain("Public video title")
  expect(turnInput.visibleContext.publicHandleEvidence).toMatchObject({
   mode: "public_handle",
   identity: { handle: "@publiccreator", channelId: "UC1234567890123456789012" },
   cacheStatus: "cached",
  })
 })

 it("does not infer public mode from channelId or mix a conflicting private channel", async () => {
  runBrainTurn.mockResolvedValue({ turn: { id: "turn-private" } })
  await runBrainTask({
   channelId: "private-connected-channel",
   publicHandleContext: { handle: "@publiccreator", channelId: "UC1234567890123456789012" },
   userText: "test",
   snapshot: {} as any,
   systemPrompt: "system",
   growthContext: {} as any,
  })
  expect(fetchPublicChannelSnapshot).not.toHaveBeenCalled()
  const [turnInput] = runBrainTurn.mock.calls[0]
  expect(turnInput.systemPrompt).not.toContain("PUBLIC CHANNEL EVIDENCE")
 })

 it("rejects a public snapshot whose identity differs from the explicit selection", async () => {
  runBrainTurn.mockResolvedValue({ turn: { id: "turn-mismatch" } })
  fetchPublicChannelSnapshot.mockResolvedValue({
   mode: "public_handle",
   source: "public_page",
   fetchedAt: "2026-10-30T00:00:00.000Z",
   channelId: "UC9999999999999999999999",
   handle: "@differentcreator",
   title: "Different Creator",
   subscriberCount: null,
   videoCount: null,
   viewCount: null,
   topVideos: [],
  })
  await runBrainTask({
   publicHandleContext: { handle: "@publiccreator", channelId: "UC1234567890123456789012" },
   userText: "test",
   snapshot: {} as any,
   systemPrompt: "system",
   growthContext: {} as any,
  })
  const [turnInput] = runBrainTurn.mock.calls[0]
  expect(turnInput.systemPrompt).not.toContain("PUBLIC CHANNEL EVIDENCE")
 })

 it("preserves an explicitly injected model generator for tests and specialized callers", async () => {
  const explicitGenerator = vi.fn()
  runBrainTurn.mockResolvedValue({ turn: { id: "turn-1" } })

  await runBrainTask({
   userText: "test",
   snapshot: {} as any,
   systemPrompt: "system",
   growthContext: {} as any,
   modelGenerator: explicitGenerator as any,
  })

  expect(runBrainTurn).toHaveBeenCalledWith(expect.objectContaining({
   modelGenerator: explicitGenerator,
  }))
 })

 it("builds bounded deterministic runtime metadata", () => {
  const artifactRefs = Array.from({ length: 60 }, (_, index) => `asset-${index}`)
  const metadata = buildBrainRuntimeMetadata({
   userText: "test",
   snapshot: {} as any,
   systemPrompt: "system",
   growthContext: {} as any,
   artifactRefs,
  })

  expect(metadata.runtimeVersion).toBe("brain-runtime-v1")
  expect(metadata.surface).toBe("unknown")
  expect(metadata.projectId).toBeNull()
  expect(metadata.artifactRefs).toHaveLength(50)
  expect(metadata.hasVisibleContext).toBe(false)
 })
})
