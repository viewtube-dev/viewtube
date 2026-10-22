import React from "react"

type BrainEvidenceHandoffProps = {
 search: string
}

/**
 * Displays the evidence reference carried from a Brain answer into Analytics.
 * This is intentionally a receipt of incoming context, not a claim that the
 * current Analytics rows have been resolved to the original historical record.
 */
export const BrainEvidenceHandoff: React.FC<BrainEvidenceHandoffProps> = ({ search }) => {
 const params = new URLSearchParams(search)
 const evidenceId = params.get("brainEvidenceId")
 if (!evidenceId) return null

 const values = [
  ["Evidence ID", evidenceId],
  ["Owner", params.get("brainEvidenceSource")],
  ["Source reference", params.get("sourceRef")],
  ["Snapshot", params.get("snapshotId")],
  ["Metric", params.get("metric")],
  ["Evidence window", params.get("window")],
  ["Channel", params.get("channelId")],
  ["Requested count", params.get("count")],
  ["Date start", params.get("since")],
  ["Date end", params.get("until")],
  ["Format", params.getAll("format").join(", ") || null],
  ["Ranking", params.get("rankBy")],
  ["Selection", params.get("selectionMode")],
  ["Filters", params.getAll("filter").join(" · ") || null],
 ].filter((entry): entry is [string, string] => Boolean(entry[1]))

 return (
  <section
   aria-labelledby="brain-evidence-handoff-title"
   role="region"
   data-vt-analytics-brain-evidence-handoff="true"
   className="grid min-w-0 gap-2 border-[2px] border-black bg-[#E7FAFF] p-3"
  >
   <div className="grid min-w-0 gap-1">
    <h2 id="brain-evidence-handoff-title" className="text-xs font-[1000] uppercase tracking-[0.08em]">
     Evidence context from AI Brain
    </h2>
    <p className="break-words text-xs font-bold leading-5">
     This link carried a canonical evidence reference and the original request constraints. The constraints are shown for inspection and are not automatically applied as Analytics filters.
    </p>
    <p className="break-words border-l-[3px] border-black pl-2 text-xs font-bold leading-5">
     This page has not confirmed a matching live Analytics row for this historical evidence record. Treat the reference as traceable context, not as a refreshed value.
    </p>
   </div>
   <dl className="grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
    {values.map(([label, value]) => (
     <div key={label} className="min-w-0 border border-black/30 bg-white p-2">
      <dt className="text-[9px] font-[1000] uppercase text-black/60">{label}</dt>
      <dd className="break-all text-xs font-bold leading-5">{value}</dd>
     </div>
    ))}
   </dl>
  </section>
 )
}

export default BrainEvidenceHandoff
