/**
 * Roadmap item 22: Subscriber / API Dispatch Functions
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: service/API handlers; inspect auth, scopes, side effects, current callers).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface SubscriberApiDispatchRequest {
  actions?: DispatchAction[];
  lastResult?: DispatchResult | null;
}

export interface SubscriberApiDispatchData {
  actions: DispatchAction[];
  lastResult: DispatchResult | null
}

/** TODO(shape): confirm the canonical shape of `DispatchAction` on the target branch; replace or import it. */
export type DispatchAction = Record<string, unknown>

/** TODO(shape): confirm the canonical shape of `DispatchResult` on the target branch; replace or import it. */
export type DispatchResult = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchSubscriberApiDispatch(request: SubscriberApiDispatchRequest, signal?: AbortSignal): Promise<SubscriberApiDispatchData> {
  void request
  return apiFetch<SubscriberApiDispatchData>(`scaffold://subscriber-api-dispatch`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveSubscriberApiDispatch(_data: SubscriberApiDispatchData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 22")
}
