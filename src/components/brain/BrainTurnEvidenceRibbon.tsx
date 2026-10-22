import React from "react"
import { Link } from "react-router-dom"
import type { AIBrainEvidencePack } from "../../types"
import type { EvidenceRecord } from "../../services/brain/EvidenceRecord"
import { StudioSplitLeftBadge } from "../../studio-ui"
import { BrainClaimEvidence } from "./BrainClaimEvidence"
import { formatEvidenceRequestSpec } from "../../services/brain/BrainEvidenceRequestPresentation"

export type BrainTurnEvidenceRibbonProps = {
 turnId: string
 evidencePack: AIBrainEvidencePack
 citedEvidenceIds?: string[]
 evidenceRecords?: EvidenceRecord[]
 evidenceIntegrityStatus?: "verified" | "unavailable" | "mismatch"
 compact?: boolean
 className?: string
}

const statusTone: Record<AIBrainEvidencePack["dataStatus"], string> = {
 ready: "#C0F240",
 partial: "#FFDA47",
 missing: "#FF7AC8",
}

/**
 * Turn-scoped provenance summary. The evidence pack represents prepared evidence;
 * only response evidence IDs count as cited. Capture time is displayed as supplied,
 * never converted into an inferred "fresh/stale" judgement.
 */
export const BrainTurnEvidenceRibbon: React.FC<BrainTurnEvidenceRibbonProps> = ({
 turnId,
 evidencePack,
 citedEvidenceIds = [],
 evidenceRecords,
 evidenceIntegrityStatus = "unavailable",
 compact = false,
 className = "",
}) => {
 const preparedCount = evidencePack.items.length
 const preparedEvidenceIds = new Set(evidencePack.items.map((item) => item.id))
 const resolvedCitations = new Set(citedEvidenceIds.filter((id) => preparedEvidenceIds.has(id)))
 const unresolvedCitationIds = new Set(citedEvidenceIds.filter((id) => !preparedEvidenceIds.has(id)))
 const citedCount = resolvedCitations.size
 const unresolvedCitationCount = unresolvedCitationIds.size
 const capturedAt = evidencePack.capturedAt
 const captureLabel = capturedAt && Number.isFinite(Date.parse(capturedAt))
  ? new Date(capturedAt).toLocaleString()
  : "Capture time unavailable"
 const requestConstraints = evidencePack.requestSpec && typeof evidencePack.requestSpec === "object"
  ? formatEvidenceRequestSpec(evidencePack.requestSpec)
  : null
 const requestSummary = requestConstraints
  ? requestConstraints.map((item) => item.value).join(" · ")
  : "Selection constraints were not recorded for this saved turn."
 const noPreparedEvidence = preparedCount === 0
 const statusLabel = evidencePack.dataStatus === "missing"
  ? "Missing evidence"
  : evidencePack.dataStatus === "partial"
   ? "Partial evidence"
   : noPreparedEvidence
    ? "No evidence selected"
    : "Evidence ready"
 const statusColor = evidencePack.dataStatus === "missing" || noPreparedEvidence
  ? statusTone.missing
  : statusTone[evidencePack.dataStatus]
 const verifiedRecords = evidenceIntegrityStatus === "verified" ? evidenceRecords : undefined
 const staleCount = verifiedRecords?.filter((record) => record.freshness === "stale" || record.epistemicState === "STALE").length ?? 0
 const missingCount = verifiedRecords?.filter((record) => record.epistemicState === "MISSING" || record.availability === "unavailable").length ?? 0
 const conflictingCount = verifiedRecords?.filter((record) => record.epistemicState === "CONFLICTING").length ?? 0
 const hasPartialCoverage = evidencePack.dataStatus === "partial"
  || Boolean(verifiedRecords?.some((record) => record.availability === "partial" || (typeof record.coverage === "number" && record.coverage < 1)))

 return (
  <section
   className={`grid min-w-0 gap-1.5 border-[2px] border-black bg-white ${compact ? "p-1.5" : "p-2"} ${className}`}
   aria-label="Evidence snapshot for this turn"
   data-vt-brain-turn-id={turnId}
  >
   <div className="flex min-w-0 flex-wrap items-center gap-1.5">
    <span className="min-w-0 flex-1 text-[9px] font-[1000] uppercase tracking-[0.08em]">Evidence snapshot</span>
    <StudioSplitLeftBadge sizeVariant="micro" style={{ backgroundColor: statusColor, width: "max-content" }}>
     {statusLabel}
    </StudioSplitLeftBadge>
   </div>
   <div className="flex flex-wrap items-center gap-1">
    <StudioSplitLeftBadge sizeVariant="micro" style={{ width: "max-content" }}>{preparedCount} prepared</StudioSplitLeftBadge>
    <StudioSplitLeftBadge sizeVariant="micro" style={{ width: "max-content" }}>{citedCount} cited</StudioSplitLeftBadge>
    {unresolvedCitationCount ? (
     <StudioSplitLeftBadge sizeVariant="micro" style={{ backgroundColor: "#FF7AC8", width: "max-content" }}>
      {unresolvedCitationCount} unresolved citation{unresolvedCitationCount === 1 ? "" : "s"}
     </StudioSplitLeftBadge>
    ) : null}
    {evidencePack.missingInputs.length ? (
     <StudioSplitLeftBadge sizeVariant="micro" style={{ backgroundColor: "#FFDA47", width: "max-content" }}>
      {evidencePack.missingInputs.length} gaps
     </StudioSplitLeftBadge>
    ) : null}
   </div>
   {unresolvedCitationCount ? (
    <p data-vt-brain-part="unresolved-citations" role="note" className="break-words text-[10px] font-bold leading-4 text-black/70">
     {unresolvedCitationCount} response citation{unresolvedCitationCount === 1 ? "" : "s"} did not match the prepared evidence list and {unresolvedCitationCount === 1 ? "is" : "are"} not counted as cited.
    </p>
   ) : null}
   <p className="break-words text-[10px] font-bold leading-4 text-black/65">Captured: {captureLabel}</p>
   {noPreparedEvidence ? (
    <p data-vt-brain-part="empty-evidence-selection" role="note" className="break-words border border-black/25 bg-[#f8f8f4] p-2 text-xs font-bold leading-5">
     No evidence items were selected for this turn. This is an empty selection, not proof that the underlying data source has no records.
    </p>
   ) : null}
   {evidenceIntegrityStatus === "verified" && verifiedRecords ? (
    <section data-vt-brain-part="evidence-condition-summary" aria-label="Evidence condition summary" className="grid min-w-0 gap-1 border-t border-black/20 pt-1.5">
     <h4 className="text-[9px] font-[1000] uppercase tracking-[0.06em]">Evidence conditions</h4>
     <div className="flex min-w-0 flex-wrap gap-1">
      {hasPartialCoverage ? <span className="border border-black bg-[#FFDA47] px-1.5 py-1 text-[9px] font-[1000] uppercase">Partial coverage</span> : null}
      {staleCount ? <span className="border border-black bg-[#FFDA47] px-1.5 py-1 text-[9px] font-[1000] uppercase">{staleCount} stale</span> : null}
      {missingCount ? <span className="border border-black bg-[#FF7AC8] px-1.5 py-1 text-[9px] font-[1000] uppercase">{missingCount} missing</span> : null}
      {conflictingCount ? <span className="border border-black bg-[#FF7AC8] px-1.5 py-1 text-[9px] font-[1000] uppercase">{conflictingCount} conflicting</span> : null}
      {!hasPartialCoverage && staleCount === 0 && missingCount === 0 && conflictingCount === 0 ? (
       <span className="border border-black bg-[#C0F240] px-1.5 py-1 text-[9px] font-[1000] uppercase">No recorded quality flags</span>
      ) : null}
     </div>
     <p className="break-words text-[10px] font-bold leading-4 text-black/65">Conditions are calculated from the verified prompt records and this turn's selection status. They describe recorded evidence quality, not a guarantee that every claim is correct.</p>
    </section>
   ) : evidenceIntegrityStatus === "mismatch" ? (
    <p role="note" className="break-words border-t border-black/20 pt-1.5 text-[10px] font-bold leading-4 text-black/65">Evidence quality details are withheld because prompt evidence identity could not be verified.</p>
   ) : null}
   {evidenceIntegrityStatus === "mismatch" ? (
    <div data-vt-brain-part="evidence-identity-warning" role="alert" className="grid gap-0.5 border-[2px] border-black bg-[#FF7AC8] p-2">
     <strong className="text-[10px] font-[1000] uppercase">Evidence identity could not be verified</strong>
     <p className="break-words text-xs font-bold leading-5">The saved record IDs do not match the prompt evidence manifest. Detailed record provenance is withheld so a different evidence set is not presented as the model input.</p>
    </div>
   ) : evidenceIntegrityStatus === "verified" ? (
    <p data-vt-brain-part="evidence-identity-verified" role="status" className="text-[10px] font-bold leading-4 text-black/70">Evidence identity verified against the recorded prompt manifest.</p>
   ) : (
    <p data-vt-brain-part="evidence-identity-unavailable" role="note" className="break-words text-[10px] font-bold leading-4 text-black/65">Prompt evidence identity unavailable for this saved turn; no complete manifest was recorded.</p>
   )}
   <section data-vt-brain-part="evidence-request-constraints" aria-label="Evidence selection request" className="grid min-w-0 gap-1 border-t border-black/20 pt-1.5">
    <div className="grid gap-0.5">
     <h4 className="text-[10px] font-[1000] uppercase tracking-[0.06em]">Selection request</h4>
     <p className="break-words text-xs font-bold leading-5 text-black/70">{requestSummary}</p>
    </div>
    {requestConstraints ? (
     <details className="min-w-0">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-[1000] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">
       <span>All selection constraints</span>
       <span className="ml-auto">{requestConstraints.length}</span>
      </summary>
      <dl className="grid min-w-0 grid-cols-1 gap-1 py-1 sm:grid-cols-2">
       {requestConstraints.map((constraint) => (
        <div key={constraint.id} className="min-w-0 border border-black/30 bg-[#f8f8f4] p-1.5">
         <dt className="text-[9px] font-[1000] uppercase text-black/55">{constraint.label}</dt>
         <dd className="break-words text-xs font-bold leading-5">{constraint.value}</dd>
        </div>
       ))}
      </dl>
     </details>
    ) : <p role="note" className="break-words text-[10px] font-bold leading-4 text-black/60">This is a legacy evidence snapshot. Its original count, format, date, ranking, and text-filter settings cannot be reconstructed safely.</p>}
   </section>
   {evidencePack.missingInputs.length ? (
    <div className="grid gap-0.5">
     <h4 className="text-[9px] font-[1000] uppercase tracking-[0.06em]">Missing inputs</h4>
     <ul className="grid gap-0.5">
      {evidencePack.missingInputs.slice(0, compact ? 2 : 4).map((item) => (
       <li key={item} className="break-words text-[10px] font-bold leading-4">{item}</li>
      ))}
     </ul>
    </div>
   ) : null}
   <BrainClaimEvidence evidencePack={evidencePack} compact label="Inspect evidence" />
   <details data-vt-brain-part="prompt-evidence-records" className="min-w-0 border-t border-black/20 pt-1.5">
    <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 text-[10px] font-[1000] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">
     <span>Prompt evidence records</span>
     <span className="shrink-0">{evidenceIntegrityStatus === "mismatch" ? "Mismatch" : evidenceRecords === undefined ? "Unavailable" : evidenceRecords.length}</span>
    </summary>
    {evidenceIntegrityStatus === "mismatch" ? (
     <p className="break-words py-1 text-[10px] font-bold leading-4 text-black/70">Record-level provenance is withheld because the prompt manifest and saved record IDs disagree.</p>
    ) : evidenceRecords === undefined ? (
     <p className="break-words py-1 text-[10px] font-bold leading-4 text-black/70">
      Record-level provenance is unavailable for this saved turn. The legacy evidence summary above is not proof of the exact typed records supplied to the model.
     </p>
    ) : evidenceRecords.length === 0 ? (
     <p className="break-words py-1 text-[10px] font-bold leading-4 text-black/70">No typed prompt evidence records were recorded for this turn.</p>
    ) : (
     <ul className="grid min-w-0 gap-1.5 py-1">
      {evidenceRecords.map((record) => {
       const sourceRoute = record.provenance.sourceRoute
       const safeSourceRoute = typeof sourceRoute === "string" && sourceRoute.startsWith("/") && !sourceRoute.startsWith("//") ? sourceRoute : null
       const displayValue = record.value === null || record.value === undefined
        ? "Unknown / missing — No zero value is inferred"
        : (typeof record.value === "number" ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(record.value) : String(record.value)) + (record.unit ? " " + record.unit : "")
       const recordHref = (() => {
        const baseRoute = record.owner === "analytics-canon" ? (safeSourceRoute || "/analytics") : safeSourceRoute
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
        if (evidencePack.requestSpec.count !== null) params.set("count", String(evidencePack.requestSpec.count))
        if (evidencePack.requestSpec.since) params.set("since", evidencePack.requestSpec.since)
        if (evidencePack.requestSpec.until) params.set("until", evidencePack.requestSpec.until)
        evidencePack.requestSpec.formats.forEach((format) => params.append("format", format))
        params.set("rankBy", evidencePack.requestSpec.rankBy)
        params.set("selectionMode", evidencePack.requestSpec.selectionMode)
        evidencePack.requestSpec.filters.forEach((filter) => params.append("filter", filter))
        return \`\${baseRoute}\${baseRoute.includes("?") ? "&" : "?"}\${params.toString()}\`
       })()
       const coverageLabel = typeof record.coverage === "number" && record.coverage < 1
        ? \`\${Math.round(Math.max(0, record.coverage) * 100)}% coverage\`
        : null
       const availabilityLabel = record.availability === "partial"
        ? "Partial coverage"
        : record.availability === "unavailable"
         ? "Unavailable"
         : record.availability === "unknown"
          ? "Availability unknown"
          : null
       return (
        <li key={record.id} data-vt-evidence-record-id={record.id} className="grid min-w-0 gap-1 border-[1.5px] border-black/40 bg-[#f8f8f4] p-2">
         <div className="flex min-w-0 flex-wrap items-start justify-between gap-1.5">
          <strong className="min-w-0 break-words text-[10px] font-[1000]">{record.metric || "Evidence record"}: {displayValue}</strong>
          <span className="shrink-0 border border-black px-1 py-0.5 text-[8px] font-black uppercase">{record.freshness}</span>
         </div>
         <div className="flex min-w-0 flex-wrap gap-1" aria-label="Record readiness">
          {availabilityLabel ? <span className="border border-black bg-[#FFDA47] px-1.5 py-0.5 text-[8px] font-[1000] uppercase">{availabilityLabel}</span> : null}
          {coverageLabel ? <span className="border border-black bg-[#FFDA47] px-1.5 py-0.5 text-[8px] font-[1000] uppercase">{coverageLabel}</span> : null}
          {record.epistemicState === "STALE" ? <span className="border border-black bg-[#FFDA47] px-1.5 py-0.5 text-[8px] font-[1000] uppercase">Stale observation</span> : null}
          {record.epistemicState === "MISSING" ? <span className="border border-black bg-[#FF7AC8] px-1.5 py-0.5 text-[8px] font-[1000] uppercase">Missing value</span> : null}
          {record.epistemicState === "CONFLICTING" ? <span className="border border-black bg-[#FF7AC8] px-1.5 py-0.5 text-[8px] font-[1000] uppercase">Conflicting values</span> : null}
         </div>
         <p className="break-all text-[9px] font-bold leading-4 text-black/65">{record.id}</p>
         <dl className="grid min-w-0 grid-cols-2 gap-x-2 gap-y-1 text-[9px] leading-4 sm:grid-cols-3">
          <div><dt className="font-black uppercase text-black/50">State</dt><dd className="break-words font-bold">{record.epistemicState}</dd></div>
          <div><dt className="font-black uppercase text-black/50">Owner</dt><dd className="break-words font-bold">{record.owner}</dd></div>
          <div><dt className="font-black uppercase text-black/50">Source</dt><dd className="break-words font-bold">{record.sourceRef}</dd></div>
          <div><dt className="font-black uppercase text-black/50">Observed</dt><dd className="break-words font-bold">{record.observedAt || "Unknown"}</dd></div>
          <div><dt className="font-black uppercase text-black/50">Updated</dt><dd className="break-words font-bold">{record.updatedAt || "Unknown"}</dd></div>
          <div><dt className="font-black uppercase text-black/50">Window</dt><dd className="break-words font-bold">{record.window?.kind || "Unknown"}</dd></div>
         </dl>
         {record.missingness?.length ? <p className="break-words text-[9px] font-bold leading-4">Missing: {record.missingness.join(", ")}</p> : null}
         {record.limitations?.length ? <ul className="grid gap-0.5">{record.limitations.map((limitation) => <li key={limitation} className="break-words text-[9px] font-bold leading-4">Limitation: {limitation}</li>)}</ul> : null}
         {record.provenance.evidenceIds.length ? <p className="break-words text-[9px] font-bold leading-4">Source evidence IDs: {record.provenance.evidenceIds.join(", ")}</p> : null}
         {recordHref ? <Link to={recordHref} className="inline-flex min-h-11 max-w-full items-center gap-1 break-words border-[1.5px] border-black bg-white px-2 py-1 text-[9px] font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">{record.owner === "analytics-canon" ? "Open exact evidence in Analytics" : "Open source with evidence ID"}</Link> : <p className="text-[9px] font-bold text-black/60">Source link unavailable for this record.</p>}
        </li>
       )
      })}
     </ul>
    )}
   </details>
  </section>
 )
}

export default BrainTurnEvidenceRibbon
