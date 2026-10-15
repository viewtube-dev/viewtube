import { describe, expect, it } from "vitest"
import type { VaultAsset } from "@/types"
import { compareVaultAssets, groupVaultDuplicateCandidates } from "../vaultAssetComparison"

const asset = (id: string, hash: string, updatedAt = 1): VaultAsset => ({
  id, name: id, kind: "image", source: "local", projectId: null, projectName: null,
  toolId: null, generationId: null, driveFileId: null, folderId: null, url: null,
  previewUrl: null, mimeType: "image/png", tags: [], metadata: { contentHash: hash }, createdAt: 1, updatedAt,
})

describe("Vault asset comparison and duplicate candidates", () => {
  it("reports field-level differences without mutating either asset", () => {
    const left = asset("a", "sha256:a", 1)
    const right = asset("b", "sha256:b", 2)
    const result = compareVaultAssets(left, right)
    expect(result.differences.map((item) => item.field)).toContain("metadata.contentHash")
    expect(left.id).toBe("a")
  })
  it("groups identical normalized hashes and selects a deterministic canonical candidate", () => {
    const groups = groupVaultDuplicateCandidates([asset("z", " SHA256:ABC "), asset("a", "sha256:abc"), asset("c", "sha256:other")])
    expect(groups).toHaveLength(1)
    expect(groups[0].assetIds).toEqual(["a", "z"])
    expect(groups[0].suggestedCanonicalId).toBe("a")
  })
})
