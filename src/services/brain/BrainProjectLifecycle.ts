import type {
 ContentBuildProfile,
 ContentBuildSnapshot,
 ContentBuildStage,
 ContentBuildWorkflowState,
} from "../asset-engine/contracts"

export type BrainProjectLifecyclePhase = ContentBuildStage

export interface BrainProjectLifecycleResolution {
 status: "resolved" | "insufficient_context"
 currentPhase: BrainProjectLifecyclePhase | null
 sourceStage: ContentBuildStage | null
 relevantCapabilities: string[]
 audiencePromisePresent: boolean
 blockers: string[]
}

const CAPABILITIES_BY_STAGE: Record<ContentBuildStage, string[]> = {
 idea: ["research", "audience_discovery", "concept_development"],
 research: ["evidence_review", "audience_discovery", "concept_development"],
 concept: ["audience_promise", "strategy", "packaging_hypotheses"],
 outline: ["outline", "script_direction"],
 script: ["script", "hook_review", "storyboard"],
 storyboard: ["storyboard", "visual_plan", "media_plan"],
 media: ["media_generation", "editing", "production_review"],
 package: ["title", "thumbnail", "description", "tags", "metadata"],
 edit: ["editor", "continuity_review", "quality_review"],
 review: ["creator_approval", "metadata_validation", "publish_readiness"],
 scheduled: ["publish_readiness", "launch_priming"],
 published: ["publication_verification", "analytics_checkpoint", "monitoring"],
 launch: ["promotion", "community", "launch_monitoring"],
 monitor: ["analytics", "outcome_evaluation"],
 evaluation: ["outcome_evaluation", "learning_candidate_review"],
 learning: ["learning_review", "opportunity_generation"],
 archived: [],
}

export const resolveBrainProjectLifecycle = (input: {
 contentBuild: Pick<ContentBuildSnapshot, "stage" | "profile" | "workflow"> | null | undefined
}): BrainProjectLifecycleResolution => {
 const contentBuild = input.contentBuild
 if (!contentBuild || !contentBuild.stage || !Object.prototype.hasOwnProperty.call(CAPABILITIES_BY_STAGE, contentBuild.stage)) {
  return {
   status: "insufficient_context",
   currentPhase: null,
   sourceStage: null,
   relevantCapabilities: [],
   audiencePromisePresent: false,
   blockers: ["A canonical ContentBuild snapshot is required to resolve project phase."],
  }
 }

 const profile: Partial<ContentBuildProfile> = contentBuild.profile || {}
 const workflow: Partial<ContentBuildWorkflowState> = contentBuild.workflow || {}
 const blockers = Array.from(new Set((workflow.blockerIds || []).filter((value): value is string => typeof value === "string" && Boolean(value.trim()))))
 return {
  status: "resolved",
  currentPhase: contentBuild.stage,
  sourceStage: contentBuild.stage,
  relevantCapabilities: [...CAPABILITIES_BY_STAGE[contentBuild.stage]],
  audiencePromisePresent: typeof profile.audiencePromise === "string" && Boolean(profile.audiencePromise.trim()),
  blockers,
 }
}
