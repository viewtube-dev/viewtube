// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"

const runner = vi.hoisted(() => vi.fn(async () => ({
 output: { body: "What would you check first on this rebuild?", intent: "invite useful discussion" },
 model: {
  capability: "text",
  requested: "gemini-3.1-flash-lite",
  served: "gemini-3.1-flash-lite",
  substituted: false,
  reason: "honoured",
 },
})))

vi.mock("../assetModelRunner", () => ({ geminiAssetModelRunner: runner }))

import { generatePinnedCommentDraft } from "../creatorAssets"
import { listGeneratedAssets } from "../AssetGenerator"

beforeEach(() => {
 localStorage.clear()
 runner.mockClear()
})

describe("governed pinned comment generation", () => {
 it("uses the selected video context and persists operation, trace and prompt provenance", async () => {
  const result = await generatePinnedCommentDraft({
   context: {
    channelId: "channel-1",
    channelName: "Restoration Works",
    subscriberCount: 48200,
    recentVideoTitles: ["A barn find teardown"],
   },
   videoId: "video-1",
   videoTitle: "Rebuilding a 1954 Fordson",
   publishedAt: "2026-10-20",
  })

  expect(result.body).toBe("What would you check first on this rebuild?")
  expect(result.record.assetType).toBe("comment_reply")
  expect(result.record.operationId).toMatch(/^pinned-comment:/)
  expect(result.record.workflowId).toContain("video-1")
  expect(result.record.traceId).toBeTruthy()
  expect(result.record.promptReceipt).toMatchObject({
   promptVersion: "pinned-comment-v1",
   outputSchemaVersion: "pinned-comment-v1",
   requestedModel: "gemini-3.1-flash-lite",
   servedModel: "gemini-3.1-flash-lite",
  })
  expect(listGeneratedAssets({ channelId: "channel-1", assetType: "comment_reply" })).toHaveLength(1)
  expect(runner).toHaveBeenCalledTimes(1)
 })
 it("rejects a missing channel or video instead of making an unscoped model call", async () => {
  await expect(generatePinnedCommentDraft({
   context: { channelId: "" },
   videoId: "video-1",
   videoTitle: "A video",
  })).rejects.toThrow("connected channel and selected video")
  expect(runner).not.toHaveBeenCalled()
 })
})
