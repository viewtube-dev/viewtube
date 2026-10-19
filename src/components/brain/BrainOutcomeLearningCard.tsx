import React, { useEffect, useMemo, useState } from "react"
import { BRAIN_OUTCOME_EVENT, listBrainOutcomes, summarizeBrainOutcomes, type BrainOutcomeRecord } from "../../services/brain/BrainOutcomeLedger"
import { ASSET_OUTCOME_EVENT, listAssetOutcomes, type AssetOutcome } from "../../services/brain/assetOutcomes"

const label = (value?: string | null) => value ? value.replace(/[-_]/g, " ") : null
const outcomeTone = (value: BrainOutcomeRecord["outcome"]) => value === "accepted" || value === "completed" ? "#3FEE56" : value === "corrected" || value === "rejected" ? "#FFDA47" : "#E8E8E8"

export const BrainOutcomeLearningCard: React.FC<{ channelId?: string | null; maximumItems?: number }> = ({ channelId = null, maximumItems = 4 }) => {
 const [revision, setRevision] = useState(0)
 useEffect(() => {
  if (typeof window === "undefined") return
  const refresh = () => setRevision((value) => value + 1)
  window.addEventListener(BRAIN_OUTCOME_EVENT, refresh)
  window.addEventListener(ASSET_OUTCOME_EVENT, refresh)
  return () => {
   window.removeEventListener(BRAIN_OUTCOME_EVENT, refresh)
   window.removeEventListener(ASSET_OUTCOME_EVENT, refresh)
  }
 }, [])
 const records = useMemo(() => listBrainOutcomes(channelId).slice(0, maximumItems), [channelId, maximumItems, revision])
 const summary = useMemo(() => summarizeBrainOutcomes(channelId), [channelId, revision])
 const assetOutcomes = useMemo(() => listAssetOutcomes({ channelId: channelId || undefined }).slice(0, maximumItems), [channelId, maximumItems, revision])
 if (!channelId) return null

 return (
  <section className="overflow-hidden border-[2px] border-black bg-white" aria-label="Brain outcomes and learning lineage">
   <header className="border-b-[2px] border-black bg-[#3FEE56] px-3 py-2">
    <h3 className="text-[10px] font-[1000] uppercase leading-4 tracking-[0.08em]">Outcomes &amp; Learning</h3>
    <p className="text-[9px] font-bold leading-3 text-black/70">Recorded decisions and lineage. Candidate review and promotion remain in the Evaluation Inbox.</p>
   </header>
   <div className="grid gap-2 p-2">
    <dl className="grid grid-cols-3 gap-1">
     <div className="border-[2px] border-black p-1"><dt className="text-[8px] font-black uppercase">Recorded</dt><dd className="text-[16px] font-[1000] tabular-nums">{summary.total}</dd></div>
     <div className="border-[2px] border-black p-1"><dt className="text-[8px] font-black uppercase">Accepted / done</dt><dd className="text-[16px] font-[1000] tabular-nums">{summary.accepted}</dd></div>
     <div className="border-[2px] border-black p-1"><dt className="text-[8px] font-black uppercase">Corrected / declined</dt><dd className="text-[16px] font-[1000] tabular-nums">{summary.negative}</dd></div>
    </dl>
    {!records.length ? <p className="border border-black/20 bg-[#f7f7f4] p-2 text-[9px] font-bold leading-4 text-black/60">No outcome records are visible in the current local ledger. This does not prove no outcomes exist in durable services.</p> : (
     <ol className="grid gap-1.5">
      {records.map((record) => {
       const lineage = [
        record.projectId ? `Project ${record.projectId}` : null,
        record.contentBuildId ? `ContentBuild ${record.contentBuildId}` : null,
        record.assetId ? `Asset ${record.assetId}` : null,
        record.publishedVideoId ? `Video ${record.publishedVideoId}` : null,
        record.actionPacketId ? `ActionPacket ${record.actionPacketId}` : null,
        record.operationId ? `Operation ${record.operationId}` : null,
        record.traceId ? `Trace ${record.traceId}` : null,
        ...(record.evidenceIds || []).slice(0, 2).map((id) => `Evidence ${id}`),
       ].filter(Boolean)
       return <li key={record.id} className="overflow-hidden border-[2px] border-black">
        <div className="flex items-center justify-between gap-2 border-b border-black px-2 py-1" style={{ backgroundColor: outcomeTone(record.outcome) }}>
         <strong className="text-[9px] font-[1000] uppercase">{label(record.outcome)}</strong>
         <time className="text-[8px] font-bold">{new Date(record.createdAt).toLocaleDateString()}</time>
        </div>
        <div className="grid gap-1 p-2">
         <p className="text-[9px] font-bold leading-3">{record.summary}</p>
         <p className="text-[8px] font-black uppercase text-black/60">{label(record.sourceToolId)}{record.targetToolId ? ` → ${label(record.targetToolId)}` : ""}</p>
         {lineage.length ? <p className="break-words text-[8px] leading-3 text-black/60">{lineage.join(" · ")}</p> : <p className="text-[8px] text-black/50">No project, asset, action, trace or evidence lineage was recorded for this event.</p>}
        </div>
       </li>
      })}
     </ol>
    )}

    <div className="border-t-[2px] border-black pt-2">
     <h4 className="mb-1 text-[9px] font-[1000] uppercase">Creator asset decisions</h4>
     <p className="mb-2 text-[8px] font-bold leading-3 text-black/60">Asset outcomes are shown separately from general Brain outcomes so one action is not counted twice.</p>
     {!assetOutcomes.length ? <p className="border border-black/20 bg-[#f7f7f4] p-2 text-[9px] font-bold leading-4 text-black/60">No asset outcome records are visible in the current local ledger.</p> : (
      <ol className="grid gap-1.5">
       {assetOutcomes.map((asset: AssetOutcome) => {
        const lineage = [
         asset.projectId ? `Project ${asset.projectId}` : null,
         asset.contentBuildId ? `ContentBuild ${asset.contentBuildId}` : null,
         asset.assetId ? `Asset ${asset.assetId}` : null,
         asset.actionPacketId ? `ActionPacket ${asset.actionPacketId}` : null,
         asset.operationId ? `Operation ${asset.operationId}` : null,
         asset.traceId ? `Trace ${asset.traceId}` : null,
         asset.publishedVideoId ? `Published video ${asset.publishedVideoId}` : null,
         ...(asset.evidenceIds || []).slice(0, 2).map((id) => `Evidence ${id}`),
        ].filter(Boolean)
        return <li key={asset.id} className="border-[2px] border-black">
         <div className="flex items-center justify-between gap-2 border-b border-black px-2 py-1" style={{ backgroundColor: asset.kind === "accepted" || asset.kind === "published" ? "#3FEE56" : asset.kind === "edited" || asset.kind === "rejected" ? "#FFDA47" : "#E8E8E8" }}>
          <strong className="text-[9px] font-[1000] uppercase">{label(asset.kind)}</strong>
          <time className="text-[8px] font-bold">{new Date(asset.createdAt).toLocaleDateString()}</time>
         </div>
         <div className="grid gap-1 p-2">
          <p className="text-[8px] font-bold uppercase text-black/60">{label(asset.assetType)} · {asset.assetId}</p>
          {asset.note ? <p className="text-[9px] leading-3">{asset.note}</p> : null}
          {typeof asset.editRatio === "number" ? <p className="text-[8px] font-bold">Edited proportion: {Math.round(asset.editRatio * 100)}% (measured edit metadata)</p> : null}
          {lineage.length ? <p className="break-words text-[8px] leading-3 text-black/60">{lineage.join(" · ")}</p> : <p className="text-[8px] text-black/50">No linked project, ContentBuild, operation or publication identity recorded.</p>}
         </div>
        </li>
       })}
      </ol>
     )}
    </div>
   </div>
  </section>
 )
}

export default BrainOutcomeLearningCard
