/**
 * Roadmap item 20: Project / Package State Persistence and Resume
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: Projects/ContentBuild workflow master resource, CreatorContextResolver.ts ContentBuild contracts).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface ProjectStateResumeRequest {
  projects?: ProjectSummary[];
  resumableState?: ProjectResumeState | null;
}

export interface ProjectStateResumeData {
  projects: ProjectSummary[];
  resumableState: ProjectResumeState | null
}

/** TODO(shape): confirm the canonical shape of `ProjectSummary` on the target branch; replace or import it. */
export type ProjectSummary = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `ProjectResumeState` on the target branch; replace or import it. */
export type ProjectResumeState = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchProjectStateResume(request: ProjectStateResumeRequest, signal?: AbortSignal): Promise<ProjectStateResumeData> {
  void request
  return apiFetch<ProjectStateResumeData>(`scaffold://project-state-resume`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveProjectStateResume(_data: ProjectStateResumeData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 20")
}
