/**
 * Roadmap item 11: Transcript and Language Tools
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: transcript providers, language contracts, consumers).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface TranscriptLanguageToolsRequest {
  videoId?: string;
  language?: string;
}

export interface TranscriptLanguageToolsData {
  videoId: string;
  language: string;
  availableLanguages: string[];
  transcript: TranscriptSegment[] | null;
  missingReason: string | null
}

/** TODO(shape): confirm the canonical shape of `TranscriptSegment` on the target branch; replace or import it. */
export type TranscriptSegment = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchTranscriptLanguageTools(request: TranscriptLanguageToolsRequest, signal?: AbortSignal): Promise<TranscriptLanguageToolsData> {
  void request
  return apiFetch<TranscriptLanguageToolsData>(`scaffold://transcript-language-tools`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveTranscriptLanguageTools(_data: TranscriptLanguageToolsData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 11")
}
