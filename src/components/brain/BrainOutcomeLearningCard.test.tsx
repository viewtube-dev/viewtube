import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { BrainOutcomeLearningCard } from "./BrainOutcomeLearningCard"

describe("BrainOutcomeLearningCard", () => {
 it("does not confuse an empty local ledger with proof that no durable outcomes exist", () => {
  const html = renderToStaticMarkup(<BrainOutcomeLearningCard channelId="channel-test" />)
  expect(html).toContain("Outcomes &amp; Learning")
  expect(html).toContain("Candidate review and promotion remain in the Evaluation Inbox")
  expect(html).toContain("does not prove no outcomes exist in durable services")
  expect(html).toContain("Creator asset decisions")
 })
 it("does not render channel outcome data without a channel scope", () => {
  expect(renderToStaticMarkup(<BrainOutcomeLearningCard />)).toBe("")
 })
})
