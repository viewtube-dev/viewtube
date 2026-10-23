import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { BrainProfileCoverageChecklist } from "./BrainProfileCoverageChecklist"

describe("BrainProfileCoverageChecklist Studio contract", () => {
 it("uses canonical Studio buttons for prompt actions and preserves route links", () => {
  const html = renderToStaticMarkup(
   <MemoryRouter>
    <BrainProfileCoverageChecklist
     snapshot={{
      evidencePack: { channelDescription: "", } as any,
      inferredProfile: { videoCount: 0 } as any,
      vtSync: { videos: 0 } as any,
      brain: { goals: 0 } as any,
      conversations: { answeredQuestions: [] } as any,
      tools: [],
     } as any}
     onPrompt={() => undefined}
    />
   </MemoryRouter>,
  )
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Add description")
  expect(html).toContain("Confirm goals")
  expect(html).toContain('href="/vt-sync-local"')
 })
})
