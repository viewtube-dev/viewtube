import React from "react"
import "./BrainChatPrimitives.css"
import { StudioBrainStatusBadge, StudioButton, StudioChatResponseShell } from "../../studio-ui"

export type BrainChatStatus = "ready" | "loading" | "partial" | "warning" | "error" | "unavailable"

const STATUS_PRESENTATION: Record<BrainChatStatus, { label: string; tone: "green" | "cyan" | "yellow" | "red" | "blue"; active: boolean }> = {
  ready: { label: "Ready", tone: "green", active: false },
  loading: { label: "Working", tone: "cyan", active: true },
  partial: { label: "Partial", tone: "yellow", active: false },
  warning: { label: "Needs attention", tone: "yellow", active: false },
  error: { label: "Error", tone: "red", active: false },
  unavailable: { label: "Unavailable", tone: "blue", active: false },
}

/** Adds chat-specific state semantics while delegating visuals to the canonical Studio Brain status badge. */
export const BrainChatStatusBadge: React.FC<{
  status: BrainChatStatus
  label?: string
  className?: string
}> = ({ status, label, className = "" }) => {
  const presentation = STATUS_PRESENTATION[status]
  const resolvedLabel = label || presentation.label
  return (
    <span
      data-vt-studio-brain-primitive="ChatStatusBadge"
      data-status={status}
      className={`inline-flex min-w-0 max-w-full [overflow-wrap:anywhere] ${className}`}
    >
      <StudioBrainStatusBadge
        label={resolvedLabel}
        tone={presentation.tone}
        active={presentation.active}
        appearance="tinted"
        className="max-w-full"
        aria-label={resolvedLabel}
      />
    </span>
  )
}

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

/** Shared response composition shell; response/evidence/learning data remains owned by existing Brain modules. */
export const BrainResponseLayout: React.FC<{
  title: string
  children: React.ReactNode
  header?: React.ReactNode
  attribution?: React.ReactNode
  status?: React.ReactNode
  headerMetadata?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
  actionsClassName?: string
}> = ({ title, children, header, attribution, status, headerMetadata, actions, footer, className = "", headerClassName = "", bodyClassName = "", actionsClassName = "" }) => (
  <StudioChatResponseShell
    data-vt-brain-component="BrainResponseLayout"
    aria-label={title}
    className={`overflow-hidden ${className}`}
    metadata={header ?? (
      <div className={`shrink-0 border-b-2 border-black px-3 py-2 ${headerClassName}`}>
        {attribution || status || headerMetadata ? (
          <div className="mb-1 flex min-w-0 flex-wrap items-center justify-between gap-1">
            {attribution ? <div className="min-w-0">{attribution}</div> : <span />}
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              {status}
              {headerMetadata}
            </div>
          </div>
        ) : null}
        <BrainResponseSectionHeader title={title} />
      </div>
    )}
    actions={(actions || footer) ? (
      <>
        {actions ? <div className={`flex min-w-0 shrink-0 flex-wrap items-center gap-1 border-t-2 border-black px-3 py-1 ${actionsClassName}`}>{actions}</div> : null}
        {footer ? <div className="w-full min-w-0">{footer}</div> : null}
      </>
    ) : null}
  >
    <div data-vt-brain-part="response-layout-body" className={`flex min-w-0 flex-col gap-2 p-3 [overflow-wrap:anywhere] ${bodyClassName}`}>
      {children}
    </div>
  </StudioChatResponseShell>
)

export const BrainResponseSectionHeader: React.FC<{
  title: string
  metadata?: React.ReactNode
  className?: string
}> = ({ title, metadata, className = "" }) => (
  <header
    data-vt-studio-brain-primitive="ResponseSectionHeader"
    className={`flex min-w-0 flex-wrap items-center justify-between gap-1 ${className}`}
  >
    <h3 className="min-w-0 [overflow-wrap:anywhere]">{title}</h3>
    {metadata ? <div className="flex min-w-0 flex-wrap items-center gap-1">{metadata}</div> : null}
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
  promptTitle?: string
  selected?: boolean
  disabled?: boolean
  onSelect: () => void
}> = ({ title, description, promptTitle, selected = false, disabled = false, onSelect }) => (
  <div data-vt-studio-brain-primitive="PromptLibraryItem" className="min-w-0 w-full">
    <StudioButton type="button" data-vt-studio-brain-control="prompt-library-item" sizeVariant="compact" textLayout="two-line" firstLine={title} secondLine={description || "Select prompt"} selected={selected} aria-pressed={selected} disabled={disabled} title={promptTitle || title} onClick={onSelect} className="w-full min-w-0 text-left" />
  </div>
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

/** Single scroll owner for the transcript; the page keeps scroll-follow policy. */
export const ChatConversationViewport: React.FC<{
  children: React.ReactNode
  viewportRef: React.Ref<HTMLDivElement>
  bottomRef?: React.Ref<HTMLDivElement>
  onScroll?: React.UIEventHandler<HTMLDivElement>
  className?: string
}> = ({ children, viewportRef, bottomRef, onScroll, className = "" }) => (
  <div
    ref={viewportRef}
    onScroll={onScroll}
    className={`brain-chat-scrollbar flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] ${className}`}
    aria-label="Brain conversation"
    role="region"
    tabIndex={0}
  >
    {children}
    <div ref={bottomRef} aria-hidden="true" className="h-px w-full shrink-0" />
  </div>
)

/** Anchored composer frame; input/send behavior remains owned by the Brain page. */
export const BrainComposerShell: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => (
  <footer
    data-vt-brain-component="BrainComposer"
    aria-label="Brain composer"
    className={`shrink-0 border-t-[2px] border-black bg-[#f8f8f4] p-2 pb-[max(8px,env(safe-area-inset-bottom))] ${className}`}
  >
    {children}
  </footer>
)
