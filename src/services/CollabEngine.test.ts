import { beforeEach, describe, expect, it, vi } from "vitest"

const generateJsonObject = vi.hoisted(() => vi.fn())

vi.mock("./brain/runtime/BrainModelGateway", () => ({
 defaultBrainModelGateway: { generateJsonObject },
}))

import { generateCollabOpportunities } from "./CollabEngine"

beforeEach(() => generateJsonObject.mockReset())

describe("collaboration research provider boundary", () => {
 it("uses the canonical gateway with live search grounding and validates candidates", async () => {
  generateJsonObject.mockResolvedValue({
   peers: [{
    id: "peer-1",
    name: "Restoration Channel",
    handle: "@restoration",
    subscriberCount: 48000,
    nicheMatch: 92,
    collabIdea: "Compare two approaches to a shared restoration problem.",
    outreachMessage: "Would you be interested in a practical comparison video?",
    thumbnail: "",
   }],
  })

  await expect(generateCollabOpportunities("My Channel", "restoration", 50000))
   .resolves.toMatchObject([{ id: "peer-1", subscriberCount: 48000 }])

  expect(generateJsonObject).toHaveBeenCalledWith(expect.objectContaining({
   capability: "analysis",
   tools: [{ googleSearch: {} }],
   responseSchema: expect.objectContaining({ required: ["peers"] }),
  }))
 })
 it("does not fabricate mock creators when the provider fails or returns unusable results", async () => {
  generateJsonObject.mockResolvedValue({ peers: [] })
  await expect(generateCollabOpportunities("My Channel", "restoration", 50000))
   .rejects.toThrow("No collaboration candidates could be verified")
  generateJsonObject.mockImplementationOnce(() => Promise.reject(new Error("provider unavailable")))
  await expect(generateCollabOpportunities("My Channel", "restoration", 50000))
   .rejects.toThrow("provider unavailable")
 })
})
