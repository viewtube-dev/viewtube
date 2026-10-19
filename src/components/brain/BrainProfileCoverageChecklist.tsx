import React from "react"
import { Link } from "react-router-dom"
import type { AIBrainContextSnapshot } from "../../services/aiBrainCommandInterface"
import { buildBrainProfileCoverageItems } from "../../services/brain/profileCoverage"

export const BrainProfileCoverageChecklist: React.FC<{
 snapshot: AIBrainContextSnapshot
 onPrompt: (prompt: string) => void
}> = ({ snapshot, onPrompt }) => {
 const items = buildBrainProfileCoverageItems(snapshot)
 return (
  <section aria-labelledby="brain-profile-coverage-title" className="mt-3 overflow-hidden rounded-[8px] border-[2px] border-black bg-white">
   <h3 id="brain-profile-coverage-title" className="border-b-[2px] border-black bg-[#36E0F6] px-2.5 py-2 text-[9px] font-black uppercase tracking-[0.12em]">
    Profile coverage
   </h3>
   <ul className="grid gap-1.5 p-2">
    {items.map((item) => (
     <li key={item.id} className="flex min-w-0 flex-wrap items-center gap-2">
      <span aria-hidden="true" className={`inline-grid h-4 w-4 shrink-0 place-items-center rounded-full border border-black text-[10px] font-black ${item.complete ? "bg-[#3FEE56]" : "bg-[#FFDA47]"}`}>
       {item.complete ? "✓" : "!"}
      </span>
      <span className="min-w-0 flex-1 text-[10px] font-black uppercase leading-4">{item.label}</span>
      {!item.complete && item.actionLabel ? item.actionRoute ? (
       <Link to={item.actionRoute} className="inline-flex min-h-9 items-center rounded-[5px] border-[2px] border-black bg-white px-2 text-[9px] font-black uppercase hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black">
        {item.actionLabel}
       </Link>
      ) : (
       <button type="button" onClick={() => item.actionPrompt && onPrompt(item.actionPrompt)} className="min-h-9 rounded-[5px] border-[2px] border-black bg-white px-2 text-[9px] font-black uppercase hover:bg-[#FFDA47] focus-visible:ring-2 focus-visible:ring-black">
        {item.actionLabel}
       </button>
      ) : null}
     </li>
    ))}
   </ul>
  </section>
 )
}

export default BrainProfileCoverageChecklist
