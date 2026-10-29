/**
 * Roadmap item 1: Channel Intelligence Engine — full page UI.
 *
 * One coherent view of channel patterns, audience, and data gaps, derived from
 * the canonical Brain snapshot contracts (shared/brainContracts.ts). Tabbed
 * layout: Overview (patterns), Audience, Data gaps, Coverage. All states are
 * honest: analytics-disabled, source-not-wired, and real errors are distinct.
 *
 * Wiring note: swap REVIEW_PREVIEW_CONTROLS for the canonical
 * `readBrainUserControls(channelId)` when connecting to the target branch.
 */
import React, { useState } from "react"
import { CapabilityPageShell } from "../shared/CapabilityPageShell"
import { CAPABILITY_BY_SLUG } from "../../capabilities/registry"
import type { BrainUserControlsView } from "../shared/brainContracts"
import { CapabilityEndpointError } from "../shared/capabilityAdapter"
import {
  buildChannelIntelligenceView,
  type ChannelIntelligenceView,
  type DataGapRecommendation,
  type PatternFinding,
} from "./channelIntelligence"
import { useChannelIntelligenceEngine } from "./useChannelIntelligenceEngine"

const capability = CAPABILITY_BY_SLUG["channel-intelligence-engine"]

/** Review-preview controls; replace with canonical readBrainUserControls at wiring time. */
const REVIEW_PREVIEW_CONTROLS: BrainUserControlsView = {
  enabled: true,
  personalization: true,
  allowAnalytics: true,
  learnFromInteractions: true,
}

const CONFIDENCE_STYLES: Record<string, string> = {
  high: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  low: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
  unreported: "border-neutral-500/40 bg-neutral-500/10 opacity-70",
}

