import { describe, expect, it } from "vitest"
import { resolveVaultMediaOperationPlan, type VaultMediaOperationAsset } from "../vaultMediaOperations"

const item = (overrides: Partial<VaultMediaOperationAsset> = {}): VaultMediaOperationAsset => ({
  id: "a1", kind: "image", byteSize: 100, protected: false, ...overrides,
})

describe("resolveVaultMediaOperationPlan", () => {
  it("plans non-destructive image batches within limits", () => {
    const plan = resolveVaultMediaOperationPlan({ operation: "image-transform", assets: [item(), item({ id: "a2" })] })
    expect(plan.allowed).toBe(true)
    expect(plan.outputStrategy).toBe("create-derivatives")
    expect(plan.assetIds).toEqual(["a1", "a2"])
  })

  it("rejects mixed media operations and protected overwrite requests", () => {
    expect(resolveVaultMediaOperationPlan({ operation: "video-trim", assets: [item(), item({ id: "v1", kind: "video" })] }).allowed).toBe(false)
    expect(resolveVaultMediaOperationPlan({ operation: "image-transform", assets: [item({ protected: true })], overwriteSource: true }).reason).toContain("protected")
  })

  it("enforces file-size and selection bounds before scheduling", () => {
    expect(resolveVaultMediaOperationPlan({ operation: "video-trim", assets: [item({ kind: "video", byteSize: 70 * 1024 * 1024 })] }).reason).toContain("64 MB")
    const many = Array.from({ length: 51 }, (_, index) => item({ id: String(index) }))
    expect(resolveVaultMediaOperationPlan({ operation: "image-transform", assets: many }).allowed).toBe(false)
  })
})
