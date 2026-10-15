import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { getToolboxPaletteColors, VT_SPECTRUM_PALETTE_06 } from "../../styles/toolboxPalette"
import { RESOURCE_LIBRARY_ENTRIES } from "./resourceLibraryRegistry"

const stylesheet = readFileSync(new URL("./resource-library.css", import.meta.url), "utf8")
const component = readFileSync(new URL("./ResourceLibrary.tsx", import.meta.url), "utf8")
const renderer = readFileSync(new URL("./ResourceDocumentRenderer.tsx", import.meta.url), "utf8")

describe("Resource Library canonical palette contract", () => {
  it("uses the canonical twelve-slot ViewTube spectrum", () => {
    expect(VT_SPECTRUM_PALETTE_06).toHaveLength(12)
    expect(new Set(VT_SPECTRUM_PALETTE_06).size).toBe(12)
  })

  it("resolves each resource pair using the shared Toolbox header/icon order", () => {
    for (const index of Array.from({ length: 12 }, (_, value) => value)) {
      const pair = getToolboxPaletteColors(index)
      expect(pair.header).toBe(VT_SPECTRUM_PALETTE_06[index])
      expect(pair.icon).toBe(VT_SPECTRUM_PALETTE_06[(index + 4) % 12])
    }
  })

  it("keeps every registry accent index inside the canonical spectrum", () => {
    for (const resource of RESOURCE_LIBRARY_ENTRIES) {
      expect(Number.isInteger(resource.accentPaletteIndex)).toBe(true)
      expect(resource.accentPaletteIndex).toBeGreaterThanOrEqual(0)
      expect(resource.accentPaletteIndex).toBeLessThan(VT_SPECTRUM_PALETTE_06.length)
    }
  })

  it("injects the canonical spectrum and uses shared pair resolution in the UI", () => {
    expect(component).toContain('import { VT_SPECTRUM_PALETTE_06, getToolboxPaletteColors } from "../../styles/toolboxPalette"')
    expect(component).toContain("VT_SPECTRUM_PALETTE_06.map")
    expect(component).toContain("getResourcePaletteStyle(resource.accentPaletteIndex)")
    expect(component).toContain('paletteIndex={8}')
    expect(component).toContain("`--vt-spectrum-${index}`")
  })

  it("gives all fifteen resources a practical exercise and explicit evidence boundary", () => {
    expect(RESOURCE_LIBRARY_ENTRIES).toHaveLength(15)
    for (const resource of RESOURCE_LIBRARY_ENTRIES) {
      expect(resource.markdown, resource.id).toContain("## Field Exercise:")
      expect(resource.markdown, resource.id).toContain("## Evidence Boundary:")
    }
  })

  it("renders six explicit quote/evidence semantics with visible text labels", () => {
    for (const label of [
      "Direct quotation",
      "Platform guidance",
      "Evidence",
      "Creator takeaway",
      "Caution",
      "Unknown",
    ]) {
      expect(renderer).toContain(label)
    }
    expect(renderer).toContain("RESOURCE_QUOTE_PALETTE_SLOT")
    expect(renderer).toContain("var(--vt-spectrum-${accent})")
    expect(renderer).toContain('return { kind: "note", body: value }')
    expect(renderer).not.toContain('normalized.includes("officially documented")')
  })

  it("does not define a second hard-coded spectrum in the resource stylesheet", () => {
    const hexValues = [...stylesheet.matchAll(/#[0-9a-f]{6}/gi)].map(([hex]) => hex.toLowerCase())
    expect(hexValues.every((hex) => ["#192033", "#fffef8", "#f2f4f7", "#eef1f4", "#f7f8fa", "#eef0f4"].includes(hex))).toBe(true)
    expect(stylesheet).toContain("var(--vt-spectrum-7)")
    expect(stylesheet).toContain("var(--vt-spectrum-9)")
    expect(stylesheet).toContain("var(--vt-resource-pair-primary")
    expect(stylesheet).toContain("var(--vt-resource-pair-secondary")
  })
})
