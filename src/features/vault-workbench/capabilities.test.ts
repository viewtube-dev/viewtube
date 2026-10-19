import { describe, expect, it } from "vitest"
import { getVaultCapabilitiesForMode, resolveVaultMediaCapabilities, VAULT_WORKBENCH_MODES } from "./capabilities"

describe("Vault media capability resolution", () => {
  it("exposes image editing only for a single image asset", () => {
    expect(resolveVaultMediaCapabilities({ kinds: ["image"] }).map((item) => item.id)).toContain("image-edit")
    expect(resolveVaultMediaCapabilities({ kinds: ["video"] }).map((item) => item.id)).not.toContain("image-edit")
  })
  it("limits mixed selections to shared operations", () => {
    const capabilities = resolveVaultMediaCapabilities({ kinds: ["image", "video"] })
    expect(capabilities.map((item) => item.id)).toEqual(expect.arrayContaining(["inspect", "organize", "compare"]))
    expect(capabilities.map((item) => item.id)).not.toContain("image-edit")
    expect(capabilities.map((item) => item.id)).not.toContain("video-process")
  })
  it("does not advertise video processing without an explicit verified processor", () => {
    expect(resolveVaultMediaCapabilities({ kinds: ["video"] }).find((item) => item.id === "video-process"))
      .toMatchObject({ available: false, reason: expect.stringContaining("processor") })
  })
  it("does not expose media editing for empty or non-media selections", () => {
    expect(resolveVaultMediaCapabilities({ kinds: [] })).toEqual([])
    expect(resolveVaultMediaCapabilities({ kinds: ["document"] }).map((item) => item.id)).toContain("inspect")
    expect(resolveVaultMediaCapabilities({ kinds: ["document"] }).map((item) => item.id)).not.toContain("image-edit")
  })
  it("respects action eligibility flags without claiming they are authorization", () => {
    const capabilities = resolveVaultMediaCapabilities({ kinds: ["image"], eligibility: { metadataEdit: false, archive: false, delete: false } })
    expect(capabilities.find((item) => item.id === "metadata-edit")).toMatchObject({ available: false, reason: expect.stringContaining("Metadata editing") })
    expect(capabilities.find((item) => item.id === "archive")?.available).toBe(false)
    expect(capabilities.find((item) => item.id === "delete")?.available).toBe(false)
  })
  it("provides and filters the canonical Workbench modes", () => {
    expect(VAULT_WORKBENCH_MODES.map((mode) => mode.id)).toEqual(["browse", "inspect", "compare", "edit", "process", "organize", "workflow"])
    const capabilities = resolveVaultMediaCapabilities({ kinds: ["image"] })
    expect(getVaultCapabilitiesForMode(capabilities, "edit").map((item) => item.id)).toEqual(["metadata-edit", "image-edit"])
    expect(getVaultCapabilitiesForMode(capabilities, "workflow").map((item) => item.id)).toEqual(["send-to"])
  })
})
