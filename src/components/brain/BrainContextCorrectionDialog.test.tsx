import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { BrainContextCorrectionDialog } from "./BrainContextCorrectionDialog"

describe("BrainContextCorrectionDialog Studio contract", () => {
 it("uses canonical Studio textarea and buttons while preserving field semantics", () => {
  const html = renderToStaticMarkup(
   <BrainContextCorrectionDialog
    channelId="channel-1"
    item={{
     id: "claim-1",
     statement: "Current statement",
     knowledgeClass: "creator_goal",
     lifecycleState: "active",
     confirmationState: "inferred",
     source: "brain_memory_claim",
     sourceId: "claim-1",
     evidenceRefs: ["evidence-1"],
     status: "inferred",
    }}
    onClose={() => undefined}
    onApplied={() => undefined}
   />,
  )
  expect(html).toContain('data-vt-studio-control="true"')
  expect(html).toContain('id="brain-context-correction-value"')
  expect(html).toContain('aria-describedby="brain-context-correction-hint"')
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Cancel")
  expect(html).toContain("Save correction")
 })
})
