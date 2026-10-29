import React, { useCallback } from "react"
import { LayoutGrid, PanelRight, Send, Zap } from "lucide-react"
import {
  StudioButton,
  StudioChatComposerDock,
  StudioLedBadgeTab,
  StudioSplitLeftButton,
  StudioTextArea,
} from "../../studio-ui"
import { BrainChatStatusBadge } from "./BrainChatPrimitives"
import type { BrainChatStatus } from "./BrainChatPrimitives"
import "./BrainComposerDock.css"
import "./BrainComposerExperience.css"

export type BrainComposerDockProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  busy?: boolean
  status?: BrainChatStatus
  statusLabel?: string
  activePromptTitle?: string | null
  onClearActivePrompt?: () => void
  onOpenPrompts?: () => void
  onOpenCapabilities?: () => void
  onOpenContext?: () => void
  onOpenJournal?: () => void
  promptLauncherRef?: React.Ref<HTMLButtonElement>
  contextLauncherRef?: React.Ref<HTMLButtonElement>
  composerRef?: React.Ref<HTMLTextAreaElement>
  maxFieldPx?: number
  className?: string
}

const focusComposer = (node: HTMLTextAreaElement | null) => {
  if (!node) return
  try {
    node.focus({ preventScroll: true })
  } catch {
    node.focus()
  }
}

/**
 * Canonical Brain composer composition. The input and send action are visually
 * dominant; prompts, capabilities, context and journal remain one-tap discoverable.
 * The page continues to own submission, prompt selection and Brain state.
 */
export const BrainComposerDock: React.FC<BrainComposerDockProps> = ({
  value,
  onChange,
  onSend,
  busy = false,
  status,
  statusLabel,
  activePromptTitle,
  onClearActivePrompt,
  onOpenPrompts,
  onOpenCapabilities,
  onOpenContext,
  onOpenJournal,
  promptLauncherRef,
  contextLauncherRef,
  composerRef,
  maxFieldPx,
  className = "",
}) => {
  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      if (typeof composerRef === "function") composerRef(node)
      else if (composerRef && "current" in composerRef) {
        ;(composerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      }
    },
    [composerRef],
  )

  const resolvedStatus = status ?? (busy ? "loading" : undefined)

  return (
    <StudioChatComposerDock
      layout="inline-actions"
      className={`vt-brain-composer-dock ${className}`.trim()}
      aria-label="Brain message composer"
      status={
        resolvedStatus ? (
          <BrainChatStatusBadge status={resolvedStatus} label={statusLabel} />
        ) : (
          <span className="vt-brain-composer-hint">Enter to send <span aria-hidden="true">·</span> Shift+Enter for a new line</span>
        )
      }
      chips={
        activePromptTitle || value.trim() ? (
          <div className="flex min-w-0 flex-wrap items-center gap-1" data-vt-brain-part="composer-attachments" role="group" aria-label="Draft details">
            {activePromptTitle ? (
              <>
                <StudioLedBadgeTab
                  mode="badge"
                  label={activePromptTitle}
                  tone="pink"
                  led="solid"
                  animation="steady"
                  sizeVariant="mini"
                  className="vt-brain-composer-attachment"
                  aria-label={`Draft source: ${activePromptTitle}`}
                  title="Draft source"
                />
                <StudioButton
                  type="button"
                  sizeVariant="compact"
                  tone="neutral"
                  data-vt-brain-part="clear-composer-source"
                  onClick={() => onClearActivePrompt?.()}
                  aria-label="Clear draft source label"
                  title="Clear draft source label"
                >
                  Clear source
                </StudioButton>
              </>
            ) : null}
            {value.trim() ? (
              <StudioButton
                type="button"
                sizeVariant="compact"
                tone="neutral"
                data-vt-brain-part="clear-composer-draft"
                onClick={() => {
                  onChange("")
                  onClearActivePrompt?.()
                }}
                aria-label="Clear message draft"
                title="Clear the current draft"
              >
                Clear draft
              </StudioButton>
            ) : null}
          </div>
        ) : null
      }
      tray={null}
      field={
        <>
          <label className="sr-only" htmlFor="brain-composer">
            Message to ViewTube Brain
          </label>
          <span id="brain-composer-help" className="sr-only">
            Press Enter to send. Shift+Enter for a new line. Use Prompts to browse saved prompts, Tools to explore Brain
            capabilities, and Context to inspect channel context.
          </span>
          <StudioTextArea
            ref={setRefs}
            id="brain-composer"
            sizeVariant="standard"
            rows={2}
            value={value}
            onChange={(event) => {
              onChange(event.currentTarget.value)
            }}
            placeholder="Ask anything about your channel, content, or next upload…"
            className="vt-brain-composer-input w-full min-w-0 resize-none"
            aria-label="Message to ViewTube Brain"
            aria-describedby="brain-composer-help"
            onFocus={(event) => {
              focusComposer(event.currentTarget)
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return
              event.preventDefault()
              if (!busy && value.trim()) onSend()
            }}
          />
        </>
      }
      action={
        <div className="vt-brain-composer-action" role="group" aria-label="Message actions">
          <StudioSplitLeftButton
            ref={promptLauncherRef}
            data-vt-brain-component="BrainComposerPromptLibraryAction"
            type="button"
            sizeVariant="compact"
            icon={<LayoutGrid size={16} aria-hidden="true" />}
            iconSizeVariant="large"
            aria-label="Open prompt library"
            title="Open prompt library"
            onClick={onOpenPrompts}
            className="vt-brain-composer-prompt"
          >
            Prompts
          </StudioSplitLeftButton>
          <StudioSplitLeftButton
            ref={contextLauncherRef}
            data-vt-brain-component="BrainComposerContextAction"
            type="button"
            sizeVariant="compact"
            icon={<PanelRight size={14} aria-hidden="true" />}
            iconSizeVariant="large"
            aria-label="Open channel context"
            title="Open channel context"
            onClick={onOpenContext}
            className="vt-brain-composer-context"
          >
            Context
          </StudioSplitLeftButton>
          <StudioButton
            data-vt-brain-component="BrainComposerSendAction"
            type="button"
            sizeVariant="standard"
            tone="neutral"
            disabled={busy || !value.trim()}
            aria-label={busy ? "Sending message" : "Send message"}
            title={busy ? "Brain is working" : "Send message"}
            onClick={onSend}
            className="vt-brain-composer-send"
          >
            {busy ? <><Zap size={14} aria-hidden="true" /> Working</> : <><Send size={14} aria-hidden="true" /> Send</>}
          </StudioButton>
        </div>
      }
    />
  )
}

export default BrainComposerDock

/** Safe focus helper for parent pages (drawers → field). */
export const focusBrainComposer = (ref: React.RefObject<HTMLTextAreaElement | null> | null) => {
  focusComposer(ref?.current ?? null)
}
