import { describe, expect, it } from "vitest"
import { canMutateVaultAsset, isVaultAssetProtected } from "../vaultMutationPolicy"

describe("Vault local lifecycle mutation policy", () => {
  it("treats GOLDEN assets as protected unless explicitly unlocked", () => {
    expect(isVaultAssetProtected({ metadata: { lifecycle: "GOLDEN" } })).toBe(true)
    expect(isVaultAssetProtected({ metadata: { lifecycle: "GOLDEN", protected: false } })).toBe(false)
  })
  it("blocks archive and trash for protected assets", () => {
    const golden = { metadata: { lifecycle: "GOLDEN" } }
    expect(canMutateVaultAsset(golden, "archive")).toBe(false)
    expect(canMutateVaultAsset(golden, "trash")).toBe(false)
    expect(canMutateVaultAsset(golden, "permanent-delete")).toBe(false)
  })
  it("allows permanent deletion only for trashed, unprotected assets", () => {
    expect(canMutateVaultAsset({ metadata: { lifecycle: "TRASHED", trashedAt: 1 } }, "permanent-delete")).toBe(true)
    expect(canMutateVaultAsset({ metadata: { lifecycle: "DRAFT" } }, "permanent-delete")).toBe(false)
    expect(canMutateVaultAsset({ metadata: { lifecycle: "TRASHED", trashedAt: 1, protected: true } }, "permanent-delete")).toBe(false)
  })
  it("blocks metadata edits while trashed and allows restoration of archived/trash records", () => {
    expect(canMutateVaultAsset({ metadata: { lifecycle: "TRASHED", trashedAt: 1 } }, "metadata-edit")).toBe(false)
    expect(canMutateVaultAsset({ metadata: { lifecycle: "ARCHIVED", archivedAt: 1 } }, "restore")).toBe(true)
  })
})
