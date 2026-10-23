import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const component = readFileSync(new URL("./StudioDisclosureSummary.tsx", import.meta.url), "utf8")
const styles = readFileSync(new URL("../../styles/studio-disclosure-summary.css", import.meta.url), "utf8")
const exports = readFileSync(new URL("../index.ts", import.meta.url), "utf8")

describe("StudioDisclosureSummary", () => {
  it("exports a native summary primitive with explicit Studio size semantics", () => {
    expect(component).toContain("<summary")
    expect(component).toContain('data-vt-studio-disclosure-summary="true"')
    expect(component).toContain('data-vt-studio-control="true"')
    expect(component).toContain('sizeVariant?: "compact" | "standard"')
    expect(exports).toContain("StudioDisclosureSummary")
  })

  it("styles native disclosure triggers without movement or shadows", () => {
    expect(styles).toContain(".vt-studio-disclosure-summary")
    expect(styles).toContain(":focus-visible")
    expect(styles).toContain("--pair-a")
    expect(styles).not.toContain("box-shadow")
    expect(styles).not.toContain("transform:")
    expect(styles).toContain("list-style: none")
  })
})
