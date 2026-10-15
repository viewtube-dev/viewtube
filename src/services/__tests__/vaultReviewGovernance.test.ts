import { describe, expect, it } from "vitest"
import { compareVaultAssets, evaluateVaultRights, proposeVaultMetadataSuggestions, acceptVaultMetadataSuggestions, type VaultReviewAsset } from "../vaultReviewGovernance"

const asset = (overrides: Partial<VaultReviewAsset> = {}): VaultReviewAsset => ({
  id: "asset-1", name: "cover.png", kind: "image", tags: ["cover"],
  metadata: { license: "Creator-owned", rightsSource: "Original" }, ...overrides,
})

describe("Vault compare and governance", () => {
  it("returns deterministic field-level differences without modifying either asset", () => {
    const left = asset()
    const right = asset({ id: "asset-2", name: "cover-v2.png", tags: ["thumbnail"], metadata: { license: "CC BY" } })
    const diff = compareVaultAssets(left, right)
    expect(diff.map((item) => item.field)).toContain("name")
    expect(diff.map((item) => item.field)).toContain("metadata.license")
    expect(left.name).toBe("cover.png")
  })

  it("flags missing and expired rights information", () => {
    expect(evaluateVaultRights(asset({ metadata: {} })).map((item) => item.code)).toContain("rights-missing")
    expect(evaluateVaultRights(asset({ metadata: { license: "CC BY", rightsExpiry: "2020-01-01" } })).map((item) => item.code)).toContain("rights-expired")
  })

  it("keeps metadata suggestions as proposals until accepted and refuses protected edits", () => {
    const source = asset()
    const proposal = proposeVaultMetadataSuggestions(source, { tags: ["thumbnail", "hero"], description: "Hero image" })
    expect(source.tags).toEqual(["cover"])
    expect(proposal.accepted).toBe(false)
    expect(acceptVaultMetadataSuggestions(source, proposal).tags).toContain("hero")
    const protectedSource = asset({ metadata: { protected: true, license: "Creator-owned" } })
    expect(acceptVaultMetadataSuggestions(protectedSource, proposal).accepted).toBe(false)
  })
})
