import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { BrainWorkflowRunPanel } from "./BrainWorkflowRunPanel"

describe("BrainWorkflowRunPanel Studio controls", () => {
 it("uses the canonical Studio button for workflow start", () => {
  const html = renderToStaticMarkup(
   <BrainWorkflowRunPanel
    recommendation={{ id: "recommendation-1", title: "Prepare a release", goal: "Create a reviewable package", reason: "The package is ready for preparation", steps: [] }}
   />,
  )
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Start workflow")
 })
})
