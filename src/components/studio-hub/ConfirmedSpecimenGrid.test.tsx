import React from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ConfirmedSpecimenGrid } from "./ConfirmedSpecimenGrid"

describe("ConfirmedSpecimenGrid", () => {
  it("renders the reference specimen tiers and composition layouts", () => {
    const renderSpecimen = vi.fn(({ id, tier, label }: { id: string; tier: string; label: string }) => (
      <output data-specimen-id={id} data-tier={tier}>{label}</output>
    ))
    render(<ConfirmedSpecimenGrid familyName="Button" renderSpecimen={renderSpecimen} documentation={<p>Family docs</p>} />)

    expect(screen.getByRole("region", { name: "Button" }).getAttribute("data-view")).toBe("reference")
    expect(screen.getByText("Family docs")).toBeTruthy()
    expect(renderSpecimen).toHaveBeenCalledWith(expect.objectContaining({ tier: "supreme" }))
    expect(renderSpecimen).toHaveBeenCalledWith(expect.objectContaining({ tier: "standard" }))
    expect(renderSpecimen).toHaveBeenCalledWith(expect.objectContaining({ tier: "compact" }))
    expect(renderSpecimen).toHaveBeenCalledWith(expect.objectContaining({ tier: "micro" }))
    expect(document.querySelectorAll(".vt-specimen-row--4")).toHaveLength(3)
  })

  it("toggles clean mode with an accessible, controlled switch and unmounts documentation", () => {
    const renderSpecimen = ({ id, tier, label }: { id: string; tier: string; label: string }) => (
      <output data-specimen-id={id} data-tier={tier}>{label}</output>
    )
    render(<ConfirmedSpecimenGrid familyName="Input" renderSpecimen={renderSpecimen} documentation={<button>Documentation action</button>} />)

    const toggle = screen.getByRole("switch", { name: "Clean composition view for Input" })
    expect(toggle.getAttribute("aria-checked")).toBe("false")
    fireEvent.click(toggle)

    expect(toggle.getAttribute("aria-checked")).toBe("true")
    expect(screen.getByRole("region", { name: "Input" }).getAttribute("data-view")).toBe("clean")
    expect(screen.queryByRole("button", { name: "Documentation action" })).toBeNull()
    expect(document.querySelectorAll(".vt-specimen-row--3")).toHaveLength(1)
    expect(document.querySelectorAll(".vt-specimen-row--4")).toHaveLength(1)
  })

  it("keeps the requested two-column composition without a stacking breakpoint", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components/studio-hub/ConfirmedSpecimenGrid.css"), "utf8")
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))")
    expect(css).not.toMatch(/@media[^{]*max-width/)
  })
})
