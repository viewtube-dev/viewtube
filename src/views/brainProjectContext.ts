export type BrainProjectContextCandidate = {
  id: string
  status?: string | null
}

/**
 * Resolve the project scope shared by Brain sends and interrupted-turn retries.
 * An explicit clear must win over stale selection and active-project fallback.
 */
export const resolveActiveBrainProject = <T extends BrainProjectContextCandidate>(
  projects: readonly T[],
  activeProjectId: string | null | undefined,
  projectContextCleared: boolean,
): T | null => {
  if (projectContextCleared) return null

  return projects.find((project) => project.id === activeProjectId)
    || projects.find((project) => project.status === "active")
    || null
}
