import React from "react"
import type { BrainHealthSnapshot } from "../../services/brain/BrainHealthSnapshot"

const STATUS_LABEL: Record<BrainHealthSnapshot["status"], string> = {
 healthy: "Healthy",
 attention: "Needs attention",
 insufficient_data: "Insufficient data",
}

const STATUS_TONE: Record<BrainHealthSnapshot["status"], string> = {
 healthy: "#C0F240",
 attention: "#FFD166",
 insufficient_data: "#36E0F6",
}

const Metric: React.FC<{ label: string; value: string | number; detail?: string }> = ({
 label,
 value,
 detail,
}) => (
 <article className="min-w-0 rounded-[8px] border-2 border-black bg-white p-2">
  <p className="text-[9px] font-black uppercase tracking-[0.08em] text-black/60">{label}</p>
  <p className="mt-1 break-words text-lg font-[1000] leading-5">{value}</p>
  {detail ? <p className="mt-1 text-[10px] leading-4 text-black/65">{detail}</p> : null}
 </article>
)

/** Read-only health surface. Snapshot data must come from canonical source adapters. */
export const BrainHealthPanel: React.FC<{
 snapshot: BrainHealthSnapshot
 compact?: boolean
}> = ({ snapshot, compact = false }) => (
 <section
  aria-labelledby="brain-health-title"
  className="grid min-w-0 gap-3 rounded-[12px] border-2 border-black bg-white p-3 shadow-[3px_3px_0_0_#000]"
 >
  <header className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
   <div>
    <h2 id="brain-health-title" className="text-[11px] font-[1000] uppercase tracking-[0.1em]">Brain health</h2>
    <p className="mt-1 text-[10px] text-black/60">Evidence, knowledge, outcomes and learning review</p>
   </div>
   <span
    className="rounded-[5px] border-2 border-black px-2 py-1 text-[9px] font-[1000] uppercase tracking-[0.08em]"
    style={{ backgroundColor: STATUS_TONE[snapshot.status] }}
    role="status"
   >
    {STATUS_LABEL[snapshot.status]}
   </span>
  </header>
  <div className={compact ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2 md:grid-cols-4"}>
   <Metric label="Evidence coverage" value={snapshot.evidence.coverageRatio === null ? "—" : `${Math.round(snapshot.evidence.coverageRatio * 100)}%`} detail={snapshot.evidence.confidence} />
   <Metric label="Stale knowledge" value={snapshot.knowledge.stale} />
   <Metric label="Overdue evaluations" value={snapshot.evaluation.overdue} />
   <Metric label="Learning to review" value={snapshot.learning.pendingReview} />
  </div>
  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
   <Metric label="Missing evidence" value={snapshot.evidence.missingCount} />
   <Metric label="Conflicts" value={snapshot.evidence.contradictionCount + snapshot.knowledge.contradictory} />
   <Metric label="Unattributed outcomes" value={snapshot.evaluation.unattributedOutcomes} />
   <Metric label="Held candidates" value={snapshot.learning.held} />
  </div>
  {snapshot.alerts.length ? (
   <div className="grid gap-1.5" aria-label="Brain health alerts">
    {snapshot.alerts.map((alert) => (
     <p key={alert} className="rounded-[6px] border border-black/25 bg-[#FFD166]/25 px-2 py-1.5 text-[10px] font-bold leading-4">
      {alert}
     </p>
    ))}
   </div>
  ) : (
   <p className="rounded-[6px] border border-black/20 bg-[#C0F240]/25 px-2 py-1.5 text-[10px] font-bold">
    No health alerts from the supplied snapshot.
   </p>
  )}
  <p className="text-[9px] text-black/50">
   Updated {Number.isNaN(Date.parse(snapshot.generatedAt)) ? "at an unknown time" : new Date(snapshot.generatedAt).toLocaleString()}.
   This view summarizes evidence; it does not promote learning or infer causality.
  </p>
 </section>
)
