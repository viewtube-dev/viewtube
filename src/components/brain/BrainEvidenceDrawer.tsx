import React from "react"
import { Info, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { AIBrainEvidencePack } from "../../types"
import { StudioSplitLeftBadge } from "../../studio-ui"

/**
 * Creator-facing "Why this recommendation?" surface.
 *
 * It intentionally explains channel evidence in creator language instead of
 * exposing storage keys, internal IDs, model traces, or sync implementation.
 * Optional confidence/inference metadata lets every Brain surface use the
 * same trust UI without changing the canonical evidence-pack schema.
 */
const EvidenceBadge: React.FC<{ label: string; tone: string }> = ({ label, tone }) => (
 <StudioSplitLeftBadge
  sizeVariant="micro"
  icon={<span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full border border-black bg-black/70" />}
  style={{ backgroundColor: tone, width: "max-content", maxWidth: "100%" }}
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
 const hasAnything = sourceCount || missing.length || caveats.length || provenanceCount

 const evidenceHref = (item: AIBrainEvidencePack["items"][number]): string => {
  const params = new URLSearchParams()
  params.set("brainEvidenceId", item.id)
  params.set("brainEvidenceSource", item.source)
  params.set("brainEvidenceLabel", item.label)
  params.set("rankBy", evidencePack.requestSpec.rankBy)
  params.set("selectionMode", evidencePack.requestSpec.selectionMode)
  if (evidencePack.requestSpec.count !== null) params.set("count", String(evidencePack.requestSpec.count))
  if (evidencePack.requestSpec.since) params.set("since", evidencePack.requestSpec.since)
  if (evidencePack.requestSpec.until) params.set("until", evidencePack.requestSpec.until)
  evidencePack.requestSpec.formats.forEach((format) => params.append("format", format))
  evidencePack.requestSpec.filters.forEach((filter) => params.append("filter", filter))
  if (item.id.startsWith("video:")) params.set("videoId", item.id.slice("video:".length))
  if (item.source.toLowerCase().includes("search")) params.set("searchTerm", item.label)
  if (item.source.toLowerCase().includes("traffic")) params.set("trafficSource", item.label)
  return `/analytics?${params.toString()}`
 }
 if (!hasAnything) return null

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
    <summary
     className="inline-flex min-h-7 cursor-pointer list-none items-center gap-1.5 rounded-[6px] border-[2px] border-black bg-white px-2 text-[9px] font-black uppercase tracking-[0.06em] hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black"
     title={summaryLabel}
     aria-label={`${summaryLabel}; ${sourceCount} evidence references`}
    >
     <Info size={13} aria-hidden="true" />
     <span>{summaryLabel}</span>
     {sourceCount ? <EvidenceBadge label={String(sourceCount)} tone="#36E0F6" /> : null}
    </summary>
   ) : (
    <summary className="cursor-pointer list-none border-b-[2px] border-black bg-[#f8f8f4] px-3 py-2 hover:bg-[#FFDA47]">
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
        <summary className="min-h-11 cursor-pointer content-center text-[10px] font-black uppercase underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">
         Show all {evidenceItems.length} references
        </summary>
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
