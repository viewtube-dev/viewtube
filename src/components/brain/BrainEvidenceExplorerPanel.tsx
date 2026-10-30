import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { StudioButton, StudioSplitLeftBadge, StudioTextInput } from "../../studio-ui"
import {
 CANONICAL_ANALYTICS_WINDOWS,
 type AnalyticsWindow,
 type CanonicalIntelligenceDatasetManifest,
 type CanonicalIntelligenceDatasetStatus,
} from "../../services/analytics-canon"
import { resolveEvidenceIntelligence, type EvidenceIntelligenceEnvelope } from "../../services/brain/EvidenceIntelligenceResolver"
import type { EvidenceRecord } from "../../services/brain/EvidenceRecord"
import { readBrainUserControls } from "../../services/brain/BrainUserControls"

type DatasetStatusFilter = "all" | CanonicalIntelligenceDatasetStatus

const DEFAULT_WINDOW = (CANONICAL_ANALYTICS_WINDOWS.includes("28d")
 ? "28d"
 : CANONICAL_ANALYTICS_WINDOWS[0] || "28d") as AnalyticsWindow

export const filterEvidenceExplorerDatasets = (
 datasets: CanonicalIntelligenceDatasetManifest[],
 query: string,
 status: DatasetStatusFilter = "all",
): CanonicalIntelligenceDatasetManifest[] => {
 const term = query.trim().toLocaleLowerCase()
 return datasets.filter((dataset) => {
  if (status !== "all" && dataset.status !== status) return false
  if (!term) return true
  return [
   dataset.id,
   dataset.label,
   dataset.description,
   ...dataset.missingMetrics,
   ...dataset.sources,
  ].join(" ").toLocaleLowerCase().includes(term)
 })
}

export const filterEvidenceExplorerRecords = (
 records: EvidenceRecord[],
 query: string,
 datasetId: string | null = null,
): EvidenceRecord[] => {
 const term = query.trim().toLocaleLowerCase()
 return records.filter((record) => {
  if (datasetId && record.datasetId !== datasetId) return false
  if (!term) return true
  return [
   record.id,
   record.owner,
   record.sourceRef,
   record.datasetId,
   record.metric,
   record.epistemicState,
   record.freshness,
   ...(record.missingness || []),
   ...(record.limitations || []),
  ].filter(Boolean).join(" ").toLocaleLowerCase().includes(term)
 })
}

export const formatEvidenceExplorerValue = (record: EvidenceRecord): string => {
 if (record.epistemicState === "MISSING" || record.value === null || record.value === undefined) return "Unknown"
 return String(record.value)
}

type EvidenceReadState =
 | { status: "ready"; envelope: EvidenceIntelligenceEnvelope }
 | { status: "unavailable" | "restricted" | "unscoped" | "error" }

const readEvidence = (channelId: string | null, window: AnalyticsWindow): EvidenceReadState => {
 if (!channelId) return { status: "unscoped" }
 const controls = readBrainUserControls(channelId)
 if (!controls.enabled || !controls.allowAnalytics || !controls.showEvidence) return { status: "restricted" }
 try {
  const envelope = resolveEvidenceIntelligence({ channelId, window })
  return envelope.scopeUsable ? { status: "ready", envelope } : { status: "unavailable" }
 } catch {
  return { status: "error" }
 }
}

const statusLabel: Record<CanonicalIntelligenceDatasetStatus, string> = {
 available: "Available",
 partial: "Partial",
 stale: "Stale",
 failed: "Failed",
 unavailable: "Unavailable",
}

const statusTone: Record<CanonicalIntelligenceDatasetStatus, string> = {
 available: "bg-[#3FEE56]",
 partial: "bg-[#FFDA47]",
 stale: "bg-[#FFDA47]",
 failed: "bg-[#FF7497]",
 unavailable: "bg-[#E5E7EB]",
}

const EvidenceStatusBadge: React.FC<{ status: CanonicalIntelligenceDatasetStatus }> = ({ status }) => (
 <StudioSplitLeftBadge sizeVariant="micro" className={statusTone[status]}>
  {statusLabel[status]}
 </StudioSplitLeftBadge>
)

