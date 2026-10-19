import React from "react"
import type { AIBrainEvidencePack } from "../../types"
import { StudioSplitLeftBadge } from "../../studio-ui"
import { BrainClaimEvidence } from "./BrainClaimEvidence"

export type BrainTurnEvidenceRibbonProps = {
 turnId: string
 evidencePack: AIBrainEvidencePack
 citedEvidenceIds?: string[]
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
 compact = false,
 className = "",
}) => {
 const preparedCount = evidencePack.items.length
 const citedCount = citedEvidenceIds.length
 const capturedAt = evidencePack.capturedAt
 const captureLabel = capturedAt && Number.isFinite(Date.parse(capturedAt))
  ? new Date(capturedAt).toLocaleString()
  : "Capture time unavailable"
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
  </section>
 )
}

export default BrainTurnEvidenceRibbon
