import { readFile } from "node:fs/promises"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFile(new URL(path, import.meta.url), "utf8")

describe("crash regression diagnostics contracts", () => {
  it("keeps the missing Studio composer import regression guarded", async () => {
    const catalogPaths = [
      "../../src/studio-ui/ConfirmedPrimitiveCatalog.tsx",
      "../../src/studio-ui/ConfirmedPrimitiveCatalog.ts",
      "../../src/components/ConfirmedPrimitiveCatalog.tsx",
      "../../src/components/ConfirmedPrimitiveCatalog.ts",
    ]
    const contents = await Promise.all(catalogPaths.map(async (path) => {
      try { return await read(path) } catch { return "" }
    }))
    const catalog = contents.join("\n")
    expect(catalog, "Confirmed Primitive Catalog source should be discoverable").not.toBe("")
    expect(catalog).toMatch(/StudioChatComposerDock/)
    expect(catalog).toMatch(/import\s*\{[^}]*StudioChatComposerDock[^}]*\}\s*from|import\s+StudioChatComposerDock\s+from/)
  })

  it("keeps the removed duplicate stylesheet out of active imports", async () => {
    const paths = [
      "../../src/main.tsx",
      "../../src/main.ts",
      "../../src/App.tsx",
      "../../src/App.ts",
      "../../src/styles/index.css",
      "../../src/styles/studio-control-system.css",
    ]
    const contents = await Promise.all(paths.map(async (path) => {
      try { return [path, await read(path)] as const } catch { return [path, ""] as const }
    }))
    const activeSources = contents.filter(([, content]) => content.length > 0)
    expect(activeSources.length, "At least one active app/style entry point should be discoverable").toBeGreaterThan(0)
    for (const [path, content] of activeSources) {
      expect(content, `${path} must not import the deleted studio-control-system-2.css`)
        .not.toMatch(/(?:from\s*|import\s*\()\s*["'][^"']*studio-control-system-2\.css["']/)
    }
  })

  it("keeps diagnostics regression checks in the focused CI contract", async () => {
    const packageJson = JSON.parse(await read("../../package.json")) as { scripts?: Record<string, string> }
    const workflow = await read("../../.github/workflows/release-gates.yml")
    expect(packageJson.scripts?.["test:focused"]).toContain("src/services/diagnostics.test.ts")
    expect(workflow).toContain("npm run test:focused")
    expect(workflow).toContain("npm run build")
    expect(workflow).toContain("npm run smoke:local")
  })
})