const EvidenceRecordCard: React.FC<{ record: EvidenceRecord }> = ({ record }) => (
 <article data-vt-brain-evidence-record={record.id} className="grid min-w-0 gap-1 rounded-[7px] border-[1.5px] border-black/25 bg-white p-2">
  <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
   <div className="min-w-0 break-words text-[10px] font-black uppercase">{record.metric || record.entityType || record.sourceRef}</div>
   <div className="flex flex-wrap items-center gap-1">
    <StudioSplitLeftBadge sizeVariant="micro">{record.epistemicState.replace(/_/g, " ")}</StudioSplitLeftBadge>
    <StudioSplitLeftBadge sizeVariant="micro" className={record.freshness === "stale" ? "bg-[#FFDA47]" : "bg-[#E5E7EB]"}>{record.freshness}</StudioSplitLeftBadge>
   </div>
  </div>
  <div className="break-words text-sm font-[1000]">
   {formatEvidenceExplorerValue(record)}{record.unit ? <span className="ml-1 text-[10px] font-bold">{record.unit}</span> : null}
  </div>
  <dl className="grid min-w-0 gap-x-3 gap-y-1 text-[9px] leading-4 sm:grid-cols-2">
   <div className="min-w-0"><dt className="font-black uppercase text-black/50">Owner</dt><dd className="break-all">{record.owner}</dd></div>
   <div className="min-w-0"><dt className="font-black uppercase text-black/50">Dataset</dt><dd className="break-all">{record.datasetId || "Not recorded"}</dd></div>
   <div className="min-w-0"><dt className="font-black uppercase text-black/50">Source reference</dt><dd className="break-all">{record.sourceRef}</dd></div>
   <div className="min-w-0"><dt className="font-black uppercase text-black/50">Snapshot</dt><dd className="break-all">{record.sourceSnapshotId || "Not recorded"}</dd></div>
   <div className="min-w-0"><dt className="font-black uppercase text-black/50">Observed</dt><dd className="break-all">{record.observedAt || "Not recorded"}</dd></div>
   <div className="min-w-0"><dt className="font-black uppercase text-black/50">Updated</dt><dd className="break-all">{record.updatedAt || "Not recorded"}</dd></div>
  </dl>
  {record.missingness?.length ? <p className="break-words text-[10px] font-bold text-black/65">Missing: {record.missingness.join(", ")}</p> : null}
  {record.limitations?.length ? <p className="break-words text-[10px] font-bold text-black/65">Limitations: {record.limitations.join(" · ")}</p> : null}
  {record.provenance.evidenceIds.length ? <p className="break-all text-[9px] text-black/55">Evidence refs: {record.provenance.evidenceIds.join(", ")}</p> : null}
  {record.provenance.sourceRoute?.startsWith("/") ? <Link className="w-fit text-[9px] font-black uppercase underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black" to={record.provenance.sourceRoute}>Open canonical source</Link> : null}
 </article>
)

