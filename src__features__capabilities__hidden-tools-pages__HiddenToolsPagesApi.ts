/**
 * Roadmap item 23: Hidden Tools, Widgets, and Pages
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: route graph, import inventory, exports, runtime route tests).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface HiddenToolsPagesRequest {
  pages?: UnlinkedPage[];
  verifiedEntryPoints?: string[];
}

export interface HiddenToolsPagesData {
  pages: UnlinkedPage[];
  verifiedEntryPoints: string[]
}

/** TODO(shape): confirm the canonical shape of `UnlinkedPage` on the target branch; replace or import it. */
export type UnlinkedPage = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchHiddenToolsPages(request: HiddenToolsPagesRequest, signal?: AbortSignal): Promise<HiddenToolsPagesData> {
  void request
  return apiFetch<HiddenToolsPagesData>(`scaffold://hidden-tools-pages`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveHiddenToolsPages(_data: HiddenToolsPagesData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 23")
}
