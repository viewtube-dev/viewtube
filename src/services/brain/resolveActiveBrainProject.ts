export type BrainProjectContextCandidate = {
  id: string
  status?: string | null
}

/**
 * Resolve the project attached to a Brain request. An explicit clear always
 * wins over both the selected ID and the implicit active-project fallback.
 */
export const resolveActiveBrainProject = <T extends BrainProjectContextCandidate>(
  projects: readonly T[],
  activeProjectId?: string | null,
  contextCleared = false,
): T | null => {
  if (contextCleared) return null
  return projects.find((project) => project.id === activeProjectId)
    || projects.find((project) => project.status === "active")
    || null
}