export const BrainEvidenceExplorerPanel: React.FC<{ channelId: string | null }> = ({ channelId }) => {
 const [window, setWindow] = useState<AnalyticsWindow>(DEFAULT_WINDOW)
 const [query, setQuery] = useState("")
 const [status, setStatus] = useState<DatasetStatusFilter>("all")
 const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null)
 const [refreshRevision, setRefreshRevision] = useState(0)
 const readState = useMemo(
  () => readEvidence(channelId, window),
  [channelId, window, refreshRevision],
 )
 const envelope = readState.status === "ready" ? readState.envelope : null
 const datasets = useMemo(
  () => envelope ? filterEvidenceExplorerDatasets(envelope.canonicalEvidence.datasets, query, status) : [],
  [envelope, query, status],
 )
 const records = useMemo(
  () => envelope ? filterEvidenceExplorerRecords(envelope.evidenceRecords, query, selectedDatasetId) : [],
  [envelope, query, selectedDatasetId],
 )
 const selectedDataset = selectedDatasetId
  ? envelope?.evidenceQuality.datasets.find((dataset) => dataset.datasetId === selectedDatasetId) || null
  : null
 const health = envelope?.evidenceQuality

 return (
  <section data-vt-brain-component="BrainEvidenceExplorer" aria-labelledby="brain-evidence-explorer-title" className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#f3f4f6]">
   <header className="grid shrink-0 gap-2 border-b-[2px] border-black bg-white p-3 sm:flex sm:items-center sm:justify-between">
    <div className="min-w-0">
     <h2 id="brain-evidence-explorer-title" className="text-sm font-[1000] uppercase tracking-[0.08em]">Evidence Explorer</h2>
     <p className="text-[10px] font-bold text-black/60">Inspect canonical source health, evidence scope, freshness and provenance.</p>
    </div>
    <div className="flex flex-wrap items-center gap-1">
     <label className="flex min-h-9 items-center gap-1 text-[9px] font-black uppercase">
      Window
      <select aria-label="Evidence time window" value={window} onChange={(event) => setWindow(event.currentTarget.value as AnalyticsWindow)} className="min-h-9 max-w-[120px] rounded-[4px] border-[2px] border-black bg-white px-2 text-[10px] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
       {CANONICAL_ANALYTICS_WINDOWS.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
     </label>
     <StudioButton sizeVariant="compact" tone="neutral" type="button" onClick={() => setRefreshRevision((value) => value + 1)}>Recheck snapshot</StudioButton>
    </div>
   </header>

   <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
    {readState.status === "unscoped" ? (
     <div role="status" className="rounded-[8px] border-[2px] border-black bg-white p-4">
      <h3 className="text-xs font-black uppercase">Connect a channel to inspect evidence</h3>
      <p className="mt-1 text-xs font-bold leading-5 text-black/65">A verified channel ID is required. A channel handle or display name is not enough to establish analytics scope.</p>
     </div>
    ) : readState.status === "restricted" ? (
     <div role="status" className="rounded-[8px] border-[2px] border-black bg-white p-4">
      <h3 className="text-xs font-black uppercase">Evidence access is disabled</h3>
      <p className="mt-1 text-xs font-bold leading-5 text-black/65">Brain's analytics or evidence display permission is off for this channel. Change it in Brain Access settings to view these records.</p>
     </div>
    ) : readState.status === "error" ? (
     <div role="alert" className="rounded-[8px] border-[2px] border-black bg-white p-4">
      <h3 className="text-xs font-black uppercase">Evidence snapshot could not be read</h3>
      <p className="mt-1 text-xs font-bold leading-5 text-black/65">The canonical evidence reader returned an error. No replacement or estimated values are shown.</p>
     </div>
    ) : readState.status === "unavailable" ? (
     <div role="status" className="rounded-[8px] border-[2px] border-black bg-white p-4">
      <h3 className="text-xs font-black uppercase">Evidence scope could not be verified</h3>
      <p className="mt-1 text-xs font-bold leading-5 text-black/65">The current canonical snapshot does not match this channel exactly, so channel-specific records are withheld.</p>
     </div>
    ) : envelope && health ? (
     <div className="grid min-w-0 gap-3">
      <section aria-label="Evidence health summary" className="grid gap-2 rounded-[8px] border-[2px] border-black bg-white p-3 sm:grid-cols-2 xl:grid-cols-4">
       <div><div className="text-[9px] font-black uppercase text-black/50">Evidence fitness</div><div className="text-lg font-[1000] uppercase">{health.confidence}</div></div>
       <div><div className="text-[9px] font-black uppercase text-black/50">Coverage</div><div className="text-lg font-[1000]">{Math.round(health.coverageRatio * 100)}%</div></div>
       <div><div className="text-[9px] font-black uppercase text-black/50">Datasets</div><div className="text-lg font-[1000]">{health.datasets.length}</div></div>
       <div><div className="text-[9px] font-black uppercase text-black/50">Evidence records</div><div className="text-lg font-[1000]">{envelope.evidenceRecords.length}</div></div>
       <p className="break-all text-[9px] font-bold text-black/55 sm:col-span-2 xl:col-span-4">Channel {health.channelId || "unavailable"} · Snapshot {health.sourceSnapshotId} · Window {health.selectedWindow} · Scope {health.scopeMatch}</p>
       {health.limitations.length ? <ul className="grid gap-1 text-[10px] font-bold text-black/65 sm:col-span-2 xl:col-span-4">{health.limitations.map((item) => <li key={item}>• {item}</li>)}</ul> : null}
      </section>

      <p className="rounded-[6px] border border-black/20 bg-[#FFDA47]/25 p-2 text-[10px] font-bold leading-4">This panel reads the current canonical channel snapshot. It does not claim that every record shown was used by a particular past answer; use that answer's evidence ribbon to inspect turn-specific references. Rechecking this view does not refresh upstream YouTube data.</p>

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.7fr)]">
       <section className="grid min-w-0 content-start gap-2">
        <div className="grid gap-1">
         <label className="text-[9px] font-black uppercase" htmlFor="brain-evidence-search">Search datasets and records</label>
         <StudioTextInput id="brain-evidence-search" sizeVariant="compact" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Dataset, metric, source or ID" className="w-full" />
         <label className="text-[9px] font-black uppercase" htmlFor="brain-evidence-status">Dataset status</label>
         <select id="brain-evidence-status" value={status} onChange={(event) => setStatus(event.currentTarget.value as DatasetStatusFilter)} className="min-h-9 w-full rounded-[4px] border-[2px] border-black bg-white px-2 text-[10px] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">
          <option value="all">All statuses</option>
          {(["available", "partial", "stale", "failed", "unavailable"] as const).map((item) => <option key={item} value={item}>{statusLabel[item]}</option>)}
         </select>
        </div>
        <div className="grid gap-1">
         <h3 className="text-[10px] font-black uppercase">Datasets · {datasets.length}</h3>
         {datasets.length ? datasets.map((dataset) => (
          <button key={dataset.id} type="button" aria-pressed={selectedDatasetId === dataset.id} onClick={() => setSelectedDatasetId((current) => current === dataset.id ? null : dataset.id)} className={`grid min-w-0 gap-1 rounded-[6px] border-[2px] border-black p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${selectedDatasetId === dataset.datasetId ? "bg-[#36E0F6]/25" : "bg-white hover:bg-[#36E0F6]/10"}`}>
           <span className="flex min-w-0 flex-wrap items-center justify-between gap-1"><span className="break-words text-[10px] font-black uppercase">{dataset.label}</span><EvidenceStatusBadge status={dataset.status} /></span>
           <span className="break-all text-[9px] text-black/55">{dataset.id} · {dataset.rowCount} rows · {dataset.evidenceRefs.length} refs</span>
           {dataset.missingMetrics.length ? <span className="break-words text-[9px] font-bold text-black/65">Missing: {dataset.missingMetrics.join(", ")}</span> : null}
           {dataset.updatedAt ? <span className="text-[9px] text-black/55">Updated {dataset.updatedAt}</span> : null}
          </button>
         )) : <p className="rounded-[6px] border border-black/20 bg-white p-2 text-[10px] font-bold text-black/60">No datasets match these filters.</p>}
        </div>
       </section>

       <section className="grid min-w-0 content-start gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
         <h3 className="text-[10px] font-black uppercase">Evidence records · {records.length}</h3>
         {selectedDataset ? <StudioButton sizeVariant="mini" tone="neutral" type="button" onClick={() => setSelectedDatasetId(null)}>Clear dataset filter</StudioButton> : null}
        </div>
        {records.length ? records.map((record) => <EvidenceRecordCard key={record.id} record={record} />) : (
         <p role="status" className="rounded-[6px] border border-black/20 bg-white p-3 text-[10px] font-bold text-black/60">{selectedDatasetId ? "No records match this dataset and search." : "No canonical EvidenceRecord projections are available for this snapshot. Dataset readiness above remains the source for missing and unavailable inputs."}</p>
        )}
       </section>
      </div>
     </div>
    ) : null}
   </div>
  </section>
 )
}

export default BrainEvidenceExplorerPanel
