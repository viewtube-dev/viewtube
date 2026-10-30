import { describe, expect, it } from "vitest"
import { pinnedCommentStrategy } from "./commentReply"

const request = (videoTitle = "Rebuilding a 1954 Fordson") => ({
 channelId: "channel-1",
 assetType: "comment_reply" as const,
 instruction: "Draft a pinned comment.",
 inputs: { videoTitle, videoId: "video-1", publishedAt: "2026-10-20" },
})

describe("pinned comment strategy", () => {
 it("binds the output to the selected owned video and enforces creator-ready copy", () => {
  const evidence = { requested: [], refs: [], missing: [], payload: {}, summary: "" }
  const instruction = pinnedCommentStrategy.buildTaskInstruction(request(), evidence)
  expect(instruction).toContain("Rebuilding a 1954 Fordson")
  expect(instruction).toContain("video-1")
  expect(instruction).toContain("280 characters")
  expect(pinnedCommentStrategy.promptVersion).toBe("pinned-comment-v1")
 })
 it("blocks empty and overlong comments", () => {
  expect(pinnedCommentStrategy.rubric?.({ body: "", intent: "" }, request()).some(f => f.severity === "blocking")).toBe(true)
  expect(pinnedCommentStrategy.rubric?.({ body: "x".repeat(281), intent: "discussion" }, request()).some(f => f.rule === "comment_length")).toBe(true)
 })
 it("accepts a concise comment draft", () => {
  expect(pinnedCommentStrategy.rubric?.({ body: "What would you check first on this rebuild?", intent: "invite useful discussion" }, request())).toEqual([])
 })
})
