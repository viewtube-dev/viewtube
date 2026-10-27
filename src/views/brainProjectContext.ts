export type BrainProjectContextCandidate = {
  id: string
  status?: string | null
}

/**
 * Resolve the single project scope used by Brain requests and retries.
 * An explicit clear always wins over a stale activeProjectId or active status.
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
