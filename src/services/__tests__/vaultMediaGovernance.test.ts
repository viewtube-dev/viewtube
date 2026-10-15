import { describe, expect, it } from "vitest"
import type { VaultAsset } from "@/types"
import { getVaultMediaToolSupport, recommendVaultGovernanceActions } from "../vaultMediaGovernance"

const asset = (patch: Partial<VaultAsset> = {}): VaultAsset => ({
  id: "asset-1", name: "asset", kind: "video", source: "local", projectId: null, projectName: null,
  toolId: null, generationId: null, driveFileId: null, folderId: null, url: null, previewUrl: null,
  mimeType: "video/mp4", tags: [], metadata: {}, createdAt: 1, updatedAt: 1, ...patch,
})

describe("Vault media support and governance", () => {
  it("only advertises capabilities backed by connected local services", () => {
    expect(getVaultMediaToolSupport("image")).toEqual(expect.arrayContaining(["metadata", "hash", "preview"]))
    expect(getVaultMediaToolSupport("video")).toContain("thumbnail")
    expect(getVaultMediaToolSupport("video")).not.toContain("transcode")
    expect(getVaultMediaToolSupport("audio")).not.toContain("transcode")
  })
  it("makes evidence-backed governance recommendations and avoids claiming legal clearance", () => {
    const actions = recommendVaultGovernanceActions(asset({ metadata: { license: "unknown", lifecycle: "GOLDEN" } }))
    expect(actions.map((item) => item.id)).toContain("confirm-rights")
    expect(actions.some((item) => item.id === "legal-clearance" && item.status === "complete")).toBe(false)
  })
})
