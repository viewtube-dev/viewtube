import type { ContentBuildSnapshot, ContentBuildStage } from "./contracts"

export type ContentBuildCapability = "generate" | "publish"

const STAGE_CAPABILITIES: Readonly<Record<ContentBuildStage, readonly ContentBuildCapability[]>> = {
 idea: ["generate"],
 research: ["generate"],
 concept: ["generate"],
 outline: ["generate"],
 script: ["generate"],
 storyboard: ["generate"],
 media: ["generate"],
 package: ["generate", "publish"],
 edit: ["generate", "publish"],
 review: ["generate", "publish"],
 scheduled: ["generate", "publish"],
 published: [],
 launch: ["generate", "publish"],
 monitor: [],
 evaluation: [],
 learning: [],
 archived: [],
}

/**
 * Canonical fail-closed ContentBuild capability check.
 * Unknown runtime values are denied even though the static type is exhaustive.
 */
export const assertContentBuildCapability = (
 build: Pick<ContentBuildSnapshot, "id" | "stage">,
 capability: ContentBuildCapability,
): void => {
 const stage = build.stage as string
 const capabilities = Object.prototype.hasOwnProperty.call(STAGE_CAPABILITIES, stage)
  ? STAGE_CAPABILITIES[stage as ContentBuildStage]
  : undefined
 if (!capabilities?.includes(capability)) {
  throw new Error(
   `ContentBuild stage "${stage}" does not allow capability ${capability} for build ${build.id}.`,
  )
 }
}

export const getContentBuildCapabilities = (stage: string): readonly ContentBuildCapability[] =>
 Object.prototype.hasOwnProperty.call(STAGE_CAPABILITIES, stage)
  ? STAGE_CAPABILITIES[stage as ContentBuildStage]
  : []
