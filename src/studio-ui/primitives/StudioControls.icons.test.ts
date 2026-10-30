import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const source = readFileSync(resolve(process.cwd(), "src/studio-ui/primitives/StudioControls.tsx"), "utf8")

describe("Studio square icon preset bindings", () => {
  it("declares every Lucide icon used by the square-button preset renderer in the module imports", () => {
    const imports = source.split("\n").filter((line) => line.includes('from "lucide-react"')).join("\n")
    expect(imports).toContain("Heart as HeartIcon")
    expect(imports).toContain("Bell")
    expect(imports).toContain("Check")
    expect(imports).toContain("Download")
    expect(imports).toContain("RefreshCw")
    expect(imports).toContain("ThumbsUp")
    expect(source).toContain('case "heart": return { icon: <HeartIcon />, activeIcon: <HeartIcon /> }')
    expect(source).not.toContain("<Heart />")
  })

  it("keeps icon and palette imports at the module header before primitive declarations", () => {
    const firstDeclaration = source.indexOf("/** Canonical numeric field")
    const iconImport = source.indexOf('from "lucide-react"')
    const paletteImport = source.indexOf('from "../../styles/toolboxPalette"')
    expect(iconImport).toBeGreaterThanOrEqual(0)
    expect(paletteImport).toBeGreaterThanOrEqual(0)
    expect(iconImport).toBeLessThan(firstDeclaration)
    expect(paletteImport).toBeLessThan(firstDeclaration)
  })
})
