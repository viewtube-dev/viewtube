/**
 * Roadmap item 2: Evidence-Connected AI Brain — data layer.
 *
 * Resolution order (see shared/capabilityAdapter.ts):
 *   1. HTTP capability endpoint (if configured via setCapabilityEndpoint).
 *   2. Registered canonical adapter (e.g. BrainOrchestrator.runBrainTurn fed the
 *      exact evidence pack supplied to the turn).
 *   3. Neither → CapabilityEndpointError. No simulated answers, ever.
 */
import { apiFetch, capabilityEndpoint } from "../../../api/client"
import {
  CapabilityEndpointError,
  runBrainTurn,
  type BrainTurnSourceData,
} from "../shared/capabilityAdapter"

export type EvidenceConnectedBrainTurn = BrainTurnSourceData

export { CapabilityEndpointError }

export async function runEvidenceConnectedBrain(
  input: { question: string; channelId?: string | null },
  signal?: AbortSignal,
): Promise<BrainTurnSourceData> {
  const endpoint = capabilityEndpoint()
  if (endpoint) {
    return apiFetch<BrainTurnSourceData>(`${endpoint}/evidence-connected-brain/turn`, {
      method: "POST",
      body: JSON.stringify({ question: input.question, channelId: input.channelId ?? null }),
      signal,
    })
  }
  try {
    return await runBrainTurn({
      channelId: input.channelId ?? null,
      userText: input.question,
      signal: signal ?? new AbortController().signal,
    })
  } catch (error) {
    if (error instanceof CapabilityEndpointError) {
      throw new CapabilityEndpointError(
        "evidence-connected-brain",
        "VIEWTUBE_SCAFFOLD: Brain turn source not wired — register the canonical orchestrator adapter (setCapabilityAdapter, e.g. runBrainTurn) or set the capability endpoint (setCapabilityEndpoint). No simulated answers are shown by design.",
      )
    }
    throw error
  }
}
