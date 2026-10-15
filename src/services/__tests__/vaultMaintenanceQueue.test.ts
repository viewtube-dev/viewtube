import { describe, expect, it } from "vitest"
import type { VaultAsset } from "@/types"
import { buildVaultMaintenanceQueue } from "../vaultMaintenanceQueue"

const asset = (id: string, patch: Partial<VaultAsset> = {}): VaultAsset => ({
  id, name: id, kind: "image", source: "local", projectId: null, projectName: null,
  toolId: null, generationId: null, driveFileId: null, folderId: null, url: null,
  previewUrl: null, mimeType: "image/png", tags: [], metadata: {}, createdAt: 1, updatedAt: 1,
  ...patch,
})

describe("Vault maintenance queue", () => {
  it("surfaces unassigned, untagged, attention-flagged and hash-duplicate assets", () => {
    const items = buildVaultMaintenanceQueue([
      asset("a", { metadata: { contentHash: "sha256:one", needsAttention: true } }),
      asset("b", { metadata: { contentHash: "sha256:one" }, tags: ["source"] }),
    ])
    expect(items.map((item) => item.assetId)).toContain("a")
    expect(items.find((item) => item.assetId === "a")?.reasons).toEqual(
      expect.arrayContaining(["Unassigned to a project", "No tags", "Flagged for review", "Duplicate content hash"]),
    )
  })
  it("keeps protected assets visible but never recommends destructive cleanup", () => {
    const [item] = buildVaultMaintenanceQueue([asset("gold", { metadata: { lifecycle: "GOLDEN", protected: true } })])
    expect(item.protected).toBe(true)
    expect(item.recommendedActions).not.toContain("trash")
    expect(item.recommendedActions).not.toContain("delete")
  })
})
