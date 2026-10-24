import React from "react"
import "./BrainChatShell.css"

export type BrainAnswerFirstProps = {
  eyebrow?: React.ReactNode; keyInsight?: React.ReactNode; children: React.ReactNode; alerts?: React.ReactNode
  details?: React.ReactNode; detailsLabel?: string; actions?: React.ReactNode; className?: string
}
export const BrainAnswerFirst: React.FC<BrainAnswerFirstProps> = ({
  eyebrow, keyInsight, children, alerts, details, detailsLabel = "Details", actions, className = "",
}) => {
  const hasDetails = details != null && details !== false
  return <article data-vt-brain-composition="BrainAnswerFirst" className={`vt-brain-answer-first ${className}`.trim()} aria-label="Assistant response">
    {eyebrow ? <div className="vt-brain-answer-first__eyebrow">{eyebrow}</div> : null}
    {keyInsight ? <p className="vt-brain-answer-first__insight">{keyInsight}</p> : null}
    {alerts ? <div className="vt-brain-answer-first__alerts">{alerts}</div> : null}
    <div className="vt-brain-answer-first__body">{children}</div>
    {hasDetails ? <details className="vt-brain-answer-first__details"><summary>{detailsLabel}</summary><div className="vt-brain-answer-first__details-body">{details}</div></details> : null}
    {actions ? <footer className="vt-brain-answer-first__actions">{actions}</footer> : null}
  </article>
}
BrainAnswerFirst.displayName = "BrainAnswerFirst"
