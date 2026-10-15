import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("confirmed split stepper primitive family", () => {
  it("renders the canonical stepper in the confirmed library at standard and compact sizes", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")

    expect(catalog).toContain('import { SubToolboxSplitStepper } from "../subtoolbox/SubToolboxSplitStepper"')
    expect(catalog).toContain('title="Split Stepper · 44px + 28px"')
    expect(catalog).toContain('size="standard"')
    expect(catalog).toContain('size="compact"')
    expect(catalog).toContain('data-vt-library-component="SubToolboxSplitStepper"')
    expect(catalog).toContain("<ConfirmedStepperFamily />")
  })

  it("uses the confirmed Studio Controls dimensions and typography for both sizes", () => {
    const css = source("src/components/subtoolbox/subtoolbox-split-stepper.css")

    expect(css).toContain("--vt-studio-28-height, 28px")
    expect(css).toContain("--vt-studio-44-height, 44px")
    expect(css).toContain("--vt-studio-28-stroke, 2px")
    expect(css).toContain("--vt-studio-44-stroke, 3px")
    expect(css).toContain("--vt-studio-28-radius, 4px")
    expect(css).toContain("--vt-studio-44-radius, 6px")
    expect(css).toContain("--vt-stepper-font-size: 24px")
    expect(css).toContain("--vt-stepper-font-size: 38px")
  })

  it("supports pointer hold repeat and keyboard activation without double-stepping pointer clicks", () => {
    const component = source("src/components/subtoolbox/SubToolboxSplitStepper.tsx")

    expect(component).toContain("setTimeout(scheduleRepeat, 360)")
    expect(component).toContain("event.detail === 0")
    expect(component).toContain("onPointerUp={stopHold}")
    expect(component).toContain("onPointerCancel={stopHold}")
    expect(component).not.toContain("\\n  valueRef.current")
  })
})
