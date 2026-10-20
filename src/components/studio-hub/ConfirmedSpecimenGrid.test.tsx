import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ConfirmedSpecimenGrid } from "./ConfirmedSpecimenGrid"

describe("ConfirmedSpecimenGrid", () => {
  it("renders the reference specimen tiers and composition layouts", () => {
    const renderSpecimen = vi.fn(({ id, tier, label }) => (
      <output data-specimen-id={id} data-tier={tier}>{label}</output>
    ))
    render(<ConfirmedSpecimenGrid familyName="Button" renderSpecimen={renderSpecimen} documentation={<p>Family docs</p>} />)

    expect(screen.getByRole("region", { name: "Button" })).toHaveAttribute("data-view", "reference")
    expect(screen.getByText("Family docs")).toBeInTheDocument()
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
    expect(toggle).toHaveAttribute("aria-checked", "false")
    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("region", { name: "Input" })).toHaveAttribute("data-view", "clean")
    expect(screen.queryByRole("button", { name: "Documentation action" })).not.toBeInTheDocument()
    expect(document.querySelectorAll(".vt-specimen-row--3")).toHaveLength(1)
    expect(document.querySelectorAll(".vt-specimen-row--4")).toHaveLength(1)
  })

  it("keeps the requested two-column composition at narrow widths without a stacking breakpoint", () => {
    const css = require("node:fs").readFileSync(
      require("node:path").resolve(process.cwd(), "src/components/studio-hub/ConfirmedSpecimenGrid.css"),
      "utf8",
    )
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))")
    expect(css).not.toMatch(/@media[^{]*max-width/)
  })
})
