import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("Studio Hub primitive visual rules", () => {
  it("groups related variants into shared subtoolbox groups", () => {
    const source = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    expect(source).toContain("STUDIO_HUB_PRIMITIVE_GROUPS")
    expect(source).toContain('label: "Buttons"')
    expect(source).toContain('label: "Switches, Toggles & Binary Controls"')
    expect(source).toContain('label: "Tooltips"')
    expect(source).toContain('"Primary Button"')
    expect(source).toContain('"Disabled Button"')
    expect(source).toContain('"Tooltip Dark"')
    expect(source).toContain('"Tooltip Color"')
  })

  it("uses the four-size ladder while preserving 65 structural levels", () => {
    const source = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    const css = read("src/components/studio-hub/studio-hub-primitive-migration-catalog.css")
    expect(source).toContain('{ size: "xs", level: "l2" }')
    expect(source).toContain('{ size: "s", level: "l2" }')
    expect(source).toContain('{ size: "m", level: "l1" }')
    expect(source).toContain('{ size: "l", level: "l0" }')
    expect(css).toContain(".vt-catalog-demo.is-l0")
    expect(css).toContain("--h:56px")
    expect(css).toContain("--fs:24px")
  })

  it("uses enlarged square icons and split-region centering", () => {
    const css = read("src/components/studio-hub/studio-hub-primitive-migration-catalog.css")
    expect(css).toContain(".vt-catalog-icon-button svg")
    expect(css).toContain("width:68%")
    expect(css).toContain("height:68%")
    expect(css).toContain(".vt-catalog-split-primitive")
    expect(css).toContain("place-items:center")
  })

  it("animates selectable tags between plus and X with reduced-motion support", () => {
    const css = read("src/styles/canonical-component-defaults.css")
    expect(css).toContain(".vt-subtoolbox-selectable-tag > span:first-child")
    expect(css).toContain("transform:rotate(180deg)")
    expect(css).toContain("@keyframes vt-selectable-tag-spin")
    expect(css).toContain("prefers-reduced-motion:reduce")
  })

  it("assigns the requested families one canonical size and groups catalog rows by size", () => {
    const source = read("src/components/studio-hub/StudioHubPrimitiveMigrationCatalog.tsx")
    expect(source).toContain("STUDIO_HUB_SINGLE_SIZE_FAMILIES")
    expect(source).toContain('"Upload Frame · Variant": "l"')
    expect(source).toContain('"Stat Card": "m"')
    expect(source).toContain('"Dialog": "l"')
    expect(source).toContain('"XY Joystick": "m"')
    expect(source).toContain("data-vt-catalog-size-lane")
    expect(source).toContain("getFamilyCatalogSizes")
  })
})
