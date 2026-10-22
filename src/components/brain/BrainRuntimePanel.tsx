import React from "react"
import {
 Activity,
 Boxes,
 Brain,
 FileStack,
 GitBranch,
 Layers3,
 ReceiptText,
 Sparkles,
 Workflow,
} from "lucide-react"

import type {
 BrainRuntimeSnapshot,
} from "../../services/brain/BrainRuntimeSnapshot"

export interface BrainRuntimePanelProps {
 snapshot: BrainRuntimeSnapshot
 embedded?: boolean
}

const INK = "#26324A"

const titleCase = (value: string | null | undefined): string =>
 String(value || "")
  .replace(/[._-]+/g, " ")
  .replace(/\b\w/g, match => match.toUpperCase())

const modelLabel = (value: string | null | undefined): string => {
 if (!value) return ""
 return value
  .replace(/^gemini[-_ ]*/i, "Gemini ")
  .replace(/[-_]+/g, " ")
  .replace(/\bpro\b/i, "Pro")
  .trim()
}

const compactId = (value: string | null | undefined): string => {
 if (!value) return "—"
 if (value.length <= 18) return value
 return `${value.slice(0, 8)}…${value.slice(-6)}`
}

export type BrainOutputReceiptState =
 | { status: "unavailable"; reason: string }
 | { status: "empty"; receiptId: string; reason: string }
 | { status: "unverified"; receiptId: string; reason: string }
 | { status: "unresolved"; receiptId: string; outputAssetIds: string[]; unresolvedAssetIds: string[]; reason: string }
 | { status: "verified"; receiptId: string; contentBuildId: string; outputAssetIds: string[]; versionIds: string[]; generationRecordId: string | null; traceId: string | null }

export const resolveBrainOutputReceiptState = (
 chain: BrainRuntimeSnapshot["provenance"]["latestChain"],
 build: Pick<NonNullable<BrainRuntimeSnapshot["build"]>, "id" | "assetIds"> | null,
): BrainOutputReceiptState => {
 if (!chain?.receiptId) return { status: "unavailable", reason: "No completed ToolReceipt is linked. No saved output is asserted." }
 if (!chain.outputAssetIds.length) {
  return { status: "empty", receiptId: chain.receiptId, reason: "A ToolReceipt is recorded, but it contains no output asset IDs. No saved output card is shown." }
 }
 if (!build || build.id !== chain.contentBuildId) {
  return { status: "unverified", receiptId: chain.receiptId, reason: "The matching ContentBuild snapshot is unavailable. The output card is withheld." }
 }
 const unresolvedAssetIds = chain.outputAssetIds.filter((id) => !build.assetIds.includes(id))
 if (unresolvedAssetIds.length) {
  return {
   status: "unresolved",
   receiptId: chain.receiptId,
   outputAssetIds: [...chain.outputAssetIds],
   unresolvedAssetIds,
   reason: "The ToolReceipt references asset IDs missing from the current ContentBuild snapshot. The output card is withheld.",
  }
 }
 return {
  status: "verified",
  receiptId: chain.receiptId,
  contentBuildId: chain.contentBuildId,
  outputAssetIds: [...chain.outputAssetIds],
  versionIds: [...chain.versionIds],
  generationRecordId: chain.generationRecordId,
  traceId: chain.traceId,
 }
}

