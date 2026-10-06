import type { SeoResult } from "../types"

export type MetadataMasterGoal =
  | "reach"
  | "search"
  | "browse"
  | "subscribers"
  | "revenue"
  | "authority"

export type MetadataMasterIntensity = "light" | "balanced" | "aggressive"

export type MetadataMasterSlot =
  | "title"
  | "thumbnail"
  | "description"
  | "tags"
  | "chapters"
  | "category"
  | "playlist"
  | "endScreen"
  | "schedule"

export interface MetadataMasterPackage {
  id: string
  version: number
  projectId?: string | null
  contentBuildId?: string | null
  videoId?: string | null
  goal: MetadataMasterGoal
  intensity: MetadataMasterIntensity
  title: string
  description: string
  tags: string[]
  category: string
  thumbnailPrompt: string
  thumbnailText: string
  chapters: string
  playlistIds: string[]
  endScreen: string
  schedule: string
  lockedSlots: MetadataMasterSlot[]
  appliedSlots: MetadataMasterSlot[]
  warnings: string[]
  score: number
  generatedAt: number
  source: "ai" | "manual" | "imported"
  provenance: string[]
}

export interface MetadataMasterSet {
  id: string
  label: string
  strategy: "search" | "curiosity" | "authority" | "channel-fit" | "custom"
  package: MetadataMasterPackage
  score: number
}

const PACKAGE_KEY = "viewtube:metadata-master:packages:v1"

export const createEmptyMetadataMasterPackage = (
  input: Partial<MetadataMasterPackage> = {},
): MetadataMasterPackage => ({
  id: input.id ?? crypto.randomUUID(),
  version: input.version ?? 1,
  projectId: input.projectId ?? null,
  contentBuildId: input.contentBuildId ?? null,
  videoId: input.videoId ?? null,
  goal: input.goal ?? "reach",
  intensity: input.intensity ?? "balanced",
  title: input.title ?? "",
  description: input.description ?? "",
  tags: input.tags ?? [],
  category: input.category ?? "",
  thumbnailPrompt: input.thumbnailPrompt ?? "",
  thumbnailText: input.thumbnailText ?? "",
  chapters: input.chapters ?? "",
  playlistIds: input.playlistIds ?? [],
  endScreen: input.endScreen ?? "",
  schedule: input.schedule ?? "",
  lockedSlots: input.lockedSlots ?? [],
  appliedSlots: input.appliedSlots ?? [],
  warnings: input.warnings ?? [],
  score: input.score ?? 0,
  generatedAt: input.generatedAt ?? Date.now(),
  source: input.source ?? "manual",
  provenance: input.provenance ?? [],
})

export const packageFromSeoResult = (
  result: SeoResult,
  input: {
    goal: MetadataMasterGoal
    intensity: MetadataMasterIntensity
    projectId?: string | null
    contentBuildId?: string | null
    videoId?: string | null
  },
): MetadataMasterPackage => {
  const first = result.titleSets?.[0]
  return createEmptyMetadataMasterPackage({
    projectId: input.projectId,
    contentBuildId: input.contentBuildId,
    videoId: input.videoId,
    goal: input.goal,
    intensity: input.intensity,
    title: first?.title ?? "",
    description: result.description ?? "",
    tags: (result.tags ?? "").split(",").map(value => value.trim()).filter(Boolean),
    category: result.category ?? "",
    thumbnailPrompt: first?.thumbnailPrompt ?? "",
    thumbnailText: first?.thumbnailText ?? "",
    source: "ai",
    provenance: ["generateSeoData", "Metadata Master"],
  })
}

export const scoreMetadataMasterPackage = (pkg: MetadataMasterPackage) => {
  const scores = {
    completeness: [
      pkg.title,
      pkg.description,
      pkg.tags.length ? "tags" : "",
      pkg.category,
      pkg.thumbnailPrompt,
    ].filter(Boolean).length / 5 * 100,
    clarity: pkg.title.trim().length >= 24 && pkg.title.trim().length <= 70 ? 100 : 72,
    description: pkg.description.trim().length >= 120 ? 100 : pkg.description.trim().length ? 70 : 0,
    packaging: pkg.title && pkg.thumbnailPrompt
      ? (pkg.thumbnailText && pkg.thumbnailText.toLowerCase() !== pkg.title.toLowerCase() ? 100 : 76)
      : 0,
    hygiene: new Set(pkg.tags.map(tag => tag.toLowerCase())).size === pkg.tags.length ? 100 : 65,
  }
  return Math.round(
    Object.values(scores).reduce((sum, value) => sum + value, 0) / Object.keys(scores).length,
  )
}

export const validateMetadataMasterPackage = (pkg: MetadataMasterPackage) => {
  const warnings: string[] = []
  if (!pkg.title.trim()) warnings.push("Title is missing.")
  if (pkg.title.length > 100) warnings.push("Title is unusually long.")
  if (!pkg.description.trim()) warnings.push("Description is missing.")
  if (!pkg.tags.length) warnings.push("No tags are selected.")
  if (!pkg.thumbnailPrompt.trim()) warnings.push("No thumbnail direction is attached.")
  if (pkg.thumbnailText.trim() && pkg.thumbnailText.trim().toLowerCase() === pkg.title.trim().toLowerCase()) {
    warnings.push("Thumbnail text repeats the title; consider a complementary visual message.")
  }
  if (new Set(pkg.tags.map(tag => tag.toLowerCase())).size !== pkg.tags.length) {
    warnings.push("Duplicate tags detected.")
  }
  return warnings
}

export const finalizeMetadataMasterPackage = (pkg: MetadataMasterPackage): MetadataMasterPackage => {
  const warnings = validateMetadataMasterPackage(pkg)
  return {
    ...pkg,
    warnings,
    score: scoreMetadataMasterPackage({ ...pkg, warnings }),
  }
}

export const saveMetadataMasterPackage = (pkg: MetadataMasterPackage) => {
  if (typeof window === "undefined") return
  try {
    const current = listMetadataMasterPackages()
    window.localStorage.setItem(
      PACKAGE_KEY,
      JSON.stringify([pkg, ...current.filter(item => item.id !== pkg.id)].slice(0, 25)),
    )
  } catch {
    // Draft persistence is best effort and must never block the creator workflow.
  }
}

export const listMetadataMasterPackages = (): MetadataMasterPackage[] => {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(window.localStorage.getItem(PACKAGE_KEY) || "[]") as MetadataMasterPackage[]
  } catch {
    return []
  }
}

export const packageToHandoffPayload = (pkg: MetadataMasterPackage) => ({
  packageId: pkg.id,
  version: pkg.version,
  title: pkg.title,
  description: pkg.description,
  tags: pkg.tags,
  category: pkg.category,
  thumbnail: {
    prompt: pkg.thumbnailPrompt,
    text: pkg.thumbnailText,
  },
  chapters: pkg.chapters,
  playlistIds: pkg.playlistIds,
  endScreen: pkg.endScreen,
  schedule: pkg.schedule,
  goal: pkg.goal,
  intensity: pkg.intensity,
  score: pkg.score,
  warnings: pkg.warnings,
  lockedSlots: pkg.lockedSlots,
  appliedSlots: pkg.appliedSlots,
  provenance: pkg.provenance,
})

export const createMetadataMasterSet = (
  pkg: MetadataMasterPackage,
  label: string,
  strategy: MetadataMasterSet["strategy"],
): MetadataMasterSet => ({
  id: crypto.randomUUID(),
  label,
  strategy,
  package: pkg,
  score: pkg.score,
})
