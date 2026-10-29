/**
 * Roadmap item 4: AI Prompt Library and Chat Handoff
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: AIBrainCommandInterface.tsx, BrainCapabilityRegistry.ts).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface PromptLibraryHandoffRequest {
  prompts?: PromptRecord[];
  categories?: string[];
}

export interface PromptLibraryHandoffData {
  prompts: PromptRecord[];
  categories: string[]
}

/** TODO(shape): confirm the canonical shape of `PromptRecord` on the target branch; replace or import it. */
export type PromptRecord = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchPromptLibraryHandoff(request: PromptLibraryHandoffRequest, signal?: AbortSignal): Promise<PromptLibraryHandoffData> {
  void request
  return apiFetch<PromptLibraryHandoffData>(`scaffold://prompt-library-handoff`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function savePromptLibraryHandoff(_data: PromptLibraryHandoffData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 4")
}
