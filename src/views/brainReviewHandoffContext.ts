import { resolveActiveBrainProject, type BrainProjectContextCandidate } from "../services/brain/resolveActiveBrainProject"

export type BrainReviewHandoffProject = BrainProjectContextCandidate & {
  contentBuildId?: string | null
}

export const resolveBrainReviewHandoffContext = <T extends BrainReviewHandoffProject>(
  projects: readonly T[],
  activeProjectId: string | null | undefined,
  projectContextCleared: boolean,
  evidenceIds: readonly string[],
): { project: T | null; selectedContentId: string | null } => {
  const project = resolveActiveBrainProject(projects, activeProjectId, projectContextCleared)
  const selectedContentId = evidenceIds.find((id) => id.startsWith("video:"))
    || project?.contentBuildId
    || null

  return { project, selectedContentId }
}
