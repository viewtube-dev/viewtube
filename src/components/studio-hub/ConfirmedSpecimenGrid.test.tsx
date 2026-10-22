import React, { act } from "react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { ConfirmedSpecimenGrid } from "./ConfirmedSpecimenGrid"

let mountedRoot: Root | null = null
let mountedContainer: HTMLDivElement | null = null

function render(node: React.ReactNode): HTMLDivElement {
  mountedContainer = document.createElement("div")
  document.body.appendChild(mountedContainer)
  mountedRoot = createRoot(mountedContainer)
  act(() => mountedRoot?.render(node))
  return mountedContainer
}

afterEach(() => {
  if (mountedRoot) act(() => mountedRoot?.unmount())
  mountedRoot = null
  mountedContainer?.remove()
  mountedContainer = null
})

describe("ConfirmedSpecimenGrid", () => {
  it("renders the reference specimen tiers and composition layouts", () => {
    const renderSpecimen = vi.fn(({ id, tier, label }: { id: string; tier: string; label: string }) => (
      <output data-specimen-id={id} data-tier={tier}>{label}</output>
    ))
    const container = render(<ConfirmedSpecimenGrid familyName="Button" renderSpecimen={renderSpecimen} documentation={<p>Family docs</p>} />)

    expect(container.querySelector('[role="region"][aria-label="Button"]')?.getAttribute("data-view")).toBe("reference")
    expect(container.textContent).toContain("Family docs")
    for (const tier of ["supreme", "standard", "compact", "micro"]) {
      expect(renderSpecimen.mock.calls.some(([request]) => request.tier === tier)).toBe(true)
    }
    expect(container.querySelectorAll(".vt-specimen-row--4")).toHaveLength(4)
  })

  it("toggles clean mode with an accessible, controlled switch and unmounts documentation", () => {
    const renderSpecimen = ({ id, tier, label }: { id: string; tier: string; label: string }) => (
      <output data-specimen-id={id} data-tier={tier}>{label}</output>
    )
    const container = render(<ConfirmedSpecimenGrid familyName="Input" renderSpecimen={renderSpecimen} documentation={<button>Documentation action</button>} />)

    const toggle = container.querySelector<HTMLButtonElement>('[role="switch"][aria-label="Clean composition view for Input"]')
    expect(toggle?.getAttribute("aria-checked")).toBe("false")
    act(() => toggle?.dispatchEvent(new MouseEvent("click", { bubbles: true })))

    expect(toggle?.getAttribute("aria-checked")).toBe("true")
    expect(container.querySelector('[role="region"][aria-label="Input"]')?.getAttribute("data-view")).toBe("clean")
    expect(container.textContent).not.toContain("Documentation action")
    expect(container.querySelectorAll(".vt-specimen-row--3")).toHaveLength(4)
    expect(container.querySelectorAll(".vt-specimen-row--4")).toHaveLength(4)
  })

  it("renders Supreme and Micro comparison rows side-by-side in independent stacks", () => {
    const renderSpecimen = ({ id, tier }: { id: string; tier: string }) => (
      <output data-specimen-id={id} data-tier={tier}>{tier}</output>
    )
    const container = render(
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
    const comparison = container.querySelector(".vt-specimen-size-comparison")
    expect(comparison).toBeTruthy()
    expect(comparison?.querySelectorAll(".vt-specimen-comparison-column--supreme .vt-specimen-row")).toHaveLength(2)
    expect(comparison?.querySelectorAll(".vt-specimen-comparison-column--micro .vt-specimen-row")).toHaveLength(4)
    expect(comparison?.querySelectorAll('[data-specimen-id^="s"]')).toHaveLength(3)
    expect(comparison?.querySelectorAll('[data-specimen-id^="m"]')).toHaveLength(10)
  })

  it("places Supreme, Standard, Compact, and Micro in four parallel size columns", () => {
    const renderSpecimen = ({ id, tier, label }: { id: string; tier: string; label: string }) => (
      <output data-specimen-id={id} data-tier={tier}>{label}</output>
    )
    const rows = (["supreme", "standard", "compact", "micro"] as const).flatMap((tier) => [
      { id: tier + "-full", tier, specimens: [{ id: tier + "-full-v1", label: "BUTTON" }] },
      { id: tier + "-halves", tier, specimens: [{ id: tier + "-half-v1", label: "BUTTON" }, { id: tier + "-half-v2", label: "BUTTON" }] },
      { id: tier + "-quarters", tier, specimens: [{ id: tier + "-q1", label: "BUTTON" }, { id: tier + "-q2", label: "BUTTON" }, { id: tier + "-q3", label: "BUTTON" }, { id: tier + "-q4", label: "BUTTON" }] },
    ])
    const container = render(<ConfirmedSpecimenGrid familyName="Button variants" renderSpecimen={renderSpecimen} specimenRows={rows} />)
    const grid = container.querySelector(".vt-specimen-tier-grid")
    expect(grid?.children).toHaveLength(4)
    for (const tier of ["supreme", "standard", "compact", "micro"]) {
      const column = grid?.querySelector(`[data-vt-specimen-tier-column="${tier}"]`)
      expect(column).toBeTruthy()
      expect(column?.querySelectorAll("[data-vt-specimen-row]")).toHaveLength(3)
      expect(column?.querySelectorAll("[data-specimen-id]")).toHaveLength(7)
    }
    expect(container.querySelectorAll(".vt-specimen-tier-column")).toHaveLength(4)
  })

  it("renders authored full-module proportional rows and the paired compact/micro half panels", () => {
    const renderSpecimen = ({ id, tier }: { id: string; tier: string }) => <output data-specimen-id={id} data-tier={tier}>{tier}</output>
    const layoutRows = [
      { id: "1-supreme-full", tier: "supreme" as const, specimens: [{ id: "s-full", label: "BUTTON", span: 144 }] },
      { id: "2-supreme-half", tier: "supreme" as const, specimens: [{ id: "s-half-a", label: "BUTTON", span: 72 }, { id: "s-half-b", label: "BUTTON", span: 72 }] },
      { id: "5-standard-fractions", tier: "standard" as const, specimens: [
        { id: "std-third", label: "BUTTON", span: 48 }, { id: "std-quarter", label: "BUTTON", span: 36 },
        { id: "std-sixth", label: "BUTTON", span: 24 }, { id: "std-eighth-a", label: "BUTTON", span: 18 },
        { id: "std-eighth-b", label: "BUTTON", span: 18 },
      ] },
      { id: "7-panels", panels: [
        { id: "compact-half", tier: "compact" as const, span: 72, rows: [{ id: "compact-row", tier: "compact" as const, specimens: [
          { id: "c-8a", label: "BUTTON", span: 36 }, { id: "c-8b", label: "BUTTON", span: 36 },
          { id: "c-8c", label: "BUTTON", span: 36 }, { id: "c-16a", label: "BUTTON", span: 18 },
          { id: "c-16b", label: "BUTTON", span: 18 },
        ] }] },
        { id: "micro-half", tier: "micro" as const, span: 72, rows: [
          { id: "micro-a", tier: "micro" as const, specimens: [{ id: "m-quarter-a", label: "BUTTON", span: 72 }, { id: "m-quarter-b", label: "BUTTON", span: 72 }] },
          { id: "micro-b", tier: "micro" as const, specimens: [
            { id: "m-eighth-a", label: "BUTTON", span: 36 }, { id: "m-eighth-b", label: "BUTTON", span: 36 },
            { id: "m-sixteenth-a", label: "BUTTON", span: 18 }, { id: "m-sixteenth-b", label: "BUTTON", span: 18 },
            { id: "m-sixteenth-c", label: "BUTTON", span: 18 }, { id: "m-sixteenth-d", label: "BUTTON", span: 18 },
          ] },
        ] },
      ] },
    ]
    const container = render(<ConfirmedSpecimenGrid familyName="Proportional Button Grid" renderSpecimen={renderSpecimen} layoutRows={layoutRows} />)
    const rows = container.querySelectorAll("[data-vt-layout-row]")
    expect(rows).toHaveLength(4)
    expect(container.querySelector('[data-vt-layout-row="1-supreme-full"] .vt-specimen-slot')?.getAttribute("data-vt-specimen-span")).toBe("144")
    expect(container.querySelectorAll('[data-vt-layout-row="2-supreme-half"] .vt-specimen-slot')).toHaveLength(2)
    expect(container.querySelector('[data-vt-specimen-panel="compact-half"]')?.getAttribute("style")).toContain("span 72")
    expect(container.querySelector('[data-vt-specimen-panel="micro-half"]')?.getAttribute("style")).toContain("span 72")
    expect(container.querySelectorAll('[data-specimen-id^="m-sixteenth"]')).toHaveLength(4)
  })

  it("keeps the requested two-column composition without a stacking breakpoint", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components/studio-hub/ConfirmedSpecimenGrid.css"), "utf8")
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))")
    expect(css).not.toMatch(/@media[^{]*max-width/)
  })
})
