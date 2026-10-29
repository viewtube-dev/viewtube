/**
 * Capability adapter boundary for systems 1 and 2 (roadmap items 1 and 2).
 *
 * Resolution order for a capability data request:
 *   1. A registered adapter — the in-repo canonical service (e.g. feed
 *      `buildBrainContextPack` + the analytics-canon snapshot loaders for the
 *      Channel Intelligence Engine, or `runBrainTurn` for the Evidence-Connected Brain).
 *   2. An HTTP endpoint (`capabilityEndpoint` in `src/api/client.ts`).
 *   3. Nothing registered/wired → explicit `CapabilityEndpointError`. The UI can
 *      detect this class and say "source not wired" instead of failing cryptically.
 *
 * Guardrail honored: there is no fixture fallback anywhere — fabricated data is
 * impossible by construction.
 */
import type { AIBrainContextSnapshotView } from "./brainContracts"

export class CapabilityEndpointError extends Error {
  readonly capabilityId: string
  constructor(capabilityId: string, message?: string) {
    super(
      message ??
        `Capability "${capabilityId}" has no data source wired: register an adapter with setCapabilityAdapter() or configure the capability endpoint. No simulated data is shown by design.`,
    )
    this.name = "CapabilityEndpointError"
    this.capabilityId = capabilityId
  }
}

export interface LoadChannelIntelligenceInput {
  channelId: string | null
  signal: AbortSignal
}

export interface ChannelIntelligenceSourceData {
  snapshot: AIBrainContextSnapshotView
  evidenceQuality: import("./brainContracts").BrainEvidenceQualityView | null
}

export type ChannelIntelligenceAdapter = (
  input: LoadChannelIntelligenceInput,
) => Promise<ChannelIntelligenceSourceData>

export interface RunBrainTurnInput {
  channelId: string | null
  userText: string
  signal: AbortSignal
}

export interface BrainTurnSourceData {
  answerId: string
  question: string
  answerText: string
  evidencePackId: string | null
  evidence: Array<{
    evidenceId: string
    label: string
    source: string
  }>
  limits: string[]
  unsupportedNumbers: string[]
}

/** Review-only retry contract: retry re-runs generation; it never replays side effects. */
export type BrainTurnAdapter = (input: RunBrainTurnInput) => Promise<BrainTurnSourceData>

type AdapterRegistry = {
  "channel-intelligence-engine"?: ChannelIntelligenceAdapter
  "evidence-connected-brain"?: BrainTurnAdapter
}

const registry: AdapterRegistry = {}

export function setCapabilityAdapter(
  capability: "channel-intelligence-engine",
  adapter: ChannelIntelligenceAdapter,
): void
export function setCapabilityAdapter(
  capability: "evidence-connected-brain",
  adapter: BrainTurnAdapter,
): void
export function setCapabilityAdapter(capability: keyof AdapterRegistry, adapter: unknown): void {
  registry[capability] = adapter as never
}

export function clearCapabilityAdapter(capability: keyof AdapterRegistry): void {
  delete registry[capability]
}

export async function loadChannelIntelligence(
  input: LoadChannelIntelligenceInput,
): Promise<ChannelIntelligenceSourceData> {
  const adapter = registry["channel-intelligence-engine"]
  if (adapter) return adapter(input)
  throw new CapabilityEndpointError("channel-intelligence-engine")
}

export async function runBrainTurn(input: RunBrainTurnInput): Promise<BrainTurnSourceData> {
  const adapter = registry["evidence-connected-brain"]
  if (adapter) return adapter(input)
  throw new CapabilityEndpointError("evidence-connected-brain")
}
