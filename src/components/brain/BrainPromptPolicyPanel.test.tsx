import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import { BrainPromptPolicyPanel } from "./BrainPromptPolicyPanel"

const snapshot = {
 inferredProfile: { videoCount: 0 },
 brain: { activeProjects: 0 },
} as unknown as AIBrainContextSnapshot

describe("BrainPromptPolicyPanel", () => {
 it("shows registry inventory without claiming it is the active prompt for a turn", () => {
  const html = renderToStaticMarkup(<BrainPromptPolicyPanel snapshot={snapshot} channelId="channel-test" onEditPrompt={() => undefined} />)
  expect(html).toContain("Prompt Studio &amp; Access")
  expect(html).toContain("Canonical prompt authority")
  expect(html).toContain("does not import documentation into runtime code")
  expect(html).toContain("Inspect active prompt for next task")
 })
 it("separates permission gates from current data readiness", () => {
  const html = renderToStaticMarkup(<BrainPromptPolicyPanel snapshot={snapshot} channelId="channel-test" />)
  expect(html).toContain("Saved permission gates")
  expect(html).toContain("Current data readiness")
  expect(html).toContain("No analyzed videos in the current profile snapshot")
  expect(html).toContain("No active project in the current snapshot")
 })
})
