import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const source = fs.readFileSync(path.resolve(process.cwd(), "src/views/CreatorVaultOS.tsx"), "utf8")

describe("CreatorVaultOS Brain asset deep-link integration", () => {
 it("resolves deep links against Vault and ContentBuild owners before selecting an asset", () => {
  expect(source).toContain("resolveVaultAssetDeepLink({")
  expect(source).toContain("assets: allAssets")
  expect(source).toContain("getBuildAssetIds: (contentBuildId) => getContentBuild(contentBuildId)?.assetIds ?? null")
  expect(source).toContain('if (assetDeepLink.status === "resolved")')
  expect(source).toContain("setSelectedAssetIds([asset.id])")
  expect(source).toContain('setVisibleModules((current) => current.includes("inspector") ? current : [...current, "inspector"])')
 })

 it("announces unresolved asset, build, and scope states without selecting an unverified asset", () => {
  expect(source).toContain('role={deepLinkNotice.tone === "alert" ? "alert" : "status"}')
  expect(source).toContain("No asset was selected.")
  expect(source).toContain("was not selected because its scope could not be verified.")
  expect(source).toContain("does not belong to ContentBuild")
 })

 it("preserves existing Vault filters and moves focus to the selected Inspector", () => {
  expect(source).toContain("Your library filters were preserved.")
  expect(source).toContain('inspectorRef.current?.focus({ preventScroll: true })')
 })
})
