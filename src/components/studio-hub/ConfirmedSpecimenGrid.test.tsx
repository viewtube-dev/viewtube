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
    expect(document.querySelectorAll(".vt-specimen-row--4")).toHaveLength(2)
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

  it("renders Supreme and Micro comparison rows side-by-side in independent stacks", () => {
    const renderSpecimen = ({ id, tier }: { id: string; tier: string }) => (
      <output data-specimen-id={id} data-tier={tier}>{tier}</output>
    )
    render(
      <ConfirmedSpecimenGrid
        familyName="Button"
        renderSpecimen={renderSpecimen}
        specimenRows={[
          { id: "supreme-a", tier: "supreme", comparisonGroup: "supreme", specimens: [{ id: "s1", label: "BUTTON" }] },
          { id: "supreme-b", tier: "supreme", comparisonGroup: "supreme", specimens: [{ id: "s2", label: "BUTTON" }, { id: "s3", label: "BUTTON" }] },
          { id: "micro-a", tier: "micro", comparisonGroup: "micro", specimens: [{ id: "m1", label: "BUTTON" }] },
          { id: "micro-b", tier: "micro", comparisonGroup: "micro", specimens: [{ id: "m2", label: "BUTTON" }, { id: "m3", label: "BUTTON" }] },
          { id: "micro-c", tier: "micro", comparisonGroup: "micro", specimens: [{ id: "m4", label: "BUTTON" }, { id: "m5", label: "BUTTON" }, { id: "m6", label: "BUTTON" }] },
          { id: "micro-d", tier: "micro", comparisonGroup: "micro", specimens: [{ id: "m7", label: "BUTTON" }, { id: "m8", label: "BUTTON" }, { id: "m9", label: "BUTTON" }, { id: "m10", label: "BUTTON" }] },
        ]}
      />,
    )
    const comparison = document.querySelector(".vt-specimen-size-comparison")
    expect(comparison).toBeTruthy()
    expect(comparison?.querySelectorAll(".vt-specimen-comparison-column--supreme .vt-specimen-row")).toHaveLength(2)
    expect(comparison?.querySelectorAll(".vt-specimen-comparison-column--micro .vt-specimen-row")).toHaveLength(4)
    expect(comparison?.querySelectorAll('[data-specimen-id^="s"]')).toHaveLength(3)
    expect(comparison?.querySelectorAll('[data-specimen-id^="m"]')).toHaveLength(10)
  })

  it("keeps the requested two-column composition without a stacking breakpoint", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components/studio-hub/ConfirmedSpecimenGrid.css"), "utf8")
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))")
    expect(css).not.toMatch(/@media[^{]*max-width/)
  })
})
