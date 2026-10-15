import React, { useMemo } from "react"
import type { CanonicalIntelligenceEvidenceBundle } from "../../services/analytics-canon"
import { buildCurrentCanonicalAnalyticsInsights } from "../../services/brain/CurrentCanonicalAnalyticsInsights"
import { presentAnalyticsFindings } from "../../services/brain/AnalyticsIntelligenceWorkflow"

const number = (value: number | null) => value === null
 ? "Not defined"
 : value.toLocaleString(undefined, { maximumFractionDigits: 2 })

/** Renders only validated trend findings built from full canonical daily rows. */
export const DeterministicAnalyticsFindingsPanel: React.FC<{
 evidence: CanonicalIntelligenceEvidenceBundle | null
}> = ({ evidence }) => {
 const result = useMemo(() => {
  if (!evidence?.channelId) return { findings: [], limitations: ["Resolve a channel-scoped canonical snapshot to calculate findings."] }
  const current = buildCurrentCanonicalAnalyticsInsights({
   channelId: evidence.channelId,
   expectedSnapshotId: evidence.snapshotId,
  })
  return {
   findings: presentAnalyticsFindings(current.findings, evidence.channelId),
   limitations: current.limitations,
  }
 }, [evidence?.channelId, evidence?.snapshotId])

 return (
  <section aria-labelledby="deterministic-analytics-findings-title" className="mb-6 overflow-hidden rounded-2xl border-[3px] border-black bg-white shadow-[5px_5px_0px_0px_black]">
   <header className="border-b-[3px] border-black bg-[#CCFF00] p-4">
    <p className="text-[9px] font-black uppercase tracking-[0.16em]">Canonical rows · deterministic calculations</p>
    <h3 id="deterministic-analytics-findings-title" className="text-xl font-[1000] uppercase tracking-tight">Analytics Findings</h3>
    <p className="mt-1 text-xs font-bold text-black/65">Observed values and trends are shown separately from explanations and recommendations.</p>
   </header>
   <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
    {result.findings.map((finding) => (
     <article key={finding.id} className="min-w-0 border-2 border-black bg-[#F7F5EF] p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
       <span className="border-2 border-black bg-white px-2 py-1 text-[9px] font-black uppercase">{finding.kind}</span>
       <span className="text-[9px] font-black uppercase">Confidence heuristic {Math.round(finding.confidence * 100)}%</span>
      </div>
      <h4 className="text-sm font-black uppercase">{finding.title}</h4>
      <p className="mt-2 text-xs font-bold">{finding.layers.fact.text}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
       <div className="border border-black/20 bg-white p-2"><dt className="font-black uppercase">Baseline</dt><dd className="mt-1 text-sm font-black">{number(finding.baselineValue)}</dd></div>
       <div className="border border-black/20 bg-white p-2"><dt className="font-black uppercase">Delta</dt><dd className="mt-1 text-sm font-black">{number(finding.delta)}</dd></div>
      </dl>
      <details className="mt-3 border-t border-black/20 pt-2 text-[10px]">
       <summary className="cursor-pointer font-black uppercase">Formula & provenance</summary>
       <p className="mt-2 break-words font-bold">{finding.formula}</p>
       <p className="mt-1 break-words text-black/65">Snapshots: {finding.sourceSnapshotIds.join(", ")}</p>
       <p className="mt-1 break-words text-black/65">Evidence: {finding.evidenceRefs.join(", ")}</p>
       {finding.limitations.map((limitation) => <p key={limitation} className="mt-1 text-black/65">Limit: {limitation}</p>)}
      </details>
      <div className="mt-3 border-t border-black/20 pt-2">
       <p className="text-[9px] font-black uppercase text-black/50">Interpretation</p>
       <p className="mt-1 text-xs">{finding.layers.interpretation || "Not generated; deterministic facts remain unchanged."}</p>
       <p className="mt-2 text-[9px] font-black uppercase text-black/50">Hypothesis</p>
       <p className="mt-1 text-xs">{finding.layers.hypothesis || "None asserted."}</p>
       <p className="mt-2 text-[9px] font-black uppercase text-black/50">Recommendation</p>
       <p className="mt-1 text-xs">{finding.layers.recommendation || "No action proposed from this trend alone."}</p>
      </div>
     </article>
    ))}
    {result.findings.length === 0 && (
     <div className="border-2 border-dashed border-black/30 bg-white p-4 text-xs font-bold md:col-span-2 xl:col-span-3">
      No validated trend findings are available from this snapshot. The system will not infer missing values or treat the report's bounded sample rows as a complete series.
     </div>
    )}
   </div>
   {result.limitations.length > 0 && (
    <details className="border-t-[3px] border-black bg-[#FFF9D9] p-4 text-xs">
     <summary className="cursor-pointer font-black uppercase">Calculation limitations ({result.limitations.length})</summary>
     <ul className="mt-2 list-disc space-y-1 pl-5">
      {result.limitations.slice(0, 8).map((limitation) => <li key={limitation}>{limitation}</li>)}
     </ul>
    </details>
   )}
  </section>
 )
}
