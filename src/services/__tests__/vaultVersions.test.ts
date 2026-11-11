import { beforeEach, describe, expect, it } from "vitest"
import {
 createContentBuild,
 createContentBuildAssetVersion,
 resetContentBuildRepositoryForTests,
} from "../asset-engine/ContentBuildRepository"
import { detachVaultAssetVersion, getVaultAssetVersionStack } from "../vaultVersions"
import { createLocalVaultAsset, listVaultAssets } from "../vaultAdapter"

describe("getVaultAssetVersionStack", () => {
 beforeEach(() => resetContentBuildRepositoryForTests())

 it("returns every canonical version in the same slot as the selected asset", () => {
  const build = createContentBuild({ id: "cb-vault-versions" })
  const v1 = createContentBuildAssetVersion({
   contentBuildId: build.id,
   assetId: "thumb-a",
   slot: "thumbnail",
   label: "A",
  })
  createContentBuildAssetVersion({
   contentBuildId: build.id,
   assetId: "thumb-b",
   slot: "thumbnail",
   label: "B",
   parentVersionId: v1.id,
   parentAssetId: "thumb-a",
  })

  const stack = getVaultAssetVersionStack("thumb-b")
  expect(stack.map((version) => version.assetId)).toEqual(["thumb-a", "thumb-b"])
  expect(stack.map((version) => version.version)).toEqual([1, 2])
 })
})

describe("detachVaultAssetVersion", () => {
 beforeEach(() => {
  resetContentBuildRepositoryForTests()
  localStorage.clear()
 })

 it("creates a new canonical asset while preserving source identity and version provenance", () => {
  const source = createLocalVaultAsset({
   name: "Approved thumbnail",
   kind: "image",
   tags: ["thumbnail"],
   metadata: { parentAssetIds: ["ancestor-1"], lifecycle: "FINAL" },
  })

  const detached = detachVaultAssetVersion(source, { versionId: "version-2" })

  expect(detached.id).not.toBe(source.id)
  expect(detached.name).toBe("Approved thumbnail · Detached")
  expect(detached.metadata?.parentAssetIds).toEqual(["ancestor-1", source.id])
  expect(detached.metadata?.detachedFromVersionId).toBe("version-2")
  expect(listVaultAssets().map((asset) => asset.id)).toContain(detached.id)
  expect(listVaultAssets().find((asset) => asset.id === source.id)?.name).toBe(source.name)
 })
})
