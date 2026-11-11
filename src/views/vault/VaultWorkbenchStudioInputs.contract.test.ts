import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const splitInput = readFileSync(new URL("../../studio-ui/primitives/StudioSplitTextInput.tsx", import.meta.url), "utf8")
const imageWorkbench = readFileSync(new URL("./VaultImageWorkbench.tsx", import.meta.url), "utf8")

describe("Vault workbench Studio side-input layout", () => {
  it("supports numeric values in the shared split text input primitive", () => {
    expect(splitInput).toContain('"number"')
    expect(splitInput).toContain('type?: "text" | "search" | "email" | "url" | "tel" | "password" | "number"')
  })

  it("places image adjustment values in three-control rows", () => {
    expect(imageWorkbench).toContain('data-vault-adjustment-row="tone"')
    expect(imageWorkbench).toContain('data-vault-adjustment-row="focal-quality"')
    expect(imageWorkbench).toContain('aria-label="Brightness"')
    expect(imageWorkbench).toContain('aria-label="Contrast"')
    expect(imageWorkbench).toContain('aria-label="Saturation"')
  })

  it("pairs crop coordinates and dimensions and gives resize its own reset control", () => {
    expect(imageWorkbench).toContain('data-vault-adjustment-row="crop-position"')
    expect(imageWorkbench).toContain('data-vault-adjustment-row="crop-size"')
    expect(imageWorkbench).toContain('data-vault-adjustment-row="resize"')
    expect(imageWorkbench).toContain('label="Reset resize dimensions"')
    expect(imageWorkbench).toContain('iconPreset="refresh"')
  })
})
