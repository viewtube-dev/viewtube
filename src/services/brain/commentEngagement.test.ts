import { beforeEach, describe, expect, it, vi } from "vitest"

const generateJsonObject = vi.hoisted(() => vi.fn())

vi.mock("./runtime/BrainModelGateway", () => ({
 defaultBrainModelGateway: { generateJsonObject },
}))

import { draftCommentReply, recommendVideoForComment } from "./commentEngagement"

beforeEach(() => generateJsonObject.mockReset())

describe("comment engagement gateway boundary", () => {
 it("drafts a structured reply through BrainModelGateway", async () => {
  generateJsonObject.mockResolvedValue({ reply: "Thanks for sharing your experience.", suggestedVideoId: "video-2" })
  await expect(draftCommentReply({
   commentText: "How did you repair the radio?",
   authorName: "Viewer",
   channelContext: "Vintage radio restoration",
   availableVideos: [{ id: "video-2", title: "Radio repair basics" }],
  })).resolves.toEqual({ reply: "Thanks for sharing your experience.", suggestedVideoId: "video-2" })
  expect(generateJsonObject).toHaveBeenCalledWith(expect.objectContaining({
   capability: "analysis",
   responseSchema: expect.objectContaining({ required: ["reply"] }),
  }))
 })
 it("rejects an empty generated reply instead of returning a blank draft", async () => {
  generateJsonObject.mockResolvedValue({ reply: " " })
  await expect(draftCommentReply({
   commentText: "Question",
   authorName: "Viewer",
   channelContext: "Restoration",
   availableVideos: [],
  })).rejects.toThrow("empty reply")
 })
 it("only returns a recommended video that exists in the supplied creator-owned list", async () => {
  generateJsonObject.mockResolvedValue({
   recommendedVideoId: "not-owned",
   matchStrength: 88,
   reason: "Related topic",
   bridgePhrase: "You may also like",
  })
  await expect(recommendVideoForComment({
   commentText: "How do I fix this?",
   availableVideos: [{ id: "video-1", title: "Repair guide" }],
  })).resolves.toMatchObject({ recommendedVideoId: null, matchStrength: 0 })
 })
 it("preserves an allowed recommendation and clamps match strength", async () => {
  generateJsonObject.mockResolvedValue({
   recommendedVideoId: "video-1",
   matchStrength: 140,
   reason: "It answers the question.",
   bridgePhrase: "Here is the next step:",
  })
  await expect(recommendVideoForComment({
   commentText: "How do I fix this?",
   availableVideos: [{ id: "video-1", title: "Repair guide" }],
  })).resolves.toMatchObject({ recommendedVideoId: "video-1", matchStrength: 100 })
 })
})
