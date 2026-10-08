import { describe, expect, it } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(process.cwd())

describe("canonical primitive CSS ownership", () => {
  it("has one production primitive stylesheet authority", () => {
    const legacyDefaults = resolve(root, "src/styles/canonical-component-defaults.css")
    const primitiveCss = readFileSync(resolve(root, "src/styles/subtoolbox-system.css"), "utf8")
    const indexCss = readFileSync(resolve(root, "src/index.css"), "utf8")

    expect(existsSync(legacyDefaults)).toBe(false)
    expect(indexCss).not.toContain('./styles/canonical-component-defaults.css')
    expect(indexCss).not.toContain('./styles/subtoolbox-system.css')
    expect(indexCss).toContain('./styles/toolbox-entry.css')
    expect(primitiveCss).toContain("--vt-control-weight:1000")
    expect(primitiveCss).toContain("--vt-size-xs:20px")
    expect(primitiveCss).toContain("height:var(--vt-control-height,var(--vt-subtoolbox-control-standard,44px))")
    expect(primitiveCss).toContain("padding:0 12px")
    expect(primitiveCss).not.toContain("padding:10px 12px")
    const splitCss = readFileSync(resolve(root, "src/styles/subtoolbox-split-primitives.css"), "utf8")
    expect(splitCss).toContain("height: var(--vt-control-height,var(--vt-subtoolbox-control-standard,44px));")
    expect(splitCss).not.toContain("var(--vt-subtoolbox-control-standard, 48px)")

  })
})