function ConfidenceChip({ value }: { value: string }) {
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[11px] ${CONFIDENCE_STYLES[value] ?? CONFIDENCE_STYLES.unreported}`}>
      confidence: {value}
    </span>
  )
}

function EvidenceRefs({ refs }: { refs: string[] }) {
  if (refs.length === 0) return null
  return (
    <p className="mt-1 text-[11px] opacity-70">
      evidence:{" "}
      {refs.slice(0, 6).map((ref, index) => (
        <React.Fragment key={ref}>
          {index > 0 ? ", " : ""}
          <code>{ref}</code>
        </React.Fragment>
      ))}
      {refs.length > 6 ? ` +${refs.length - 6} more` : ""}
    </p>
  )
}

function PatternCard({ finding }: { finding: PatternFinding }) {
  return (
    <li className="rounded-md border p-3">
      <p className="text-sm font-medium">{finding.title}</p>
      <p className="mt-0.5 text-xs opacity-80">{finding.detail}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="rounded border px-1.5 py-0.5 text-[11px] opacity-70">{finding.kind}</span>
        <ConfidenceChip value={finding.confidence} />
      </div>
      <EvidenceRefs refs={finding.evidenceRefs} />
    </li>
  )
}

function GapCard({ recommendation }: { recommendation: DataGapRecommendation }) {
  return (
    <li className="rounded-md border p-3">
      <p className="text-sm font-medium">{recommendation.title}</p>
      <p className="mt-0.5 text-xs opacity-80">{recommendation.rationale}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="rounded border px-1.5 py-0.5 text-[11px] opacity-70">
          severity: {recommendation.severity}
        </span>
        <code className="text-[11px] opacity-70">{recommendation.missingInputId}</code>
      </div>
    </li>
  )
}

const TABS = ["overview", "audience", "gaps", "coverage"] as const
type Tab = (typeof TABS)[number]

function IntelligenceTabs({ view }: { view: ChannelIntelligenceView }) {
  const [tab, setTab] = useState<Tab>("overview")
  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="flex flex-wrap gap-1.5">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={`rounded-md border px-2.5 py-1 text-xs capitalize ${
              tab === name ? "bg-black/10 font-medium dark:bg-white/15" : "hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            {name === "gaps" ? `Data gaps (${view.recommendations.length})` : name}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        view.patterns.length === 0 ? (
          <p className="rounded-md border border-dashed p-3 text-sm opacity-70">
            No patterns could be derived from the supplied evidence — no pattern is invented.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {view.patterns.map((finding) => (
              <PatternCard key={finding.id} finding={finding} />
            ))}
          </ul>
        )
      ) : null}

      {tab === "audience" ? (
        view.audienceSummary == null ? (
          <p className="rounded-md border border-dashed p-3 text-sm opacity-70">
            No audience summary is available from the supplied evidence. The canonical
            AudienceIntelligence dataset is required; nothing is inferred in its place.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ConfidenceChip value={view.audienceSummary.confidence} />
            </div>
            <ul className="flex flex-col gap-1.5">
              {view.audienceSummary.signals.map((signal, index) => (
                <li key={`${signal.kind}-${index}`} className="rounded-md border p-2.5 text-sm">
                  <span className="text-xs uppercase tracking-wide opacity-60">{signal.kind}</span>{" "}
                  {signal.label} — <span className="opacity-80">{signal.detail}</span>
                  {signal.evidenceRef ? (
                    <span className="ml-1 text-[11px] opacity-70">
                      evidence: <code>{signal.evidenceRef}</code>
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            {view.audienceSummary.missingEvidence.length > 0 ? (
              <p className="text-xs text-amber-500">
                Missing audience datasets: {view.audienceSummary.missingEvidence.join(", ")}
              </p>
            ) : null}
            {view.audienceSummary.evidenceBoundary.map((rule) => (
              <p key={rule} className="text-xs opacity-70">Boundary: {rule}</p>
            ))}
          </div>
        )
      ) : null}

      {tab === "gaps" ? (
        view.recommendations.length === 0 ? (
          <p className="rounded-md border border-dashed p-3 text-sm opacity-70">
            No data gaps reported — every input the engine knows about is present.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {view.recommendations.map((recommendation) => (
              <GapCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </ul>
        )
      ) : null}

      {tab === "coverage" ? (
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <ConfidenceChip value={view.coverage.confidence} />
            <span className="rounded border px-1.5 py-0.5 text-[11px] opacity-70">
              coverage: {Math.round(view.coverage.coverageRatio * 100)}%
            </span>
            <span className="rounded border px-1.5 py-0.5 text-[11px] opacity-70">
              scope: {view.coverage.scopeMatch}
            </span>
            <span className="rounded border px-1.5 py-0.5 text-[11px] opacity-70">
              evidence refs: {view.coverage.evidenceReferenceCount}
            </span>
          </div>
          {view.coverage.staleDatasetIds.length > 0 ? (
            <p className="text-xs text-amber-500">Stale datasets: {view.coverage.staleDatasetIds.join(", ")}</p>
          ) : null}
          {view.coverage.failedDatasetIds.length > 0 ? (
            <p className="text-xs text-red-500">Failed datasets: {view.coverage.failedDatasetIds.join(", ")}</p>
          ) : null}
          {view.coverage.partialDatasetIds.length > 0 ? (
            <p className="text-xs text-amber-500">Partial datasets: {view.coverage.partialDatasetIds.join(", ")}</p>
          ) : null}
          {view.missingInputs.length > 0 ? (
            <p className="text-xs opacity-70">
              Missing inputs: {view.missingInputs.map((input) => (
                <code key={input} className="mr-1">{input}</code>
              ))}
            </p>
          ) : null}
          {view.limitations.map((limitation) => (
            <p key={limitation} className="text-xs opacity-70">Limitation: {limitation}</p>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function ChannelIntelligenceEnginePage() {
  const { snapshot, run, reset } = useChannelIntelligenceEngine()
  const [channelIdInput, setChannelIdInput] = useState("")

  const endpointNotWired =
    snapshot.status === "error" && snapshot.error != null && /not wired/i.test(snapshot.error)

  return (
    <CapabilityPageShell capability={capability}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={channelIdInput}
            onChange={(event) => setChannelIdInput(event.target.value)}
            aria-label="Channel ID (optional — canonical resolver fills this)"
            className="min-w-56 flex-1 rounded-md border px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => run({ channelId: channelIdInput.trim() || null })}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Load intelligence
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Reset
          </button>
        </div>

        {snapshot.status === "idle" ? (
          <p className="text-sm opacity-70">
            Idle. Loading builds the engine view from the canonical Brain snapshot (adapter or
            capability endpoint). No simulated data is shown by design.
          </p>
        ) : null}

        {snapshot.status === "loading" ? (
          <p className="text-sm opacity-70" role="status">Loading channel intelligence…</p>
        ) : null}

        {endpointNotWired ? (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <p className="font-medium">Source not wired.</p>
            <p className="opacity-80">{snapshot.error}</p>
          </div>
        ) : snapshot.status === "error" ? (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">
            <p className="font-medium">Request failed — showing the real error, no invented data.</p>
            <p className="opacity-80">{snapshot.error}</p>
          </div>
        ) : null}

        {snapshot.status === "ready" && snapshot.data != null ? (
          (() => {
            const view = buildChannelIntelligenceView(snapshot.data, REVIEW_PREVIEW_CONTROLS)
            return (
              <div className="flex flex-col gap-3">
                <p className="text-xs opacity-60">
                  {view.analyticsDisabled
                    ? "Analytics evidence access is disabled by the creator in Brain User Controls — private metrics are not inferred or quoted."
                    : `Engine view for ${view.channelLabel} · generated ${view.generatedAt}`}
                </p>
                {view.analyticsDisabled ? (
                  <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                    {view.limitations.map((limitation) => (
                      <p key={limitation}>{limitation}</p>
                    ))}
                  </div>
                ) : (
                  <IntelligenceTabs view={view} />
                )}
              </div>
            )
          })()
        ) : null}
      </div>
    </CapabilityPageShell>
  )
}
