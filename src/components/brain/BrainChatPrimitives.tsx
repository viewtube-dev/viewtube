import React from "react"
import { StudioButton } from "../../studio-ui"

export type BrainChatStatus = "ready" | "loading" | "partial" | "warning" | "error" | "unavailable"

const STATUS_LABELS: Record<BrainChatStatus, string> = {
  ready: "Ready",
  loading: "Working",
  partial: "Partial",
  warning: "Needs attention",
  error: "Error",
  unavailable: "Unavailable",
}

/** A truthful, compact status primitive. It never infers status from missing data. */
export const BrainChatStatusBadge: React.FC<{
  status: BrainChatStatus
  label?: string
  className?: string
}> = ({ status, label, className = "" }) => (
  <span
    data-vt-studio-brain-primitive="ChatStatusBadge"
    data-status={status}
    className={`inline-flex min-h-6 max-w-full items-center border border-black px-1.5 text-[9px] font-black uppercase leading-4 [overflow-wrap:anywhere] ${className}`}
  >
    {label || STATUS_LABELS[status]}
  </span>
)

export const BrainChatMessageShell: React.FC<{
  role: "user" | "assistant"
  children: React.ReactNode
  className?: string
  label?: string
}> = ({ role, children, className = "", label }) => (
  <article
    data-vt-studio-brain-primitive="ChatMessageShell"
    data-message-role={role}
    aria-label={label || (role === "user" ? "Your message" : "Assistant response")}
    className={`min-w-0 w-full [overflow-wrap:anywhere] ${className}`}
  >
    {children}
  </article>
)

export const BrainResponseSectionHeader: React.FC<{
  title: string
  metadata?: React.ReactNode
  className?: string
}> = ({ title, metadata, className = "" }) => (
  <header
    data-vt-studio-brain-primitive="ResponseSectionHeader"
    className={`flex min-w-0 flex-wrap items-center justify-between gap-1.5 ${className}`}
  >
    <h3 className="min-w-0 [overflow-wrap:anywhere]">{title}</h3>
    {metadata ? <div className="flex min-w-0 flex-wrap items-center gap-1.5">{metadata}</div> : null}
  </header>
)

export type BrainChatAction = {
  id: string
  label: string
  onSelect: () => void
  disabled?: boolean
  title?: string
}

/** Actions are supplied by the existing Brain page/registries; this component owns no behavior. */
export const BrainChatActionButtonGroup: React.FC<{
  actions: BrainChatAction[]
  label?: string
  className?: string
}> = ({ actions, label = "Message actions", className = "" }) => (
  <div
    data-vt-studio-brain-primitive="ChatActionButtonGroup"
    role="group"
    aria-label={label}
    className={`flex min-w-0 flex-wrap items-center gap-1 ${className}`}
  >
    {actions.map((action) => (
      <StudioButton
        key={action.id}
        type="button"
        sizeVariant="compact"
        tone="neutral"
        disabled={action.disabled}
        title={action.title || action.label}
        aria-label={action.label}
        onClick={action.onSelect}
      >
        {action.label}
      </StudioButton>
    ))}
  </div>
)

export const BrainPromptLibraryItem: React.FC<{
  title: string
  description?: string
  selected?: boolean
  disabled?: boolean
  onSelect: () => void
}> = ({ title, description, selected = false, disabled = false, onSelect }) => (
  <button
    type="button"
    data-vt-studio-brain-primitive="PromptLibraryItem"
    aria-pressed={selected}
    disabled={disabled}
    onClick={onSelect}
    className="flex min-h-11 min-w-0 w-full flex-col items-start gap-0.5 border-2 border-black px-2 py-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50 data-[selected=true]:bg-[var(--vt-studio-control-accent)]"
    data-selected={selected ? "true" : "false"}
  >
    <span className="w-full [overflow-wrap:anywhere] text-[10px] font-black uppercase">{title}</span>
    {description ? <span className="w-full [overflow-wrap:anywhere] text-xs leading-4">{description}</span> : null}
  </button>
)

export const BrainComposerAccessoryRow: React.FC<{
  children: React.ReactNode
  label?: string
  className?: string
}> = ({ children, label = "Composer options", className = "" }) => (
  <div
    data-vt-studio-brain-primitive="ComposerAccessoryRow"
    role="group"
    aria-label={label}
    className={`flex min-w-0 flex-wrap items-center gap-1 ${className}`}
  >
    {children}
  </div>
)
