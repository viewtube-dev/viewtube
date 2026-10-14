import { listContentBuildSnapshots } from "./assetEngine"

export type VaultAssetUsage = {
 contentBuildId: string
 projectId: string | null
 projectName: string | null
 stage: string
 selectedSlots: string[]
}

const toUsage = (build: ReturnType<typeof listContentBuildSnapshots>[number], assetId: string): VaultAssetUsage => ({
 contentBuildId: build.id,
 projectId: build.legacyProjectId || null,
 projectName: build.legacyProjectName || null,
 stage: build.stage,
 selectedSlots: Object.entries(build.selections)
  .filter(([, selectedAssetId]) => selectedAssetId === assetId)
  .map(([slot]) => slot),
})

const sortUsage = (usage: VaultAssetUsage[]): VaultAssetUsage[] =>
 usage.sort((a, b) => (a.projectName || a.contentBuildId).localeCompare(b.projectName || b.contentBuildId))

export const getVaultAssetUsage = (assetId: string): VaultAssetUsage[] =>
 sortUsage(listContentBuildSnapshots()
  .filter((build) => build.assetIds.includes(assetId))
  .map((build) => toUsage(build, assetId)))

/** Build usage for the whole library from one Content Build snapshot read. */
export const getVaultAssetUsageIndex = (): Map<string, VaultAssetUsage[]> => {
 const index = new Map<string, VaultAssetUsage[]>()
 for (const build of listContentBuildSnapshots()) {
  const assetIds = new Set([...build.assetIds, ...Object.values(build.selections).filter((id): id is string => typeof id === "string" && Boolean(id))])
  for (const assetId of assetIds) {
   const usage = index.get(assetId) || []
   usage.push(toUsage(build, assetId))
   index.set(assetId, usage)
  }
 }
 index.forEach(sortUsage)
 return index
}
