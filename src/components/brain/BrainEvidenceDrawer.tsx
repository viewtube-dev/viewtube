import React from "react"
import { Info, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { AIBrainEvidencePack } from "../../types"
import { StudioSplitLeftBadge, StudioDisclosureSummary } from "../../studio-ui"

/**
 * Creator-facing "Why this recommendation?" surface.
 *
 * It intentionally explains channel evidence in creator language instead of
 * exposing storage keys, internal IDs, model traces, or sync implementation.
 * Optional confidence/inference metadata lets every Brain surface use the
 * same trust UI without changing the canonical evidence-pack schema.
 */
const EVIDENCE_BADGE_TONE_CLASS: Record<string, string> = {
 "#36E0F6": "bg-[#36E0F6]",
 "#FFDA47": "bg-[#FFDA47]",
 "#C0F240": "bg-[#C0F240]",
}

const EvidenceBadge: React.FC<{ label: string; tone: string }> = ({ label, tone }) => (
 <StudioSplitLeftBadge
  sizeVariant="micro"
  icon={<span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full border border-black bg-black/70" />}
  className={`w-max max-w-full ${EVIDENCE_BADGE_TONE_CLASS[tone] || "bg-white"}`}
 >
  {label}
 </StudioSplitLeftBadge>
)

export const BrainEvidenceDrawer: React.FC<{
 evidencePack: AIBrainEvidencePack
 summaryLabel?: string
 className?: string
 compact?: boolean
 confidence?: "low" | "medium" | "high" | number | null
 inference?: boolean
 caveats?: string[]
 evidenceChips?: string[]
 sourceRoute?: string | null
 sourceLabel?: string
}> = ({
 evidencePack,
 summaryLabel = "Why this recommendation",
 className = "",
 compact = false,
 confidence = null,
 inference = true,
 caveats = [],
 evidenceChips = [],
 sourceRoute = "/analytics",
 sourceLabel = "Open source in Analytics",
}) => {
 const missing = evidencePack.missingInputs.slice(0, 4)
 const evidenceItems = evidencePack.items
 const visibleEvidenceItems = evidenceItems.slice(0, 5)
 const sourceCount = evidenceItems.length
 const provenanceCount = evidenceChips.length
 const hasNoEvidenceDetails = sourceCount === 0

 const evidenceHref = (item: AIBrainEvidencePack["items"][number]): string => {
  const params = new URLSearchParams()
  params.set("brainEvidenceId", item.id)
  params.set("brainEvidenceSource", item.source)
  params.set("brainEvidenceLabel", item.label)
  const requestSpec = evidencePack.requestSpec && typeof evidencePack.requestSpec === "object" ? evidencePack.requestSpec : null
  if (requestSpec) {
   params.set("rankBy", requestSpec.rankBy)
   params.set("selectionMode", requestSpec.selectionMode)
   if (typeof requestSpec.count === "number") params.set("count", String(requestSpec.count))
   if (typeof requestSpec.since === "string" && requestSpec.since) params.set("since", requestSpec.since)
   if (typeof requestSpec.until === "string" && requestSpec.until) params.set("until", requestSpec.until)
   if (Array.isArray(requestSpec.formats)) requestSpec.formats.forEach((format) => params.append("format", format))
   if (typeof requestSpec.rankBy === "string" && requestSpec.rankBy) params.set("rankBy", requestSpec.rankBy)
   if (typeof requestSpec.selectionMode === "string" && requestSpec.selectionMode) params.set("selectionMode", requestSpec.selectionMode)
   if (Array.isArray(requestSpec.filters)) requestSpec.filters.forEach((filter) => params.append("filter", filter))
  }
  if (item.id.startsWith("video:")) params.set("videoId", item.id.slice("video:".length))
  if (item.source.toLowerCase().includes("search")) params.set("searchTerm", item.label)
  if (item.source.toLowerCase().includes("traffic")) params.set("trafficSource", item.label)
  return `/analytics?${params.toString()}`
 }

 const confidenceText = typeof confidence === "number"
  ? `${Math.round(Math.max(0, Math.min(1, confidence)) * 100)}% confidence`
  : confidence
   ? `${confidence} confidence`
   : ""

 return (
  <details
   className={`group ${compact ? "relative" : "overflow-hidden rounded-[10px] border-[2px] border-black bg-white"} ${className}`}
  >
   {compact ? (
    <StudioDisclosureSummary sizeVariant="compact" title={summaryLabel} aria-label={`${summaryLabel}; ${sourceCount} evidence references`} className="gap-1.5">
     <Info size={13} aria-hidden="true" />
     <span>{summaryLabel}</span>
     {sourceCount ? <EvidenceBadge label={String(sourceCount)} tone="#36E0F6" /> : null}
    </StudioDisclosureSummary>
   ) : (
    <StudioDisclosureSummary sizeVariant="standard" className="gap-1.5">
     <span className="flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.08em]">
      <span>{summaryLabel}</span>
      {sourceCount ? <EvidenceBadge label={`${sourceCount} sources`} tone="#36E0F6" /> : null}
      {provenanceCount ? <EvidenceBadge label={`${provenanceCount} provenance notes`} tone="#FFDA47" /> : null}
      {confidenceText ? <EvidenceBadge label={confidenceText} tone="#C0F240" /> : null}
      <EvidenceBadge label={inference ? "inference" : "measured"} tone="#FFDA47" />
     </span>
    </summary>
   )}
   <div
    className={`grid gap-3 ${
     compact
      ? "absolute right-0 z-20 mt-1 w-[300px] max-w-[calc(100vw-24px)] rounded-[6px] border-[2px] border-black bg-white p-3"
      : "p-3"
    }`}
   >
    <p className="text-[9px] font-bold leading-4 text-black/55">
     {inference
      ? "Brain combined the evidence below to reach this conclusion. It is an interpretation, not a directly measured fact."
      : "This statement is directly represented by the channel evidence below."}
    </p>

    {evidenceChips.length ? (
     <section className="rounded-[8px] border-[2px] border-black bg-[#36E0F6]/15 p-2">
      <h4 className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">Evidence provenance</h4>
      <ul className="mt-1 grid gap-1">
       {evidenceChips.slice(0, 8).map((chip, index) => (
        <li key={`${index}:${chip}`} className="text-[10px] font-bold leading-4 text-black/70">{chip}</li>
       ))}
      </ul>
     </section>
    ) : null}

    {hasNoEvidenceDetails ? (
     <section
      role="status"
      aria-live="polite"
      className="grid gap-1 border-[2px] border-black bg-[#FFDA47]/20 p-3"
     >
      <h4 className="text-[10px] font-[1000] uppercase tracking-[0.08em]">
       {evidencePack.dataStatus === "missing" ? "Evidence unavailable" : "No evidence references attached"}
      </h4>
      <p className="break-words text-xs font-bold leading-5 text-black/75">
       {evidencePack.dataStatus === "missing"
        ? "No evidence was available for this answer. Connect or sync a data source, then ask again."
        : evidencePack.dataStatus === "partial"
         ? "No evidence references were attached to this answer. Available data may be incomplete; this is not proof that a search returned no results."
         : "No evidence references were attached to this answer. This does not establish that evidence does not exist; inspect the data sources before relying on the conclusion."}
      </p>
     </section>
    ) : null}

    {visibleEvidenceItems.length ? (
     <section>
      <h4 className="text-[9px] font-black uppercase tracking-[0.16em] text-black/45">Evidence supplied for this answer</h4>
      <ul className="mt-1 grid gap-1">
       {visibleEvidenceItems.map((item) => (
        <li key={item.id} className="overflow-hidden rounded-[7px] border-[1.5px] border-black/20 bg-[#f8f8f4]">
         <Link to={evidenceHref(item)} className="flex min-h-11 items-center justify-between gap-2 px-2 py-1.5 text-xs font-bold leading-4 text-black/80 hover:bg-[#36E0F6]/25 focus-visible:ring-2 focus-visible:ring-black">
          <span className="min-w-0">
           <span className="block break-words">{item.label}</span>
           <span className="block text-[9px] font-bold text-black/50">{item.source}{item.detail ? ` · ${item.detail}` : ""}</span>
          </span>
          <ArrowUpRight size={13} className="shrink-0" aria-hidden="true" />
         </Link>
        </li>
       ))}
      </ul>
      {evidenceItems.length > visibleEvidenceItems.length ? (
       <details className="mt-2">
        <StudioDisclosureSummary sizeVariant="standard">
         Show all {evidenceItems.length} references
        </StudioDisclosureSummary>
        <ul className="mt-1 grid gap-1">
         {evidenceItems.slice(5).map((item) => (
          <li key={item.id} className="overflow-hidden rounded-[7px] border-[1.5px] border-black/20 bg-[#f8f8f4]">
           <Link to={evidenceHref(item)} className="flex min-h-11 items-center justify-between gap-2 px-2 py-1.5 text-xs font-bold leading-4 text-black/80 hover:bg-[#36E0F6]/25 focus-visible:ring-2 focus-visible:ring-black">
            <span className="min-w-0">
             <span className="block break-words">{item.label}</span>
             <span className="block text-[9px] font-bold text-black/50">{item.source}{item.detail ? ` · ${item.detail}` : ""}</span>
             <code className="block break-all text-[8px] font-normal text-black/45">{item.id}</code>
            </span>
            <ArrowUpRight size={13} className="shrink-0" aria-hidden="true" />
           </Link>
          </li>
         ))}
        </ul>
       </details>
      ) : null}
     </section>
    ) : null}

    {missing.length ? (
     <section className="rounded-[8px] border-[2px] border-black bg-[#FFDA47]/30 p-2">
      <h4 className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">Missing evidence that would sharpen this</h4>
      <ul className="mt-1 grid gap-1">
       {missing.map((item) => <li key={item} className="text-xs font-bold leading-5 text-black/60">{item}</li>)}
      </ul>
     </section>
    ) : null}

    {caveats.length ? (
     <section className="rounded-[8px] border-[2px] border-black bg-[#FF7497]/20 p-2">
      <h4 className="text-[9px] font-black uppercase tracking-[0.16em] text-black/55">Caveats</h4>
      <ul className="mt-1 grid gap-1">
       {caveats.slice(0, 4).map((item) => <li key={item} className="text-xs font-bold leading-5 text-black/60">{item}</li>)}
      </ul>
     </section>
    ) : null}

    {sourceRoute && sourceCount ? (
     <Link
      to={sourceRoute}
      className="inline-flex w-fit items-center gap-1 border-[2px] border-black bg-white px-2 py-1 text-[8px] font-[1000] uppercase outline-none focus-visible:ring-2 focus-visible:ring-black hover:bg-[#36E0F6]"
     >
      {sourceLabel}<ArrowUpRight size={11} />
     </Link>
    ) : null}
   </div>
  </details>
 )
}

export default BrainEvidenceDrawer
