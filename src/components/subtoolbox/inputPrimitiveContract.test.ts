import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8")

describe("canonical Studio Hub input primitives", () => {
  it("defines plain input and textarea as primitives 20 and 21", () => {
    const primitives = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    expect(primitives).toContain('data-vt-primitive-id="20"')
    expect(primitives).toContain('data-vt-primitive-id="21"')
    expect(primitives).toContain("export const SubToolboxInput20")
    expect(primitives).toContain("export const SubToolboxTextArea21")
  })

  it("composes floating label primitives 137 and 138 from 20 and 21", () => {
    const primitives = read("src/components/subtoolbox/SubToolboxPrimitives.tsx")
    expect(primitives).toContain('data-vt-primitive-id="137"')
    expect(primitives).toContain('data-vt-primitive-id="138"')
    expect(primitives).toContain("<SubToolboxInput20")
    expect(primitives).toContain("<SubToolboxTextArea21")
  })

  it("keeps canonical input shadows off and exposes the compact location-sized variants", () => {
    const styles = read("src/styles/subtoolbox-system.css")
    expect(styles).toContain(".vt-subtoolbox-input.is-compact{height:32px;min-height:32px")
    expect(styles).toContain(".vt-subtoolbox-textarea.is-compact{height:auto;min-height:72px")
    expect(styles).toContain("box-shadow:none!important")
  })

  it("routes Studio facades and the component library through canonical sources", () => {
    const controls = read("src/studio-ui/primitives/StudioControls.tsx")
    const library = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    expect(controls).toContain("SubToolboxInput20")
    expect(controls).toContain("SubToolboxTextArea21")
    for (const id of ["20 Plain Input", "21 Plain Text Area", "137 Floating Label Input", "138 Floating Label Text Area"]) {
      expect(library).toContain(id)
    }
  })
})
