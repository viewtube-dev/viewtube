import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { resolveVaultMediaCapabilities } from "./capabilities"
import { VaultAdaptiveWorkbenchHost } from "./VaultAdaptiveWorkbenchHost"

describe("VaultAdaptiveWorkbenchHost", () => {
  it("shows contextual capabilities and selection count", () => {
    render(<VaultAdaptiveWorkbenchHost capabilities={resolveVaultMediaCapabilities({ kinds: ["image"] })} selectionCount={1} />)
    expect(screen.getByLabelText("Adaptive Vault Workbench")).toBeTruthy()
    expect(screen.getByText("1 selected")).toBeTruthy()
    expect(screen.getByText("Lineage")).toBeTruthy()
  })
  it("changes modes and filters actions through the shared registry", () => {
    render(<VaultAdaptiveWorkbenchHost capabilities={resolveVaultMediaCapabilities({ kinds: ["image"] })} selectionCount={1} />)
    fireEvent.click(screen.getByRole("tab", { name: "Edit" }))
    expect(screen.getByText("Image Workbench")).toBeTruthy()
    expect(screen.getByText("Edit metadata")).toBeTruthy()
    expect(screen.queryByText("Send To")).toBeNull()
  })
  it("shows unavailable processing as unavailable until a processor is connected", () => {
    render(<VaultAdaptiveWorkbenchHost capabilities={resolveVaultMediaCapabilities({ kinds: ["video"] })} selectionCount={1} />)
    fireEvent.click(screen.getByRole("tab", { name: "Process" }))
    expect(screen.getByLabelText(/Video operations unavailable/)).toBeTruthy()
  })
})
