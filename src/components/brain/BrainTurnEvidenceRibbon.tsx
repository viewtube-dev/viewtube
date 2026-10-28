import React from "react"
import { Link } from "react-router-dom"
import type { AIBrainEvidencePack, BrainClaimEvidenceLink } from "../../types"
import type { EvidenceRecord } from "../../services/brain/EvidenceRecord"
import { StudioSplitLeftBadge } from "../../studio-ui"
import { BrainClaimEvidence } from "./BrainClaimEvidence"
import { formatEvidenceRequestSpec } from "../../services/brain/BrainEvidenceRequestPresentation"

export type BrainTurnEvidenceRibbonProps = {
  turnId: string
  evidencePack: AIBrainEvidencePack
  citedEvidenceIds?: string[]
  evidenceRecords?: EvidenceRecord[]
  claimEvidence?: BrainClaimEvidenceLink[]
  evidenceIntegrityStatus?: "verified" | "unavailable" | "mismatch"
  compact?: boolean
  className?: string
}

/**
 * Turn-scoped provenance summary.
 * Default UI is a single compact line. Advanced evidence detail stays collapsed
 * so the chat surface stays readable on mobile.
 */
export const BrainTurnEvidenceRibbon: React.FC<BrainTurnEvidenceRibbonProps> = ({
  turnId,
  evidencePack,
  citedEvidenceIds = [],
  evidenceRecords,
  claimEvidence = [],
  evidenceIntegrityStatus = "unavailable",
  compact = false,
  className = "",
}) => {
  const preparedCount = evidencePack.items.length
  // The prompt evidence records are the canonical IDs actually supplied to the model.
  // They can differ from display IDs in the broader evidence pack; only trust record
  // IDs when the saved prompt-evidence manifest has been verified.
  const verifiedRecords = evidenceIntegrityStatus === "verified" ? evidenceRecords : undefined
  const preparedEvidenceIds = new Set(evidencePack.items.map((item) => item.id))
  const trustedEvidenceIds = new Set([
    ...preparedEvidenceIds,
    ...(verifiedRecords || []).map((record) => record.id),
  ])
  const resolvedCitations = new Set(citedEvidenceIds.filter((id) => trustedEvidenceIds.has(id)))
  const unresolvedCitationIds = new Set(citedEvidenceIds.filter((id) => !trustedEvidenceIds.has(id)))
  const citedCount = resolvedCitations.size
  const unresolvedCitationCount = unresolvedCitationIds.size
  const capturedAt = evidencePack.capturedAt
  const captureLabel =
    capturedAt && Number.isFinite(Date.parse(capturedAt))
      ? new Date(capturedAt).toLocaleString()
      : "Capture time unavailable"
  const requestSpec =
    evidencePack.requestSpec && typeof evidencePack.requestSpec === "object" ? evidencePack.requestSpec : null
  const requestConstraints = requestSpec ? formatEvidenceRequestSpec(requestSpec) : null
  const requestSummary = requestConstraints
    ? requestConstraints.map((item) => item.value).join(" · ")
    : "Selection constraints were not recorded for this saved turn."
  const noPreparedEvidence = preparedCount === 0
  const statusLabel =
    evidencePack.dataStatus === "missing"
      ? "Missing evidence"
      : evidencePack.dataStatus === "partial"
        ? "Partial evidence"
        : noPreparedEvidence
          ? "No evidence selected"
          : "Evidence ready"
  const staleCount =
    verifiedRecords?.filter((record) => record.freshness === "stale" || record.epistemicState === "STALE").length ?? 0
  const missingCount =
    verifiedRecords?.filter((record) => record.epistemicState === "MISSING" || record.availability === "unavailable")
      .length ?? 0
  const conflictingCount =
    verifiedRecords?.filter((record) => record.epistemicState === "CONFLICTING").length ?? 0
  const hasPartialCoverage =
    evidencePack.dataStatus === "partial" ||
    Boolean(
      verifiedRecords?.some(
        (record) => record.availability === "partial" || (typeof record.coverage === "number" && record.coverage < 1),
      ),
    )
  const gapCount = evidencePack.missingInputs.length

  const summaryBits = [
    statusLabel,
    preparedCount ? `${preparedCount} prepared` : null,
    citedCount ? `${citedCount} cited` : null,
    gapCount ? `${gapCount} gaps` : null,
  ].filter(Boolean)

  return (
    <details
      className={`min-w-0 border-[2px] border-black bg-white ${className}`}
      aria-label="Evidence for this answer"
      data-vt-brain-turn-id={turnId}
      data-vt-brain-component="BrainTurnEvidenceRibbon"
    >
      <summary className="flex min-h-10 cursor-pointer list-none flex-wrap items-center gap-1.5 px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
        <span className="text-[9px] font-[1000] uppercase tracking-[0.08em]">Evidence</span>
        <StudioSplitLeftBadge sizeVariant="micro" className="w-max">
          {statusLabel}
        </StudioSplitLeftBadge>
        <span className="min-w-0 flex-1 truncate text-[10px] font-bold text-black/65">
          {summaryBits.slice(1).join(" · ")}
        </span>
        <span className="text-[9px] font-black uppercase text-black/45">Details</span>
      </summary>

      <div className={`grid min-w-0 gap-1.5 border-t-[2px] border-black ${compact ? "p-1.5" : "p-2"}`}>
        <div className="flex flex-wrap items-center gap-1">
          <StudioSplitLeftBadge sizeVariant="micro" className="w-max">
            {preparedCount} prepared
          </StudioSplitLeftBadge>
          <StudioSplitLeftBadge sizeVariant="micro" className="w-max">
            {citedCount} cited
          </StudioSplitLeftBadge>
          {unresolvedCitationCount ? (
            <StudioSplitLeftBadge sizeVariant="micro" className="w-max">
              {unresolvedCitationCount} unresolved citation{unresolvedCitationCount === 1 ? "" : "s"}
            </StudioSplitLeftBadge>
          ) : null}
          {gapCount ? (
            <StudioSplitLeftBadge sizeVariant="micro" className="w-max">
              {gapCount} gaps
            </StudioSplitLeftBadge>
          ) : null}
        </div>

        {unresolvedCitationCount ? (
          <p
            data-vt-brain-part="unresolved-citations"
            role="note"
            className="break-words text-[10px] font-bold leading-4 text-black/70"
          >
            {unresolvedCitationCount} response citation{unresolvedCitationCount === 1 ? "" : "s"} did not match the
            prepared evidence list or verified prompt records and {unresolvedCitationCount === 1 ? "is" : "are"} not counted as cited.
          </p>
        ) : null}

        <p className="break-words text-[10px] font-bold leading-4 text-black/65">Captured: {captureLabel}</p>

        {noPreparedEvidence ? (
          <p
            data-vt-brain-part="empty-evidence-selection"
            role="note"
            className="break-words border border-black/25 bg-[#f8f8f4] p-2 text-xs font-bold leading-5"
          >
            No evidence items were selected for this turn. This is an empty selection, not proof that the underlying
            data source has no records.
          </p>
        ) : null}

        {evidenceIntegrityStatus === "verified" && verifiedRecords ? (
          <section
            data-vt-brain-part="evidence-condition-summary"
            aria-label="Evidence condition summary"
            className="grid min-w-0 gap-1 border-t border-black/20 pt-1.5"
          >
            <h4 className="text-[9px] font-[1000] uppercase tracking-[0.06em]">Evidence conditions</h4>
            <div className="flex min-w-0 flex-wrap gap-1">
              {hasPartialCoverage ? <StudioSplitLeftBadge sizeVariant="micro">Partial coverage</StudioSplitLeftBadge> : null}
              {staleCount ? <StudioSplitLeftBadge sizeVariant="micro">{staleCount} stale</StudioSplitLeftBadge> : null}
              {missingCount ? <StudioSplitLeftBadge sizeVariant="micro">{missingCount} missing</StudioSplitLeftBadge> : null}
              {conflictingCount ? (
                <StudioSplitLeftBadge sizeVariant="micro">{conflictingCount} conflicting</StudioSplitLeftBadge>
              ) : null}
              {!hasPartialCoverage && staleCount === 0 && missingCount === 0 && conflictingCount === 0 ? (
                <StudioSplitLeftBadge sizeVariant="micro">No quality issues recorded</StudioSplitLeftBadge>
              ) : null}
            </div>
            <p className="break-words text-[10px] font-bold leading-4 text-black/65">
              These flags describe recorded evidence quality for this answer. They are not a guarantee that every claim
              is correct.
            </p>
          </section>
        ) : evidenceIntegrityStatus === "mismatch" ? (
          <p role="note" className="break-words border-t border-black/20 pt-1.5 text-[10px] font-bold leading-4 text-black/65">
            Evidence quality details are hidden because the saved evidence record could not be verified.
          </p>
        ) : null}

        {evidenceIntegrityStatus === "mismatch" ? (
          <div
            data-vt-brain-part="evidence-identity-warning"
            role="alert"
            className="grid gap-0.5 border-[2px] border-black bg-[#FF7AC8] p-2"
          >
            <strong className="text-[10px] font-[1000] uppercase">Evidence could not be verified</strong>
            <p className="break-words text-xs font-bold leading-5">
              Saved evidence IDs do not match the records used for this answer. Detailed provenance is hidden so a
              different set is not shown as if it were the model input.
            </p>
          </div>
        ) : null}

        <details data-vt-brain-part="evidence-request-constraints" className="min-w-0 border-t border-black/20 pt-1.5">
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-[10px] font-[1000] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
            <span>How evidence was chosen</span>
            <span className="text-black/50">{requestConstraints ? requestConstraints.length : 0}</span>
          </summary>
          <div className="grid gap-1 py-1">
            <p className="break-words text-xs font-bold leading-5 text-black/70">{requestSummary}</p>
            {requestConstraints ? (
              <dl className="grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-2">
                {requestConstraints.map((constraint) => (
                  <div key={constraint.id} className="min-w-0 border border-black/30 bg-[#f8f8f4] p-1.5">
                    <dt className="text-[9px] font-[1000] uppercase text-black/55">{constraint.label}</dt>
                    <dd className="break-words text-xs font-bold leading-5">{constraint.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p role="note" className="break-words text-[10px] font-bold leading-4 text-black/60">
                This is a legacy evidence snapshot. Original selection settings cannot be reconstructed safely.
              </p>
            )}
          </div>
        </details>

        {evidencePack.missingInputs.length ? (
          <div className="grid gap-0.5">
            <h4 className="text-[9px] font-[1000] uppercase tracking-[0.06em]">Missing inputs</h4>
            <ul className="grid gap-0.5">
              {evidencePack.missingInputs.slice(0, compact ? 2 : 4).map((item) => (
                <li key={item} className="break-words text-[10px] font-bold leading-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <BrainClaimEvidence evidencePack={evidencePack} compact label="Inspect evidence" />

        <details data-vt-brain-part="prompt-evidence-records" className="min-w-0 border-t border-black/20 pt-1.5">
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-[10px] font-[1000] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
            <span>Evidence records</span>
            <span className="shrink-0">
              {evidenceIntegrityStatus === "mismatch"
                ? "Mismatch"
                : evidenceRecords === undefined
                  ? "Unavailable"
                  : evidenceRecords.length}
            </span>
          </summary>
          {evidenceIntegrityStatus === "mismatch" ? (
            <p className="break-words py-1 text-[10px] font-bold leading-4 text-black/70">
              Record-level detail is hidden because the prompt evidence could not be verified.
            </p>
          ) : evidenceRecords === undefined ? (
            <p className="break-words py-1 text-[10px] font-bold leading-4 text-black/70">
              Record-level detail is unavailable for this saved turn.
            </p>
          ) : evidenceRecords.length === 0 ? (
            <p className="break-words py-1 text-[10px] font-bold leading-4 text-black/70">
              No typed evidence records were recorded for this turn.
            </p>
          ) : (
            <ul className="grid min-w-0 gap-1.5 py-1">
              {evidenceRecords.map((record) => {
                const sourceRoute = record.provenance.sourceRoute
                const safeSourceRoute =
                  typeof sourceRoute === "string" && sourceRoute.startsWith("/") && !sourceRoute.startsWith("//")
                    ? sourceRoute
                    : null
                const displayValue =
                  record.value === null || record.value === undefined
                    ? "Unknown / missing — No zero value is inferred"
                    : (typeof record.value === "number"
                        ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(record.value)
                        : String(record.value)) + (record.unit ? " " + record.unit : "")
                const recordHref = (() => {
                  const baseRoute =
                    record.owner === "analytics-canon" ? safeSourceRoute || "/analytics" : safeSourceRoute
                  if (!baseRoute) return null
                  const params = new URLSearchParams()
                  params.set("brainEvidenceId", record.id)
                  params.set("brainEvidenceSource", record.owner)
                  if (record.sourceSnapshotId) params.set("snapshotId", record.sourceSnapshotId)
                  if (record.sourceRef) params.set("sourceRef", record.sourceRef)
                  if (record.metric) params.set("metric", record.metric)
                  if (record.window?.kind) params.set("window", record.window.kind)
                  if (record.videoId) params.set("videoId", record.videoId)
                  const channelId = record.channelId || evidencePack.channelId
                  if (channelId) params.set("channelId", channelId)
                  if (requestSpec) {
                    if (typeof requestSpec.count === "number") params.set("count", String(requestSpec.count))
                    if (typeof requestSpec.since === "string" && requestSpec.since) params.set("since", requestSpec.since)
                    if (typeof requestSpec.until === "string" && requestSpec.until) params.set("until", requestSpec.until)
                    if (Array.isArray(requestSpec.formats))
                      requestSpec.formats.forEach((format) => params.append("format", format))
                    if (typeof requestSpec.rankBy === "string" && requestSpec.rankBy)
                      params.set("rankBy", requestSpec.rankBy)
                    if (typeof requestSpec.selectionMode === "string" && requestSpec.selectionMode)
                      params.set("selectionMode", requestSpec.selectionMode)
                    if (Array.isArray(requestSpec.filters))
                      requestSpec.filters.forEach((filter) => params.append("filter", filter))
                  }
                  return `${baseRoute}${baseRoute.includes("?") ? "&" : "?"}${params.toString()}`
                })()
                const coverageLabel =
                  typeof record.coverage === "number" && record.coverage < 1
                    ? `${Math.round(Math.max(0, record.coverage) * 100)}% coverage`
                    : null
                const availabilityLabel =
                  record.availability === "partial"
                    ? "Partial coverage"
                    : record.availability === "unavailable"
                      ? "Unavailable"
                      : null
                const linkedClaims =
                  evidenceIntegrityStatus === "verified" && evidenceRecords
                    ? claimEvidence.filter(
                        (item) => item.verification === "direct_value_match" && item.evidenceIds.includes(record.id),
                      )
                    : []
                return (
                  <li
                    key={record.id}
                    data-vt-evidence-record-id={record.id}
                    className="grid min-w-0 gap-1 border-[1.5px] border-black/40 bg-[#f8f8f4] p-2"
                  >
                    <div className="flex min-w-0 flex-wrap items-start justify-between gap-1.5">
                      <strong className="min-w-0 break-words text-[10px] font-[1000]">
                        {record.metric || "Evidence record"}: {displayValue}
                      </strong>
                      <StudioSplitLeftBadge sizeVariant="micro" className="shrink-0">
                        {record.freshness}
                      </StudioSplitLeftBadge>
                    </div>
                    <div className="flex min-w-0 flex-wrap gap-1" aria-label="Record readiness">
                      {availabilityLabel ? (
                        <StudioSplitLeftBadge sizeVariant="micro">{availabilityLabel}</StudioSplitLeftBadge>
                      ) : null}
                      {coverageLabel ? <StudioSplitLeftBadge sizeVariant="micro">{coverageLabel}</StudioSplitLeftBadge> : null}
                      {record.epistemicState === "STALE" ? (
                        <StudioSplitLeftBadge sizeVariant="micro">Stale observation</StudioSplitLeftBadge>
                      ) : null}
                      {record.epistemicState === "MISSING" ? (
                        <StudioSplitLeftBadge sizeVariant="micro">Missing value</StudioSplitLeftBadge>
                      ) : null}
                      {record.epistemicState === "CONFLICTING" ? (
                        <StudioSplitLeftBadge sizeVariant="micro">Conflicting values</StudioSplitLeftBadge>
                      ) : null}
                    </div>
                    <dl className="grid min-w-0 grid-cols-2 gap-x-2 gap-y-1 text-[9px] leading-4 sm:grid-cols-3">
                      <div>
                        <dt className="font-black uppercase text-black/50">State</dt>
                        <dd className="break-words font-bold">{record.epistemicState}</dd>
                      </div>
                      <div>
                        <dt className="font-black uppercase text-black/50">Owner</dt>
                        <dd className="break-words font-bold">{record.owner}</dd>
                      </div>
                      <div>
                        <dt className="font-black uppercase text-black/50">Source</dt>
                        <dd className="break-words font-bold">{record.sourceRef}</dd>
                      </div>
                    </dl>
                    {linkedClaims.length ? (
                      <section
                        data-vt-brain-part="claim-evidence-links"
                        aria-label="Claim text with matching recorded value"
                        className="grid min-w-0 gap-1 border-t border-black/20 pt-1.5"
                      >
                        <h5 className="text-[9px] font-[1000] uppercase tracking-[0.06em]">Matching claims</h5>
                        <ul className="grid min-w-0 gap-1">
                          {linkedClaims.map((item, index) => (
                            <li
                              key={`${record.id}:${index}`}
                              className="break-words border-l-2 border-black pl-2 text-[10px] font-bold leading-4"
                            >
                              {item.claim}
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                    {recordHref ? (
                      <Link
                        to={recordHref}
                        className="inline-flex min-h-11 max-w-full items-center gap-1 break-words border-[1.5px] border-black bg-white px-2 py-1 text-[9px] font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                      >
                        {record.owner === "analytics-canon"
                          ? "Open Analytics with evidence context"
                          : "Open source with evidence context"}
                      </Link>
                    ) : (
                      <p className="text-[9px] font-bold text-black/60">Source link unavailable for this record.</p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </details>
      </div>
    </details>
  )
}

export default BrainTurnEvidenceRibbon
