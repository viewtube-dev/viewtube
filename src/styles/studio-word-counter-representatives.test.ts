import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8")

describe("Studio left word counter sizing and confirmed representatives", () => {
  it("inherits the same size-specific typography as the numeric left counter", () => {
    const wordCss = source("src/styles/studio-control-word-counter.css")
    const controlCss = source("src/styles/studio-control-system.css")

    expect(wordCss).not.toContain(".vt-studio-left-word-counter .vt-studio-side-counter__value {\n  font-size:")
    expect(controlCss).toContain(".vt-studio-side-counter__value {")
    expect(controlCss).toContain("font-size: var(--vt-studio-control-font-size, 38px);")
    expect(controlCss).toContain('.vt-studio-left-counter[data-size="compact"] .vt-studio-side-counter__value')
    expect(controlCss).toContain('.vt-studio-left-counter[data-size="micro"] .vt-studio-side-counter__value')
  })

  it("keeps one standard-size component-grid specimen in the representatives section", () => {
    const catalog = source("src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx")
    const start = catalog.indexOf('data-vt-confirmed-representatives="true"')
    const end = catalog.indexOf("\n      </div>", start)
    const representatives = catalog.slice(start, end)

    expect(representatives).toContain('data-vt-library-component="StudioComponentGrid:standard"')
    expect(representatives).not.toContain('data-vt-library-component={`StudioComponentGrid:${size}`}')
    expect(representatives).not.toContain('(["supreme", "standard", "compact", "mini", "micro"] as const).map')
    expect(representatives).toContain('size="standard"')
  })
})
