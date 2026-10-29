/**
 * Roadmap item 21: Cross-Tool Workflow Handoffs
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: tool handoff contracts, output asset IDs, origin IDs, receipts).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface CrossToolHandoffsRequest {
  handoffs?: HandoffRecord[];
  receipt?: HandoffReceipt | null;
}

export interface CrossToolHandoffsData {
  handoffs: HandoffRecord[];
  receipt: HandoffReceipt | null;
  reviewRequired: true
}

/** TODO(shape): confirm the canonical shape of `HandoffRecord` on the target branch; replace or import it. */
export type HandoffRecord = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `HandoffReceipt` on the target branch; replace or import it. */
export type HandoffReceipt = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchCrossToolHandoffs(request: CrossToolHandoffsRequest, signal?: AbortSignal): Promise<CrossToolHandoffsData> {
  void request
  return apiFetch<CrossToolHandoffsData>(`scaffold://cross-tool-handoffs`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveCrossToolHandoffs(_data: CrossToolHandoffsData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 21")
}
