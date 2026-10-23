import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8")
const evidenceDrawer = read("./BrainEvidenceDrawer.tsx")
const runtimePanel = read("./BrainRuntimePanel.tsx")
const answerModules = read("./BrainAnswerModules.tsx")
const studioSplitCss = read("../../styles/studio-control-split.css")
const studioEntryCss = read("../../styles/studio-control-entry.css")

describe("Brain disclosure triggers use shared Studio chrome", () => {
  it("keeps evidence drawer disclosures native and migrates every summary trigger", () => {
    expect((evidenceDrawer.match(/<details\b/g) || []).length).toBeGreaterThan(0)
    expect((evidenceDrawer.match(/<summary\b/g) || []).length).toBe(3)
    expect((evidenceDrawer.match(/data-vt-studio-disclosure-summary="true"/g) || []).length).toBe(3)
    expect(evidenceDrawer).not.toContain("hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black")
  })

  it("uses compact and standard shared triggers for runtime lineage disclosures", () => {
    expect((runtimePanel.match(/<details\b/g) || []).length).toBe(3)
    expect((runtimePanel.match(/<summary\b/g) || []).length).toBe(3)
    expect((runtimePanel.match(/data-vt-studio-disclosure-summary="true"/g) || []).length).toBe(3)
    expect(runtimePanel).toContain('data-size="compact"')
    expect(runtimePanel).toContain('data-size="standard"')
  })


  it("uses the shared compact disclosure layout for structured answer modules", () => {
    const headerStart = answerModules.indexOf('<summary data-vt-studio-disclosure-summary="true" data-size="compact" data-layout="module"')
    const headerEnd = answerModules.indexOf('</summary>', headerStart)
    const header = answerModules.slice(headerStart, headerEnd)
    expect(headerStart).toBeGreaterThanOrEqual(0)
    expect(header).toContain('className="vt-studio-disclosure-summary"')
    expect(header).not.toContain('style={{ backgroundColor: accent }}')
    expect(header).not.toContain('truncate px-2.5 py-1.5')
  })

  it("keeps the shared skin on the existing Studio stylesheet entrypoint", () => {
    const disclosureSkin = studioSplitCss.slice(studioSplitCss.indexOf("/* Native disclosure triggers share Studio"))
    expect(studioEntryCss).toContain('@import "./studio-control-split.css";')
    expect(disclosureSkin).toContain(".vt-studio-disclosure-summary")
    expect(disclosureSkin).toContain("var(--pair-a")
    expect(disclosureSkin).toContain("var(--pair-b")
    expect(disclosureSkin).not.toContain("transition:")
  })
})
