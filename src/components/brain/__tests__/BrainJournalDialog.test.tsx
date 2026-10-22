import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { BrainJournalDialog } from "../BrainJournalDialog"

describe("BrainJournalDialog", () => {
 it("exposes a named modal dialog and a programmatic label for the journal input", () => {
  const html = renderToStaticMarkup(
   <BrainJournalDialog
    value="Audience likes practical examples"
    onChange={() => undefined}
    onClose={() => undefined}
    onSave={() => undefined}
   />,
  )

  expect(html).toContain('role="dialog"')
  expect(html).toContain('aria-modal="true"')
  expect(html).toContain('aria-labelledby="brain-journal-dialog-title"')
  expect(html).toContain('id="brain-journal-entry"')
  expect(html).toContain('for="brain-journal-entry"')
  expect(html).toContain("Save To AI Journal")
  expect(html).toContain("Audience likes practical examples")
 })

 it("does not allow saving an empty journal entry", () => {
  const html = renderToStaticMarkup(
   <BrainJournalDialog value="  " onChange={() => undefined} onClose={() => undefined} onSave={() => undefined} />,
  )

  expect(html).toContain("disabled")
 })
})
