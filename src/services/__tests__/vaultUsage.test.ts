import { beforeEach, describe, expect, it } from "vitest"
import {
 attachAssetToContentBuild,
 createContentBuild,
 resetContentBuildRepositoryForTests,
 setContentBuildSelection,
} from "../asset-engine/ContentBuildRepository"
import { getVaultAssetUsage, getVaultAssetUsageIndex } from "../vaultUsage"

describe("getVaultAssetUsage", () => {
 beforeEach(() => resetContentBuildRepositoryForTests())

 it("reports every ContentBuild using the asset and any selected slot", () => {
  const build = createContentBuild({
   id: "cb-usage",
   legacyProjectId: "p-usage",
   legacyProjectName: "Austerlitz",
  })
  attachAssetToContentBuild(build.id, "asset-thumb", { toolId: "test" })
  setContentBuildSelection(build.id, "thumbnail", "asset-thumb")

  expect(getVaultAssetUsage("asset-thumb")).toEqual([
   expect.objectContaining({
    contentBuildId: "cb-usage",
    projectName: "Austerlitz",
    selectedSlots: ["thumbnail"],
   }),
  ])
 })
 
 it("builds the library usage index from one snapshot pass and includes selected-slot references", () => {
  const build = createContentBuild({
   id: "cb-index",
   legacyProjectId: "p-index",
   legacyProjectName: "Index Project",
  })
  attachAssetToContentBuild(build.id, "asset-index", { toolId: "test" })
  setContentBuildSelection(build.id, "thumbnail", "asset-index")

  const index = getVaultAssetUsageIndex()
  expect(index.get("asset-index")).toEqual([
   expect.objectContaining({
    contentBuildId: "cb-index",
    projectName: "Index Project",
    selectedSlots: ["thumbnail"],
   }),
  ])
  expect(index.get("unreferenced-asset")).toBeUndefined()
 })
})
