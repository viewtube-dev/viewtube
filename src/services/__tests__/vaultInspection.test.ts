import { describe, expect, it } from "vitest"
import { inspectVaultAsset, type VaultInspectableAsset } from "../vaultInspection"

const asset = (overrides: Partial<VaultInspectableAsset> = {}): VaultInspectableAsset => ({
  id: "asset-1", name: "cover.png", kind: "image", mimeType: "image/png",
  url: "data:image/png;base64,abc", previewUrl: null,
  metadata: { width: 1280, height: 720, byteSize: 1024, license: "Creator-owned", rightsSource: "Original artwork" },
  tags: ["thumbnail"], projectId: "project-1", createdAt: 1, updatedAt: 2,
  ...overrides,
})

describe("inspectVaultAsset", () => {
  it("projects technical, rights, and lineage data without mutating the asset", () => {
    const source = asset({ metadata: { width: 1280, height: 720, license: "CC BY", parentAssetIds: ["parent-1"] } })
    const result = inspectVaultAsset(source)
    expect(result.technical.dimensions).toBe("1280 × 720")
    expect(result.rights.license).toBe("CC BY")
    expect(result.lineage.parentAssetIds).toEqual(["parent-1"])
    expect(source.metadata?.license).toBe("CC BY")
  })

  it("surfaces actionable findings for missing media metadata and rights", () => {
    const result = inspectVaultAsset(asset({ mimeType: null, metadata: {} }))
    expect(result.findings.map((finding) => finding.code)).toContain("missing-mime")
    expect(result.findings.map((finding) => finding.code)).toContain("missing-rights")
    expect(result.findings.map((finding) => finding.code)).toContain("missing-image-dimensions")
  })

  it("does not require image dimensions for documents", () => {
    const result = inspectVaultAsset(asset({ kind: "document", mimeType: "text/plain", metadata: { license: "Internal" } }))
    expect(result.findings.map((finding) => finding.code)).not.toContain("missing-image-dimensions")
  })
})
