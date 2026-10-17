import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")
const controlStyles = [
  "src/styles/studio-control-system.css",
  "src/styles/studio-control-core.css",
  "src/styles/studio-control-split.css",
  "src/styles/studio-control-fields.css",
  "src/styles/studio-control-motion.css",
].map(read).join("\n")

describe("canonical Studio text-field primitives", () => {
  it("defines native text input and textarea through their dedicated primitives", () => {
    const input = read("src/studio-ui/primitives/StudioTextInput.tsx")
    const area = read("src/studio-ui/primitives/StudioTextArea.tsx")
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")

    expect(input).toContain("export const StudioTextInput = React.forwardRef")
    expect(area).toContain("export const StudioTextArea = React.forwardRef")
    expect(input).toContain('data-vt-studio-control="true"')
    expect(area).toContain('data-vt-studio-control="true"')
    expect(input).toContain("data-size={size}")
    expect(area).toContain("data-size={size}")
    expect(controls).toContain('export { StudioTextInput, StudioInput, StudioSearchInput, StudioNumberInput }')
    expect(controls).toContain('export { StudioTextArea }')
  })

  it("composes simple, floating-label, and fixed-label variants from the same primitives", () => {
    const input = read("src/studio-ui/primitives/StudioTextInput.tsx")
    const area = read("src/studio-ui/primitives/StudioTextArea.tsx")
    const catalog = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")

    for (const variant of ['"floating-label"', '"fixed-label"']) {
      expect(input).toContain(variant)
      expect(area).toContain(variant)
    }
    expect(input).toContain("vt-studio-floating-field")
    expect(input).toContain("vt-studio-fixed-label-field")
    expect(area).toContain("vt-studio-floating-field")
    expect(area).toContain("vt-studio-fixed-label-field")
    expect(catalog).toContain('<StudioTextInput variant="floating-label"')
    expect(catalog).toContain('<StudioTextArea variant="floating-label"')
    for (const family of ["20 Plain Input", "21 Plain Text Area", "137 Floating Label Input", "138 Floating Label Text Area"]) {
      expect(catalog).toContain(family)
    }
  })

  it("uses the global Studio typography, stroke tokens, and reduced-motion contract", () => {
    expect(controlStyles).toContain("--vt-studio-control-font-family")
    expect(controlStyles).toContain("--vt-studio-control-text-stroke")
    expect(controlStyles).toContain("-webkit-text-stroke")
    expect(controlStyles).toContain(".vt-studio-floating-field")
    expect(controlStyles).toContain(".vt-studio-fixed-label-field")
    expect(controlStyles).toContain("@media (prefers-reduced-motion: reduce)")
    expect(controlStyles).toContain("transition: none !important")
    expect(controlStyles).toContain("box-shadow: inset")
    const fields = read("src/styles/studio-control-fields.css")
    expect(fields).toContain("box-shadow: inset 0 0 0 var(--vt-studio-control-stroke, 3px) var(--vt-field-primary);")
  })

  it("keeps Studio facades pointed at the canonical input implementations", () => {
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const index = read("src/studio-ui/index.ts")
    expect(controls).toContain("StudioInput = StudioTextInput")
    expect(controls).toContain("Studioarea = StudioTextArea")
    expect(index).toContain("StudioTextInput")
    expect(index).toContain("StudioTextArea")
    expect(input).not.toContain("sizeClass(")
    expect(area).not.toContain("sizeClass(")
  })
})
