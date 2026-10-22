import { describe, expect, it } from "vitest"
import { resolveVaultAssetDeepLink } from "./vaultAssetDeepLink"

const assets = [
 { id: "asset-1", name: "Verified title", kind: "text" },
 { id: "asset-other", name: "Other asset", kind: "image" },
] as any

describe("resolveVaultAssetDeepLink", () => {
 it("resolves only a canonical Vault asset that belongs to the requested ContentBuild", () => {
  expect(resolveVaultAssetDeepLink({
   search: "?assetId=asset-1&contentBuildId=build-1",
   assets,
   getBuildAssetIds: (id) => id === "build-1" ? ["asset-1", "asset-other"] : null,
  })).toEqual({ status: "resolved", assetId: "asset-1", contentBuildId: "build-1" })
 })

 it("rejects an asset that exists but is not in the requested ContentBuild", () => {
  expect(resolveVaultAssetDeepLink({
   search: "?assetId=asset-1&contentBuildId=build-2",
   assets,
   getBuildAssetIds: (id) => id === "build-2" ? ["asset-other"] : null,
  })).toMatchObject({ status: "scope-mismatch", assetId: "asset-1", contentBuildId: "build-2" })
 })

 it("returns a truthful unavailable state for unknown assets or builds", () => {
  expect(resolveVaultAssetDeepLink({
   search: "?assetId=missing&contentBuildId=build-1",
   assets,
   getBuildAssetIds: () => ["asset-1"],
  }).status).toBe("asset-not-found")
  expect(resolveVaultAssetDeepLink({
   search: "?assetId=asset-1&contentBuildId=missing-build",
   assets,
   getBuildAssetIds: () => null,
  }).status).toBe("build-not-found")
 })

 it("does not treat an absent assetId as a deep-link request", () => {
  expect(resolveVaultAssetDeepLink({ search: "?contentBuildId=build-1", assets, getBuildAssetIds: () => ["asset-1"] }))
   .toEqual({ status: "none" })
 })
})