const BrainReceiptBackedOutputCard: React.FC<{
 chain: BrainRuntimeSnapshot["provenance"]["latestChain"]
 build: Pick<NonNullable<BrainRuntimeSnapshot["build"]>, "id" | "assetIds"> | null
}> = ({ chain, build }) => {
 const state = resolveBrainOutputReceiptState(chain, build)
 return (
  <section
   data-vt-brain-part="receipt-backed-output-card"
   aria-label="Latest receipt-backed output"
   className="grid min-w-0 gap-1 border-[1.5px] border-black/40 bg-white p-2"
  >
   <h3 className="text-[9px] font-[1000] uppercase tracking-[0.08em]">Latest receipt-backed output</h3>
   {state.status === "verified" ? (
    <>
     <p role="status" className="text-[9px] font-bold leading-4">Verified against the current ContentBuild snapshot.</p>
     <dl className="grid min-w-0 gap-1 text-[9px] leading-4 sm:grid-cols-2">
      <div><dt className="font-[1000] uppercase opacity-60">ToolReceipt</dt><dd className="break-all">{state.receiptId}</dd></div>
      <div><dt className="font-[1000] uppercase opacity-60">ContentBuild</dt><dd className="break-all">{state.contentBuildId}</dd></div>
      <div><dt className="font-[1000] uppercase opacity-60">Generation record</dt><dd className="break-all">{state.generationRecordId || "Not recorded"}</dd></div>
      <div><dt className="font-[1000] uppercase opacity-60">Trace</dt><dd className="break-all">{state.traceId || "Not recorded"}</dd></div>
     </dl>
     <div className="grid min-w-0 gap-0.5">
      <h4 className="text-[9px] font-[1000] uppercase">Output asset IDs</h4>
      <ul className="grid min-w-0 gap-0.5">
       {state.outputAssetIds.map((id) => <li key={id} data-vt-brain-output-asset-id={id} className="break-all text-[9px] font-bold">{id}</li>)}
      </ul>
     </div>
     {state.versionIds.length ? <p className="break-words text-[9px] font-bold leading-4">Version IDs: {state.versionIds.join(", ")}</p> : null}
    </>
   ) : state.status === "unresolved" ? (
    <div role="alert" className="grid gap-1 break-words border border-black bg-[#FFDA47] p-1.5 text-[9px] font-bold leading-4">
     <p>{state.reason}</p>
     <p>Unresolved asset IDs: {state.unresolvedAssetIds.join(", ")}</p>
    </div>
   ) : (
    <p role="status" className="break-words text-[9px] font-bold leading-4">{state.reason}</p>
   )}
  </section>
 )
}

const formatLatency = (latencyMs: number | null): string => {
 if (latencyMs === null) return "—"
 if (latencyMs < 1000) return `${latencyMs}ms`
 return `${(latencyMs / 1000).toFixed(latencyMs >= 10000 ? 0 : 1)}s`
}

const RuntimeCell: React.FC<{
 label: string
 value: React.ReactNode
 detail: React.ReactNode
 icon: React.ReactNode
 accent: string
}> = ({ label, value, detail, icon, accent }) => (
 <article
  data-vt-brain-component="BrainRuntimeCell"
  className="min-w-0 overflow-hidden rounded-[9px] border-[2px] bg-white"
  style={{ borderColor: INK }}
 >
  <div
   className="flex min-h-7 items-center gap-1.5 border-b-[2px] px-2 py-1"
   style={{ backgroundColor: accent, borderColor: INK }}
  >
   <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] bg-white/75" aria-hidden="true">
    {icon}
   </span>
   <span className="min-w-0 break-words text-[9px] font-[1000] uppercase tracking-[0.1em] md:truncate" style={{ color: INK }}>
    {label}
   </span>
  </div>
  <div className="grid min-h-[54px] content-center gap-0.5 px-2 py-1.5" style={{ color: INK }}>
   <div className="min-w-0 break-words text-[11px] font-[1000] leading-4 md:truncate">{value}</div>
   <div className="text-[9px] font-bold leading-[12px] opacity-65 md:line-clamp-2">{detail}</div>
  </div>
 </article>
)

const RuntimePill: React.FC<{
 label: string
 value: React.ReactNode
}> = ({ label, value }) => (
 <span
  data-vt-brain-component="BrainRuntimeMetricPill"
  className="inline-flex min-h-6 items-center gap-1 rounded-[6px] border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.06em]"
  style={{ borderColor: `${INK}55`, color: INK, backgroundColor: "#ffffffb8" }}
 >
  <span className="opacity-55">{label}</span>
  <strong className="text-[9px]">{value}</strong>
 </span>
)

const RuntimeCompactCell: React.FC<{
 label: string
 value: React.ReactNode
 detail: string
 icon: React.ReactNode
 accent: string
}> = ({ label, value, detail, icon, accent }) => (
 <article
  data-vt-brain-component="BrainRuntimeCell"
  data-vt-runtime-cell="compact"
  title={detail}
  className="flex min-w-0 items-center gap-1.5 rounded-[7px] border-[2px] bg-white px-1.5 py-1"
  style={{ borderColor: INK, color: INK }}
 >
  <span
   className="grid h-7 w-7 shrink-0 place-items-center rounded-[5px]"
   style={{ backgroundColor: accent }}
   aria-hidden="true"
  >
   {icon}
  </span>
  <div className="min-w-0">
   <div className="truncate text-[7px] font-[1000] uppercase leading-3 tracking-[0.08em] opacity-60">{label}</div>
   <div className="truncate text-[10px] font-[1000] leading-4">{value}</div>
  </div>
 </article>
)

