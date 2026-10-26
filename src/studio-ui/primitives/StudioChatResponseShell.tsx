import React from "react"
import "../../styles/studio-chat-response-shell.css"

export type StudioChatResponseShellSize = "standard" | "compact" | "micro"

export interface StudioChatResponseShellProps extends React.HTMLAttributes<HTMLElement> {
  metadata?: React.ReactNode
  evidence?: React.ReactNode
  actions?: React.ReactNode
  sizeVariant?: StudioChatResponseShellSize
  children?: React.ReactNode
}

export const StudioChatResponseShell: React.FC<StudioChatResponseShellProps> = ({
  metadata,
  evidence,
  actions,
  sizeVariant = "compact",
  className,
  children,
  "aria-label": ariaLabel = "Chat response",
  ...rest
}) => (
  <article
    {...rest}
    className={["vt-studio-chat-response-shell", className].filter(Boolean).join(" ")}
    data-vt-studio-control="chat-response-shell"
    data-vt-studio-size={sizeVariant}
    aria-label={ariaLabel}
  >
    {metadata !== null && metadata !== undefined && metadata !== false ? (
      <header className="vt-studio-chat-response-shell__metadata" data-slot="metadata">{metadata}</header>
    ) : null}
    <div className="vt-studio-chat-response-shell__response" data-slot="response">{children}</div>
    {evidence !== null && evidence !== undefined && evidence !== false ? (
      <div className="vt-studio-chat-response-shell__evidence" data-slot="evidence">{evidence}</div>
    ) : null}
    {actions !== null && actions !== undefined && actions !== false ? (
      <footer className="vt-studio-chat-response-shell__actions" data-slot="actions">{actions}</footer>
    ) : null}
  </article>
)

StudioChatResponseShell.displayName = "StudioChatResponseShell"
