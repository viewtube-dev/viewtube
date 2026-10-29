/**
 * Roadmap item 3: Channel Context Intake
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: src/services/aiBrainContext.ts, AIBrainCommandInterface.tsx, CreatorContextResolver.ts).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface ChannelContextIntakeRequest {
  goals?: string;
  audience?: string;
}

export interface ChannelContextIntakeData {
  goals: string;
  audience: string;
  niche: string;
  formats: string[];
  identity: string
}



/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchChannelContextIntake(request: ChannelContextIntakeRequest, signal?: AbortSignal): Promise<ChannelContextIntakeData> {
  void request
  return apiFetch<ChannelContextIntakeData>(`scaffold://channel-context-intake`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveChannelContextIntake(_data: ChannelContextIntakeData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 3")
}