export const BrainRuntimePanel: React.FC<BrainRuntimePanelProps> = ({ snapshot, embedded = false }) => {
 const { project, build, generation, brain, outcomes, lifecycle, metadataIntelligence } = snapshot
 const request = generation.latestRequest
 const receipt = generation.latestReceipt
 const trace = brain.latestTrace

 if (embedded) {
  return (
   <section
    data-vt-brain-component="BrainRuntimePanel"
    aria-label="Brain runtime status"
    data-vt-brain-runtime-shell="merged"
    className="border-b-[2px] border-black bg-[#EEF2F7] px-2 py-2"
   >
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-6">
     <RuntimeCompactCell
      label="Project"
      icon={<Sparkles size={13} strokeWidth={2.5} />}
      accent="#FFDA47"
      value={project?.name || "No project"}
      detail={project ? `${titleCase(project.status)} · ${compactId(project.id)}` : "Brain is operating channel-wide."}
     />
     <RuntimeCompactCell
      label="ContentBuild"
      icon={<Boxes size={13} strokeWidth={2.5} />}
      accent="#A8DC4A"
      value={build ? `${titleCase(build.stage)} · r${build.revision}` : "Unbound"}
      detail={build ? `${build.assetCount} assets · ${build.versionCount} versions` : "No durable build is bound yet."}
     />
     <RuntimeCompactCell
      label="Context"
      icon={<FileStack size={13} strokeWidth={2.5} />}
      accent="#34CDEA"
      value={request ? `Revision ${request.contextRevision}` : "Waiting"}
      detail={request ? `${request.requestedSlotCount} slots · ${request.evidenceCount} evidence refs` : "No generation context prepared yet."}
     />
     <RuntimeCompactCell
      label="Generation"
      icon={<Workflow size={13} strokeWidth={2.5} />}
      accent="#8C68E8"
      value={request ? titleCase(request.toolId) : "Idle"}
      detail={request ? `${titleCase(request.mode)} ${titleCase(request.targetSlot)}` : "No generation request yet."}
     />
     <RuntimeCompactCell
      label="Receipt"
      icon={<ReceiptText size={13} strokeWidth={2.5} />}
      accent="#F36BB5"
      value={receipt ? `${receipt.outputAssetCount} outputs` : "None"}
      detail={receipt ? `${receipt.versionCount} versions · ${generation.receiptCount} receipts` : "No completed tool receipt yet."}
     />
     <RuntimeCompactCell
      label="Brain Trace"
      icon={<Activity size={13} strokeWidth={2.5} />}
      accent="#50C878"
      value={trace?.modelServed ? modelLabel(trace.modelServed) : (trace ? titleCase(trace.status) : "Idle")}
      detail={trace ? `${trace.evidenceReturned} evidence · ${trace.gradeAverage ?? "—"} grade · ${formatLatency(trace.latencyMs)}` : "No model trace yet."}
     />
    </div>

    <div className="mt-1 hidden flex-wrap gap-1 md:flex">
     <RuntimePill label="Capabilities" value={brain.capabilityCount} />
     <RuntimePill label="Outcomes" value={outcomes.total} />
     <RuntimePill label="Accepted" value={`${outcomes.acceptanceRate}%`} />
     <RuntimePill label="Selected" value={build?.selectedSlotCount || 0} />
     <RuntimePill label="Events" value={build?.eventCount || 0} />
     <RuntimePill label="YouTube" value={titleCase(build?.youtubeStatus || "unbound")} />
     <RuntimePill label="Latest" value={titleCase(lifecycle.latestEventType || "none")} />
     <RuntimePill label="Metadata versions" value={metadataIntelligence.metadataVersionCount} />
     <RuntimePill label="Comparisons" value={`${metadataIntelligence.readyComparisonCount}/${metadataIntelligence.comparisonCount}`} />
     <RuntimePill label="Learning candidates" value={metadataIntelligence.learningCandidateCount} />
     <RuntimePill label="Promoted" value={metadataIntelligence.promotedKnowledgeCount} />
     <RuntimePill label="Evidence chains" value={snapshot.provenance.chainCount} />
     <RuntimePill label="Unresolved chains" value={snapshot.provenance.unresolvedChainCount} />
    </div>
    <details className="mt-1 rounded-[5px] border border-black/30 bg-white px-2 py-1" data-vt-brain-part="embedded-evidence-lineage">
     <summary className="min-h-8 cursor-pointer content-center text-[9px] font-[1000] uppercase underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
      Evidence lineage · {snapshot.provenance.unresolvedChainCount} unresolved
     </summary>
     {snapshot.provenance.latestChain ? (
      <dl className="grid gap-1 py-1 text-[9px] leading-4 sm:grid-cols-2">
       {([
        ["Request", snapshot.provenance.latestChain.requestId],
        ["ContentBuild", snapshot.provenance.latestChain.contentBuildId],
        ["Receipt", snapshot.provenance.latestChain.receiptId],
        ["Trace", snapshot.provenance.latestChain.traceId],
        ["Generation record", snapshot.provenance.latestChain.generationRecordId],
        ["Model served", snapshot.provenance.latestChain.modelServed],
       ] as Array<[string, string | null]>).map(([label, value]) => (
        <div key={label} className="min-w-0">
         <dt className="font-[1000] uppercase opacity-60">{label}</dt>
         <dd className="break-all">{value || "Not recorded"}</dd>
        </div>
       ))}
       <div className="sm:col-span-2 min-w-0">
        <dt className="font-[1000] uppercase opacity-60">Evidence IDs</dt>
        <dd className="break-words">{snapshot.provenance.latestChain.evidenceIds.length ? snapshot.provenance.latestChain.evidenceIds.join(", ") : "No evidence IDs recorded"}</dd>
       </div>
       {snapshot.provenance.latestChain.unresolved.length > 0 ? (
        <div className="sm:col-span-2 break-words" role="status">Unresolved links: {snapshot.provenance.latestChain.unresolved.join(", ")}</div>
       ) : <div className="sm:col-span-2" role="status">No unresolved links recorded for this chain.</div>}
       {snapshot.provenance.latestChain.operationIdentityMismatch ? (
        <div className="sm:col-span-2 border border-black bg-[#FFDA47] p-1 font-[1000]" role="alert">Operation identity mismatch — verify attribution.</div>
       ) : null}
      </dl>
     ) : (
      <p className="py-1 text-[9px] leading-4">No provenance chain is available yet. This is an empty state, not a claim that lineage is complete.</p>
     )}
    </details>
   </section>
  )
 }

 return (
  <section
   data-vt-brain-component="BrainRuntimePanel"
   aria-label="Live Brain runtime"
   data-vt-brain-runtime-shell="card"
   className="overflow-hidden rounded-[11px] border-[2px] bg-[#F8FAFC] shadow-[3px_3px_0_0_rgba(38,50,74,0.16)]"
   style={{ borderColor: INK }}
  >
   <header
    className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] px-2.5 py-1.5"
    style={{ borderColor: INK, backgroundColor: "#36E0F6" }}
   >
    <div className="flex min-w-0 items-center gap-2">
     <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-white/80" aria-hidden="true">
      <Brain size={16} strokeWidth={2.5} />
     </span>
     <div className="min-w-0">
      <h2 className="max-md:whitespace-normal md:truncate text-[11px] font-[1000] uppercase leading-4 tracking-[0.11em]" style={{ color: INK }}>
       LIVE BRAIN RUNTIME
      </h2>
      <p className="max-md:whitespace-normal md:truncate text-[9px] font-bold leading-3 opacity-65" style={{ color: INK }}>
       Project → ContentBuild → Context → Generation → Receipt → learning
      </p>
     </div>
    </div>
    <div className="flex flex-wrap gap-1">
     <RuntimePill label="Capabilities" value={brain.capabilityCount} />
     <RuntimePill label="Outcomes" value={outcomes.total} />
     <RuntimePill label="Accepted" value={`${outcomes.acceptanceRate}%`} />
    </div>
   </header>

   <div className="grid grid-cols-2 gap-1.5 p-2 md:grid-cols-3 xl:grid-cols-6">
    <RuntimeCell
     label="Project"
     icon={<Sparkles size={13} strokeWidth={2.5} />}
     accent="#FFDA47"
     value={project?.name || "No active project"}
     detail={project ? `${titleCase(project.status)} · ${compactId(project.id)}` : "Brain is operating channel-wide."}
    />
    <RuntimeCell
     label="ContentBuild"
     icon={<Boxes size={13} strokeWidth={2.5} />}
     accent="#A8DC4A"
     value={build ? `${titleCase(build.stage)} · r${build.revision}` : "No build bound"}
     detail={build
      ? `${build.assetCount} assets · ${build.versionCount} versions · ${build.variantGroupCount} variant groups`
      : "Open or create a Project to bind durable work."}
    />
    <RuntimeCell
     label="Context"
     icon={<FileStack size={13} strokeWidth={2.5} />}
     accent="#34CDEA"
     value={request ? `Revision ${request.contextRevision}` : "No context yet"}
     detail={request
      ? `${request.requestedSlotCount} slots · ${request.selectedAssetCount} selected · ${request.evidenceCount} evidence refs`
      : "A generative tool has not prepared context yet."}
    />
    <RuntimeCell
     label="Generation"
     icon={<Workflow size={13} strokeWidth={2.5} />}
     accent="#8C68E8"
     value={request ? titleCase(request.toolId) : "No request yet"}
     detail={request
      ? `${titleCase(request.mode)} ${titleCase(request.targetSlot)} · ${generation.requestCount} total requests`
      : "GenerationRequest history will appear here."}
    />
    <RuntimeCell
     label="Receipt"
     icon={<ReceiptText size={13} strokeWidth={2.5} />}
     accent="#F36BB5"
     value={receipt ? `${receipt.outputAssetCount} outputs` : "No receipt yet"}
     detail={receipt
      ? `${receipt.versionCount} versions · ${receipt.variantGroupId ? "variant group linked" : "no variant group"} · ${generation.receiptCount} receipts`
      : "Tool outputs have not closed a generation request."}
    />
    <RuntimeCell
     label="Brain Trace"
     icon={<Activity size={13} strokeWidth={2.5} />}
     accent="#50C878"
     value={trace?.modelServed ? modelLabel(trace.modelServed) : (trace ? titleCase(trace.status) : "No trace yet")}
     detail={trace
      ? `${titleCase(trace.kind)} · ${trace.evidenceReturned} evidence · ${trace.gradeAverage ?? "—"} grade · ${formatLatency(trace.latencyMs)}`
      : "Model, evidence, grading, repair, and latency will appear here."}
    />
   </div>

   <section
    data-vt-brain-part="evidence-lineage"
    aria-label="Evidence lineage"
    className="grid gap-2 border-t px-2 py-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
    style={{ borderColor: `${INK}44`, color: INK, backgroundColor: "#FFFFFF" }}
   >
    <div className="grid content-start gap-1">
     <h3 className="text-[10px] font-[1000] uppercase tracking-[0.1em]">Evidence lineage</h3>
     <div className="flex flex-wrap gap-1">
      <RuntimePill label="Linked chains" value={snapshot.provenance.chainCount} />
      <RuntimePill label="Outcomes" value={snapshot.provenance.attributedOutcomeChainCount} />
      <RuntimePill label="Evaluated" value={snapshot.provenance.evaluatedChainCount} />
      <RuntimePill label="Learning" value={snapshot.provenance.learningChainCount} />
      <RuntimePill label="Unresolved" value={snapshot.provenance.unresolvedChainCount} />
     </div>
     <p className="text-[9px] leading-4 opacity-70">
      Shows recorded lineage links only. It does not expose private model reasoning or infer missing identities.
     </p>
    </div>
    <details className="min-w-0 rounded-[6px] border px-2 py-1.5" style={{ borderColor: `${INK}44` }}>
     <summary className="min-h-8 cursor-pointer content-center text-[10px] font-[1000] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
      Inspect latest lineage
     </summary>
     {snapshot.provenance.latestChain ? (
      <dl className="mt-2 grid gap-1 text-[10px] leading-4 sm:grid-cols-2">
       {([
        ["Request", snapshot.provenance.latestChain.requestId],
        ["ContentBuild", snapshot.provenance.latestChain.contentBuildId],
        ["Operation", snapshot.provenance.latestChain.operationId],
        ["Workflow", snapshot.provenance.latestChain.workflowId],
        ["Receipt", snapshot.provenance.latestChain.receiptId],
        ["Trace", snapshot.provenance.latestChain.traceId],
        ["Generation record", snapshot.provenance.latestChain.generationRecordId],
        ["Model served", snapshot.provenance.latestChain.modelServed],
       ] as Array<[string, string | null]>).map(([label, value]) => (
        <div key={label} className="min-w-0">
         <dt className="font-[1000] uppercase opacity-60">{label}</dt>
         <dd className="break-all">{value || "Not recorded"}</dd>
        </div>
       ))}
       <div className="min-w-0 sm:col-span-2">
        <dt className="font-[1000] uppercase opacity-60">Evidence IDs</dt>
        <dd className="break-words">{snapshot.provenance.latestChain.evidenceIds.length
         ? snapshot.provenance.latestChain.evidenceIds.join(", ")
         : "No evidence IDs recorded"}</dd>
       </div>
       {snapshot.provenance.latestChain.unresolved.length > 0 ? (
        <div className="min-w-0 sm:col-span-2" role="status">
         <dt className="font-[1000] uppercase">Unresolved links</dt>
         <dd className="break-words">{snapshot.provenance.latestChain.unresolved.join(", ")}</dd>
        </div>
       ) : (
        <div className="sm:col-span-2 font-bold" role="status">No unresolved links recorded for this chain.</div>
       )}
       {snapshot.provenance.latestChain.operationIdentityMismatch ? (
        <div className="sm:col-span-2 border border-black bg-[#FFDA47] p-1.5 font-[1000]" role="alert">
         Operation identity mismatch — verify this chain before relying on its attribution.
        </div>
       ) : null}
      </dl>
     ) : (
      <p className="mt-2 text-[10px] leading-4 opacity-70">No provenance chain is available yet. This is an empty state, not a claim that lineage is complete.</p>
     )}
    </details>
   </section>

   <footer
    className="flex flex-wrap items-center gap-1 border-t px-2 py-1.5"
    style={{ borderColor: `${INK}44`, color: INK, backgroundColor: "#EEF2F7" }}
   >
    <RuntimePill label="Selected" value={build?.selectedSlotCount || 0} />
    <RuntimePill label="Relations" value={build?.relationCount || 0} />
    <RuntimePill label="Events" value={build?.eventCount || 0} />
    <RuntimePill label="YouTube" value={titleCase(build?.youtubeStatus || "unbound")} />
    <RuntimePill label="Trace" value={trace ? titleCase(trace.status) : "none"} />
    <RuntimePill label="Evidence gaps" value={trace?.evidenceMissing || 0} />
    <RuntimePill label="Repairs" value={trace?.repairAttempts || 0} />
    <RuntimePill label="Publish events" value={lifecycle.publishEventCount} />
    <RuntimePill label="Analytics" value={lifecycle.analyticsCheckpointCount} />
    <RuntimePill label="Metadata versions" value={metadataIntelligence.metadataVersionCount} />
    <RuntimePill label="Comparisons" value={`${metadataIntelligence.readyComparisonCount}/${metadataIntelligence.comparisonCount}`} />
    <RuntimePill label="Learning candidates" value={metadataIntelligence.learningCandidateCount} />
    <RuntimePill label="Promoted" value={metadataIntelligence.promotedKnowledgeCount} />
    <RuntimePill label="Latest" value={titleCase(lifecycle.latestEventType || "no build event")} />
    <span className="ml-auto hidden items-center gap-1 text-[8px] font-black uppercase tracking-[0.06em] opacity-50 md:inline-flex">
     <GitBranch size={11} aria-hidden="true" />
     <span>{compactId(receipt?.requestId || request?.id)}</span>
     <Layers3 size={11} aria-hidden="true" />
     <span>{brain.traceCount} traces</span>
    </span>
   </footer>
  </section>
 )
}

export default BrainRuntimePanel
