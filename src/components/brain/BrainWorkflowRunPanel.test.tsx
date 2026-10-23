import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import type { WorkflowChain } from "../../types"
import { requestWorkflowStepApproval } from "./BrainWorkflowRunPanel"
import { BrainWorkflowRunPanel } from "./BrainWorkflowRunPanel"

describe("BrainWorkflowRunPanel Studio controls", () => {
 it("uses the canonical Studio button for workflow start", () => {
  const html = renderToStaticMarkup(
   <BrainWorkflowRunPanel
    recommendation={{ id: "recommendation-1", title: "Prepare a release", goal: "Create a reviewable package", reason: "The package is ready for preparation", steps: [] }}
   />,
  )
  expect(html).toContain('data-vt-studio-button="true"')
  expect(html).toContain("Track action plan")
  expect(html).toContain("This tracker records your progress in this browser. It does not run tools, publish, or create canonical output records.")
  expect(html).not.toContain("Live run")
 })
})

describe("Brain workflow approval boundary", () => {
 const chain = { id: "chain-1", steps: [] } as unknown as WorkflowChain

 it("never activates a gated step when no governance approval callback exists", async () => {
  const updateStep = vi.fn()
  const result = await requestWorkflowStepApproval({
   chain,
   stepId: "step-1",
   updateStep: updateStep as never,
  })
  expect(result).toBeNull()
  expect(updateStep).not.toHaveBeenCalled()
 })

 it("keeps a gated step pending when the governance service does not approve it", async () => {
  const updateStep = vi.fn()
  const onApprovalRequested = vi.fn(async () => false)
  const result = await requestWorkflowStepApproval({
   chain,
   stepId: "step-1",
   onApprovalRequested,
   updateStep: updateStep as never,
  })
  expect(onApprovalRequested).toHaveBeenCalledWith(chain, "step-1")
  expect(result).toBeNull()
  expect(updateStep).not.toHaveBeenCalled()
 })

 it("activates a gated step only after authoritative approval succeeds", async () => {
  const updated = { ...chain, steps: [{ id: "step-1", status: "active" }] } as unknown as WorkflowChain
  const updateStep = vi.fn(() => updated)
  const onApprovalRequested = vi.fn(async () => true)
  const onStatusChanged = vi.fn()
  const result = await requestWorkflowStepApproval({
   chain,
   stepId: "step-1",
   onApprovalRequested,
   updateStep: updateStep as never,
   onStatusChanged,
  })
  expect(result).toBe(updated)
  expect(updateStep).toHaveBeenCalledWith("chain-1", "step-1", "active")
  expect(onStatusChanged).toHaveBeenCalledWith(updated, "step-1", "active")
 })
})
