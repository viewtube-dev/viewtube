import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainContextCorrectionDialog } from "../BrainContextCorrectionDialog"

describe("BrainContextCorrectionDialog", () => {
 it("presents an accessible, explicit correction form with the source and current statement", () => {
  const html = renderToStaticMarkup(
   <BrainContextCorrectionDialog
    channelId="channel-1"
    item={{
     id: "claim-1",
     statement: "Old preference",
     knowledgeClass: "CREATOR_PREFERENCE",
     lifecycleState: "active",
     confirmationState: "explicit",
     source: "brain_memory_claim",
     sourceId: "claim-1",
     evidenceRefs: ["evidence-1"],
     status: "confirmed",
    }}
    onClose={() => undefined}
    onApplied={() => undefined}
   />,
  )

  expect(html).toContain('role="dialog"')
  expect(html).toContain('aria-modal="true"')
  expect(html).toContain('aria-labelledby="brain-context-correction-title"')
  expect(html).toContain('for="brain-context-correction-value"')
  expect(html).toContain("Old preference")
  expect(html).toContain("claim-1")
  expect(html).toContain("Nothing changes until you submit this correction.")
  expect(html).toContain("Save correction")
 })
})
