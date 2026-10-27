import React, { useCallback } from "react"
import { Send, Zap } from "lucide-react"
import {
  StudioButton,
  StudioChatComposerDock,
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
  maxFieldPx = 144,
  className = "",
}) => {
  const resizeField = useCallback(
    (element: HTMLTextAreaElement | null) => {
      if (!element) return
      element.style.height = "auto"
      element.style.height = `${Math.min(element.scrollHeight, maxFieldPx)}px`
    },
    [maxFieldPx],
  )

  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      if (typeof composerRef === "function") composerRef(node)
      else if (composerRef && "current" in composerRef) {
        ;(composerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      }
      if (node) resizeField(node)
    },
    [composerRef, resizeField],
  )

  const resolvedStatus = status ?? (busy ? "loading" : undefined)

  return (
    <StudioChatComposerDock
      layout="toolbar-actions"
      className={`vt-brain-composer-dock ${className}`.trim()}
      aria-label="Brain message composer"
      status={
        resolvedStatus ? (
          <BrainChatStatusBadge status={resolvedStatus} label={statusLabel} />
        ) : (
          <span className="vt-brain-composer-hint">Enter to send <span aria-hidden="true">·</span> Shift+Enter for a new line</span>
        )
      }
      chips={null}
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
              resizeField(event.currentTarget)
              onChange(event.currentTarget.value)
            }}
            placeholder="Ask anything about your channel, content, or next upload…"
            className="vt-brain-composer-input w-full min-w-0 resize-none"
            style={{ minHeight: 60, maxHeight: maxFieldPx }}
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
        <StudioButton
          data-vt-brain-component="BrainComposerSendAction"
          type="button"
          sizeVariant="standard"
          tone="accent"
          disabled={busy || !value.trim()}
          aria-label={busy ? "Sending message" : "Send message"}
          title={busy ? "Brain is working" : "Send message"}
          onClick={onSend}
          className="vt-brain-composer-send"
        >
          <span className="vt-brain-composer-send__content">
            {busy ? <Zap size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
            <span>{busy ? "Working" : "Send"}</span>
          </span>
        </StudioButton>
      }
    />
  )
}

export default BrainComposerDock

/** Safe focus helper for parent pages (drawers → field). */
export const focusBrainComposer = (ref: React.RefObject<HTMLTextAreaElement | null> | null) => {
  focusComposer(ref?.current ?? null)
}
