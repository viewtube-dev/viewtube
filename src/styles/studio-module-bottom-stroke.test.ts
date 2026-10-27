import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("Studio split-module bottom-stroke regression", () => {
  it("keeps the collapsing split-module shell border visible", () => {
    const css = source("src/styles/studio-control-system.css")

    expect(css).toContain("details.vt-studio-collapsing-split-module {")
    expect(css).toContain("border-bottom: var(--vt-top-split-stroke, 3px) solid #000 !important;")
  })

  it("reserves header border space and draws the expanded separator without layout movement", () => {
    const css = source("src/styles/studio-control-system.css")

    expect(css).toContain("border-bottom: var(--vt-top-split-stroke, 3px) solid transparent !important;")
    expect(css).toContain("padding-bottom: 0 !important;")
    expect(css).toContain("details.vt-studio-collapsing-split-module[open] > summary.vt-studio-collapsing-split-module__head")
    expect(css).toContain("box-shadow: inset 0 calc(-1 * var(--vt-top-split-stroke, 3px)) 0 #000 !important;")
    expect(css).toContain("details.vt-studio-collapsing-split-module:not([open]) > summary.vt-studio-collapsing-split-module__head")
  })

  it("covers the non-collapsing top split-module header too", () => {
    const css = source("src/styles/studio-control-system.css")
    const controls = source("src/studio-ui/primitives/StudioControls.tsx")

    expect(css).toContain(".vt-studio-top-split-module > .vt-studio-top-split-module__head")
    expect(css).toContain('.vt-studio-top-split-module[data-open="false"] > .vt-studio-top-split-module__head')
    expect(controls).toContain("vt-studio-collapsing-split-module__head")
    expect(controls).toContain("vt-studio-top-split-module__head")
  })
})
