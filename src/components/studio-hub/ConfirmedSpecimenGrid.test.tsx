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
    expect(container.querySelector("button:not([role='switch'])")?.textContent).not.toContain("Documentation action")
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

  it("keeps the requested two-column composition without a stacking breakpoint", () => {
    const css = readFileSync(resolve(process.cwd(), "src/components/studio-hub/ConfirmedSpecimenGrid.css"), "utf8")
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))")
    expect(css).not.toMatch(/@media[^{]*max-width/)
  })
})
