/**
 * Roadmap item 16: Evidence Quality and Source Validation
 * Typed API stubs. TODO(endpoint): confirm the canonical backend endpoint(s) on
 * the target branch (footholds: BrainContextBroker.ts evidence quality report type; verify current report owner and UI mapping).
 *
 * Guardrail honored: stubs THROW instead of returning fixture data, so no
 * scaffold can disguise fake data as live data.
 */
import { apiFetch } from "../../../api/client"

export interface EvidenceQualityValidationRequest {
  evidencePackId?: string;
  items?: EvidenceQualityItem[];
}

export interface EvidenceQualityValidationData {
  evidencePackId: string;
  items: EvidenceQualityItem[]
}

/** TODO(shape): confirm the canonical shape of `EvidenceQualityItem` on the target branch; replace or import it. */
export type EvidenceQualityItem = Record<string, unknown>

/** TODO(endpoint): replace path + wire params after confirming the backend contract. */
export async function fetchEvidenceQualityValidation(request: EvidenceQualityValidationRequest, signal?: AbortSignal): Promise<EvidenceQualityValidationData> {
  void request
  return apiFetch<EvidenceQualityValidationData>(`scaffold://evidence-quality-validation`, { signal })
}

/** TODO(endpoint): write paths only where the backend supports + authorizes them. */
export async function saveEvidenceQualityValidation(_data: EvidenceQualityValidationData): Promise<void> {
  throw new Error("VIEWTUBE_SCAFFOLD: write endpoint not wired — see roadmap item 16")
}
