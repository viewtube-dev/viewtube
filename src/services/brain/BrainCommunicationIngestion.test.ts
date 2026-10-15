// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { classifyCreatorCommunication, recordCreatorCommunicationEvidence, redactLegacyCreatorCommunicationText } from "./BrainCommunicationIngestion"
import { listAlgorithmIntelligenceEvents, recordAlgorithmIntelligenceEvent } from "./AlgorithmIntelligenceEventLedger"
import { DEFAULT_BRAIN_USER_CONTROLS, writeBrainUserControls } from "./BrainUserControls"

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

 it("leaves neutral text unclassified instead of inventing a fact", () => {
  const result = classifyCreatorCommunication("Hello, can you help me?")
  expect(result.labels).toEqual([])
  expect(result.confidence).toBe("low")
  expect(result.rationale[0]).toContain("do not infer a fact")
 })
})

describe("recordCreatorCommunicationEvidence privacy and consent", () => {
 beforeEach(() => {
  localStorage.clear()
 })

 it("does not record communication until the creator explicitly opts in", () => {
  writeBrainUserControls({ ...DEFAULT_BRAIN_USER_CONTROLS, captureCreatorCommunications: false }, "channel-a")
  expect(() => recordCreatorCommunicationEvidence({
   channelId: "channel-a",
   communicationId: "message-1",
   text: "Always keep the thumbnail text-free.",
  })).toThrow("Explicit creator communication capture consent is required")
 })

 it("records only a fingerprint and classification, never raw communication text", () => {
  writeBrainUserControls({ ...DEFAULT_BRAIN_USER_CONTROLS, captureCreatorCommunications: true }, "channel-a")
  const privateText = "Always keep the thumbnail text-free and avoid neon green."
  const result = recordCreatorCommunicationEvidence({
   channelId: "channel-a",
   communicationId: "message-2",
   text: privateText,
  })
  expect(result.event.metadata?.communicationText).toBeUndefined()
  expect(result.event.metadata?.communicationTextFingerprint).toMatch(/^[a-f0-9]{16}$/)
  expect(result.event.summary).not.toContain(privateText)
  expect(JSON.stringify(result.event)).not.toContain(privateText)
  expect(result.classification.durableMemoryPromoted).toBe(false)
 })

 it("redacts raw text from legacy events and queues the sanitized record for durable sync", () => {
  recordAlgorithmIntelligenceEvent({
   id: "creator-communication:channel-a:legacy-1",
   channelId: "channel-a",
   projectId: null,
   kind: "CREATOR_COMMUNICATION_CLASSIFIED",
   sourceSystem: "communication",
   sourceId: "legacy-1",
   parentEventIds: [],
   evidenceIds: ["legacy-1"],
   confidence: "high",
   title: "Creator communication: instruction",
   summary: "Always keep the thumbnail text-free.",
   metadata: { communicationText: "Always keep the thumbnail text-free.", communicationId: "legacy-1" },
  })
  expect(redactLegacyCreatorCommunicationText("channel-a")).toBe(1)
  const event = listAlgorithmIntelligenceEvents({ channelId: "channel-a" }).find((item) => item.id === "creator-communication:channel-a:legacy-1")
  expect(event?.metadata.communicationText).toBeUndefined()
  expect(event?.metadata.rawCommunicationTextRetained).toBe(false)
  expect(event?.summary).not.toContain("Always keep the thumbnail text-free.")
 })

 it("keeps retries idempotent and rejects reuse of a communication ID for different text", () => {
  writeBrainUserControls({ ...DEFAULT_BRAIN_USER_CONTROLS, captureCreatorCommunications: true }, "channel-a")
  const input = { channelId: "channel-a", communicationId: "message-3", text: "Always keep the thumbnail text-free." }
  expect(recordCreatorCommunicationEvidence(input).idempotentReplay).toBe(false)
  expect(recordCreatorCommunicationEvidence(input).idempotentReplay).toBe(true)
  expect(() => recordCreatorCommunicationEvidence({ ...input, text: "Never use neon green." }))
   .toThrow("Communication ID was already used for different text or scope")
 })
})
