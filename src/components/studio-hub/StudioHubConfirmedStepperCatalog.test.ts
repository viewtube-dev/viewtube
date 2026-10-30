import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("confirmed canonical split stepper representative", () => {
  it("renders the production StudioSplitStepper in standard and compact sizes", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")

    expect(catalog).toContain('title="Studio Split Stepper · Standard + Compact"')
    expect(catalog).toContain('data-vt-library-component="StudioSplitStepper"')
    expect(catalog).toContain('aria-label="Standard split stepper"')
    expect(catalog).toContain('aria-label="Compact split stepper"')
    expect(catalog).toContain("<StudioSplitStepper")
    expect(catalog).not.toContain("SubToolboxSplitStepper")
  })

  it("uses the canonical five-tier Studio Controls source and shared split-stepper implementation", () => {
    const controls = source("src/studio-ui/primitives/StudioControls.tsx")
    const styles = source("src/styles/studio-control-split.css")

    expect(controls).toContain('export interface StudioSplitStepperProps')
    expect(controls).toContain('className={studioClasses("vt-studio-split-stepper"')
    expect(controls).toContain('data-vt-studio-control-kind="split-stepper"')
    expect(styles).toContain(".vt-studio-split-stepper")
    expect(styles).toContain("--vt-studio-split-rail-size")
  })
})
