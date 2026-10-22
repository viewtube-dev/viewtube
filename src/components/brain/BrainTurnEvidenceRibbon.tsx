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
 compact = false,
 className = "",
}) => {
 const preparedCount = evidencePack.items.length
 const citedCount = citedEvidenceIds.length
 const capturedAt = evidencePack.capturedAt
 const captureLabel = capturedAt && Number.isFinite(Date.parse(capturedAt))
  ? new Date(capturedAt).toLocaleString()
  : "Capture time unavailable"
 const requestConstraints = evidencePack.requestSpec && typeof evidencePack.requestSpec === "object"
  ? formatEvidenceRequestSpec(evidencePack.requestSpec)
  : null
 const requestSummary = requestConstraints
  ? requestConstraints.slice(0, 4).map((item) => item.value).join(" · ")
  : "Selection constraints were not recorded for this saved turn."
 const statusLabel = evidencePack.dataStatus === "missing"
  ? "Missing evidence"
  : evidencePack.dataStatus === "partial"
   ? "Partial evidence"
   : "Evidence ready"

 return (
  <section
   className={`grid min-w-0 gap-1.5 border-[2px] border-black bg-white ${compact ? "p-1.5" : "p-2"} ${className}`}
   aria-label="Evidence snapshot for this turn"
   data-vt-brain-turn-id={turnId}
  >
   <div className="flex min-w-0 flex-wrap items-center gap-1.5">
    <span className="min-w-0 flex-1 text-[9px] font-[1000] uppercase tracking-[0.08em]">Evidence snapshot</span>
    <StudioSplitLeftBadge sizeVariant="micro" style={{ backgroundColor: statusTone[evidencePack.dataStatus], width: "max-content" }}>
     {statusLabel}
    </StudioSplitLeftBadge>
   </div>
   <div className="flex flex-wrap items-center gap-1">
    <StudioSplitLeftBadge sizeVariant="micro" style={{ width: "max-content" }}>{preparedCount} prepared</StudioSplitLeftBadge>
    <StudioSplitLeftBadge sizeVariant="micro" style={{ width: "max-content" }}>{citedCount} cited</StudioSplitLeftBadge>
    {evidencePack.missingInputs.length ? (
     <StudioSplitLeftBadge sizeVariant="micro" style={{ backgroundColor: "#FFDA47", width: "max-content" }}>
      {evidencePack.missingInputs.length} gaps
     </StudioSplitLeftBadge>
    ) : null}
   </div>
   <p className="break-words text-[10px] font-bold leading-4 text-black/65">Captured: {captureLabel}</p>
   <section data-vt-brain-part="evidence-request-constraints" aria-label="Evidence selection request" className="grid min-w-0 gap-1 border-t border-black/20 pt-1.5">
    <div className="grid gap-0.5">
     <h4 className="text-[9px] font-[1000] uppercase tracking-[0.06em]">Selection request</h4>
     <p className="break-words text-[10px] font-bold leading-4 text-black/70">{requestSummary}</p>
    </div>
    {requestConstraints ? (
     <details className="min-w-0">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-[10px] font-[1000] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">
       <span>All selection constraints</span>
       <span className="ml-auto">{requestConstraints.length}</span>
      </summary>
      <dl className="grid min-w-0 grid-cols-1 gap-1 py-1 sm:grid-cols-2">
       {requestConstraints.map((constraint) => (
        <div key={constraint.id} className="min-w-0 border border-black/30 bg-[#f8f8f4] p-1.5">
         <dt className="text-[8px] font-[1000] uppercase text-black/55">{constraint.label}</dt>
         <dd className="break-words text-[10px] font-bold leading-4">{constraint.value}</dd>
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
     <span className="shrink-0">{evidenceRecords === undefined ? "Unavailable" : evidenceRecords.length}</span>
    </summary>
    {evidenceRecords === undefined ? (
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
       return (
        <li key={record.id} data-vt-evidence-record-id={record.id} className="grid min-w-0 gap-1 border-[1.5px] border-black/40 bg-[#f8f8f4] p-2">
         <div className="flex min-w-0 flex-wrap items-start justify-between gap-1.5">
          <strong className="min-w-0 break-words text-[10px] font-[1000]">{record.metric || "Evidence record"}: {displayValue}</strong>
          <span className="shrink-0 border border-black px-1 py-0.5 text-[8px] font-black uppercase">{record.freshness}</span>
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
         {safeSourceRoute ? <Link to={safeSourceRoute} className="inline-flex min-h-9 w-fit items-center gap-1 border-[1.5px] border-black bg-white px-2 text-[9px] font-black uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">Open source surface</Link> : <p className="text-[9px] font-bold text-black/60">Source link unavailable for this record.</p>}
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
