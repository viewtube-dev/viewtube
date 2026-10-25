import React from "react"
import { Link } from "react-router-dom"
import { BrainEvaluationInboxPanel } from "./BrainEvaluationInboxPanel"
import { StudioButton, StudioLedBadgeTab } from "../../studio-ui"

export const BrainReviewPanel: React.FC<{ channelId: string | null }> = ({ channelId }) => (
  <section id="brain-page-panel-review" role="tabpanel" aria-labelledby="brain-page-tab-review" data-vt-brain-component="BrainReviewPanel"
    className="grid min-h-0 flex-1 gap-2 overflow-y-auto bg-white p-2" aria-label="Review learning and outcomes">
    <header className="grid gap-1 border-b-2 border-black pb-2">
      <h2 className="text-[11px] font-[1000] uppercase tracking-[0.08em]">Review</h2>
      <p className="text-[11px] font-bold leading-4 text-black/65">Pending learning, overdue checks, and measured outcomes. Approving a candidate only marks it eligible for a separate profile step.</p>
    </header>
    <BrainEvaluationInboxPanel channelId={channelId} maximumItems={8} />
  </section>
)

export const BrainControlsPanel: React.FC = () => (
  <section id="brain-page-panel-controls" role="tabpanel" aria-labelledby="brain-page-tab-controls" data-vt-brain-component="BrainControlsPanel"
    className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto bg-white p-3" aria-label="Brain controls">
    <header className="grid gap-1 border-b-2 border-black pb-2">
      <h2 className="text-[11px] font-[1000] uppercase tracking-[0.08em]">Controls</h2>
      <p className="text-[11px] font-bold leading-4 text-black/65">Channel-scoped policy, data access, and intelligence engines. Changes apply only after Save on the Controls page.</p>
    </header>
    <div className="grid gap-2 rounded-[8px] border-2 border-black bg-[#f8f8f4] p-3">
      <p className="text-sm font-bold leading-5">Open the full Brain Controls page to edit master policy, analytics access, engines, and evidence thresholds.</p>
      <Link to="/brain-controls" className="inline-flex min-h-11 w-max items-center justify-center border-2 border-black bg-[#3FEE56] px-3 text-[10px] font-[1000] uppercase">Open Brain Controls</Link>
    </div>
    <ul className="grid gap-1 text-[11px] font-bold leading-4 text-black/70">
      <li>· Brain enabled / personalization / learn from interactions</li>
      <li>· Analytics, projects, vault, comments, publisher handoffs</li>
      <li>· Channel, anomaly, opportunity, algorithm priming engines</li>
    </ul>
  </section>
)

export type BrainMyBrainKnowledgeItem = { id: string; statement: string; status?: string; knowledgeClass?: string }

export const BrainMyBrainPanel: React.FC<{
  items: BrainMyBrainKnowledgeItem[]
  styleSummary?: string | null
  onCorrectItem?: (id: string) => void
  profileIncomplete?: boolean
}> = ({ items, styleSummary, onCorrectItem, profileIncomplete }) => (
  <section id="brain-page-panel-my-brain" role="tabpanel" aria-labelledby="brain-page-tab-my-brain" data-vt-brain-component="BrainMyBrainPanel"
    className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto bg-white p-3" aria-label="What the Brain knows about you">
    <header className="flex flex-wrap items-start justify-between gap-2 border-b-2 border-black pb-2">
      <div className="grid gap-1">
        <h2 className="text-[11px] font-[1000] uppercase tracking-[0.08em]">My Brain</h2>
        <p className="text-[11px] font-bold leading-4 text-black/65">Confirmed knowledge, preferences, and style the assistant may use. Nothing here is published automatically.</p>
      </div>
      <StudioLedBadgeTab mode="badge" label={profileIncomplete ? "Profile incomplete" : "Profile"} tone={profileIncomplete ? "yellow" : "green"} led="solid" animation={profileIncomplete ? "radar" : "steady"} sizeVariant="mini" />
    </header>
    {styleSummary ? <div className="grid gap-1 rounded-[7px] border-2 border-black bg-[#f8f8f4] p-2"><h3 className="text-[9px] font-[1000] uppercase text-black/55">Style profile</h3><p className="text-[12px] font-bold leading-5">{styleSummary}</p></div> : null}
    <div className="grid gap-1">
      <h3 className="text-[9px] font-[1000] uppercase text-black/55">Knowledge in use</h3>
      {!items.length ? <p className="rounded-[7px] border border-black/25 bg-[#f8f8f4] p-2 text-[12px] font-bold leading-5 text-black/65">No confirmed knowledge items yet. Answer Brain questions or add notes in chat so this list can fill in.</p> : (
        <ul className="grid gap-1">{items.map((item) => <li key={item.id} className="grid gap-1 rounded-[7px] border border-black/30 bg-[#f8f8f4] px-2 py-1.5">
          {item.status || item.knowledgeClass ? <span className="text-[9px] font-black uppercase text-black/50">{[item.status, item.knowledgeClass?.replace(/_/g, " ")].filter(Boolean).join(" · ")}</span> : null}
          <p className="text-[12px] font-bold leading-5">{item.statement}</p>
          {onCorrectItem ? <StudioButton sizeVariant="compact" tone="neutral" type="button" onClick={() => onCorrectItem(item.id)}>Propose correction</StudioButton> : null}
        </li>)}</ul>
      )}
    </div>
  </section>
)
