import { describe, expect, it } from "vitest"
import { shouldFollowBrainConversation } from "./brainConversationScroll"

describe("shouldFollowBrainConversation", () => {
 it("follows when the transcript is within the bottom threshold", () => {
  expect(shouldFollowBrainConversation(1000, 850, 100)).toBe(true)
  expect(shouldFollowBrainConversation(1000, 828, 100)).toBe(true)
 })

 it("stops following when the reader is more than the threshold above the bottom", () => {
  expect(shouldFollowBrainConversation(1000, 827, 100)).toBe(false)
  expect(shouldFollowBrainConversation(1000, 400, 100)).toBe(false)
 })

 it("supports an explicit threshold for compact viewports", () => {
  expect(shouldFollowBrainConversation(500, 360, 100, 40)).toBe(true)
  expect(shouldFollowBrainConversation(500, 359, 100, 40)).toBe(false)
 })
})
