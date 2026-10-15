import { describe, expect, it } from "vitest"
import { classifyCreatorCommunication } from "./BrainCommunicationIngestion"

describe("classifyCreatorCommunication", () => {
 it("classifies explicit instructions and constraints without promoting memory", () => {
  const result = classifyCreatorCommunication("Always keep thumbnails text-free and do not use neon green.")
  expect(result.labels).toContain("instruction")
  expect(result.labels).toContain("constraint")
  expect(result.labels).toContain("style_feedback")
  expect(result.durableMemoryPromoted).toBe(false)
  expect(result.requiresGovernedReview).toBe(true)
 })

 it("distinguishes correction, rejection, approval and experiment notes", () => {
  expect(classifyCreatorCommunication("Correction: the audience is beginners, not experts.").labels).toContain("correction")
  expect(classifyCreatorCommunication("I reject this title.").labels).toContain("rejection")
  expect(classifyCreatorCommunication("Approved; use version B.").labels).toContain("approval")
  expect(classifyCreatorCommunication("Experiment note: test the shorter hook next week.").labels).toContain("experiment_note")
 })

 it("does not invent a durable fact from ambiguous text", () => {
  const result = classifyCreatorCommunication("Maybe the upload did better because the thumbnail changed.")
  expect(result.labels).toContain("factual_claim")
  expect(result.durableMemoryPromoted).toBe(false)
  expect(result.requiresGovernedReview).toBe(true)
 })
})
