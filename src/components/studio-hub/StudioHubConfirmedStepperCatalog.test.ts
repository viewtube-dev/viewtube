import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("confirmed split stepper primitive family", () => {
  it("renders the canonical stepper in the confirmed library at standard and compact sizes", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")

    expect(catalog).toContain("StudioSplitStepper,")
    expect(catalog).toContain('from "../../studio-ui/primitives/StudioControls"')
    expect(catalog).toContain('title="Split Stepper · 44px + 28px"')
    expect(catalog).toContain('size="standard"')
    expect(catalog).toContain('size="compact"')
    expect(catalog).toContain('data-vt-library-component="StudioSplitStepper"')
    expect(catalog).toContain("<ConfirmedStepperFamily />")
  })

  it("uses the confirmed Studio Controls dimensions and typography for both sizes", () => {
    const css = source("src/styles/studio-control-system.css")

    expect(css).toContain("--vt-studio-control-height")
    expect(css).toContain('data-height-variant="44"')
    expect(css).toContain('data-height-variant="28"')
    expect(css).toContain("--vt-studio-control-stroke")
    expect(css).toContain("--vt-studio-control-radius")
    expect(css).toContain("--vt-studio-control-radius")
    expect(css).toContain("--vt-stepper-font-size: 24px")
    expect(css).toContain("--vt-stepper-font-size: 38px")
  })

  it("supports pointer hold repeat and keyboard activation without double-stepping pointer clicks", () => {
    const component = source("src/studio-ui/primitives/StudioControls.tsx")

    expect(component).toContain("setTimeout(scheduleRepeat, 360)")
    expect(component).toContain("event.detail === 0")
    expect(component).toContain("onPointerUp={stopHold}")
    expect(component).toContain("onPointerCancel={stopHold}")
    expect(component).not.toContain("\\n  valueRef.current")
  })
})

describe("confirmed floating and fixed field-label variants", () => {
  it("shows standard floating-label examples followed by compact A/B rows for inputs and textareas", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")

    expect(catalog).toContain("Floating label · 44px standard · A")
    expect(catalog).toContain("Floating label · 28px compact · A")
    expect(catalog).toContain("Floating label · 28px compact · B · reverse colors")
    expect(catalog).toContain("Fixed label box · 28px compact · A")
    expect(catalog).toContain("Fixed label box · 28px compact · B · reverse colors")
    expect(catalog).toContain("Studio floating-label textarea compact B reverse colors")
    expect(catalog).toContain("Studio fixed-label textarea compact B reverse colors")
  })

  it("implements reverse pair colors and the compact B focus stroke for both native field types", () => {
    const css = source("src/styles/studio-control-system.css")
    const textArea = source("src/studio-ui/primitives/StudioTextArea.tsx")

    expect(css).toContain(".vt-studio-floating-field.is-reverse-colors")
    expect(css).toContain(".vt-studio-fixed-label-field.is-reverse-colors")
    expect(css).toContain('> :is(input, textarea)[data-size="compact"]:is(:focus, :focus-visible)')
    expect(textArea).toContain('floatingLabelVariant?: "a" | "b"')
    expect(textArea).toContain("data-vt-floating-variant={floatingLabelVariant}")
  })

  it("documents the non-default size, label, palette, focus, and textarea settings", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")

    expect(catalog).toContain("compact floating label B reverses the paired colors")
    expect(catalog).toContain("Compact fixed-label B reverses the label-box and field accent colors")
    expect(catalog).toContain("Textarea-only typography is 18px standard / 14px compact")
  })
})
