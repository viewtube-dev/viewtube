// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { addVaultAsset, listVaultAssets, setVaultAssetProtection, updateVaultAsset, upsertVaultAsset } from "../vaultAdapter"

const assetInput = {
  name: "Original",
  kind: "image" as const,
  source: "local" as const,
  projectId: "project-1",
  projectName: "Project One",
  toolId: null,
  generationId: null,
  driveFileId: null,
  folderId: null,
  url: "blob:original",
  previewUrl: "blob:original",
  mimeType: "image/png",
  tags: ["source"],
  metadata: { contentHash: "sha256:abc" },
}

describe("Vault canonical asset identity", () => {
  beforeEach(() => localStorage.clear())

  it("preserves asset ID and creation time when metadata is updated", () => {
    const created = addVaultAsset(assetInput)
    const updated = updateVaultAsset(created.id, { name: "Renamed", tags: ["reviewed"] })
    expect(updated?.id).toBe(created.id)
    expect(updated?.createdAt).toBe(created.createdAt)
    expect(updated?.name).toBe("Renamed")
  })

  it("blocks protected content replacement until the asset is explicitly unlocked", () => {
    const golden = addVaultAsset({ ...assetInput, metadata: { lifecycle: "GOLDEN", protected: true } })
    expect(updateVaultAsset(golden.id, { url: "blob:replacement" })).toBeNull()
    expect(updateVaultAsset(golden.id, { url: "blob:replacement", metadata: { protected: false } })).toBeNull()
    expect(listVaultAssets()[0].url).toBe("blob:original")
    expect(setVaultAssetProtection(golden.id, false)?.metadata?.protected).toBe(false)
    expect(updateVaultAsset(golden.id, { url: "blob:replacement" })?.url).toBe("blob:replacement")
  })

  it("preserves the matched canonical ID during upsert", () => {
    const created = addVaultAsset(assetInput)
    const updated = upsertVaultAsset(
      (asset) => asset.id === created.id,
      { ...assetInput, name: "Upserted" },
    )
    expect(updated.id).toBe(created.id)
    expect(updated.createdAt).toBe(created.createdAt)
    expect(listVaultAssets()).toHaveLength(1)
  })
})
