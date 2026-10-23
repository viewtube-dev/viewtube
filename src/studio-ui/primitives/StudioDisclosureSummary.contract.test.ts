import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const component = readFileSync(new URL("./StudioDisclosureSummary.tsx", import.meta.url), "utf8")
const styles = readFileSync(new URL("../../styles/studio-disclosure-summary.css", import.meta.url), "utf8")
const exports = readFileSync(new URL("../index.ts", import.meta.url), "utf8")
const runtimePanel = readFileSync(new URL("../../components/brain/BrainRuntimePanel.tsx", import.meta.url), "utf8")
const evidenceDrawer = readFileSync(new URL("../../components/brain/BrainEvidenceDrawer.tsx", import.meta.url), "utf8")
const answerModules = readFileSync(new URL("../../components/brain/BrainAnswerModules.tsx", import.meta.url), "utf8")

describe("StudioDisclosureSummary", () => {
  it("exports a native summary primitive with explicit Studio size semantics", () => {
    expect(component).toContain("<summary")
    expect(component).toContain('data-vt-studio-disclosure-summary="true"')
    expect(component).toContain('data-vt-studio-control="true"')
    expect(component).toContain('sizeVariant?: "compact" | "standard"')
    expect(component).toContain('appearanceVariant?: "control" | "structured"')
    expect(exports).toContain("StudioDisclosureSummary")
  })

  it("styles native disclosure triggers without movement or shadows", () => {
    expect(styles).toContain(".vt-studio-disclosure-summary")
    expect(styles).toContain(":focus-visible")
    expect(styles).toContain("--pair-a")
    expect(styles).not.toContain("box-shadow")
    expect(styles).not.toContain("\n  transform:")
    expect(styles).toContain("list-style: none")
    expect(styles).toContain('[data-appearance="structured"]')
  })
})


describe("Brain disclosure consumers", () => {
  it("uses the shared summary primitive for runtime and evidence disclosures", () => {
    expect((runtimePanel.match(/<StudioDisclosureSummary\b/g) || []).length).toBe(3)
    expect(runtimePanel).not.toContain("<summary")
    expect((evidenceDrawer.match(/<StudioDisclosureSummary\b/g) || []).length).toBe(3)
    expect(evidenceDrawer).not.toContain("<summary")
    expect((answerModules.match(/<StudioDisclosureSummary\b/g) || []).length).toBe(1)
    expect(answerModules).toContain('appearanceVariant="structured"')
    expect(answerModules).not.toContain("<summary")
  })
})
