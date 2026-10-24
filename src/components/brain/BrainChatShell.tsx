import React from "react"
import "./BrainChatShell.css"

export type BrainChatShellProps = {
  header?: React.ReactNode
  children: React.ReactNode
  composer: React.ReactNode
  sheet?: React.ReactNode
  className?: string
  "aria-label"?: string
}

export const BrainChatShell: React.FC<BrainChatShellProps> = ({
  header, children, composer, sheet, className = "",
  "aria-label": ariaLabel = "Brain chat",
}) => (
  <div data-vt-brain-composition="BrainChatShell" className={`vt-brain-chat-shell ${className}`.trim()} aria-label={ariaLabel}>
    {header ? <div data-vt-brain-part="shell-header" className="vt-brain-chat-shell__header">{header}</div> : null}
    <div data-vt-brain-part="shell-transcript" className="vt-brain-chat-shell__transcript">{children}</div>
    <div data-vt-brain-part="shell-composer" className="vt-brain-chat-shell__composer">{composer}</div>
    {sheet ? <div data-vt-brain-part="shell-sheet" className="vt-brain-chat-shell__sheet">{sheet}</div> : null}
  </div>
)
BrainChatShell.displayName = "BrainChatShell"
