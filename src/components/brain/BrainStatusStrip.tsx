import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import "./BrainChatShell.css"

export type BrainStatusItem = { id: string; label: string; value: string; tone?: "neutral" | "ok" | "warn" | "bad" }
export type BrainStatusStripProps = { items: BrainStatusItem[]; details?: React.ReactNode; className?: string }
const TONE_CLASS: Record<NonNullable<BrainStatusItem["tone"]>, string> = { neutral: "is-neutral", ok: "is-ok", warn: "is-warn", bad: "is-bad" }

export const BrainStatusStrip: React.FC<BrainStatusStripProps> = ({ items, details, className = "" }) => {
  const [open, setOpen] = useState(false)
  const hasDetails = details != null && details !== false
  return <div data-vt-brain-composition="BrainStatusStrip" className={`vt-brain-status-strip ${className}`.trim()}>
    <div className="vt-brain-status-strip__row">
      <ul className="vt-brain-status-strip__items" aria-label="Brain status">
        {items.map((item, index) => <li key={item.id} className={`vt-brain-status-strip__item ${TONE_CLASS[item.tone || "neutral"]}`}>
          {index > 0 ? <span className="vt-brain-status-strip__dot" aria-hidden="true">·</span> : null}
          <span className="vt-brain-status-strip__label">{item.label}</span><span className="vt-brain-status-strip__value">{item.value}</span>
        </li>)}
      </ul>
      {hasDetails ? <button type="button" className="vt-brain-status-strip__more" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        {open ? "Less" : "Details"}<ChevronDown className={open ? "is-open" : undefined} size={14} aria-hidden="true" />
      </button> : null}
    </div>
    {hasDetails && open ? <div className="vt-brain-status-strip__details">{details}</div> : null}
  </div>
}
BrainStatusStrip.displayName = "BrainStatusStrip"
