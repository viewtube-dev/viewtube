import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const catalog = readFileSync(resolve(process.cwd(), "src/components/studio-hub/StudioHubConfirmedPrimitiveCatalog.tsx"), "utf8")
const start = catalog.indexOf("const ConfirmedDirectPrimitiveRows")
const end = catalog.indexOf("\nconst ConfirmedStudioCounterFamily", start)
const representatives = catalog.slice(start, end)

describe("confirmed primitive representatives", () => {
  it("gives every direct production representative its own full-width primitive module", () => {
    const names = [...representatives.matchAll(/data-vt-library-component="([^"]+)"/g)].map((match) => match[1])
    expect(names.length).toBe(60)
    expect(new Set(names).size).toBe(names.length)

    for (const name of names) {
      const specimen = representatives.indexOf(`data-vt-library-component="${name}"`)
      const moduleStart = representatives.lastIndexOf("<Family title=", specimen)
      const moduleEnd = representatives.indexOf("</Family>", moduleStart)
      expect(moduleStart, `${name} has an owning module`).toBeGreaterThanOrEqual(0)
      expect(moduleEnd, `${name} is contained by its own module`).toBeGreaterThan(specimen)
      expect(representatives.slice(moduleStart, moduleEnd)).toContain(`primitive=${JSON.stringify(name)}`)
    }
  })

  it("includes both canonical stepper primitives with their supported standard and compact sizes", () => {
    expect(representatives).toContain('title="Studio Inline Stepper · Standard + Compact"')
    expect(representatives).toContain('title="Studio Split Stepper · Standard + Compact"')
    expect(representatives).toContain('data-vt-library-component="StudioInlineStepper"')
    expect(representatives).toContain('data-vt-library-component="StudioSplitStepper"')
    expect(representatives).toContain('aria-label="Standard inline stepper"')
    expect(representatives).toContain('aria-label="Compact inline stepper"')
    expect(representatives).toContain('aria-label="Standard split stepper"')
    expect(representatives).toContain('aria-label="Compact split stepper"')
  })

  it("keeps the representatives section separate from the detailed family modules", () => {
    expect(representatives).toContain('title="Direct Imported Primitive Representatives · Standard"')
    expect(representatives).toContain('aria-label="Canonical primitive representatives"')
    expect(representatives).not.toContain("<h4 className=\"vt-confirmed-representative-heading\">")
  })
})
