import { describe, expect, it } from "vitest"
import { resolveVaultMediaCapabilities } from "./capabilities"

describe("Vault media capability resolution", () => {
  it("exposes image editing only for a single image asset", () => {
    expect(resolveVaultMediaCapabilities({ kinds: ["image"] }).map((item) => item.id)).toContain("image-edit")
    expect(resolveVaultMediaCapabilities({ kinds: ["video"] }).map((item) => item.id)).not.toContain("image-edit")
  })

  it("limits a mixed multi-selection to operations shared by all selected media", () => {
    const capabilities = resolveVaultMediaCapabilities({ kinds: ["image", "video"] })
    expect(capabilities.map((item) => item.id)).toContain("inspect")
    expect(capabilities.map((item) => item.id)).toContain("organize")
    expect(capabilities.map((item) => item.id)).not.toContain("image-edit")
    expect(capabilities.map((item) => item.id)).not.toContain("video-process")
  })

  it("does not advertise processing as available until a real processor is wired", () => {
    expect(resolveVaultMediaCapabilities({ kinds: ["video"], videoProcessorAvailable: false })
      .find((item) => item.id === "video-process")).toMatchObject({
        available: false,
        reason: expect.stringContaining("processor"),
      })
  })

  it("does not expose media editing for empty or non-media selections", () => {
    expect(resolveVaultMediaCapabilities({ kinds: [] }).map((item) => item.id)).toEqual([])
    expect(resolveVaultMediaCapabilities({ kinds: ["document"] }).map((item) => item.id)).toContain("inspect")
    expect(resolveVaultMediaCapabilities({ kinds: ["document"] }).map((item) => item.id)).not.toContain("image-edit")
  })
})
